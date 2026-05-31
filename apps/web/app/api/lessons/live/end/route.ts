// app/api/lessons/live/end/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lessonId, recordingUrl, recordingId } = body

    // Verify lesson and user is teacher
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        createdBy: session.user.id
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found or unauthorized' }, { status: 404 })
    }

    const liveSession = await prisma.lessonSession.findUnique({
      where: { lessonId }
    })

    if (!liveSession) {
      return NextResponse.json({ error: 'No active session for this lesson' }, { status: 404 })
    }

    // End all open attendee sessions
    await prisma.sessionAttendee.updateMany({
      where: {
        lessonId,
        leftAt: null
      },
      data: {
        leftAt: new Date(),
        attended: true
      }
    })

    // Update session with recording details
    const updatedSession = await prisma.lessonSession.update({
      where: { lessonId },
      data: {
        status: recordingUrl ? 'RECORDING' : 'COMPLETED',
        endedAt: new Date(),
        recordingUrl,
        recordingId
      }
    })

    // Update lesson
    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        status: 'COMPLETED',
        isPublished: !!recordingUrl
      }
    })

    return NextResponse.json({
      success: true,
      session: updatedSession,
      message: 'Live session ended successfully'
    })
  } catch (error) {
    console.error('Error ending live session:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
