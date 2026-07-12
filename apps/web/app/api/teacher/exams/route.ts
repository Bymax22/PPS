// app/api/teacher/exams/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNotificationHooks } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, type, classId, scheduledAt, duration, totalMarks, passingMarks, questions, status } = body

    if (!title || !classId) {
      return NextResponse.json({ error: 'Exam title and class are required' }, { status: 400 })
    }

    const normalizedQuestions = Array.isArray(questions) ? questions : []

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        type,
        classId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        duration: duration ? Number(duration) : 60,
        totalMarks: totalMarks ? Number(totalMarks) : 100,
        passingMarks: passingMarks ? Number(passingMarks) : 50,
        questions: {
          create: normalizedQuestions.map((q: any, index: number) => ({
            type: q.type,
            text: q.text,
            marks: q.marks,
            orderIndex: index,
            options: q.options ?? null,
            correctAnswer: q.correctAnswer
          }))
        }
      }
    })

    const enrollments = await prisma.enrollment.findMany({ where: { classId, status: 'ACTIVE' }, include: { user: true } })
    await Promise.allSettled(
      enrollments.map((enrollment) =>
        sendNotificationHooks({
          userId: enrollment.userId,
          type: 'HOMEWORK_DUE',
          title: `New assessment: ${exam.title}`,
          body: `A new ${type.toLowerCase()} has been created for your class.`,
          link: `/student/exams/${exam.id}`
        })
      )
    )

    return NextResponse.json(exam)
  } catch (error) {
    console.error('Create exam error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')

    const exams = await prisma.exam.findMany({
      where: { classId: classId ?? undefined, isDeleted: false },
      include: {
        attempts: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } }
        },
        questions: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error('List exams error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}