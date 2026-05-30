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

  const parents = await prisma.user.findMany({
    take: 50,
    where: { role: 'PARENT' },
    orderBy: { updatedAt: 'desc' },
    include: {
      children: { include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } },
      subscriptions: { take: 1, orderBy: { createdAt: 'desc' }, include: { plan: true } }
    }
  })

  return NextResponse.json({
    parents: parents.map((parent) => ({
      id: parent.id,
      name: `${parent.firstName} ${parent.lastName}`,
      email: parent.email,
      phone: parent.phone,
      childrenCount: parent.children.length,
      lastUpdated: parent.updatedAt.toISOString(),
      subscription: parent.subscriptions?.[0]?.isActive ? parent.subscriptions[0].plan.name : 'Inactive'
    }))
  })
}
