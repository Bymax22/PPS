// app/api/parent/children/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parent = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        children: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    })

    if (parent?.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent account required' }, { status: 403 })
    }

    return NextResponse.json(parent?.children || [])
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, email, phone, grade, schoolYear } = body
    const normalizedGrade = Number(grade)
    if (
      typeof firstName !== 'string' || !firstName.trim() ||
      typeof lastName !== 'string' || !lastName.trim() ||
      typeof email !== 'string' || !email.includes('@') ||
      !Number.isInteger(normalizedGrade) || normalizedGrade < 0
    ) {
      return NextResponse.json({ error: 'Valid child name, email, and grade are required' }, { status: 400 })
    }

    // Find parent
    const parent = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!parent || parent.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Create or find student user
    let student = await prisma.user.findUnique({
      where: { email }
    })

    if (student && student.role !== 'STUDENT') {
      return NextResponse.json({ error: 'That email belongs to a non-student account' }, { status: 409 })
    }

    if (!student) {
      student = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      })
    }

    const existingProfile = await prisma.student.findUnique({ where: { userId: student.id } })
    if (existingProfile) {
      return NextResponse.json({ error: 'This student is already linked to a parent account' }, { status: 409 })
    }

    const studentProfile = await prisma.student.create({
      data: { userId: student.id, grade: normalizedGrade, schoolYear, parentId: parent.id },
      include: { user: true },
    })

    return NextResponse.json(studentProfile, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')

    if (!childId) {
      return NextResponse.json({ error: 'Child ID required' }, { status: 400 })
    }

    const parent = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!parent || parent.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent account required' }, { status: 403 })
    }

    const child = await prisma.student.findFirst({ where: { id: childId, parentId: parent.id } })
    if (!child) {
      return NextResponse.json({ error: 'Child not found for this parent' }, { status: 404 })
    }

    await prisma.student.update({
      where: { id: child.id },
      data: { parentId: null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}