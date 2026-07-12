import { prisma } from '@/lib/prisma'

export async function logAuditAction(options: {
  userId?: string | null
  action: string
  entity: string
  entityId?: string | null
  oldValue?: Record<string, unknown> | null
  newValue?: Record<string, unknown> | null
  ipAddress?: string
  userAgent?: string
}) {
  if (!options.userId && !options.entity) return null

  return prisma.auditLog.create({
    data: {
      userId: options.userId ?? null,
      action: options.action,
      entity: options.entity,
      entityId: options.entityId ?? null,
      oldValue: options.oldValue ?? undefined,
      newValue: options.newValue ?? undefined,
      ipAddress: options.ipAddress ?? null,
      userAgent: options.userAgent ?? null
    }
  })
}
