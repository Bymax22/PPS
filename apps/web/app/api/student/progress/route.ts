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

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')

    const [progressRecords, examAttempts, attendanceRecords] = await Promise.all([
      prisma.progress.findMany({
        where: { userId: session.user.id, ...(classId ? { lesson: { classId } } : {}) },
        include: { lesson: { select: { id: true, title: true, classId: true } } },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.examAttempt.findMany({
        where: { userId: session.user.id, ...(classId ? { exam: { classId } } : {}) },
        include: { exam: { select: { id: true, title: true, classId: true } } },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.attendance.findMany({
        where: { userId: session.user.id, ...(classId ? { classId } : {}) },
        orderBy: { date: 'desc' }
      })
    ])

    return NextResponse.json({
      progress: progressRecords,
      exams: examAttempts,
      attendance: attendanceRecords
    })
  } catch (error) {
    console.error('Student progress error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
