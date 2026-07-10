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
              },
            },
          },
        },
      },
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone ?? undefined,
      profileImage: undefined,
      children: parent.children.map((child) => ({
        id: child.id,
        userId: child.userId,
        grade: child.grade ?? 0,
        schoolYear: child.schoolYear ?? undefined,
        user: {
          firstName: child.user.firstName,
          lastName: child.user.lastName,
          email: child.user.email,
          phone: child.user.phone ?? undefined,
          profileImage: undefined,
        },
        progress: undefined,
        attendance: undefined,
        classes: [],
      })),
      notifications: [],
      messages: [],
      payments: [],
      paymentInstructions: {
        mobileMoneyProviders: [
          { name: 'MTN Mobile Money', code: 'MTN' },
          { name: 'Airtel Money', code: 'AIRTEL' },
        ],
        bankDetails: {
          accountName: 'PPS School Ltd',
          accountNumber: '1234567890',
          bankName: 'Zambia National Bank',
          swift: null,
        },
      },
      savedCards: [],
      totalOutstanding: 0,
      currency: 'ZMW',
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
