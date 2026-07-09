import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  initializeVideoTranscoding,
  getTranscodingStatus,
  getHlsStreamUrl,
  getCloudinaryVideoUrl,
} from '@/lib/videoTranscoding'

/**
 * POST /api/videos/transcode
 * Initiate video transcoding for a resource
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { videoUrl, title, description, lessonId, resourceId } = body

    if (!videoUrl || !resourceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user has permission
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Initialize transcoding
    const result = await initializeVideoTranscoding(videoUrl, {
      title: title || 'Untitled Video',
      description,
      lessonId: lessonId || 'unknown',
      resourceId,
    })

    return NextResponse.json({
      success: true,
      videoId: result.videoId,
      status: result.status,
      playbackId: result.playbackId,
      message: result.message,
    })
  } catch (err: any) {
    console.error('Video transcoding error:', err)
    return NextResponse.json(
      { error: err?.message || 'Transcoding failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/videos/[videoId]/status
 * Get the status of a transcoding job
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('videoId')

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 })
    }

    const status = await getTranscodingStatus(videoId)

    return NextResponse.json({
      videoId: status.videoId,
      status: status.status,
      playbackId: status.playbackId,
      duration: status.duration,
    })
  } catch (err: any) {
    console.error('Get status error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to get status' },
      { status: 500 }
    )
  }
}
