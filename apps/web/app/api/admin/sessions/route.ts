import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const sessions = await prisma.lesson.findMany({
    take: 50,
    orderBy: { scheduledAt: 'desc' },
    include: {
      class: { select: { name: true, program: { select: { name: true } } } },
      attendees: { select: { id: true } }
    }
  })

  return NextResponse.json({
    sessions: sessions.map((sessionItem) => ({
      id: sessionItem.id,
      title: sessionItem.title,
      className: sessionItem.class?.name ?? 'Unknown',
      lessonType: sessionItem.type,
      status: sessionItem.status,
      program: sessionItem.class?.program?.name ?? 'Unknown',
      scheduledAt: sessionItem.scheduledAt?.toISOString() ?? null,
      attendees: sessionItem.attendees.length
    }))
  })
}
