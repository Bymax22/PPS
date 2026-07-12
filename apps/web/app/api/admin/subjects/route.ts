import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/adminAuth'
import { adminSubjectPayloadSchema, parseValidation } from '@/lib/validation'
import { logProductionEvent } from '@/lib/monitoring'

export async function GET() {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const subjects = await prisma.subject.findMany({ orderBy: { name: 'asc' } })
  const programs = await prisma.program.findMany({ where: { isDeleted: false }, orderBy: { name: 'asc' } })

  return NextResponse.json({ subjects, programs })
}

export async function POST(req: Request) {
  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const body = await req.json()
  const validation = parseValidation(adminSubjectPayloadSchema, body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { name, code, programId } = validation.data

  const existing = await prisma.subject.findUnique({ where: { name } })
  if (existing) {
    return NextResponse.json({ error: 'Subject already exists' }, { status: 409 })
  }

  const created = await prisma.subject.create({ data: { name, code: code || undefined } })

  if (programId) {
    const program = await prisma.program.findUnique({ where: { id: programId } })
    if (program) {
      await prisma.notification.create({
        data: {
          userId: context.admin.id,
          type: 'ANNOUNCEMENT',
          title: 'Curriculum updated',
          body: `Added ${created.name} to ${program.name}.`,
          link: '/admin/subjects'
        }
      })
    }
  }

  logProductionEvent('subject_created', { adminId: context.admin.id, subjectId: created.id }, 'info')
  return NextResponse.json({ subject: { id: created.id, name: created.name, code: created.code } }, { status: 201 })
}
