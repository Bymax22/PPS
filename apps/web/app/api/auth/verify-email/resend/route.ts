import { NextResponse } from 'next/server'
import { createVerificationToken, sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ ok: true, alreadyVerified: true })
    }

    const verificationToken = createVerificationToken(user.id)

    try {
      await sendVerificationEmail(email, `${user.firstName} ${user.lastName}`.trim() || email, verificationToken)
    } catch (error: any) {
      console.error('Resend verification email failed', error)
      const message = error?.message || ''
      if (message.includes('unauthorized') || message.includes('unrecognised IP') || message.includes('authorised IP')) {
        return NextResponse.json({
          error: 'Verification email could not be sent because Brevo rejected the request. Please authorize this server IP in your Brevo account and try again.',
        }, { status: 500 })
      }

      return NextResponse.json({ error: 'We could not send the verification email. Please try again later.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Resend verification error', error)
    return NextResponse.json({ error: error?.message || 'Unable to resend verification email' }, { status: 500 })
  }
}
