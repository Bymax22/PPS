import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import getAuthOptions from '@/lib/auth'

export async function GET(request: Request) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.role !== 'ADMIN' && user.role !== 'FINANCE') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
