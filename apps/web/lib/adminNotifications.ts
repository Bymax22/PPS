import { prisma } from '@/lib/prisma'

export async function createNotificationsForUsers(
  userIds: string[],
  payload: {
    title: string
    body: string
    type?: string
    link?: string
    metadata?: Record<string, unknown>
  }
) {
  if (!userIds.length) return []

  return prisma.notification.createMany({
    data: userIds.map((userId) => ({
      userId,
      title: payload.title,
      body: payload.body,
      type: (payload.type ?? 'ANNOUNCEMENT') as any,
      link: payload.link,
      metadata: payload.metadata ?? {}
    }))
  })
}
