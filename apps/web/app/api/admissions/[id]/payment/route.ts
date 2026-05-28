import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'

function feeForGrade(grade: string) {
  // simple mapping; adjust as needed
  const mapping: Record<string, number> = {
    'Baby Class': 150,
    'Nursery': 150,
    'Reception': 150,
    'Grade 1': 200,
    'Grade 2': 200,
    'Grade 3': 200,
    'Grade 4': 250,
    'Grade 5': 250,
    'Grade 6': 300,
    'Grade 7': 300
  }
  return mapping[grade] || 200
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await req.json()
    const { paymentMethod, mobileProvider, mobileNumber, bankReference } = body
    const { prisma } = await import('@/lib/prisma')

    const admission = await prisma.admissionForm.findUnique({ where: { id } })
    if (!admission) return NextResponse.json({ error: 'Admission not found' }, { status: 404 })

    const amount = feeForGrade(admission.applyingForGrade ? String(admission.applyingForGrade) : admission.studentName)

    const payment = await prisma.payment.create({
      data: {
        userId: admission.id, // tie to admission id in userId field as placeholder
        amount: amount,
        currency: 'ZMW',
        paymentMethod: paymentMethod || 'BANK_TRANSFER',
        transactionRef: bankReference || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({ payment })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
