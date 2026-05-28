// app/api/parent/payments/route.ts
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
            user: true
          }
        }
      }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Get all payments for parent's children
    const childUserIds = parent.children.map(c => c.userId)
    const payments = await prisma.payment.findMany({
      where: {
        userId: { in: childUserIds }
      },
      include: {
        subscription: {
          include: {
            plan: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(payments)
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
    const { childId, amount, paymentMethod, subscriptionId } = body

    // Get student
    const student = await prisma.student.findUnique({
      where: { id: childId },
      include: { user: true }
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: student.userId,
        subscriptionId: subscriptionId || null,
        amount: parseFloat(amount),
        currency: 'ZMW',
        paymentMethod,
        status: 'PENDING',
        transactionRef: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}