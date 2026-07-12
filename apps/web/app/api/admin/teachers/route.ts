import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotificationsForUsers } from '@/lib/adminNotifications'

export async function GET() {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { firstName, lastName, email, phone, password, qualifications, specialties, hourlyRate, classIds } = body

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
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

  return NextResponse.json({ id: teacher.id, email: teacher.email }, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { teacherId, classIds } = body

  if (!teacherId) {
    return NextResponse.json({ error: 'Missing teacher id' }, { status: 400 })
  }

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

  return NextResponse.json({ ok: true })
}
