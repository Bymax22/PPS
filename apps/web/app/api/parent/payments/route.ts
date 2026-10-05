import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  MobileMoneyNetwork,
  PaymentGateway,
  PaymentGatewayError,
  normalizeZambianPhone,
  requestBroadPayCheckout,
  requestDpoCheckout,
} from '@/lib/paymentGateways'

const checkoutSchema = z.object({
  childId: z.string().cuid(),
  planId: z.string().cuid(),
  gateway: z.enum(['BROADPAY', 'DPO']),
  mobileProvider: z.enum(['MTN', 'AIRTEL']),
  mobileNumber: z.string().min(1).max(40),
})

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parent = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        role: true,
        children: {
          select: { id: true, userId: true, user: { select: { firstName: true, lastName: true } } },
        },
      },
    })
    if (!parent || parent.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent account required' }, { status: 403 })
    }

    const childByUserId = new Map<string, { id: string; name: string }>(parent.children.map(child => [
      child.userId,
      {
        id: child.id,
        name: [child.user.firstName, child.user.lastName].filter(Boolean).join(' '),
      },
    ] as const))
    const payments = await prisma.payment.findMany({
      where: { userId: { in: parent.children.map(child => child.userId) } },
      include: { plan: { select: { name: true } }, subscription: { select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(payments.map(payment => ({
      id: payment.id,
      childId: childByUserId.get(payment.userId)?.id,
      childName: childByUserId.get(payment.userId)?.name ?? 'Student',
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      date: payment.createdAt,
      description: payment.plan?.name ?? 'Subscription payment',
      method: payment.paymentMethod,
      subscriptionId: payment.subscriptionId,
    })))
  } catch (error) {
    console.error('Failed to load parent payments', error)
    return NextResponse.json({ error: 'Unable to load payment history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
    }

    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid payment details' },
        { status: 400 }
      )
    }

    const phone = normalizeZambianPhone(parsed.data.mobileNumber)
    if (!phone) {
      return NextResponse.json({ error: 'Enter a valid Zambian mobile number, such as 0971234567.' }, { status: 400 })
    }

    const parent = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, firstName: true, lastName: true, email: true },
    })
    if (!parent || parent.role !== 'PARENT') {
      return NextResponse.json({ error: 'Parent account required' }, { status: 403 })
    }

    const [student, plan] = await Promise.all([
      prisma.student.findFirst({
        where: { id: parsed.data.childId, parentId: parent.id, isDeleted: false },
        select: { userId: true },
      }),
      prisma.subscriptionPlan.findFirst({
        where: { id: parsed.data.planId, isDeleted: false },
        select: { id: true, name: true, price: true, currency: true, durationDays: true },
      }),
    ])
    if (!student) {
      return NextResponse.json({ error: 'Child not found for this parent' }, { status: 404 })
    }
    if (!plan) {
      return NextResponse.json({ error: 'Subscription plan not found' }, { status: 404 })
    }
    if (plan.currency !== 'ZMW' || !Number.isFinite(plan.price) || plan.price <= 0) {
      return NextResponse.json(
        { error: 'This plan is not configured with a valid ZMW price. Please contact the school.' },
        { status: 409 }
      )
    }
    if (!Number.isInteger(plan.durationDays) || plan.durationDays <= 0) {
      return NextResponse.json({ error: 'This plan has an invalid duration and cannot be purchased.' }, { status: 409 })
    }

    const now = new Date()
    const [activeSubscription, pendingPayment] = await Promise.all([
      prisma.subscription.findFirst({
        where: { userId: student.userId, planId: plan.id, status: 'ACTIVE', endDate: { gt: now } },
        select: { id: true },
      }),
      prisma.payment.findFirst({
        where: {
          userId: student.userId,
          planId: plan.id,
          status: { in: ['PENDING', 'PROCESSING'] },
        },
        select: { id: true },
      }),
    ])
    if (activeSubscription) {
      return NextResponse.json({ error: 'This child already has an active subscription for the selected plan.' }, { status: 409 })
    }
    if (pendingPayment) {
      return NextResponse.json({ error: 'A payment for this plan is already awaiting confirmation.' }, { status: 409 })
    }

    const gateway: PaymentGateway = parsed.data.gateway
    const network: MobileMoneyNetwork = parsed.data.mobileProvider
    const reference = `PPS-${randomUUID()}`
    const payment = await prisma.payment.create({
      data: {
        userId: student.userId,
        planId: plan.id,
        amount: plan.price,
        currency: 'ZMW',
        paymentMethod: gateway,
        status: 'PENDING',
        transactionRef: reference,
        gatewayResponse: { gateway, mobileProvider: network },
      },
    })

    try {
      const checkout = gateway === 'BROADPAY'
        ? {
          checkoutUrl: await requestBroadPayCheckout({
            amount: payment.amount,
            currency: payment.currency,
            reference,
            firstName: parent.firstName,
            lastName: parent.lastName,
            email: parent.email,
            phone,
          }),
          transactionToken: null,
        }
        : await requestDpoCheckout({
          amount: payment.amount,
          currency: payment.currency,
          reference,
          firstName: parent.firstName,
          lastName: parent.lastName,
          email: parent.email,
          phone,
          network,
        })

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          gatewayResponse: {
            gateway,
            mobileProvider: network,
            ...(checkout.transactionToken ? { transactionToken: checkout.transactionToken } : {}),
          },
        },
      })
      await prisma.payment.updateMany({
        where: { id: payment.id, status: 'PENDING' },
        data: { status: 'PROCESSING' },
      })
      const updatedPayment = await prisma.payment.findUniqueOrThrow({ where: { id: payment.id } })
      return NextResponse.json({
        payment: {
          id: updatedPayment.id,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          status: updatedPayment.status,
          paymentMethod: updatedPayment.paymentMethod,
        },
        checkoutUrl: checkout.checkoutUrl,
      }, { status: 201 })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment checkout could not be started.'
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: error instanceof PaymentGatewayError ? 'FAILED' : 'PROCESSING',
          failureReason: message.slice(0, 500),
        },
      })
      if (error instanceof PaymentGatewayError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode })
      }
      console.error('Payment checkout initialization failed', error)
      return NextResponse.json({ error: 'Payment checkout could not be started. Please try again.' }, { status: 502 })
    }
  } catch (error) {
    console.error('Failed to create parent payment', error)
    return NextResponse.json({ error: 'Payment checkout could not be started.' }, { status: 500 })
  }
}
