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

  const data = await prisma.$transaction([
    prisma.program.findMany({ where: { isDeleted: false }, orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.class.findMany({
      where: { isDeleted: false },
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
    return null
  })

  if (!data) {
    return NextResponse.json({ error: 'Unable to load class management data' }, { status: 500 })
  }
  const [programs, subjects, classes, teachers] = data

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
        .filter((value): value is string => Boolean(value)),
      teacherIds: classItem.teachers.map((link) => link.teacherId)
    }))
  })
}

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { admin } = context

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }
  const validation = parseValidation(adminClassPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { name, programId, grade, subject, capacity, teacherIds } = validation.data

  const program = await prisma.program.findFirst({ where: { id: programId, isDeleted: false } })
  if (!program) {
    return NextResponse.json({ error: 'Invalid program' }, { status: 400 })
  }

  const resolvedTeacherIds = teacherIds ?? []
  const validTeachers = resolvedTeacherIds.length
    ? await prisma.user.findMany({
        where: { id: { in: resolvedTeacherIds }, role: 'TEACHER' },
        select: { id: true }
      })
    : []
  if (validTeachers.length !== resolvedTeacherIds.length) {
    return NextResponse.json({ error: 'One or more selected teachers are invalid' }, { status: 400 })
  }

  let created
  try {
    created = await prisma.class.create({
      data: {
        name,
        program: { connect: { id: program.id } },
        grade,
        subject: subject || undefined,
        capacity: capacity ?? 30,
        teachers: resolvedTeacherIds.length
          ? {
              create: resolvedTeacherIds.map((teacherId) => ({
                teacher: { connect: { id: teacherId } }
              }))
            }
          : undefined
      }
    })
  } catch (error) {
    console.error('Failed to create admin class', error)
    return NextResponse.json({ error: 'Unable to create class' }, { status: 500 })
  }

  if (resolvedTeacherIds.length) {
    try {
      await createNotificationsForUsers(resolvedTeacherIds, {
        title: 'New class assignment',
        body: `You have been assigned to class ${created.name}.`,
        type: 'ANNOUNCEMENT',
        link: '/teacher',
        metadata: { classId: created.id }
      })
    } catch (error) {
      console.error('Failed to notify teachers about new class assignment', error)
    }
  }

  logProductionEvent('class_created', { adminId: admin.id, classId: created.id }, 'info')
  return NextResponse.json({ class: { id: created.id, name: created.name } }, { status: 201 })
}

export async function PATCH(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }
  const validation = parseValidation(adminClassUpdatePayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { classId, teacherIds, grade, subject, capacity } = validation.data

  const targetClass = await prisma.class.findFirst({ where: { id: classId, isDeleted: false } })
  if (!targetClass) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  }

  const resolvedTeacherIds = teacherIds ?? []
  const validTeachers = resolvedTeacherIds.length
    ? await prisma.user.findMany({
        where: { id: { in: resolvedTeacherIds }, role: 'TEACHER' },
        select: { id: true }
      })
    : []
  if (validTeachers.length !== resolvedTeacherIds.length) {
    return NextResponse.json({ error: 'One or more selected teachers are invalid' }, { status: 400 })
  }

  try {
    const updated = await prisma.$transaction(async (transaction) => {
      const result = await transaction.class.update({
        where: { id: targetClass.id },
        data: {
          ...(grade !== undefined ? { grade } : {}),
          ...(subject !== undefined ? { subject: subject || null } : {}),
          ...(capacity !== undefined ? { capacity } : {})
        }
      })

      if (teacherIds !== undefined) {
        await transaction.teacherClass.deleteMany({ where: { classId: targetClass.id } })
        if (resolvedTeacherIds.length) {
          await transaction.teacherClass.createMany({
            data: resolvedTeacherIds.map((teacherId) => ({ teacherId, classId: targetClass.id, isPrimary: true })),
            skipDuplicates: true
          })
        }
      }

      return result
    })

    if (teacherIds !== undefined && resolvedTeacherIds.length) {
      try {
        await createNotificationsForUsers(resolvedTeacherIds, {
          title: 'Class assignment updated',
          body: `You have been assigned to class ${updated.name}.`,
          type: 'ANNOUNCEMENT',
          link: '/teacher',
          metadata: { classId: updated.id }
        })
      } catch (error) {
        console.error('Failed to notify teachers about class assignment update', error)
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to update admin class', error)
    return NextResponse.json({ error: 'Unable to update class' }, { status: 500 })
  }
}
