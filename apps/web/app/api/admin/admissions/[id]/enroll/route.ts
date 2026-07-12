import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { logAuditAction } from '@/lib/audit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: admissionId } = await params

  const context = await requireAdmin()
  if ('error' in context) {
    return context.error
  }

  const { prisma } = await import('@/lib/prisma')

  const admission = await prisma.admissionForm.findUnique({
    where: { id: admissionId }
  })

  if (!admission) {
    return NextResponse.json(
      { error: 'Admission not found' },
      { status: 404 }
    )
  }

  if (admission.status !== 'APPROVED') {
    return NextResponse.json(
      {
        error: 'Admission must be approved before enrollment'
      },
      { status: 400 }
    )
  }

  let user = await prisma.user.findUnique({
    where: { email: admission.parentEmail || '' }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: admission.parentEmail || `${admission.studentName.replace(/\s+/g, '.').toLowerCase()}@pps.local`,
        firstName: admission.studentName.split(' ')[0] || 'Student',
        lastName: admission.studentName.split(' ').slice(1).join(' ') || '',
        role: 'STUDENT',
        status: 'ACTIVE',
        password: null
      }
    })
  }

  const targetClass = await prisma.class.findFirst({
    where: {
      grade: Number(admission.applyingForGrade)
    }
  })

  if (!targetClass) {
    return NextResponse.json(
      {
        error: 'No class found for the applied grade'
      },
      { status: 400 }
    )
  }

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: user.id,
      classId: targetClass.id
    }
  })

  await prisma.admissionForm.update({
    where: { id: admissionId },
    data: { status: 'ENROLLED' }
  })

  await logAuditAction({
    userId: context.admin.id,
    action: 'ADMISSION_ENROLLMENT_CREATED',
    entity: 'Enrollment',
    entityId: enrollment.id,
    newValue: { admissionId, classId: targetClass.id, studentId: user.id }
  })

  return NextResponse.json({ enrollment })
}