import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sendLoginOtpEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, role } = body

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before signing in.' }, { status: 403 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.role !== role) {
      return NextResponse.json({ error: 'User does not have access to this role' }, { status: 403 })
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`
    const metadata = (user.metadata as Record<string, any> | null) || {}
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...metadata,
          loginOtp: otp,
          loginOtpExpiresAt: expiresAt,
        },
      },
    })

    await sendLoginOtpEmail(email, `${user.firstName} ${user.lastName}`, otp)

    return NextResponse.json({ requiresOtp: true, email: user.email })
  } catch (error: any) {
    console.error('login otp error', error)
    return NextResponse.json({ error: error?.message || 'Unable to start login' }, { status: 500 })
  }
}
