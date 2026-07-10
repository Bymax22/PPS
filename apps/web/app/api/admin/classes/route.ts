import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
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

  const [programs, subjects, classes] = await prisma.$transaction([
    prisma.program.findMany({ orderBy: { name: 'asc' } }),
    prisma.subject.findMany({ orderBy: { name: 'asc' } }),
    prisma.class.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        program: { select: { id: true, name: true } },
        enrollments: { select: { id: true } },
        teachers: { include: { teacher: { select: { firstName: true, lastName: true } } } }
      }
    })
  ]).catch((error) => {
    console.error('Failed to load admin classes data', error)
    return [[], [], []] as const
  })

  return NextResponse.json({
    programs,
    subjects,
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
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { name, programId, grade, subject, capacity } = body

  if (!name || !programId || !capacity) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const program = await prisma.program.findUnique({ where: { id: programId } })
  if (!program) {
    return NextResponse.json({ error: 'Invalid program' }, { status: 400 })
  }

  const created = await prisma.class.create({
    data: {
      name,
      program: { connect: { id: program.id } },
      grade: grade ? Number(grade) : undefined,
      subject: subject || undefined,
      capacity: Number(capacity)
    }
  })

  return NextResponse.json({ class: { id: created.id, name: created.name } }, { status: 201 })
}
