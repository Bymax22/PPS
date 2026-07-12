import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotificationsForUsers } from '@/lib/adminNotifications'

export async function GET() {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { title, classId, description, type, status, scheduledAt, duration, roomId } = body

  if (!title || !classId || !type || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

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

  return NextResponse.json({ id: created.id, title: created.title }, { status: 201 })
}
