import { NextResponse } from 'next/server'
import { createResetToken, sendPasswordResetEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email } })
    // Always return success to avoid user enumeration
    if (!user) return NextResponse.json({ ok: true })

    const token = createResetToken(user.id)
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:2000'}/portal/reset-password?token=${encodeURIComponent(token)}`

    try {
      await sendPasswordResetEmail(email, resetLink)
    } catch (error) {
      console.error('Password reset email failed', error)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('forgot error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
