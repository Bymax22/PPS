// app/api/lessons/[id]/join/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getLessonAccess } from '@/lib/lessonAccess'

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

    const access = await getLessonAccess(session.user.id, lessonId)
    if (!access) return NextResponse.json({ error: 'Lesson or user not found' }, { status: 404 })
    const { user, lesson } = access
    if (!access.canAccess) {
      return NextResponse.json({ error: 'Not enrolled in this class' }, { status: 403 })
    }
    if (lesson.status !== 'LIVE' || lesson.session?.status !== 'LIVE') {
      return NextResponse.json({ error: 'This lesson is not live yet' }, { status: 409 })
    }

    // Check if already joined
    let attendee = await prisma.sessionAttendee.findFirst({
      where: {
        lessonId,
        userId: user.id,
        leftAt: null,
        sessionId: lesson.session.id,
      }
    })

    if (attendee) {
      return NextResponse.json({
        success: true,
        attendee,
        message: 'Already joined'
      })
    }

    // Attendee rows represent actual joins, not the lesson's enrollment roster.
    const joinedAt = new Date()
    const joined = await prisma.$transaction(async (tx) => {
      const newAttendee = await tx.sessionAttendee.create({
        data: {
          lessonId,
          userId: user.id,
          sessionId: lesson.session?.id,
          joinedAt,
          attended: true
        }
      })
      const existingAttendance = await tx.attendance.findFirst({
        where: { userId: user.id, lessonId },
        select: { id: true },
      })
      if (!existingAttendance) {
        await tx.attendance.create({
          data: {
            userId: user.id,
            lessonId,
            classId: lesson.classId,
            date: joinedAt,
            status: 'ONLINE',
            remarks: 'Joined live online lesson',
          },
        })
      }
      return newAttendee
    })
    attendee = joined

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
