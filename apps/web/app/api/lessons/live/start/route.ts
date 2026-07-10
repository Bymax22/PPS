// app/api/lessons/live/start/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lessonId, title, description } = body

    // Verify lesson exists and user is the teacher
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        createdBy: session.user.id
      },
      include: { class: true }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found or unauthorized' }, { status: 404 })
    }

    // Check if session already exists
    let liveSession = await prisma.lessonSession.findUnique({
      where: { lessonId }
    })

    if (liveSession && liveSession.status === 'LIVE') {
      return NextResponse.json({
        success: true,
        session: liveSession,
        alreadyLive: true,
        message: 'Lesson is already live'
      }, { status: 200 })
    }

    const roomId = uuidv4()
    const streamKey = `${roomId}-${Date.now()}`

    // Create or update session
    liveSession = await prisma.lessonSession.upsert({
      where: { lessonId },
      update: {
        status: 'LIVE',
        startedAt: new Date(),
        roomId,
        streamKey
      },
      create: {
        lessonId,
        roomId,
        streamKey,
        status: 'LIVE',
        startedAt: new Date(),
        description: description || lesson.description
      }
    })

    // Update lesson status
    await prisma.lesson.update({
      where: { id: lessonId },
      data: { status: 'LIVE', roomId }
    })

    // Notify students in class
    const enrollments = await prisma.enrollment.findMany({
      where: { classId: lesson.classId },
      include: { user: true }
    })

    for (const enrollment of enrollments) {
      await prisma.notification.create({
        data: {
          userId: enrollment.userId,
          type: 'LESSON_STARTING',
          title: `${title || lesson.title} - Live Now!`,
          body: `Your ${lesson.class.name} class is now live. Click to join!`,
          link: `/student/lessons/${lessonId}/join`
        }
      })

      // Log activity
      await prisma.studentActivity.create({
        data: {
          lessonId,
          userId: enrollment.userId,
          action: 'JOINED',
          metadata: { auto: true }
        }
      })
    }

    return NextResponse.json({
      success: true,
      session: liveSession,
      message: 'Live session started successfully'
    })
  } catch (error) {
    console.error('Error starting live session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
