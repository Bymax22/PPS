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
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { firstName, lastName, email, phone, password, grade, schoolYear, parentEmail, classIds } = body

  if (!firstName || !lastName || !email || !password || !grade) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
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

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
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
  const { studentId, classIds } = body

  if (!studentId) {
    return NextResponse.json({ error: 'Missing student id' }, { status: 400 })
  }

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

  return NextResponse.json({ ok: true })
}
