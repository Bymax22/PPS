// app/api/teacher/classes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
                      include: {
                        studentProfile: true
                      }
                    }
                  }
                },
                lessons: {
                  where: { isDeleted: false },
                  orderBy: { scheduledAt: 'asc' }
                }
              }
            }
          }
        }
      }
    })

    const classes = teacher?.teachingClasses.map(tc => {
      const cls = tc.class
      return {
        id: cls.id,
        name: cls.name,
        grade: cls.grade,
        subject: cls.subject ?? 'General',
        program: cls.program,
        students: cls.enrollments.map(e => ({
          id: e.user.id,
          userId: e.user.id,
          firstName: e.user.firstName,
          lastName: e.user.lastName,
          email: e.user.email,
          grade: e.user.studentProfile?.grade ?? cls.grade,
          phone: e.user.phone
        })),
        schedule: cls.lessons.map((lesson) => ({
          id: lesson.id,
          day: lesson.scheduledAt?.toISOString() ?? '',
          time: lesson.scheduledAt?.toISOString() ?? '',
          duration: lesson.duration ?? 0
        }))
      }
    })

    return NextResponse.json(classes || [])
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}