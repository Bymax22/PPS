import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(request: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { prisma } = await import('@/lib/prisma')

  const [totalUsers, totalTeachers, totalParents, totalStudents, totalEnrollments, pendingAdmissions, recentPayments] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.enrollment.count(),
    prisma.admissionForm.count({ where: { status: 'PENDING' } }).catch(() => 0),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 10 })
  ])

  return NextResponse.json({
    totals: { totalUsers, totalTeachers, totalParents, totalStudents, totalEnrollments },
    pendingAdmissions,
    recentPayments
  })
}
