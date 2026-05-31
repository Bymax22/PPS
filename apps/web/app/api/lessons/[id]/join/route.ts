// app/api/lessons/[id]/join/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId } = await params
    const body = await req.json()
    const { deviceInfo } = body

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { class: true, session: true }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Check if student is enrolled in the class
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        classId: lesson.classId
      }
    })

    if (!enrollment && user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not enrolled in this class' }, { status: 403 })
    }

    // Check if already joined
    let attendee = await prisma.sessionAttendee.findFirst({
      where: {
        lessonId,
        userId: user.id,
        leftAt: null
      }
    })

    if (attendee) {
      return NextResponse.json({
        success: true,
        attendee,
        message: 'Already joined'
      })
    }

    // Create session attendee record
    attendee = await prisma.sessionAttendee.create({
      data: {
        lessonId,
        userId: user.id,
        sessionId: lesson.session?.id,
        joinedAt: new Date(),
        attended: true
      }
    })

    // Track activity
    await prisma.studentActivity.create({
      data: {
        lessonId,
        userId: user.id,
        action: 'JOINED',
        metadata: deviceInfo || {}
      }
    })

    // Get live session details
    const liveSession = lesson.session || await prisma.lessonSession.findUnique({
      where: { lessonId }
    })

    return NextResponse.json({
      success: true,
      attendee,
      session: liveSession,
      message: 'Successfully joined lesson'
    })
  } catch (error) {
    console.error('Error joining lesson:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
