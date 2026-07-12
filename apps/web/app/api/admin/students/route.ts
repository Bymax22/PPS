import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createNotificationsForUsers } from '@/lib/adminNotifications'
import { requireAdmin } from '@/lib/adminAuth'
import { adminStudentPayloadSchema, adminStudentUpdatePayloadSchema, parseValidation } from '@/lib/validation'
import { captureError, logProductionEvent } from '@/lib/monitoring'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const [students, parents, classes] = await prisma.$transaction([
    prisma.student.findMany({
      take: 50,
      orderBy: { updatedAt: 'desc' },
      include: {
        user: true,
        parent: { select: { id: true, firstName: true, lastName: true, email: true } }
      }
    }),
    prisma.user.findMany({
      where: { role: 'PARENT' },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true, email: true }
    }),
    prisma.class.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
  ])

  return NextResponse.json({
    parents,
    classes,
    students: students.map((student) => ({
      id: student.id,
      firstName: student.user.firstName,
      lastName: student.user.lastName,
      email: student.user.email,
      phone: student.user.phone,
      grade: student.grade,
      schoolYear: student.schoolYear,
      parentName: student.parent ? `${student.parent.firstName} ${student.parent.lastName}` : null,
      lastUpdated: student.updatedAt.toISOString()
    }))
  })
}

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminStudentPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { firstName, lastName, email, phone, password, grade, schoolYear, parentEmail, classIds } = validation.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    logProductionEvent('student_create_conflict', { email }, 'warn')
    return NextResponse.json({ error: 'User already exists' }, { status: 409 })
  }

  const parent = parentEmail
    ? await prisma.user.findUnique({ where: { email: parentEmail, role: 'PARENT' } as any })
    : null

  const resolvedClassIds = Array.isArray(classIds)
    ? classIds.filter((value: unknown): value is string => typeof value === 'string' && Boolean(value))
    : []

  const existingClasses = resolvedClassIds.length
    ? await prisma.class.findMany({
        where: { id: { in: resolvedClassIds }, isDeleted: false },
        select: { id: true }
      })
    : []
  const validClassIds = existingClasses.map((classItem) => classItem.id)

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'STUDENT',
      studentProfile: {
        create: {
          grade: Number(grade),
          schoolYear: schoolYear || undefined,
          parent: parent ? { connect: { id: parent.id } } : undefined
        }
      }
    }
  })

  if (validClassIds.length) {
    await prisma.enrollment.createMany({
      data: validClassIds.map((classId) => ({ userId: user.id, classId, status: 'ACTIVE' })),
      skipDuplicates: true
    })
  }

  await createNotificationsForUsers([user.id, ...(parent ? [parent.id] : [])], {
    title: 'Student account created',
    body: `A new student account has been created for ${firstName} ${lastName}.`,
    type: 'ANNOUNCEMENT',
    link: '/student',
    metadata: { studentId: user.id }
  })

  logProductionEvent('student_created', { adminId: context.admin.id, studentId: user.id }, 'info')

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}

export async function PATCH(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminStudentUpdatePayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { studentId, classIds } = validation.data

  const existingStudent = await prisma.student.findUnique({ where: { userId: studentId } })
  if (!existingStudent) {
    return NextResponse.json({ error: 'Student not found' }, { status: 400 })
  }

  const resolvedClassIds = Array.isArray(classIds)
    ? classIds.filter((value: unknown): value is string => typeof value === 'string' && Boolean(value))
    : []

  await prisma.enrollment.deleteMany({ where: { userId: studentId } })

  if (resolvedClassIds.length) {
    const validClasses = await prisma.class.findMany({
      where: { id: { in: resolvedClassIds }, isDeleted: false },
      select: { id: true }
    })

    if (validClasses.length) {
      await prisma.enrollment.createMany({
        data: validClasses.map((classItem) => ({ userId: studentId, classId: classItem.id, status: 'ACTIVE' })),
        skipDuplicates: true
      })
    }
  }

  logProductionEvent('student_class_update', { adminId: context.admin.id, studentId }, 'info')

  return NextResponse.json({ ok: true })
}
