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

    if (!parent || parent.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent account required' }, { status: 403 })
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
    console.error('Failed to load parent payments', error)
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
    const { childId, amount, paymentMethod, subscriptionId, mobileProvider, mobileNumber, bankReference, card, cardId } = body
    const numericAmount = Number(amount)
    if (typeof childId !== 'string' || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'A valid child and positive payment amount are required' }, { status: 400 })
    }

    const parent = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    })
    if (!parent || parent.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent account required' }, { status: 403 })
    }

    const student = await prisma.student.findFirst({
      where: { id: childId, parentId: parent.id },
      select: { userId: true },
    })
    if (!student) {
      return NextResponse.json({ error: 'Child not found for this parent' }, { status: 404 })
    }

    if (subscriptionId) {
      const subscription = await prisma.subscription.findFirst({
        where: { id: subscriptionId, userId: student.userId },
        select: { id: true },
      })
      if (!subscription) {
        return NextResponse.json({ error: 'Subscription not found for this child' }, { status: 404 })
      }
    }

    // Create payment record
    // Map incoming method to Prisma enum values
    let prismaMethod: any = 'BANK_TRANSFER'
    if (paymentMethod === 'card' || paymentMethod === 'saved_card' || paymentMethod === 'new_card') prismaMethod = 'STRIPE'
    if (paymentMethod === 'bank_transfer') prismaMethod = 'BANK_TRANSFER'
    if (paymentMethod === 'mobile_money') {
      if (mobileProvider === 'MTN') prismaMethod = 'MTN_MONEY'
      else if (mobileProvider === 'AIRTEL') prismaMethod = 'AIRTEL_MONEY'
      else prismaMethod = 'MTN_MONEY'
    }

    const transactionRef = paymentMethod === 'bank_transfer' && bankReference
      ? bankReference
      : `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const payment = await prisma.payment.create({
      data: {
        userId: student.userId,
        subscriptionId: subscriptionId || null,
        amount: numericAmount,
        currency: 'ZMW',
        paymentMethod: prismaMethod,
        status: 'PENDING',
        transactionRef
      }
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Failed to create parent payment', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}