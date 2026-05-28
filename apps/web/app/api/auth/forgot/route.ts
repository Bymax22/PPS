import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { email } })
    // Always return success to avoid user enumeration
    if (!user) return NextResponse.json({ ok: true })

    const secret = process.env.NEXTAUTH_SECRET || process.env.SECRET || 'dev_secret'
    const expires = Date.now() + 1000 * 60 * 60 // 1 hour
    const payload = `${user.id}:${expires}`
    const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    const token = Buffer.from(`${payload}:${hmac}`).toString('base64url')

    const resetLink = `${process.env.NEXTAUTH_URL || ''}/portal/reset-password?token=${encodeURIComponent(token)}`
    // TODO: send email via SMTP/provider. For now log to server console.
    console.log('Password reset link for', email, resetLink)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('forgot error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
