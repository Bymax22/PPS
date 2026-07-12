import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
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
