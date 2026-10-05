// apps/web/app/api/lessons/[id]/exercises/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createExercise } from '@/lib/services/exercise'
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const access = await getLessonAccess(user.id, lessonId)
    if (!access) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    if (!access.canTeach) return NextResponse.json({ error: 'Only an assigned teacher or admin can create exercises' }, { status: 403 })

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
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id: lessonId } = await params
    const access = await getLessonAccess(session.user.id, lessonId)
    if (!access?.canAccess) return NextResponse.json({ error: 'No access to this lesson' }, { status: 403 })

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
