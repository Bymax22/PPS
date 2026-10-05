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

  const comments = await prisma.contentRevision.findMany({
    where: { entity: 'AdmissionForm', entityId: id },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(comments.map((comment) => ({
    id: comment.id,
    text: typeof comment.data === 'object' && comment.data !== null && 'text' in comment.data
      ? comment.data.text
      : comment.note,
    authorId: comment.authorId,
    createdAt: comment.createdAt,
  })))
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

  const comment = await prisma.contentRevision.create({
    data: {
      entity: 'AdmissionForm',
      entityId: id,
      data: { text },
      authorId: admin.id,
      note: 'Admission comment',
    }
  })

  return NextResponse.json({
    id: comment.id,
    text,
    authorId: comment.authorId,
    createdAt: comment.createdAt,
  }, { status: 201 })
}