// app/api/lessons/[id]/activity/route.ts
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
    const { action, metadata } = body

    const validActions = [
      'RAISED_HAND',
      'LOWERED_HAND',
      'ANSWERED_POLL',
      'SHARED_SCREEN',
      'SHARED_CHAT',
      'PARTICIPATED'
    ]

    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify user is in the lesson
    const attendee = await prisma.sessionAttendee.findFirst({
      where: {
        lessonId,
        userId: user.id
      }
    })

    if (!attendee) {
      return NextResponse.json({ error: 'Not in this lesson' }, { status: 403 })
    }

    // Create activity record
    const activity = await prisma.studentActivity.create({
      data: {
        lessonId,
        userId: user.id,
        action,
        metadata: metadata || {}
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      activity
    })
  } catch (error) {
    console.error('Error tracking activity:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

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

    // Verify user is teacher or admin
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const isTeacher = lesson.createdBy === user.id || user.role === 'ADMIN'
    const isStudent = await prisma.sessionAttendee.findFirst({
      where: { lessonId, userId: user.id }
    })

    if (!isTeacher && !isStudent) {
      return NextResponse.json({ error: 'No access' }, { status: 403 })
    }

    // Get activities
    const activities = await prisma.studentActivity.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      activities,
      total: activities.length
    })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
