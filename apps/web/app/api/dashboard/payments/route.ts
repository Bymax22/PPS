import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import getAuthOptions from '@/lib/auth'

export async function GET(request: Request) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const payments = await prisma.payment.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 20 })
  return NextResponse.json({ payments })
}
