// apps/web/app/api/lessons/[id]/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createExercise } from '@/lib/services/exercise'

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

    // Verify lesson exists and user is the creator
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson || lesson.createdBy !== user.id) {
      return NextResponse.json(
        { error: 'Lesson not found or unauthorized' },
        { status: 403 }
      )
    }

    const exercise = await createExercise(lessonId, user.id, body)

    return NextResponse.json({
      success: true,
      exercise,
    })
  } catch (error) {
    console.error('Error creating exercise:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params

    const exercises = await prisma.classExercise.findMany({
      where: { lessonId },
      include: {
        questions: true,
        _count: {
          select: { responses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      exercises,
    })
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
