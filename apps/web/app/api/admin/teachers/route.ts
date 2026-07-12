import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createNotificationsForUsers } from '@/lib/adminNotifications'
import { requireAdmin } from '@/lib/adminAuth'
import { adminTeacherPayloadSchema, adminTeacherUpdatePayloadSchema, parseValidation } from '@/lib/validation'
import { logProductionEvent } from '@/lib/monitoring'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const [teachers, classes] = await prisma.$transaction([
    prisma.user.findMany({
      take: 50,
      where: { role: 'TEACHER' },
      orderBy: { updatedAt: 'desc' },
      include: {
        teacherProfile: true,
        teachingClasses: { include: { class: { select: { name: true } } } }
      }
    }),
    prisma.class.findMany({
      where: { isDeleted: false },
      orderBy: { name: 'asc' },
      select: { id: true, name: true }
    })
  ])

  return NextResponse.json({
    classes,
    teachers: teachers.map((teacher) => ({
      id: teacher.id,
      name: `${teacher.firstName} ${teacher.lastName}`,
      email: teacher.email,
      phone: teacher.phone,
      subject: teacher.teacherProfile?.specialties?.split(',')[0].trim() ?? null,
      classes: teacher.teachingClasses.map((item) => item.class.name).join(', '),
      lastUpdated: teacher.updatedAt.toISOString()
    }))
  })
}

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminTeacherPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { firstName, lastName, email, phone, password, qualifications, specialties, hourlyRate, classIds } = validation.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    logProductionEvent('teacher_create_conflict', { email }, 'warn')
    return NextResponse.json({ error: 'User already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const teacher = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          qualifications: qualifications || undefined,
          specialties: specialties || undefined,
          hourlyRate: hourlyRate ? Number(hourlyRate) : undefined
        }
      }
    }
  })

  const resolvedClassIds = Array.isArray(classIds)
    ? classIds.filter((value: unknown): value is string => typeof value === 'string' && Boolean(value))
    : []

  if (resolvedClassIds.length) {
    const existingClasses = await prisma.class.findMany({
      where: { id: { in: resolvedClassIds }, isDeleted: false },
      select: { id: true }
    })

    for (const classItem of existingClasses) {
      await prisma.teacherClass.create({
        data: {
          teacherId: teacher.id,
          classId: classItem.id,
          isPrimary: true
        }
      }).catch(() => undefined)
    }
  }

  await createNotificationsForUsers([teacher.id], {
    title: 'Teacher account created',
    body: `Teacher account created for ${firstName} ${lastName}.`,
    type: 'ANNOUNCEMENT',
    link: '/teacher',
    metadata: { teacherId: teacher.id }
  })

  logProductionEvent('teacher_created', { adminId: context.admin.id, teacherId: teacher.id }, 'info')

  return NextResponse.json({ id: teacher.id, email: teacher.email }, { status: 201 })
}

export async function PATCH(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminTeacherUpdatePayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { teacherId, classIds } = validation.data

  const existingTeacher = await prisma.user.findFirst({ where: { id: teacherId, role: 'TEACHER' } })
  if (!existingTeacher) {
    return NextResponse.json({ error: 'Teacher not found' }, { status: 400 })
  }

  const resolvedClassIds = Array.isArray(classIds)
    ? classIds.filter((value: unknown): value is string => typeof value === 'string' && Boolean(value))
    : []

  await prisma.teacherClass.deleteMany({ where: { teacherId } })

  if (resolvedClassIds.length) {
    const validClasses = await prisma.class.findMany({
      where: { id: { in: resolvedClassIds }, isDeleted: false },
      select: { id: true }
    })

    if (validClasses.length) {
      await prisma.teacherClass.createMany({
        data: validClasses.map((classItem) => ({ teacherId, classId: classItem.id, isPrimary: true })),
        skipDuplicates: true
      })
    }
  }

  logProductionEvent('teacher_class_update', { adminId: context.admin.id, teacherId }, 'info')

  return NextResponse.json({ ok: true })
}
