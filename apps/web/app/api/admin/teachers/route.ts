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

  const teachers = await prisma.user.findMany({
    take: 50,
    where: { role: 'TEACHER' },
    orderBy: { updatedAt: 'desc' },
    include: {
      teacherProfile: true,
      teachingClasses: { include: { class: { select: { name: true } } } }
    }
  })

  return NextResponse.json({
    teachers: teachers.map((teacher) => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.teacherProfile?.subject ?? null,
      classes: teacher.teachingClasses.map((item) => item.class.name).join(', '),
      lastUpdated: teacher.updatedAt.toISOString()
    }))
  })
}
