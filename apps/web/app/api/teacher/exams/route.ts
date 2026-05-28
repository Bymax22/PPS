// app/api/teacher/exams/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, type, classId, scheduledAt, duration, totalMarks, passingMarks, questions } = body

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        type,
        classId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        duration,
        totalMarks,
        passingMarks,
        questions: {
          create: questions.map((q: any, index: number) => ({
            type: q.type,
            text: q.text,
            marks: q.marks,
            orderIndex: index,
            options: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer
          }))
        }
      }
    })

    return NextResponse.json(exam)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}