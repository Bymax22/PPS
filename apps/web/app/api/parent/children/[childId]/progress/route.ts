// app/api/parent/children/[childId]/progress/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const childId = params.childId

    // Get student user ID from student profile
    const student = await prisma.student.findUnique({
      where: { id: childId },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get progress data
    const progress = await prisma.progress.findMany({
      where: { userId: student.userId },
      include: {
        lesson: {
          include: { class: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    // Get exam attempts
    const examAttempts = await prisma.examAttempt.findMany({
      where: { userId: student.userId },
      include: {
        exam: {
          include: { class: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate statistics
    const completedLessons = progress.filter(p => p.percentageWatched === 100).length
    const totalLessons = progress.length
    const passedExams = examAttempts.filter(e => e.isPassed === true).length
    const totalExams = examAttempts.length
    const averageScore = examAttempts.length > 0
      ? Math.round(examAttempts.reduce((sum, e) => sum + (e.percentage || 0), 0) / examAttempts.length)
      : 0

    // Get recent activity
    const recentActivity = [
      ...progress.slice(0, 3).map(p => ({
        id: p.id,
        type: 'lesson',
        title: p.lesson.title,
        date: p.updatedAt,
        status: p.percentageWatched === 100 ? 'completed' : 'in-progress',
        percentageWatched: p.percentageWatched
      })),
      ...examAttempts.slice(0, 3).map(e => ({
        id: e.id,
        type: 'exam',
        title: e.exam.title,
        date: e.submittedAt || e.createdAt,
        score: e.score,
        status: e.isPassed ? 'passed' : 'failed'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

    return NextResponse.json({
      averageScore,
      completedLessons,
      totalLessons,
      passedExams,
      totalExams,
      recentActivity
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}