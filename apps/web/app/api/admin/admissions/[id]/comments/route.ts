import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { prisma } = await import('@/lib/prisma')

  const comments = await prisma.communication.findMany({
    where: { admissionId: id },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(comments)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { admin } = context

  const body = await request.json()
  const text = body.text || ''

  if (!text.trim()) {
    return NextResponse.json(
      { error: 'Empty comment' },
      { status: 400 }
    )
  }

  const { prisma } = await import('@/lib/prisma')

  const comment = await prisma.communication.create({
    data: {
      senderId: admin.id,
      receiverId: admin.id,
      body: text,
      subject: 'Admission update',
      type: 'DIRECT_MESSAGE'
    }
  })

  return NextResponse.json(comment)
}