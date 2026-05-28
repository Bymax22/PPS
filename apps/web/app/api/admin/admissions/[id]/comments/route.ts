import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import getAuthOptions from '@/lib/auth'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user?.email) return NextResponse.json([], { status: 200 })

  const { prisma } = await import('@/lib/prisma')
  const comments = await prisma.communication.findMany({ where: { admissionId: params.id }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(comments)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const text = body.text || ''
  if (!text.trim()) return NextResponse.json({ error: 'Empty comment' }, { status: 400 })

  const { prisma } = await import('@/lib/prisma')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  const comment = await prisma.communication.create({ data: { fromId: user!.id, toId: user!.id, message: text, admissionId: params.id, type: 'admin_comment' } })
  return NextResponse.json(comment)
}
