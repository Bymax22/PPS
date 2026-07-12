// app/api/teacher/lessons/route.ts
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
    const { title, description, type, classId, scheduledAt, duration, content, studentIds = [], assignToClass = false, status } = body

    if (!title || !classId) {
      return NextResponse.json({ error: 'Lesson title and class are required' }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type,
        classId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        duration: duration ? Number(duration) : undefined,
        status: status || (scheduledAt ? 'SCHEDULED' : 'DRAFT'),
        createdBy: session.user.id,
        contentType: type === 'RECORDED' ? 'video' : 'live'
      }
    })

    const selectedStudentIds = Array.isArray(studentIds) && studentIds.length > 0
      ? studentIds
      : assignToClass
        ? (await prisma.enrollment.findMany({ where: { classId, status: 'ACTIVE' }, select: { userId: true } })).map((item) => item.userId)
        : []

    for (const userId of selectedStudentIds) {
      const existingAttendance = await prisma.sessionAttendee.findFirst({
        where: { lessonId: lesson.id, userId },
      })

      if (!existingAttendance) {
        await prisma.sessionAttendee.create({
          data: {
            lessonId: lesson.id,
            userId,
            attended: true,
          },
        })
      }
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { classId },
      include: { user: true }
    })

    await Promise.allSettled(
      enrollments.map((enrollment) =>
        sendNotificationHooks({
          userId: enrollment.userId,
          type: 'LESSON_STARTING',
          title: `New lesson: ${title}`,
          body: `A new ${type.toLowerCase()} lesson has been scheduled for your class.`,
          link: `/student/lessons/${lesson.id}`
        })
      )
    )

    return NextResponse.json({ ...lesson, assignedStudentCount: selectedStudentIds.length })
  } catch (error) {
    console.error('Create lesson error', error)
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
      where: { classId: classId ?? undefined, isDeleted: false },
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { lessonId, title, description, type, classId, scheduledAt, duration, status } = body

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson id is required' }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title: title ?? lesson.title,
        description: description ?? lesson.description,
        type: type ?? lesson.type,
        classId: classId ?? lesson.classId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : lesson.scheduledAt,
        duration: duration ? Number(duration) : lesson.duration,
        status: status ?? lesson.status,
        updatedAt: new Date()
      }
    })

    if (status && status !== lesson.status) {
      const enrollments = await prisma.enrollment.findMany({ where: { classId: updatedLesson.classId, status: 'ACTIVE' }, include: { user: true } })
      await Promise.allSettled(
        enrollments.map((enrollment) =>
          sendNotificationHooks({
            userId: enrollment.userId,
            type: status === 'CANCELLED' ? 'ANNOUNCEMENT' : 'LESSON_STARTING',
            title: status === 'CANCELLED' ? `Lesson cancelled: ${updatedLesson.title}` : `Lesson updated: ${updatedLesson.title}`,
            body: status === 'CANCELLED'
              ? `The lesson ${updatedLesson.title} has been cancelled.`
              : `The lesson ${updatedLesson.title} has been updated.`,
            link: `/student/lessons/${updatedLesson.id}`
          })
        )
      )
    }

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Update lesson error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const lessonId = searchParams.get('lessonId')

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson id is required' }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { isDeleted: true, deletedAt: new Date(), status: 'ARCHIVED' }
    })

    const enrollments = await prisma.enrollment.findMany({ where: { classId: updatedLesson.classId, status: 'ACTIVE' }, include: { user: true } })
    await Promise.allSettled(
      enrollments.map((enrollment) =>
        sendNotificationHooks({
          userId: enrollment.userId,
          type: 'ANNOUNCEMENT',
          title: `Lesson removed: ${updatedLesson.title}`,
          body: `The lesson ${updatedLesson.title} has been removed from the schedule.`,
          link: `/student`
        })
      )
    )

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Delete lesson error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}