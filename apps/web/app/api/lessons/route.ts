import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTeacherClassScope, teacherCanAccessClass } from '@/lib/teacherAccess'

const lessonSchema = z.object({
  title: z.string().trim().min(1).max(200),
  classId: z.string().cuid(),
  description: z.string().max(5000).optional(),
  type: z.enum(['LIVE', 'RECORDED', 'HYBRID']),
  subject: z.string().trim().max(100).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED']).optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().int().positive().optional(),
})

export async function GET() {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  let classIds: string[] | null = null
  if (user.role === 'TEACHER') {
    const scope = await getTeacherClassScope(user.id)
    classIds = scope?.classIds ?? []
  } else if (user.role === 'STUDENT') {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id, status: 'ACTIVE' },
      select: { classId: true },
    })
    classIds = enrollments.map((enrollment) => enrollment.classId)
  } else if (user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Account cannot access lessons' }, { status: 403 })
  }

  const lessons = await prisma.lesson.findMany({
    where: { isDeleted: false, ...(classIds ? { classId: { in: classIds } } : {}) },
    orderBy: { scheduledAt: 'asc' },
  })
  return NextResponse.json(lessons)
}

export async function POST(request: Request) {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }
  const parsed = lessonSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid lesson details' }, { status: 400 })
  }

  const scope = await getTeacherClassScope(session.user.id)
  if (!scope || !teacherCanAccessClass(scope, parsed.data.classId)) {
    return NextResponse.json({ error: 'Only the assigned teacher or an admin can create lessons for this class' }, { status: 403 })
  }

  const lesson = await prisma.lesson.create({
    data: {
      title: parsed.data.title,
      classId: parsed.data.classId,
      description: parsed.data.description,
      type: parsed.data.type,
      subject: parsed.data.subject,
      status: parsed.data.status ?? (parsed.data.scheduledAt ? 'SCHEDULED' : 'DRAFT'),
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
      duration: parsed.data.duration,
      createdBy: session.user.id,
    },
  })
  return NextResponse.json(lesson, { status: 201 })
}
