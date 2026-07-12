import { prisma } from '@/lib/prisma'

export async function sendNotificationHooks(payload: {
  userId: string
  type: string
  title: string
  body: string
  link?: string
  metadata?: Record<string, unknown>
}) {
  await prisma.notification.create({
    data: {
      userId: payload.userId,
      type: payload.type as any,
      title: payload.title,
      body: payload.body,
      link: payload.link,
      metadata: payload.metadata ?? {},
      read: false,
      sentToPush: true
    }
  })
}
