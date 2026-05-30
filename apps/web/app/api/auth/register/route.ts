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
    if (existing) return NextResponse.json({ error: 'user_exists' }, { status: 409 })

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
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:2000'}/portal/verify-email?token=${encodeURIComponent(verificationToken)}`

    let verificationSent = false
    try {
      await sendVerificationEmail(email, `${firstName} ${lastName}`, verificationUrl)
      verificationSent = true
    } catch (error) {
      console.error('Verification email failed', error)
    }

    return NextResponse.json({ id: user.id, email: user.email, verificationSent })
  } catch (err) {
    console.error('register error', err)
    // Return a human-friendly error message so the client doesn't display raw codes
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 })
  }
}
