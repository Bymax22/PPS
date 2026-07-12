import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(request: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { prisma } = await import('@/lib/prisma')

  const url = new URL(request.url)
  const status = url.searchParams.get('status') || undefined
  const page = Number(url.searchParams.get('page') || '1')
  const take = Number(url.searchParams.get('take') || '20')
  const skip = (Math.max(1, page) - 1) * take

  const where: any = {}
  if (status) where.status = status

  const [items, total] = await Promise.all([
    prisma.admissionForm.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
    prisma.admissionForm.count({ where })
  ])

  return NextResponse.json({ items, total, page, take })
}
