import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function formatUserName(user: { firstName?: string; lastName?: string }) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Student'
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parent = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        children: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              }
            }
          }
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        receivedMessages: {
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    const childIds = parent.children.map((child) => child.userId)
    const [childEnrollments, childProgress, childAttendance, childPayments, childExams] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: { in: childIds }, status: 'ACTIVE' },
        include: {
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
              subject: true,
              program: { select: { name: true, type: true } }
            }
          }
        }
      }),
      prisma.progress.findMany({
        where: { userId: { in: childIds } },
        include: {
          lesson: {
            select: { id: true, title: true, classId: true, scheduledAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 100
      }),
      prisma.attendance.findMany({
        where: { userId: { in: childIds } },
        orderBy: { date: 'desc' },
        take: 100
      }),
      prisma.payment.findMany({
        where: { userId: { in: childIds } },
        orderBy: { createdAt: 'desc' },
        take: 50
      }),
      prisma.examAttempt.findMany({
        where: { userId: { in: childIds } },
        include: {
          exam: {
            select: { id: true, title: true, classId: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100
      })
    ])

    const classIdsByChild = new Map<string, string[]>()
    for (const enrollment of childEnrollments) {
      const classIds = classIdsByChild.get(enrollment.userId) ?? []
      classIds.push(enrollment.classId)
      classIdsByChild.set(enrollment.userId, classIds)
    }

    const childLessons = await prisma.lesson.findMany({
      where: {
        classId: { in: Array.from(new Set(childEnrollments.map((enrollment) => enrollment.classId))) },
        isDeleted: false
      },
      orderBy: { scheduledAt: 'asc' },
      take: 50,
      include: {
        class: { select: { id: true, name: true } }
      }
    })

    const enrollmentsByChild = new Map<string, typeof childEnrollments>()
    for (const enrollment of childEnrollments) {
      const list = enrollmentsByChild.get(enrollment.userId) ?? []
      list.push(enrollment)
      enrollmentsByChild.set(enrollment.userId, list)
    }

    const progressByChild = new Map<string, typeof childProgress>()
    for (const progress of childProgress) {
      const list = progressByChild.get(progress.userId) ?? []
      list.push(progress)
      progressByChild.set(progress.userId, list)
    }

    const attendanceByChild = new Map<string, typeof childAttendance>()
    for (const attendance of childAttendance) {
      const list = attendanceByChild.get(attendance.userId) ?? []
      list.push(attendance)
      attendanceByChild.set(attendance.userId, list)
    }

    const paymentsByChild = new Map<string, typeof childPayments>()
    for (const payment of childPayments) {
      const list = paymentsByChild.get(payment.userId) ?? []
      list.push(payment)
      paymentsByChild.set(payment.userId, list)
    }

    const examsByChild = new Map<string, typeof childExams>()
    for (const examAttempt of childExams) {
      const list = examsByChild.get(examAttempt.userId) ?? []
      list.push(examAttempt)
      examsByChild.set(examAttempt.userId, list)
    }

    const lessonsByChild = new Map<string, typeof childLessons>()
    for (const lesson of childLessons) {
      for (const [childId, classIds] of classIdsByChild.entries()) {
        if (classIds.includes(lesson.classId)) {
          const list = lessonsByChild.get(childId) ?? []
          list.push(lesson)
          lessonsByChild.set(childId, list)
        }
      }
    }

    const children = await Promise.all(parent.children.map(async (child) => {
      const childProgressRecords = progressByChild.get(child.userId) ?? []
      const childAttendanceRecords = attendanceByChild.get(child.userId) ?? []
      const childPaymentsList = paymentsByChild.get(child.userId) ?? []
      const childExamAttempts = examsByChild.get(child.userId) ?? []
      const childLessonsList = lessonsByChild.get(child.userId) ?? []

      const completedLessons = childProgressRecords.filter((record) => record.percentageWatched >= 100).length
      const averageScore = childExamAttempts.length
        ? Math.round(childExamAttempts.reduce((sum, attempt) => sum + (attempt.score ?? 0), 0) / childExamAttempts.length)
        : 0
      const passedExams = childExamAttempts.filter((attempt) => attempt.isPassed === true).length
      const totalExams = childExamAttempts.length
      const totalLessons = childProgressRecords.length || childLessonsList.length

      const attendanceSummary = childAttendanceRecords.reduce(
        (summary, attendance) => {
          if (attendance.status === 'PRESENT') summary.present += 1
          if (attendance.status === 'ABSENT') summary.absent += 1
          if (attendance.status === 'LATE') summary.late += 1
          if (attendance.status === 'EXCUSED') summary.excused += 1
          return summary
        },
        { present: 0, absent: 0, late: 0, excused: 0 }
      )

      const attendancePercentage = childAttendanceRecords.length
        ? Math.round((attendanceSummary.present / childAttendanceRecords.length) * 100)
        : 0

      return {
        id: child.id,
        userId: child.userId,
        grade: child.grade ?? 0,
        schoolYear: child.schoolYear ?? undefined,
        user: {
          firstName: child.user.firstName,
          lastName: child.user.lastName,
          email: child.user.email,
          phone: child.user.phone ?? undefined,
          profileImage: undefined
        },
        progress: {
          averageScore,
          completedLessons,
          totalLessons,
          passedExams,
          totalExams,
          recentActivity: childExamAttempts.slice(0, 5).map((attempt) => ({
            id: attempt.id,
            type: 'exam',
            title: attempt.exam?.title ?? 'Exam',
            date: attempt.createdAt,
            score: attempt.score ?? undefined,
            status: attempt.isPassed ? 'passed' : 'pending'
          }))
        },
        attendance: {
          ...attendanceSummary,
          percentage: attendancePercentage
        },
        classes: (enrollmentsByChild.get(child.userId) ?? []).map((enrollment) => ({
          id: enrollment.class.id,
          name: enrollment.class.name,
          grade: enrollment.class.grade ?? 0,
          subject: enrollment.class.subject ?? undefined,
          programName: enrollment.class.program?.name ?? undefined
        })),
        lessons: childLessonsList.slice(0, 5).map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          className: lesson.class?.name ?? 'Class',
          scheduledAt: lesson.scheduledAt?.toISOString() ?? null
        })),
        payments: childPaymentsList.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          date: payment.createdAt.toISOString(),
          description: payment.transactionRef ?? 'School payment'
        }))
      }
    }))

    const payments = parent.children.flatMap((child) => {
      const childPaymentsList = paymentsByChild.get(child.userId) ?? []
      return childPaymentsList.map((payment) => ({
        id: payment.id,
        childId: child.id,
        amount: payment.amount,
        status: payment.status,
        date: payment.createdAt.toISOString(),
        description: payment.transactionRef ?? 'School payment',
        method: payment.paymentMethod
      }))
    })

    const notifications = parent.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.body,
      date: notification.createdAt.toISOString(),
      read: notification.read,
      childId: null
    }))

    const messages = parent.receivedMessages.map((message) => ({
      id: message.id,
      from: formatUserName(message.sender),
      fromRole: message.sender.role,
      message: message.body,
      date: message.createdAt.toISOString(),
      read: message.read,
      childId: null
    }))

    return NextResponse.json({
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone ?? undefined,
      profileImage: undefined,
      children,
      notifications,
      messages,
      payments,
      paymentInstructions: {
        mobileMoneyProviders: [
          { name: 'MTN Mobile Money', code: 'MTN' },
          { name: 'Airtel Money', code: 'AIRTEL' }
        ],
        bankDetails: {
          accountName: 'PPS School Ltd',
          accountNumber: '1234567890',
          bankName: 'Zambia National Bank',
          swift: null
        }
      },
      savedCards: [],
      totalOutstanding: payments.filter((payment) => payment.status !== 'SUCCEEDED').reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0),
      currency: 'ZMW'
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
