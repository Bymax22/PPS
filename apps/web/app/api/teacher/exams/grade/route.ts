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
    if (typeof examId !== 'string' || typeof studentId !== 'string' || !Number.isFinite(score)) {
      return NextResponse.json({ error: 'Exam, student, and numeric score are required' }, { status: 400 })
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId } })
    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 })

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'TEACHER')) {
      return NextResponse.json({ error: 'Only teachers and admins can grade exams' }, { status: 403 })
    }
    if (currentUser.role === 'TEACHER') {
      const assignment = await prisma.teacherClass.findFirst({
        where: { teacherId: currentUser.id, classId: exam.classId },
        select: { id: true },
      })
      if (!assignment) return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: studentId, classId: exam.classId, status: 'ACTIVE' },
      select: { id: true },
    })
    if (!enrollment) return NextResponse.json({ error: 'Student is not enrolled in this class' }, { status: 400 })
    if (score < 0 || score > exam.totalMarks) {
      return NextResponse.json({ error: `Score must be between 0 and ${exam.totalMarks}` }, { status: 400 })
    }

    // Try find existing attempt by composite unique examId+userId
    let attempt = await prisma.examAttempt.findUnique({ where: { examId_userId: { examId, userId: studentId } } })

    const percentage = exam.totalMarks ? Math.round((score / exam.totalMarks) * 100) : null
    const isPassed = percentage !== null ? score >= exam.passingMarks : null

    if (attempt) {
      attempt = await prisma.examAttempt.update({
        where: { id: attempt.id },
        data: { score, percentage, isPassed, feedback, submittedAt: new Date() }
      })
    } else {
      attempt = await prisma.examAttempt.create({
        data: {
          examId,
          userId: studentId,
          startedAt: new Date(),
          submittedAt: new Date(),
          score,
          percentage,
          isPassed,
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
    console.error('Grade submission error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
