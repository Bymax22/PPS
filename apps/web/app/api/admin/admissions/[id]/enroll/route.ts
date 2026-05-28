import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import getAuthOptions from '@/lib/auth'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prisma } = await import('@/lib/prisma')
  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admissionId = params.id
  const admission = await prisma.admissionForm.findUnique({ where: { id: admissionId } })
  if (!admission) return NextResponse.json({ error: 'Admission not found' }, { status: 404 })
  if (admission.status !== 'APPROVED') return NextResponse.json({ error: 'Admission must be approved before enrollment' }, { status: 400 })

  // Create user if not exists using applicant email
  let user = await prisma.user.findUnique({ where: { email: admission.applicantEmail } })
  if (!user) {
    user = await prisma.user.create({ data: {
      email: admission.applicantEmail,
      firstName: admission.studentName.split(' ')[0] || 'Student',
      lastName: admission.studentName.split(' ').slice(1).join(' ') || '',
      role: 'STUDENT',
      status: 'ACTIVE',
      password: null
    }})
  }

  // Determine class assignment: pick first class matching grade
  const targetClass = await prisma.class.findFirst({ where: { grade: Number(admission.applyingForGrade) } })
  if (!targetClass) return NextResponse.json({ error: 'No class found for the applied grade' }, { status: 400 })

  const enrollment = await prisma.enrollment.create({ data: { userId: user.id, classId: targetClass.id } })

  // Mark admission as ENROLLED
  await prisma.admissionForm.update({ where: { id: admissionId }, data: { status: 'ENROLLED' } })

  return NextResponse.json({ enrollment })
}
