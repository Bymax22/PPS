import { NextResponse } from 'next/server'
import { verifySignedToken } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const verified = verifySignedToken(token)
    if (!verified || verified.type !== 'reset') {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const userId = verified.id
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const bcrypt = (await import('bcryptjs')).default
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('reset error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
