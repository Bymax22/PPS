import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotificationsForUsers } from '@/lib/adminNotifications'
import { requireAdmin } from '@/lib/adminAuth'
import { adminClassPayloadSchema, adminClassUpdatePayloadSchema, parseValidation } from '@/lib/validation'
import { logProductionEvent } from '@/lib/monitoring'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const [programs, subjects, classes, teachers] = await prisma.$transaction([
    prisma.program.findMany({ orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.class.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        program: { select: { id: true, name: true } },
        enrollments: { select: { id: true } },
        teachers: { include: { teacher: { select: { firstName: true, lastName: true } } } }
      }
    }),
    prisma.user.findMany({
      where: { role: 'TEACHER' },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true, email: true }
    })
  ]).catch((error) => {
    console.error('Failed to load admin classes data', error)
    return [[], [], [], []] as const
  })

  return NextResponse.json({
    programs,
    subjects,
    teachers: teachers.map((teacher) => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`.trim(),
      email: teacher.email
    })),
    classes: classes.map((classItem) => ({
      id: classItem.id,
      name: classItem.name,
      grade: classItem.grade,
      subject: classItem.subject,
      capacity: classItem.capacity,
      programName: classItem.program?.name ?? 'Unassigned',
      enrolledCount: classItem.enrollments.length,
      teachers: classItem.teachers
        .map((link) => {
          const fullName = `${link.teacher?.firstName ?? ''} ${link.teacher?.lastName ?? ''}`.trim()
          return fullName || null
        })
        .filter((value): value is string => Boolean(value))
    }))
  })
}

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { admin } = context

  const body = await req.json()
  const validation = parseValidation(adminClassPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { name, programId, grade, subject, capacity, teacherIds } = validation.data

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) {
    return NextResponse.json({ error: 'Invalid program' }, { status: 400 })
  }

  const resolvedTeacherIds = Array.isArray(teacherIds)
    ? teacherIds.filter((value: unknown): value is string => typeof value === 'string' && Boolean(value))
    : []

  const created = await prisma.class.create({
    data: {
      name,
      program: { connect: { id: program.id } },
      grade: grade ? Number(grade) : undefined,
      subject: subject || undefined,
      capacity: Number(capacity ?? 30),
      teachers: resolvedTeacherIds.length
        ? {
            create: resolvedTeacherIds.map((teacherId) => ({
              teacher: { connect: { id: teacherId } }
            }))
          }
        : undefined
    }
  })

  if (resolvedTeacherIds.length) {
    await createNotificationsForUsers(resolvedTeacherIds, {
      title: 'New class assignment',
      body: `You have been assigned to class ${created.name}.`,
      type: 'ANNOUNCEMENT',
      link: '/teacher',
      metadata: { classId: created.id }
    })
  }

  logProductionEvent('class_created', { adminId: admin.id, classId: created.id }, 'info')
  return NextResponse.json({ class: { id: created.id, name: created.name } }, { status: 201 })
}

export async function PATCH(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminClassUpdatePayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { classId, teacherIds, grade, subject, capacity } = validation.data

  const targetClass = await prisma.class.findUnique({ where: { id: classId } })
  if (!targetClass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 400 })
  }

  const updatePayload: Record<string, unknown> = {}
  if (grade !== undefined) updatePayload.grade = Number(grade)
  if (subject !== undefined) updatePayload.subject = subject || null
  if (capacity !== undefined) updatePayload.capacity = Number(capacity)

  if (Object.keys(updatePayload).length) {
    await prisma.class.update({ where: { id: classId }, data: updatePayload })
  }

  const resolvedTeacherIds = Array.isArray(teacherIds)
    ? teacherIds.filter((value: unknown): value is string => typeof value === 'string' && Boolean(value))
    : []

  if (resolvedTeacherIds.length || teacherIds !== undefined) {
    await prisma.teacherClass.deleteMany({ where: { classId: targetClass.id } })

    if (resolvedTeacherIds.length) {
      await prisma.teacherClass.createMany({
        data: resolvedTeacherIds.map((teacherId) => ({ teacherId, classId: targetClass.id, isPrimary: true })),
        skipDuplicates: true
      })
    }
  }

  return NextResponse.json({ ok: true })
}
