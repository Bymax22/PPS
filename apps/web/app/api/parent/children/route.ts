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
                phone: true,
                profileImage: true
              }
            }
          }
        }
      }
    })

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

    // Find parent
    const parent = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Create or find student user
    let student = await prisma.user.findUnique({
      where: { email }
    })

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

    // Create student profile
    const studentProfile = await prisma.student.create({
      data: {
        userId: student.id,
        grade: parseInt(grade),
        schoolYear,
        parentId: parent.id
      },
      include: {
        user: true
      }
    })

    return NextResponse.json(studentProfile)
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

    // Update student profile to remove parent link
    await prisma.student.update({
      where: { id: childId },
      data: { parentId: null }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}