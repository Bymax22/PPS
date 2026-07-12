import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { adminParentPayloadSchema, parseValidation } from '@/lib/validation'
import { logProductionEvent } from '@/lib/monitoring'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
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

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminParentPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { firstName, lastName, email, phone, password } = validation.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const parent = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'PARENT'
    }
  })

  logProductionEvent('parent_created', { adminId: context.admin.id, parentId: parent.id }, 'info')
  return NextResponse.json({ id: parent.id, email: parent.email }, { status: 201 })
}
