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

  const payments = await prisma.payment.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      subscription: { select: { plan: true } }
    }
  })

  return NextResponse.json({
    payments: payments.map((payment) => ({
      id: payment.id,
      date: payment.createdAt.toISOString(),
      payer: `${payment.user.firstName} ${payment.user.lastName}`,
      email: payment.user.email,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      subscription: payment.subscription?.plan?.name ?? null
    }))
  })
}
