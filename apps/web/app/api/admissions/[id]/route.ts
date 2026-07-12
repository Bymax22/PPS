import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { logAuditAction } from '@/lib/audit'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
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
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await req.json()
    const { prisma } = await import('@/lib/prisma')

    const existing = await prisma.admissionForm.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Admission not found' }, { status: 404 })

    const update = await prisma.admissionForm.update({ where: { id }, data: body })

    if (body.status) {
      await logAuditAction({
        userId: session.user.id,
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
