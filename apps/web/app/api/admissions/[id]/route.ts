import { NextRequest, NextResponse } from 'next/server'
import { logAuditAction } from '@/lib/audit'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireAdmin()
    if ('error' in context) return context.error

    const { id } = await params
    const { prisma } = await import('@/lib/prisma')
    const admission = await prisma.admissionForm.findUnique({ where: { id } })
    if (!admission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(admission)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const context = await requireAdmin()
    if ('error' in context) return context.error

    const { id } = await params
    const body = await req.json()
    const { prisma } = await import('@/lib/prisma')

    const existing = await prisma.admissionForm.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Admission not found' }, { status: 404 })

    const update = await prisma.admissionForm.update({ where: { id }, data: body })

    if (body.status) {
      await logAuditAction({
        userId: context.admin.id,
        action: 'ADMISSION_STATUS_CHANGED',
        entity: 'AdmissionForm',
        entityId: id,
        oldValue: { status: existing.status },
        newValue: { status: body.status }
      })
    }

    return NextResponse.json(update)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
