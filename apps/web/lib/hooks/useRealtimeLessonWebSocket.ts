'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

export type RealtimeUpdate = {
  type: 'exercise' | 'poll' | 'participant' | 'chat' | 'grade'
  data: any
  timestamp: number
}

interface UseRealtimeLessonOptions {
  lessonId: string
  userId: string
  userName: string
  userRole: 'TEACHER' | 'STUDENT' | 'ADMIN'
  onUpdate?: (update: RealtimeUpdate) => void
}

export function useRealtimeLesson({
  lessonId,
  userId,
  userName,
  userRole,
  onUpdate,
}: UseRealtimeLessonOptions) {
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [polls, setPolls] = useState<any[]>([])
  const [exercises, setExercises] = useState<any[]>([])

  // Connect to WebSocket
  useEffect(() => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:2000'
    
    socketRef.current = io(appUrl, {
      auth: {
        userId,
        userName,
        userRole,
        lessonId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      console.log('[Socket.io] Connected to lesson', lessonId)
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected from lesson')
      setConnected(false)
    })

    socket.on('error', (error) => {
      console.error('[Socket.io] Connection error:', error)
    })

    // Participant events
    socket.on('participant:joined', (data) => {
      setParticipants((prev) => [
        ...prev,
        { id: data.userId, name: data.userName, role: data.userRole },
      ])
      onUpdate?.({
        type: 'participant',
        data: { event: 'joined', ...data },
        timestamp: data.timestamp,
      })
    })

    socket.on('participant:left', (data) => {
      setParticipants((prev) => prev.filter((p) => p.id !== data.userId))
      onUpdate?.({
        type: 'participant',
        data: { event: 'left', ...data },
        timestamp: data.timestamp,
      })
    })

    // Exercise events
    socket.on('exercise:new', (data) => {
      setExercises((prev) => [...prev, data])
      onUpdate?.({
        type: 'exercise',
        data: { event: 'new', ...data },
        timestamp: data.timestamp,
      })
    })

    socket.on('exercise:response', (data) => {
      onUpdate?.({
        type: 'exercise',
        data: { event: 'response', ...data },
        timestamp: data.timestamp,
      })
    })

    // Poll events
    socket.on('poll:new', (data) => {
      setPolls((prev) => [...prev, data])
      onUpdate?.({
        type: 'poll',
        data: { event: 'new', ...data },
        timestamp: data.timestamp,
      })
    })

    socket.on('poll:response', (data) => {
      onUpdate?.({
        type: 'poll',
        data: { event: 'response', ...data },
        timestamp: data.timestamp,
      })
    })

    socket.on('poll:closed', (data) => {
      setPolls((prev) => prev.filter((p) => p.pollId !== data.pollId))
      onUpdate?.({
        type: 'poll',
        data: { event: 'closed', ...data },
        timestamp: data.timestamp,
      })
    })

    // Chat events
    socket.on('chat:message', (data) => {
      setMessages((prev) => [...prev, data])
      onUpdate?.({
        type: 'chat',
        data,
        timestamp: data.timestamp,
      })
    })

    // Hand raise events (for teachers only)
    socket.on('hand:raised', (data) => {
      if (userRole === 'TEACHER') {
        onUpdate?.({
          type: 'participant',
          data: { event: 'hand:raised', ...data },
          timestamp: data.timestamp,
        })
      }
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [lessonId, userId, userName, userRole, onUpdate])

  // Event emitters
  const submitExercise = useCallback((exerciseId: string, responses: any, duration: number) => {
    if (socketRef.current) {
      socketRef.current.emit('exercise:submit', { exerciseId, responses, duration })
    }
  }, [])

  const createExercise = useCallback((title: string, questions: any[]) => {
    if (socketRef.current) {
      socketRef.current.emit('exercise:create', { title, questions })
    }
  }, [])

  const respondToPoll = useCallback((pollId: string, selectedOption: string) => {
    if (socketRef.current) {
      socketRef.current.emit('poll:respond', { pollId, selectedOption })
    }
  }, [])

  const createPoll = useCallback((question: string, options: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit('poll:create', { question, options })
    }
  }, [])

  const closePoll = useCallback((pollId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('poll:close', { pollId })
    }
  }, [])

  const sendMessage = useCallback((text: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat:message', { text })
    }
  }, [])

  const raiseHand = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('hand:raise')
    }
  }, [])

  const lowerHand = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('hand:lower')
    }
  }, [])

  return {
    connected,
    participants,
    messages,
    polls,
    exercises,
    submitExercise,
    createExercise,
    respondToPoll,
    createPoll,
    closePoll,
    sendMessage,
    raiseHand,
    lowerHand,
  }
}
