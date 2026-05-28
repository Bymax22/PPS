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
                  include: {
                    user: {
                      include: {
                        studentProfile: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    const classes = teacher?.teachingClasses.map(tc => ({
      id: tc.class.id,
      name: tc.class.name,
      grade: tc.class.grade,
      subject: tc.class.subject,
      program: tc.class.program,
      students: tc.class.enrollments.map(e => e.user),
      schedule: [] // You'll need a schedule model
    }))

    return NextResponse.json(classes || [])
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}