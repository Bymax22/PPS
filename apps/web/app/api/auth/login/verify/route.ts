import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getAuthOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp, role } = body

    if (!email || !otp || !role) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const metadata = (user.metadata as Record<string, any> | null) || {}
    const savedOtp = metadata.loginOtp
    const expiresAt = metadata.loginOtpExpiresAt

    if (!savedOtp || !expiresAt || savedOtp !== otp) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 })
    }

    const expiry = new Date(expiresAt)
    if (Number.isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...metadata,
          loginOtp: null,
          loginOtpExpiresAt: null,
        },
      },
    })

    const authOptions = await getAuthOptions()
    const session = await getServerSession(authOptions)

    return NextResponse.json({ ok: true, sessionExists: Boolean(session) })
  } catch (error: any) {
    console.error('login verify error', error)
    return NextResponse.json({ error: error?.message || 'Unable to verify login' }, { status: 500 })
  }
}
