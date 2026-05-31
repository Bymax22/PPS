// apps/web/app/api/livekit/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { AccessToken } from 'livekit-server-sdk'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const room = url.searchParams.get('room')
    const isHost = url.searchParams.get('host') === 'true'

    if (!room) {
      return NextResponse.json({ error: 'Room name required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Only teachers and admins can request host tokens
    if (isHost && user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only teachers can start live sessions' }, { status: 403 })
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: 'LiveKit credentials not configured' }, { status: 500 })
    }

    const displayName = `${user.firstName} ${user.lastName}`.trim()
    const identity = `${user.id}-${Date.now()}`

    const at = new AccessToken(apiKey, apiSecret, { identity, name: displayName })

    // Host tokens get publish/subscribe permissions; students only subscribe
    const grant = isHost
      ? { room, canPublish: true, canPublishData: true, canSubscribe: true }
      : { room, canPublish: false, canPublishData: true, canSubscribe: true }

    at.addGrant(grant)

    const token = at.toJwt()
    return NextResponse.json({ token, identity, displayName, isHost, role: user.role })
  } catch (err) {
    console.error('Error generating LiveKit token', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
