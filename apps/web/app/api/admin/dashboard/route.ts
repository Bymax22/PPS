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

  const [totalStudents, totalParents, totalTeachers, totalClasses, totalEnrollments, totalPayments, revenue, activeSubscriptions] = await prisma.$transaction([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'PARENT' } }),
    prisma.user.count({ where: { role: 'TEACHER' } }),
    prisma.class.count(),
    prisma.enrollment.count(),
    prisma.payment.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.subscription.count({ where: { isActive: true } })
  ])

  const enrollments = await prisma.enrollment.findMany({
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
  })

  const parents = await prisma.user.findMany({
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
  })

  const teachers = await prisma.user.findMany({
    take: 20,
    where: { role: 'TEACHER' },
    orderBy: { updatedAt: 'desc' },
    include: {
      teacherProfile: true,
      teachingClasses: {
        include: { class: { select: { name: true, grade: true, subject: true } } }
      }
    }
  })

  const classes = await prisma.class.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      program: true,
      teachers: { include: { teacher: { select: { firstName: true, lastName: true } } } },
      enrollments: { select: { id: true } }
    }
  })

  const sessions = await prisma.lesson.findMany({
    take: 20,
    orderBy: { scheduledAt: 'desc' },
    include: {
      class: { select: { name: true, program: { select: { type: true } } } },
      attendees: { select: { id: true } }
    }
  })

  const payments = await prisma.payment.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      subscription: { select: { plan: true } }
    }
  })

  return NextResponse.json({
    summary: {
      totalStudents,
      totalParents,
      totalTeachers,
      totalClasses,
      totalEnrollments,
      totalPayments,
      totalRevenue: revenue._sum.amount ?? 0,
      activeSubscriptions
    },
    enrollments: enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      status: enrollment.status,
      studentName: `${enrollment.user.firstName} ${enrollment.user.lastName}`,
      studentEmail: enrollment.user.email,
      studentPhone: enrollment.user.phone,
      grade: enrollment.class.grade,
      subject: enrollment.class.subject,
      programType: enrollment.class.program?.type ?? null,
      latestPaymentStatus: enrollment.user.payments?.[0]?.status ?? null
    })),
    parents: parents.map((parent) => ({
      id: parent.id,
      name: `${parent.firstName} ${parent.lastName}`,
      email: parent.email,
      phone: parent.phone,
      nationalId: parent.nationalId,
      lastUpdated: parent.updatedAt.toISOString(),
      children: parent.children.map((child) => ({
        name: `${child.user.firstName} ${child.user.lastName}`,
        email: child.user.email,
        phone: child.user.phone,
        grade: child.grade
      })),
      activeSubscription: parent.subscriptions?.[0]?.isActive ? 'Active' : 'Inactive'
    })),
    teachers: teachers.map((teacher) => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.teacherProfile?.subject ?? null,
      classes: teacher.teachingClasses.map((teachingClass) => teachingClass.class.name),
      lastUpdated: teacher.updatedAt.toISOString()
    })),
    classes: classes.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      grade: classItem.grade,
      subject: classItem.subject,
      programType: classItem.program?.type ?? null,
      teachers: classItem.teachers.map((teacherLink) => `${teacherLink.teacher.firstName} ${teacherLink.teacher.lastName}`),
      enrolledCount: classItem.enrollments.length,
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
      attendees: lesson.attendees.length
    })),
    payments: payments.map((payment) => ({
      id: payment.id,
      createdAt: payment.createdAt.toISOString(),
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      payer: `${payment.user.firstName} ${payment.user.lastName}`,
      email: payment.user.email,
      subscription: payment.subscription?.plan?.name ?? null
    }))
  })
}
