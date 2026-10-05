import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'

const programSchema = z.object({
  name: z.string().trim().min(2).max(100),
  type: z.enum(['ONLINE_FULL_TIME', 'HOME_TUITION', 'ON_CAMPUS', 'HOLIDAY_TUITION', 'RESOURCES_SHOP']),
})

export async function POST(request: Request) {
  const context = await requireAdmin()
  if ('error' in context) return context.error

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON' }, { status: 400 })
  }

  const parsed = programSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid program details' }, { status: 400 })
  }

  const slug = parsed.data.name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  try {
    const program = await prisma.program.create({
      data: { ...parsed.data, slug },
    })
    return NextResponse.json({ program }, { status: 201 })
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A program with this name already exists' }, { status: 409 })
    }
    console.error('Failed to create program', error)
    return NextResponse.json({ error: 'Unable to create program' }, { status: 500 })
  }
}
