import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const buf = Buffer.from(token, 'base64url').toString('utf8')
    const parts = buf.split(':')
    if (parts.length < 3) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    const userId = parts[0]
    const expires = parseInt(parts[1], 10)
    const sentHmac = parts.slice(2).join(':')

    const secret = process.env.NEXTAUTH_SECRET || process.env.SECRET || 'dev_secret'
    const payload = `${userId}:${expires}`
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
    if (expected !== sentHmac) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    if (Date.now() > expires) return NextResponse.json({ error: 'Token expired' }, { status: 400 })

    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const bcrypt = (await import('bcryptjs')).default
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('reset error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
