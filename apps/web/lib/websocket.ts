import { Server } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { publishLessonEvent, publishParticipantEvent, publishPollEvent, publishExerciseEvent, publishChatEvent } from './redis'

let ioInstance: Server | null = null

export function initializeWebSocketServer(httpServer: HTTPServer): Server {
  if (ioInstance) return ioInstance

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 10000,
    pingTimeout: 5000,
    maxHttpBufferSize: 1e6, // 1MB for file uploads
  })

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    const lessonId = socket.handshake.auth.lessonId
    
    if (!lessonId) {
      return next(new Error('Missing lessonId'))
    }

    // Store user info on socket
    socket.data.lessonId = lessonId
    socket.data.userId = socket.handshake.auth.userId
    socket.data.userName = socket.handshake.auth.userName
    socket.data.userRole = socket.handshake.auth.userRole
    socket.data.isTeacher = socket.handshake.auth.userRole === 'TEACHER'

    next()
  })

  // Connection handling
  io.on('connection', (socket) => {
    const { lessonId, userId, userName, userRole, isTeacher } = socket.data

    console.log(`[WS] User ${userId} (${userRole}) connected to lesson ${lessonId}`)

    // Join lesson room
    socket.join(`lesson:${lessonId}`)
    if (isTeacher) {
      socket.join(`lesson:${lessonId}:teachers`)
    }

    // Broadcast participant joined
    io.to(`lesson:${lessonId}`).emit('participant:joined', {
      userId,
      userName,
      userRole,
      timestamp: Date.now(),
    })

    publishParticipantEvent(lessonId, userId, 'joined', {
      userName,
      userRole,
    })

    // Exercise handlers
    socket.on('exercise:submit', async (data) => {
      if (!isTeacher) {
        const { exerciseId, responses, duration } = data
        
        // Broadcast to teachers
        io.to(`lesson:${lessonId}:teachers`).emit('exercise:response', {
          studentId: userId,
          studentName: userName,
          exerciseId,
          responses,
          duration,
          timestamp: Date.now(),
        })

        await publishExerciseEvent(lessonId, exerciseId, 'response', {
          studentId: userId,
          studentName: userName,
          responses,
          duration,
        })
      }
    })

    socket.on('exercise:create', async (data) => {
      if (isTeacher) {
        const { title, questions } = data
        const exerciseId = `ex_${Date.now()}`

        // Broadcast to all students
        io.to(`lesson:${lessonId}`).emit('exercise:new', {
          exerciseId,
          title,
          questions,
          createdBy: userName,
          timestamp: Date.now(),
        })

        await publishExerciseEvent(lessonId, exerciseId, 'created', {
          title,
          questions,
          createdBy: userId,
        })
      }
    })

    // Poll handlers
    socket.on('poll:respond', async (data) => {
      const { pollId, selectedOption } = data

      io.to(`lesson:${lessonId}:teachers`).emit('poll:response', {
        pollId,
        studentId: userId,
        studentName: userName,
        selectedOption,
        timestamp: Date.now(),
      })

      await publishPollEvent(lessonId, pollId, 'response', {
        studentId: userId,
        selectedOption,
      })
    })

    socket.on('poll:create', async (data) => {
      if (isTeacher) {
        const { question, options } = data
        const pollId = `poll_${Date.now()}`

        io.to(`lesson:${lessonId}`).emit('poll:new', {
          pollId,
          question,
          options,
          createdBy: userName,
          timestamp: Date.now(),
        })

        await publishPollEvent(lessonId, pollId, 'created', {
          question,
          options,
          createdBy: userId,
        })
      }
    })

    socket.on('poll:close', async (data) => {
      if (isTeacher) {
        const { pollId } = data

        io.to(`lesson:${lessonId}`).emit('poll:closed', {
          pollId,
          timestamp: Date.now(),
        })

        await publishPollEvent(lessonId, pollId, 'closed', {})
      }
    })

    // Chat handlers
    socket.on('chat:message', async (data) => {
      const { text } = data
      const message = {
        id: `msg_${Date.now()}`,
        userId,
        userName,
        text,
        timestamp: Date.now(),
      }

      io.to(`lesson:${lessonId}`).emit('chat:message', message)
      await publishChatEvent(lessonId, message)
    })

    // Hand raise
    socket.on('hand:raise', () => {
      io.to(`lesson:${lessonId}:teachers`).emit('hand:raised', {
        studentId: userId,
        studentName: userName,
        timestamp: Date.now(),
      })

      publishLessonEvent(lessonId, 'hand:raised', {
        studentId: userId,
        studentName: userName,
      })
    })

    socket.on('hand:lower', () => {
      io.to(`lesson:${lessonId}:teachers`).emit('hand:lowered', {
        studentId: userId,
        timestamp: Date.now(),
      })
    })

    // Disconnect handling
    socket.on('disconnect', () => {
      console.log(`[WS] User ${userId} disconnected from lesson ${lessonId}`)

      io.to(`lesson:${lessonId}`).emit('participant:left', {
        userId,
        userName,
        timestamp: Date.now(),
      })

      publishParticipantEvent(lessonId, userId, 'left', {
        userName,
        userRole,
      })
    })

    // Error handling
    socket.on('error', (error) => {
      console.error(`[WS] Socket error for user ${userId}:`, error)
    })
  })

  ioInstance = io
  return io
}

export function getWebSocketServer(): Server | null {
  return ioInstance
}

export function emitToLesson(lessonId: string, event: string, data: any) {
  if (ioInstance) {
    ioInstance.to(`lesson:${lessonId}`).emit(event, data)
  }
}

export function emitToTeachers(lessonId: string, event: string, data: any) {
  if (ioInstance) {
    ioInstance.to(`lesson:${lessonId}:teachers`).emit(event, data)
  }
}

export function getConnectedUsers(lessonId: string): string[] {
  if (!ioInstance) return []
  const room = ioInstance.sockets.adapter.rooms.get(`lesson:${lessonId}`)
  return room ? Array.from(room) : []
}

export function getConnectionCount(lessonId: string): number {
  return getConnectedUsers(lessonId).length
}
