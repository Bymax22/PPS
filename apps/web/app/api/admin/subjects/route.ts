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

  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })

  return NextResponse.json({ subjects })
}

export async function POST(req: Request) {
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { name } = body

  if (!name) {
    return NextResponse.json({ error: 'Subject name is required' }, { status: 400 })
  }

  const existing = await prisma.subject.findUnique({ where: { name } })
  if (existing) {
    return NextResponse.json({ error: 'Subject already exists' }, { status: 409 })
  }

  const created = await prisma.subject.create({ data: { name } })
  return NextResponse.json({ subject: { id: created.id, name: created.name } }, { status: 201 })
}
