import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const manualSubscriptionSchema = z.object({
  userId: z.string().cuid(),
  planId: z.string().cuid(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export async function GET(request: Request) {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  if (searchParams.get('view') === 'plans') {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isDeleted: false },
      include: { program: { select: { id: true, name: true, type: true } } },
      orderBy: [{ program: { name: 'asc' } }, { price: 'asc' }],
    })
    return NextResponse.json(plans)
  }

  const subscriptions = await prisma.subscription.findMany({
    where: user.role === 'ADMIN' ? {} : { userId: user.id },
    include: {
      plan: { include: { program: { select: { id: true, name: true, type: true } } } },
      payments: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(subscriptions)
}

export async function POST(request: Request) {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const actor = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })
  if (actor?.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Subscriptions can only be activated after confirmed payment. Checkout is not configured yet.' },
      { status: 503 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }

  const parsed = manualSubscriptionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid subscription details' }, { status: 400 })
  }

  const [user, plan] = await Promise.all([
    prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true } }),
    prisma.subscriptionPlan.findFirst({ where: { id: parsed.data.planId, isDeleted: false } }),
  ])
  if (!user || !plan) return NextResponse.json({ error: 'User or subscription plan not found' }, { status: 404 })

  const startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : new Date()
  const endDate = parsed.data.endDate
    ? new Date(parsed.data.endDate)
    : new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000)
  if (endDate <= startDate) return NextResponse.json({ error: 'Subscription end date must be after its start date' }, { status: 400 })

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: plan.id,
      status: 'ACTIVE',
      startDate,
      endDate,
    },
    include: { plan: { include: { program: true } } },
  })
  return NextResponse.json(subscription, { status: 201 })
}
