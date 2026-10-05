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

  if (admission.status === 'ENROLLED' && admission.enrolledStudentId) {
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: admission.enrolledStudentId },
    })
    if (enrollment) return NextResponse.json({ enrollment, alreadyEnrolled: true })
  }

  if (admission.status !== 'APPROVED') {
    return NextResponse.json(
      {
        error: 'Admission must be approved before enrollment'
      },
      { status: 400 }
    )
  }

  const parent = await prisma.user.findUnique({
    where: { email: admission.parentEmail },
    select: { id: true, role: true },
  })
  if (parent && parent.role !== 'PARENT') {
    return NextResponse.json({ error: 'The applicant guardian email belongs to a non-parent account' }, { status: 409 })
  }

  let studentEmail: string | null = null
  try {
    const documents: unknown = JSON.parse(admission.documentsMediaIds ?? '{}')
    if (
      typeof documents === 'object' &&
      documents !== null &&
      'studentEmail' in documents &&
      typeof documents.studentEmail === 'string' &&
      documents.studentEmail
    ) {
      studentEmail = documents.studentEmail
    }
  } catch {
    studentEmail = null
  }
  if (!studentEmail) studentEmail = `admission-${admission.id}@students.pps.invalid`
  if (studentEmail.toLowerCase() === admission.parentEmail.toLowerCase()) {
    return NextResponse.json({ error: 'The student email must be different from the guardian email' }, { status: 400 })
  }

  const existingStudent = await prisma.user.findUnique({
    where: { email: studentEmail },
    include: { studentProfile: true },
  })
  if (existingStudent && existingStudent.role !== 'STUDENT') {
    return NextResponse.json({ error: 'The student email belongs to a non-student account' }, { status: 409 })
  }
  if (existingStudent?.studentProfile?.parentId && parent && existingStudent.studentProfile.parentId !== parent.id) {
    return NextResponse.json({ error: 'The student account is already linked to another parent' }, { status: 409 })
  }

  const targetClass = await prisma.class.findFirst({
    where: {
      grade: admission.applyingForGrade,
      isDeleted: false,
    },
    orderBy: { createdAt: 'asc' },
  })

  if (!targetClass) {
    return NextResponse.json(
      {
        error: 'No class found for the applied grade'
      },
      { status: 400 }
    )
  }

  const outcome = await prisma.$transaction(async (tx) => {
    const student = existingStudent
      ? await tx.user.update({
          where: { id: existingStudent.id },
          data: {
            dateOfBirth: existingStudent.dateOfBirth ?? admission.dateOfBirth,
            studentProfile: existingStudent.studentProfile
              ? undefined
              : {
                  create: {
                    grade: admission.applyingForGrade,
                    parent: parent ? { connect: { id: parent.id } } : undefined,
                  },
                },
          },
        })
      : await tx.user.create({
          data: {
            email: studentEmail!,
            firstName: admission.studentName.split(' ')[0] || 'Student',
            lastName: admission.studentName.split(' ').slice(1).join(' ') || '',
            dateOfBirth: admission.dateOfBirth,
            role: 'STUDENT',
            status: 'ACTIVE',
            password: null,
            studentProfile: {
              create: {
                grade: admission.applyingForGrade,
                parent: parent ? { connect: { id: parent.id } } : undefined,
              },
            },
          },
        })

    if (existingStudent?.studentProfile && parent && !existingStudent.studentProfile.parentId) {
      await tx.student.update({
        where: { userId: student.id },
        data: { parentId: parent.id, grade: admission.applyingForGrade },
      })
    }

    const existingEnrollment = await tx.enrollment.findUnique({
      where: { userId_classId: { userId: student.id, classId: targetClass.id } },
    })
    const enrollment = existingEnrollment ?? await tx.enrollment.create({
      data: { userId: student.id, classId: targetClass.id },
    })

    await tx.admissionForm.update({
      where: { id: admissionId },
      data: { status: 'ENROLLED', enrolledStudentId: student.id },
    })

    return { enrollment, studentId: student.id }
  })

  await logAuditAction({
    userId: context.admin.id,
    action: 'ADMISSION_ENROLLMENT_CREATED',
    entity: 'Enrollment',
    entityId: outcome.enrollment.id,
    newValue: { admissionId, classId: targetClass.id, studentId: outcome.studentId }
  })

  return NextResponse.json({ enrollment: outcome.enrollment })
}