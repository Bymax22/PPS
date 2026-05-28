// app/api/teacher/lessons/route.ts
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
    const { title, description, type, classId, scheduledAt, duration, content } = body

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type,
        classId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        duration,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        createdBy: session.user.id,
        contentType: type === 'RECORDED' ? 'video' : 'live'
      }
    })

    // Notify students in the class
    const enrollments = await prisma.enrollment.findMany({
      where: { classId },
      include: { user: true }
    })

    for (const enrollment of enrollments) {
      await prisma.notification.create({
        data: {
          userId: enrollment.userId,
          type: 'LESSON_STARTING',
          title: `New lesson: ${title}`,
          body: `A new ${type.toLowerCase()} lesson has been scheduled for your class.`,
          link: `/student/lessons/${lesson.id}`
        }
      })
    }

    return NextResponse.json(lesson)
  } catch (error) {
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

    const lessons = await prisma.lesson.findMany({
      where: classId ? { classId } : {},
      include: {
        class: true,
        attendees: true,
        progress: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(lessons)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}