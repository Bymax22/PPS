import { NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(auth) as Session | null

  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const API_URL = process.env.API_URL ?? 'http://localhost:3333'

    const res = await fetch(
      `${API_URL}/student/dashboard?email=${encodeURIComponent(session.user.email)}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('Backend dashboard error:', res.status, text)
      return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}