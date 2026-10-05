// apps/web/app/api/lessons/[id]/polls/[pollId]/respond/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { submitPollResponse, getPollResults } from '@/lib/services/poll'
import { getLessonAccess } from '@/lib/lessonAccess'

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
    const body = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const access = await getLessonAccess(user.id, lessonId)
    if (!access?.canAccess || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only enrolled students can respond to polls' }, { status: 403 })
    }

    // Verify poll exists
    const poll = await prisma.livePoll.findUnique({
      where: { id: pollId },
    })

    if (!poll || poll.lessonId !== lessonId) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    if (!poll.isActive) {
      return NextResponse.json({ error: 'Poll is closed' }, { status: 400 })
    }

    const response = await submitPollResponse(pollId, user.id, body.selectedOption)

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error('Error submitting poll response:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pollId: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: lessonId, pollId } = await params
    const access = await getLessonAccess(session.user.id, lessonId)
    if (!access?.canAccess) return NextResponse.json({ error: 'No access to this lesson' }, { status: 403 })

    const poll = await prisma.livePoll.findUnique({
      where: { id: pollId },
    })

    if (!poll || poll.lessonId !== lessonId) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 })
    }

    if (!access.canTeach && access.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'No access to poll results' }, { status: 403 })
    }
    const results = await getPollResults(pollId)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching poll results:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
