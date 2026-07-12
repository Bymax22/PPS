import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const [payments, summary, outstanding, subscriptions] = await Promise.all([
    prisma.payment.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        subscription: { select: { plan: true } }
      }
    }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.payment.findMany({ where: { status: { notIn: ['SUCCEEDED', 'REFUNDED'] } }, select: { amount: true } }),
    prisma.subscription.findMany({ where: { status: 'ACTIVE' }, include: { plan: true }, take: 20 })
  ])

  const outstandingBalance = outstanding.reduce((sum, item) => sum + Number(item.amount ?? 0), 0)

  return NextResponse.json({
    payments: payments.map((payment) => ({
      id: payment.id,
      date: payment.createdAt.toISOString(),
      payer: `${payment.user.firstName} ${payment.user.lastName}`,
      email: payment.user.email,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      subscription: payment.subscription?.plan?.name ?? null,
      invoiceNumber: payment.invoiceNumber ?? payment.id.slice(0, 8).toUpperCase(),
      receiptUrl: `/api/receipts/${payment.id}`
    })),
    summary: {
      totalRevenue: Number(summary._sum.amount ?? 0),
      outstandingBalance,
      activeSubscriptions: subscriptions.length
    },
    subscriptions: subscriptions.map((subscription) => ({
      id: subscription.id,
      plan: subscription.plan?.name ?? null,
      status: subscription.status,
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.endDate?.toISOString() ?? null
    }))
  })
}
