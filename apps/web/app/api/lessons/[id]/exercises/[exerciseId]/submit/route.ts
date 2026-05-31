// apps/web/app/api/lessons/[id]/exercises/[exerciseId]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { submitExerciseResponse, getExerciseResponses } from '@/lib/services/exercise'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; exerciseId: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId, exerciseId } = await params
    const body = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify exercise exists
    const exercise = await prisma.classExercise.findUnique({
      where: { id: exerciseId },
    })

    if (!exercise || exercise.lessonId !== lessonId) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    const response = await submitExerciseResponse(exerciseId, user.id, body.answers)

    return NextResponse.json({
      success: true,
      response,
    })
  } catch (error) {
    console.error('Error submitting exercise response:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; exerciseId: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId, exerciseId } = await params

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify exercise
    const exercise = await prisma.classExercise.findUnique({
      where: { id: exerciseId },
    })

    if (!exercise || exercise.lessonId !== lessonId) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 })
    }

    // If teacher, return all responses; if student, return only their own
    if (user.role === 'TEACHER' || user.role === 'ADMIN') {
      const responses = await getExerciseResponses(exerciseId)
      return NextResponse.json({ responses })
    } else {
      const response = await prisma.classExerciseResponse.findUnique({
        where: { exerciseId_userId: { exerciseId, userId: user.id } },
      })
      return NextResponse.json({ response })
    }
  } catch (error) {
    console.error('Error fetching exercise responses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
