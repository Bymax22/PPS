// apps/web/app/api/lessons/[id]/polls/[pollId]/close/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { closeLivePoll } from '@/lib/services/poll'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pollId: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId, pollId } = await params

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only teachers can close polls
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only teachers can close polls' }, { status: 403 })
    }

    // Verify poll exists and user is creator
    const poll = await prisma.livePoll.findUnique({
      where: { id: pollId },
    })

    if (!poll || poll.lessonId !== lessonId || poll.createdBy !== user.id) {
      return NextResponse.json(
        { error: 'Poll not found or unauthorized' },
        { status: 403 }
      )
    }

    const closed = await closeLivePoll(pollId)

    return NextResponse.json({
      success: true,
      poll: closed,
    })
  } catch (error) {
    console.error('Error closing poll:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
