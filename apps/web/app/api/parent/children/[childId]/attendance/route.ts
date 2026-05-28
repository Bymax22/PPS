// app/api/parent/children/[childId]/attendance/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const childId = params.childId

    // Get student user ID
    const student = await prisma.student.findUnique({
      where: { id: childId }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get attendance records
    const attendance = await prisma.attendance.findMany({
      where: { userId: student.userId }
    })

    const present = attendance.filter(a => a.status === 'PRESENT' || a.status === 'ONLINE').length
    const absent = attendance.filter(a => a.status === 'ABSENT').length
    const late = attendance.filter(a => a.status === 'LATE').length
    const excused = attendance.filter(a => a.status === 'EXCUSED').length
    const total = attendance.length
    const percentage = total > 0 ? Math.round(((present + excused) / total) * 100) : 0

    return NextResponse.json({
      present,
      absent,
      late,
      excused,
      total,
      percentage
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}