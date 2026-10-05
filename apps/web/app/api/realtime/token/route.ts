import Ably from 'ably'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { getAuthOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(await getAuthOptions())
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const key = process.env.ABLY_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'Realtime service is not configured' }, { status: 503 })
  }

  try {
    const client = new Ably.Rest({ key })
    const tokenRequest = await client.auth.createTokenRequest({
      clientId: session.user.id,
      capability: JSON.stringify({ 'school-updates': ['subscribe'] }),
    })
    return NextResponse.json(tokenRequest, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Failed to create realtime token request', error)
    return NextResponse.json({ error: 'Unable to authorize realtime connection' }, { status: 503 })
  }
}
