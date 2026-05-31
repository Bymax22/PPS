// app/api/lessons/[id]/attendees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId } = await params

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify user has access to this lesson (enrolled or teacher)
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        class: true,
        session: true
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const isTeacher = lesson.createdBy === user.id
    const isEnrolled = await prisma.enrollment.findFirst({
      where: {
        classId: lesson.classId,
        userId: user.id
      }
    })

    if (!isTeacher && !isEnrolled && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No access to this lesson' }, { status: 403 })
    }

    // Get current and past attendees
    const attendees = await prisma.sessionAttendee.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true
          }
        }
      },
      orderBy: { joinedAt: 'asc' }
    })

    // Separate active and inactive
    const activeAttendees = attendees.filter(a => a.leftAt === null)
    const inactiveAttendees = attendees.filter(a => a.leftAt !== null)

    // Get stats
    const totalJoined = attendees.length
    const currentActive = activeAttendees.length
    const averageDuration =
      attendees.length > 0
        ? attendees.reduce((sum, a) => sum + a.durationSeconds, 0) / attendees.length
        : 0

    return NextResponse.json({
      session: {
        lessonId,
        status: lesson.session?.status || 'PENDING',
        startedAt: lesson.session?.startedAt,
        endedAt: lesson.session?.endedAt
      },
      activeAttendees,
      inactiveAttendees,
      stats: {
        totalJoined,
        currentActive,
        averageDurationSeconds: Math.round(averageDuration)
      }
    })
  } catch (error) {
    console.error('Error fetching attendees:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
