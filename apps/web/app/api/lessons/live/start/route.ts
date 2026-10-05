// app/api/lessons/live/start/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLessonAccess } from '@/lib/lessonAccess'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lessonId, title, description } = body

    if (typeof lessonId !== 'string' || !lessonId) {
      return NextResponse.json({ error: 'Lesson id is required' }, { status: 400 })
    }
    const access = await getLessonAccess(session.user.id, lessonId)
    if (!access) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    const { lesson, user } = access
    if ((user.role !== 'TEACHER' && user.role !== 'ADMIN') || !access.canTeach) {
      return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
    }
    if (lesson.type === 'RECORDED') {
      return NextResponse.json({ error: 'Recorded lessons cannot be started as live sessions' }, { status: 400 })
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

    const roomId = lesson.id
    const streamKey = `${lesson.id}-${Date.now()}`

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
      where: { classId: lesson.classId, status: 'ACTIVE' },
      select: { userId: true },
    })

    await Promise.all(enrollments.map((enrollment) =>
      prisma.notification.create({
        data: {
          userId: enrollment.userId,
          type: 'LESSON_STARTING',
          title: `${title || lesson.title} - Live Now!`,
          body: `Your ${lesson.class.name} class is now live. Click to join!`,
          link: `/student/lessons/${lessonId}`
        }
      })
    ))

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
