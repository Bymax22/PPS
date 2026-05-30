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

  const enrollments = await prisma.enrollment.findMany({
    take: 50,
    orderBy: { enrolledAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, payments: { take: 1, orderBy: { createdAt: 'desc' } } } },
      class: { select: { name: true, grade: true, subject: true, program: { select: { name: true } } } }
    }
  })

  return NextResponse.json({
    enrollments: enrollments.map((enrollment) => ({
      id: enrollment.id,
      student: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
      email: enrollment.user.email,
      className: enrollment.class.name,
      grade: enrollment.class.grade ? `Grade ${enrollment.class.grade}` : 'N/A',
      program: enrollment.class.program?.name ?? 'Unknown',
      status: enrollment.status,
      paymentStatus: enrollment.user.payments?.[0]?.status ?? 'No payment',
      enrolledAt: enrollment.enrolledAt.toISOString()
    }))
  })
}
