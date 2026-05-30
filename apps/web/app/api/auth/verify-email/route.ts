import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySignedToken } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    const verified = verifySignedToken(token)
    if (!verified || verified.type !== 'verify') {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: verified.id },
      data: { emailVerified: new Date() },
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Email verification error', error)
    return NextResponse.json({ error: error?.message || 'Verification failed' }, { status: 500 })
  }
}
