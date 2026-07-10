import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createVerificationToken, sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, firstName, lastName, phone, grade, schoolYear, role } = body
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (role === 'STUDENT' && !grade) {
      return NextResponse.json({ error: 'Grade is required for student registration' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })

    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } })
      if (existingPhone) return NextResponse.json({ error: 'Phone number is already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        phone,
        role: role || 'STUDENT',
        studentProfile:
          role === 'STUDENT'
            ? {
                create: {
                  grade: parseInt(grade, 10),
                  schoolYear: schoolYear || undefined,
                },
              }
            : undefined,
      },
    })

    const verificationToken = createVerificationToken(user.id)

    let verificationSent = false
    try {
      await sendVerificationEmail(email, `${firstName} ${lastName}`, verificationToken)
      verificationSent = true
    } catch (error: any) {
      console.error('Verification email failed', error)
      const message = error?.message || ''
      if (message.includes('unauthorized') || message.includes('unrecognised IP') || message.includes('authorised IP')) {
        return NextResponse.json({
          error: 'Verification email could not be sent because Brevo rejected the request. Please authorize this server IP in your Brevo account and try again.',
        }, { status: 500 })
      }

      return NextResponse.json({
        error: 'We could not send the verification email. Please try again later.',
      }, { status: 500 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      verificationSent,
      verificationToken,
    })
  } catch (err: any) {
    console.error('register error', err)
    // Handle Prisma unique constraint failures with friendly messages
    if (err?.code === 'P2002') {
      const target = err?.meta?.target
      const field = Array.isArray(target) ? target.join(', ') : String(target || '')
      if (field.toLowerCase().includes('phone')) {
        return NextResponse.json({ error: 'Phone number is already registered' }, { status: 409 })
      }
      if (field.toLowerCase().includes('email')) {
        return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
      }
      return NextResponse.json({ error: 'A record with a unique field already exists' }, { status: 409 })
    }

    // Fallback: general server error message
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}
