import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const [students, parents] = await prisma.$transaction([
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
    })
  ])

  return NextResponse.json({
    parents,
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
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { firstName, lastName, email, phone, password, grade, schoolYear, parentEmail } = body

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

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
}
