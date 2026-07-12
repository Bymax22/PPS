import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function formatUserName(user: { firstName?: string; lastName?: string }) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || 'Unknown'
}

function getInitials(user: { firstName?: string; lastName?: string }) {
  const names = [user.firstName, user.lastName].filter(Boolean)
  if (!names.length) return 'T'
  return names
    .map((name) => name?.charAt(0).toUpperCase())
    .filter(Boolean)
    .join('')
    .slice(0, 2)
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const teacher = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        teachingClasses: {
          include: {
            class: {
              include: {
                program: true,
                enrollments: {
                  where: { status: 'ACTIVE' },
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        studentProfile: { select: { grade: true } }
                      }
                    }
                  }
                },
                lessons: {
                  where: { isDeleted: false },
                  orderBy: { scheduledAt: 'asc' }
                },
                exams: {
                  where: { isDeleted: false },
                  include: {
                    attempts: {
                      include: {
                        user: {
                          select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                          }
                        }
                      },
                      orderBy: { submittedAt: 'desc' }
                    }
                  },
                  orderBy: { scheduledAt: 'desc' }
                },
                resources: {
                  where: { isDeleted: false },
                  orderBy: { createdAt: 'desc' },
                  include: {
                    media: { select: { originalUrl: true } }
                  }
                }
              }
            }
          }
        },
        receivedMessages: {
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    }

    const classRecords = (teacher.teachingClasses ?? []).map((link) => link.class)

    const classes = classRecords.map((cls) => ({
      id: cls.id,
      name: cls.name,
      grade: cls.grade ?? 0,
      subject: cls.subject ?? 'General',
      program: cls.program ? { name: cls.program.name, type: cls.program.type } : { name: 'General', type: 'ONLINE_FULL_TIME' },
      students: cls.enrollments.map((enrollment) => ({
        id: enrollment.user.id,
        userId: enrollment.user.id,
        firstName: enrollment.user.firstName,
        lastName: enrollment.user.lastName,
        email: enrollment.user.email,
        grade: enrollment.user.studentProfile?.grade ?? cls.grade ?? 0,
        phone: enrollment.user.phone ?? undefined,
        attendance: [],
        progress: []
      })),
      schedule: cls.lessons.map((lesson) => ({
        id: lesson.id,
        day: lesson.scheduledAt ? lesson.scheduledAt.toISOString() : '',
        time: lesson.scheduledAt ? lesson.scheduledAt.toISOString() : '',
        duration: lesson.duration ?? 0
      }))
    }))

    const lessons = classRecords
      .flatMap((cls) => cls.lessons)
      .map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description ?? '',
        type: lesson.type,
        status: lesson.status,
        scheduledAt: lesson.scheduledAt?.toISOString(),
        duration: lesson.duration ?? 0,
        classId: lesson.classId,
        createdAt: lesson.createdAt.toISOString()
      }))

    const exams = classRecords
      .flatMap((cls) => cls.exams)
      .map((exam) => ({
        id: exam.id,
        title: exam.title,
        description: exam.description ?? '',
        type: exam.type,
        scheduledAt: exam.scheduledAt?.toISOString(),
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        classId: exam.classId,
        submissions: exam.attempts.map((attempt) => ({
          id: attempt.id,
          studentId: attempt.userId,
          studentName: formatUserName(attempt.user),
          score: attempt.score ?? 0,
          percentage: attempt.percentage ?? 0,
          submittedAt: attempt.submittedAt?.toISOString() ?? null,
          status: attempt.score != null ? 'GRADED' : 'PENDING'
        }))
      }))

    const resources = classRecords
      .flatMap((cls) => cls.resources)
      .map((resource) => ({
        id: resource.id,
        title: resource.title,
        description: resource.description ?? '',
        type: resource.type,
        fileUrl: resource.media?.originalUrl ?? '',
        fileSize: resource.fileSize ?? 0,
        downloadCount: resource.downloadCount,
        createdAt: resource.createdAt.toISOString()
      }))

    const messages = teacher.receivedMessages.map((message) => ({
      id: message.id,
      from: formatUserName(message.sender),
      fromRole: message.sender.role,
      to: 'teacher',
      message: message.body,
      date: message.createdAt.toISOString(),
      read: message.read,
      childId: message.parentId ?? undefined
    }))

    const notifications = teacher.notifications.map((notification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.body,
      date: notification.createdAt.toISOString(),
      read: notification.read,
      type: notification.type
    }))

    const teacherDetails = {
      id: teacher.id,
      name: formatUserName(teacher),
      initials: getInitials(teacher),
      email: teacher.email,
      role: teacher.role ?? 'TEACHER'
    }

    return NextResponse.json({ teacher: teacherDetails, classes, lessons, exams, resources, messages, notifications })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
