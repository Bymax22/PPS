// apps/web/app/api/lessons/[id]/polls/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createLivePoll, getLessonPolls } from '@/lib/services/poll'

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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only teachers can create polls
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only teachers can create polls' }, { status: 403 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson || lesson.createdBy !== user.id) {
      return NextResponse.json(
        { error: 'Lesson not found or unauthorized' },
        { status: 403 }
      )
    }

    const poll = await createLivePoll(lessonId, user.id, body)

    return NextResponse.json({
      success: true,
      poll,
    })
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    const polls = await getLessonPolls(lessonId)

    return NextResponse.json({
      polls,
    })
  } catch (error) {
    console.error('Error fetching polls:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
