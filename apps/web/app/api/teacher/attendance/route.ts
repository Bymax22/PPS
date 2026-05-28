import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { classId, lessonId, date, attendance } = body

    if (!attendance || !Array.isArray(attendance)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const created: any[] = []
    for (const a of attendance) {
      const att = await prisma.attendance.create({
        data: {
          userId: a.userId,
          lessonId: lessonId || null,
          classId: classId || null,
          date: date ? new Date(date) : new Date(),
          status: a.status,
          remarks: a.remarks || null,
          recordedBy: session.user.id
        }
      })
      created.push(att)
    }

    return NextResponse.json({ created })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')
    const lessonId = searchParams.get('lessonId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    if (classId) where.classId = classId
    if (lessonId) where.lessonId = lessonId
    if (startDate || endDate) where.date = {}
    if (startDate) where.date.gte = new Date(startDate)
    if (endDate) where.date.lte = new Date(endDate)

    const records = await prisma.attendance.findMany({ where, orderBy: { date: 'desc' } })
    return NextResponse.json(records)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
