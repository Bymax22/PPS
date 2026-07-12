import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const resolveCount = (result: PromiseSettledResult<number>) => (result.status === 'fulfilled' ? result.value : 0)
  const resolveAmount = (result: PromiseSettledResult<{ _sum: { amount: number | null } }>) => {
    if (result.status !== 'fulfilled') return 0
    return Number(result.value._sum.amount ?? 0)
  }

  const [totalStudents, totalParents, totalTeachers, totalClasses, totalEnrollments, totalPayments, revenue, activeSubscriptions] = await Promise.allSettled([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.class.count(),
    prisma.enrollment.count(),
    prisma.payment.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.subscription.count({ where: { status: 'ACTIVE' } })
  ])

  const [enrollmentsResult, parentsResult, teachersResult, classesResult, sessionsResult, paymentsResult] = await Promise.allSettled([
    prisma.enrollment.findMany({
      take: 20,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            payments: { take: 1, orderBy: { createdAt: 'desc' } }
          }
        },
        class: {
          select: {
            grade: true,
            subject: true,
            program: { select: { type: true, name: true } }
          }
        }
      }
    }),
    prisma.user.findMany({
      take: 20,
      where: { role: 'PARENT' },
      orderBy: { updatedAt: 'desc' },
      include: {
        children: {
          include: {
            user: { select: { firstName: true, lastName: true, email: true, phone: true } }
          }
        },
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 1 },
        payments: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    }),
    prisma.user.findMany({
      take: 20,
      where: { role: 'TEACHER' },
      orderBy: { updatedAt: 'desc' },
      include: {
        teacherProfile: true,
        teachingClasses: {
          include: { class: { select: { name: true, grade: true, subject: true } } }
        }
      }
    }),
    prisma.class.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        program: true,
        teachers: { include: { teacher: { select: { firstName: true, lastName: true } } } },
        enrollments: { select: { id: true } }
      }
    }),
    prisma.lesson.findMany({
      take: 20,
      orderBy: { scheduledAt: 'desc' },
      include: {
        class: { select: { name: true, program: { select: { type: true } } } },
        attendees: { select: { id: true } }
      }
    }),
    prisma.payment.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        subscription: { select: { plan: true } }
      }
    })
  ])

  const enrollments = enrollmentsResult.status === 'fulfilled' ? enrollmentsResult.value : []
  const parents = parentsResult.status === 'fulfilled' ? parentsResult.value : []
  const teachers = teachersResult.status === 'fulfilled' ? teachersResult.value : []
  const classes = classesResult.status === 'fulfilled' ? classesResult.value : []
  const sessions = sessionsResult.status === 'fulfilled' ? sessionsResult.value : []
  const payments = paymentsResult.status === 'fulfilled' ? paymentsResult.value : []

  const formatName = (firstName?: string | null, lastName?: string | null) => {
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
    return fullName || 'Unknown user'
  }

  return NextResponse.json({
    summary: {
      totalStudents: resolveCount(totalStudents),
      totalParents: resolveCount(totalParents),
      totalTeachers: resolveCount(totalTeachers),
      totalClasses: resolveCount(totalClasses),
      totalEnrollments: resolveCount(totalEnrollments),
      totalPayments: resolveCount(totalPayments),
      totalRevenue: resolveAmount(revenue),
      activeSubscriptions: resolveCount(activeSubscriptions)
    },
    enrollments: enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      status: enrollment.status,
      studentName: formatName(enrollment.user?.firstName, enrollment.user?.lastName),
      studentEmail: enrollment.user?.email ?? 'No email',
      studentPhone: enrollment.user?.phone ?? null,
      grade: enrollment.class?.grade ?? null,
      subject: enrollment.class?.subject ?? null,
      programType: enrollment.class?.program?.type ?? null,
      latestPaymentStatus: enrollment.user?.payments?.[0]?.status ?? null
    })),
    parents: parents.map((parent) => ({
      id: parent.id,
      name: formatName(parent.firstName, parent.lastName),
      email: parent.email,
      phone: parent.phone,
      nationalId: parent.nationalId,
      lastUpdated: parent.updatedAt.toISOString(),
      children: (parent.children ?? []).map((child) => ({
        name: formatName(child.user?.firstName, child.user?.lastName),
        email: child.user?.email ?? 'No email',
        phone: child.user?.phone ?? null,
        grade: child.grade
      })),
      activeSubscription: parent.subscriptions?.[0]?.isActive ? 'Active' : 'Inactive'
    })),
    teachers: teachers.map((teacher) => ({
      id: teacher.id,
      name: formatName(teacher.firstName, teacher.lastName),
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.teacherProfile?.subject ?? null,
      classes: (teacher.teachingClasses ?? []).map((teachingClass) => teachingClass.class?.name ?? 'Unnamed class'),
      lastUpdated: teacher.updatedAt.toISOString()
    })),
    classes: classes.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      grade: classItem.grade,
      subject: classItem.subject,
      programType: classItem.program?.type ?? null,
      teachers: (classItem.teachers ?? []).map((teacherLink) => formatName(teacherLink.teacher?.firstName, teacherLink.teacher?.lastName)),
      enrolledCount: classItem.enrollments?.length ?? 0,
      capacity: classItem.capacity
    })),
    sessions: sessions.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      className: lesson.class?.name ?? 'No class',
      programType: lesson.class?.program?.type ?? null,
      lessonType: lesson.type,
      status: lesson.status,
      scheduledAt: lesson.scheduledAt?.toISOString() ?? null,
      attendees: lesson.attendees?.length ?? 0
    })),
    payments: payments.map((payment) => ({
      id: payment.id,
      createdAt: payment.createdAt.toISOString(),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      payer: formatName(payment.user?.firstName, payment.user?.lastName),
      email: payment.user?.email ?? 'No email',
      subscription: payment.subscription?.plan?.name ?? null
    }))
  })
}
