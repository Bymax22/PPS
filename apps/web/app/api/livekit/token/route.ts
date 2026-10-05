// apps/web/app/api/livekit/token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { AccessToken } from 'livekit-server-sdk'
import { prisma } from '@/lib/prisma'
import { getLessonAccess } from '@/lib/lessonAccess'

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

    const access = await getLessonAccess(session.user.id, room)
    if (!access) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    if (!access.canAccess) return NextResponse.json({ error: 'No access to this live session' }, { status: 403 })
    if (access.lesson.status !== 'LIVE' || access.lesson.session?.status !== 'LIVE') {
      return NextResponse.json({ error: 'This live session is not active' }, { status: 409 })
    }
    if (isHost && !access.canTeach) {
      return NextResponse.json({ error: 'Only the assigned teacher or an admin can host this lesson' }, { status: 403 })
    }
    if (!isHost && access.user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only enrolled students can join as learners' }, { status: 403 })
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const serverUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json({ error: 'LiveKit credentials and server URL are not configured' }, { status: 503 })
    }

    const displayName = `${session.user.name || 'User'}`.trim()
    const identity = `${session.user.id}-${Date.now()}`

    const at = new AccessToken(apiKey, apiSecret, { identity, name: displayName })

    // Students receive subscribe-only access; lesson chat is authorized separately.
    const grant = isHost
      ? { room, canPublish: true, canPublishData: true, canSubscribe: true }
      : { room, canPublish: false, canPublishData: true, canSubscribe: true }

    at.addGrant(grant)

    const token = await at.toJwt()
    return NextResponse.json({ token, identity, displayName, isHost, role: access.user.role, serverUrl })
  } catch (err) {
    console.error('Error generating LiveKit token', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
