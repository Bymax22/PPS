import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export type VerifiedPaymentStatus = 'SUCCEEDED' | 'PROCESSING' | 'FAILED'

export async function settlePayment(input: {
  reference: string
  status: VerifiedPaymentStatus
  amount?: number
  currency?: string
}) {
  return prisma.$transaction(async transaction => {
    await transaction.$queryRaw(
      Prisma.sql`SELECT "id" FROM "Payment" WHERE "transactionRef" = ${input.reference} FOR UPDATE`
    )

    const payment = await transaction.payment.findUnique({
      where: { transactionRef: input.reference },
      include: { plan: true },
    })
    if (!payment) throw new Error('Payment reference was not found.')
    if (payment.status === 'SUCCEEDED') return payment
    if (payment.status === 'FAILED') {
      throw new Error('A failed payment cannot be reactivated by a later callback.')
    }

    if (input.currency && input.currency !== payment.currency) {
      throw new Error('Verified payment currency does not match the checkout currency.')
    }
    if (input.amount !== undefined && Math.abs(input.amount - payment.amount) > 0.01) {
      throw new Error('Verified payment amount does not match the checkout amount.')
    }

    if (input.status !== 'SUCCEEDED') {
      return transaction.payment.update({
        where: { id: payment.id },
        data: { status: input.status },
      })
    }

    if (!payment.plan || payment.currency !== 'ZMW') {
      throw new Error('The payment has no valid ZMW subscription plan attached.')
    }

    const now = new Date()
    const activeSubscription = await transaction.subscription.findFirst({
      where: { userId: payment.userId, planId: payment.plan.id, status: 'ACTIVE' },
      orderBy: { endDate: 'desc' },
    })
    const subscription = activeSubscription
      ? await transaction.subscription.update({
          where: { id: activeSubscription.id },
          data: {
            status: 'ACTIVE',
            endDate: new Date(Math.max(activeSubscription.endDate?.getTime() ?? 0, now.getTime()) + payment.plan.durationDays * 24 * 60 * 60 * 1000),
            targetType: payment.plan.targetType,
            targetId: payment.plan.targetId,
            targetMetadata: payment.plan.targetMetadata ?? Prisma.JsonNull,
            subjectId: payment.plan.subjectId,
            classId: payment.plan.classId,
            lessonId: payment.plan.lessonId,
          },
        })
      : await transaction.subscription.create({
          data: {
            userId: payment.userId,
            planId: payment.plan.id,
            status: 'ACTIVE',
            startDate: now,
            endDate: new Date(now.getTime() + payment.plan.durationDays * 24 * 60 * 60 * 1000),
            targetType: payment.plan.targetType,
            targetId: payment.plan.targetId,
            targetMetadata: payment.plan.targetMetadata ?? Prisma.JsonNull,
            subjectId: payment.plan.subjectId,
            classId: payment.plan.classId,
            lessonId: payment.plan.lessonId,
          },
        })

    return transaction.payment.update({
      where: { id: payment.id },
      data: { status: 'SUCCEEDED', subscriptionId: subscription.id, failureReason: null },
    })
  }, { isolationLevel: 'Serializable' })
}
