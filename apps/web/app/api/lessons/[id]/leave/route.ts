// app/api/lessons/[id]/leave/route.ts
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get and update attendee
    const attendee = await prisma.sessionAttendee.findFirst({
      where: {
        lessonId,
        userId: user.id,
        leftAt: null
      }
    })

    if (!attendee) {
      return NextResponse.json({ error: 'Not currently in lesson' }, { status: 404 })
    }

    const leftAt = new Date()
    const durationSeconds = Math.floor(
      (leftAt.getTime() - attendee.joinedAt.getTime()) / 1000
    )

    // Update attendee
    const updatedAttendee = await prisma.sessionAttendee.update({
      where: { id: attendee.id },
      data: {
        leftAt,
        durationSeconds
      }
    })

    // Track activity
    await prisma.studentActivity.create({
      data: {
        lessonId,
        userId: user.id,
        action: 'LEFT',
        metadata: { durationSeconds }
      }
    })

    return NextResponse.json({
      success: true,
      attendee: updatedAttendee,
      message: 'Successfully left lesson'
    })
  } catch (error) {
    console.error('Error leaving lesson:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
