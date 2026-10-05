// app/api/lessons/live/end/route.ts
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
    const { lessonId, recordingUrl, recordingId } = body

    if (typeof lessonId !== 'string' || !lessonId) {
      return NextResponse.json({ error: 'Lesson id is required' }, { status: 400 })
    }
    const access = await getLessonAccess(session.user.id, lessonId)
    if (!access) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    if ((access.user.role !== 'TEACHER' && access.user.role !== 'ADMIN') || !access.canTeach) {
      return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
    }
    const { lesson } = access

    const liveSession = await prisma.lessonSession.findUnique({
      where: { lessonId }
    })

    if (!liveSession) {
      return NextResponse.json({ error: 'No active session for this lesson' }, { status: 404 })
    }

    const endedAt = new Date()
    const activeAttendees = await prisma.sessionAttendee.findMany({
      where: { lessonId, leftAt: null },
      select: { id: true, joinedAt: true },
    })
    if (activeAttendees.length) {
      await prisma.$transaction(activeAttendees.map((attendee) =>
        prisma.sessionAttendee.update({
        where: { id: attendee.id },
        data: {
          leftAt: endedAt,
          durationSeconds: Math.max(0, Math.floor((endedAt.getTime() - attendee.joinedAt.getTime()) / 1000)),
          attended: true,
        },
      })
      ))
    }

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
