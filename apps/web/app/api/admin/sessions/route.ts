import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotificationsForUsers } from '@/lib/adminNotifications'
import { requireAdmin } from '@/lib/adminAuth'
import { adminSessionPayloadSchema, adminSessionReassignPayloadSchema, parseValidation } from '@/lib/validation'
import { logProductionEvent } from '@/lib/monitoring'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const [sessions, classes] = await prisma.$transaction([
    prisma.lesson.findMany({
      take: 50,
      orderBy: { scheduledAt: 'desc' },
      include: {
        class: { select: { id: true, name: true, program: { select: { name: true } } } },
        attendees: { select: { id: true } }
      }
    }),
    prisma.class.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } })
  ])

  return NextResponse.json({
    classes,
    sessions: sessions.map((sessionItem) => ({
      id: sessionItem.id,
      title: sessionItem.title,
      classId: sessionItem.classId,
      className: sessionItem.class?.name ?? 'Unknown',
      lessonType: sessionItem.type,
      status: sessionItem.status,
      program: sessionItem.class?.program?.name ?? 'Unknown',
      scheduledAt: sessionItem.scheduledAt?.toISOString() ?? null,
      attendees: sessionItem.attendees.length
    }))
  })
}

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { admin } = context

  const body = await req.json()
  const validation = parseValidation(adminSessionPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { title, classId, description, type, status, scheduledAt, duration, roomId } = validation.data

  const targetClass = await prisma.class.findUnique({ where: { id: classId } })
  if (!targetClass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 400 })
  }

  const created = await prisma.lesson.create({
    data: {
      title,
      description: description || undefined,
      type,
      status,
      class: { connect: { id: targetClass.id } },
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      duration: duration ? Number(duration) : undefined,
      roomId: roomId || undefined,
      createdBy: admin.id
    }
  })

  const enrolledUsers = await prisma.enrollment.findMany({
    where: { classId: targetClass.id, status: 'ACTIVE' },
    select: { userId: true }
  })

  if (enrolledUsers.length) {
    await createNotificationsForUsers(enrolledUsers.map((item) => item.userId), {
      title: 'New session scheduled',
      body: `A new ${type.toLowerCase()} session titled ${title} is now available for your class.`,
      type: 'ANNOUNCEMENT',
      link: '/student',
      metadata: { lessonId: created.id, classId: targetClass.id }
    })
  }

  logProductionEvent('session_created', { adminId: admin.id, lessonId: created.id, classId: targetClass.id }, 'info')

  return NextResponse.json({ id: created.id, title: created.title }, { status: 201 })
}

export async function PATCH(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminSessionReassignPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { lessonId, classId } = validation.data

  const targetLesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!targetLesson) {
    return NextResponse.json({ error: 'Session not found' }, { status: 400 })
  }

  const targetClass = await prisma.class.findUnique({ where: { id: classId, isDeleted: false } })
  if (!targetClass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 400 })
  }

  await prisma.lesson.update({ where: { id: lessonId }, data: { classId } })

  logProductionEvent('session_class_reassigned', { adminId: context.admin.id, lessonId, classId }, 'info')

  return NextResponse.json({ ok: true })
}
