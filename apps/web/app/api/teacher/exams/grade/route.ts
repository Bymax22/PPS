import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNotificationHooks } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { examId, studentId, score, feedback } = body

    const exam = await prisma.exam.findUnique({ where: { id: examId } })
    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 })

    // Try find existing attempt by composite unique examId+userId
    let attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId: studentId } } as any })

    const percentage = exam.totalMarks ? Math.round((score / exam.totalMarks) * 100) : null
    const isPassed = percentage !== null ? percentage >= (exam.passingMarks || 0) : null

    if (attempt) {
      attempt = await prisma.examAttempt.update({
        where: { id: attempt.id },
        data: { score, percentage: percentage || undefined, isPassed: isPassed || undefined, feedback, submittedAt: new Date() }
      })
    } else {
      attempt = await prisma.examAttempt.create({
        data: {
          examId,
          userId: studentId,
          startedAt: new Date(),
          submittedAt: new Date(),
          score,
          percentage: percentage || undefined,
          isPassed: isPassed || undefined,
          feedback
        }
      })
    }

    await sendNotificationHooks({
      userId: studentId,
      type: 'GRADE_PUBLISHED',
      title: `Your exam results: ${exam.title}`,
      body: `You scored ${score} (${percentage}%)`,
      link: `/student/exams/${examId}`
    })

    return NextResponse.json(attempt)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
