import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import getAuthOptions from '@/lib/auth'

export async function GET(request: Request) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
