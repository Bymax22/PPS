import { prisma } from '@/lib/prisma'

export type TranscodingProfile = 'mobile' | 'web' | '4k'

interface TranscodingResult {
  videoId: string
  url: string
  format: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

const MUX_API_URL = 'https://api.mux.com/video/v1'
const MUX_ACCESS_TOKEN = process.env.MUX_ACCESS_TOKEN
const MUX_SECRET_TOKEN = process.env.MUX_SECRET_TOKEN

// Encoding profiles for different use cases
const ENCODING_PROFILES = {
  mobile: {
    width: 640,
    height: 360,
    bitrate: 800, // kbps
    format: 'h264',
  },
  web: {
    width: 1280,
    height: 720,
    bitrate: 2500, // kbps
    format: 'h264',
  },
  '4k': {
    width: 3840,
    height: 2160,
    bitrate: 15000, // kbps
    format: 'h264',
  },
}

export async function initializeVideoTranscoding(
  videoUrl: string,
  metadata: {
    title: string
    description?: string
    lessonId: string
    resourceId: string
  }
) {
  try {
    if (!MUX_ACCESS_TOKEN || !MUX_SECRET_TOKEN) {
      console.warn('Mux credentials not configured, using Cloudinary video delivery')
      return {
        videoId: metadata.resourceId,
        status: 'pending',
        profiles: {
          mobile: videoUrl,
          web: videoUrl,
          '4k': videoUrl,
        },
      }
    }

    const auth = Buffer.from(`${MUX_ACCESS_TOKEN}:${MUX_SECRET_TOKEN}`).toString('base64')

    const response = await fetch(`${MUX_API_URL}/assets`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { url: videoUrl },
        playback_policy: ['public'],
        encoding_tier: 'baseline', // Use baseline for cost savings, can upgrade to standard
        mp4_support: 'standard',
        test: process.env.NODE_ENV === 'development', // Use test mode in dev
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Mux API error: ${error.errors?.[0]?.detail || 'Unknown error'}`)
    }

    const { data } = await response.json()

    // Store transcoding job in database
    await prisma.mediaAsset.create({
      data: {
        name: metadata.title,
        description: metadata.description,
        mimeType: 'video/mp4',
        bucket: 'mux',
        path: data.id,
        fileSize: 0,
        uploaderId: metadata.lessonId,
        metadata: {
          muxAssetId: data.id,
          originalUrl: videoUrl,
          profiles: {},
          createdAt: new Date().toISOString(),
        },
      },
    })

    return {
      videoId: data.id,
      status: 'processing',
      playbackId: data.playback_ids?.[0]?.id,
      message: 'Video transcoding started',
    }
  } catch (err) {
    console.error('Video transcoding initialization error:', err)
    throw err
  }
}

export async function getTranscodingStatus(videoId: string) {
  try {
    if (!MUX_ACCESS_TOKEN || !MUX_SECRET_TOKEN) {
      return { status: 'completed', videoId }
    }

    const auth = Buffer.from(`${MUX_ACCESS_TOKEN}:${MUX_SECRET_TOKEN}`).toString('base64')

    const response = await fetch(`${MUX_API_URL}/assets/${videoId}`, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch video status')
    }

    const { data } = await response.json()

    const status = data.status === 'ready' ? 'completed' : data.status === 'processing' ? 'processing' : 'failed'

    return {
      videoId: data.id,
      status,
      playbackId: data.playback_ids?.[0]?.id,
      duration: data.duration,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (err) {
    console.error('Get transcoding status error:', err)
    throw err
  }
}

export async function getPlaybackUrl(videoId: string, profile: TranscodingProfile = 'web') {
  try {
    const status = await getTranscodingStatus(videoId)

    if (status.status !== 'completed') {
      return null
    }

    // Mux HLS streaming URL format
    const playbackId = status.playbackId
    if (!playbackId) return null

    // Return HLS master playlist URL (automatically includes all profiles)
    return `https://image.mux.com/${playbackId}/animated.gif` // For poster frame
  } catch (err) {
    console.error('Get playback URL error:', err)
    return null
  }
}

export async function getHlsStreamUrl(videoId: string) {
  try {
    const status = await getTranscodingStatus(videoId)

    if (status.status !== 'completed') {
      return null
    }

    const playbackId = status.playbackId
    if (!playbackId) return null

    // Mux provides HLS streaming out of the box
    return `https://stream.mux.com/${playbackId}.m3u8`
  } catch (err) {
    console.error('Get HLS stream error:', err)
    return null
  }
}

export async function getDashStreamUrl(videoId: string) {
  try {
    const status = await getTranscodingStatus(videoId)

    if (status.status !== 'completed') {
      return null
    }

    const playbackId = status.playbackId
    if (!playbackId) return null

    // Mux provides DASH streaming as well
    return `https://stream.mux.com/${playbackId}.mpd`
  } catch (err) {
    console.error('Get DASH stream error:', err)
    return null
  }
}

export async function handleTranscodingWebhook(event: string, data: any) {
  try {
    const videoId = data.data.id

    if (event === 'video.asset.ready') {
      // Update media asset status
      await prisma.mediaAsset.updateMany({
        where: {
          metadata: {
            path: ['muxAssetId'],
            equals: videoId,
          },
        },
        data: {
          metadata: {
            status: 'completed',
            playbackId: data.data.playback_ids?.[0]?.id,
            completedAt: new Date().toISOString(),
          },
        },
      })

      return { success: true, message: 'Transcoding completed' }
    }

    if (event === 'video.asset.errored') {
      await prisma.mediaAsset.updateMany({
        where: {
          metadata: {
            path: ['muxAssetId'],
            equals: videoId,
          },
        },
        data: {
          metadata: {
            status: 'failed',
            error: data.data.errors?.[0]?.detail,
          },
        },
      })

      return { success: true, message: 'Transcoding failed' }
    }

    return { success: true, message: 'Webhook processed' }
  } catch (err) {
    console.error('Webhook handling error:', err)
    throw err
  }
}

/**
 * Alternative fallback: Use Cloudinary's video transformation
 * Cloudinary handles basic transcoding automatically
 */
export function getCloudinaryVideoUrl(publicId: string, profile: TranscodingProfile = 'web') {
  const profiles = {
    mobile: 'c_scale,w_640,q_auto:good,f_auto',
    web: 'c_scale,w_1280,q_auto:good,f_auto',
    '4k': 'c_scale,w_3840,q_auto,f_auto',
  }

  const cloudinaryBase = 'https://res.cloudinary.com/dgksylod2/video/upload'
  const transformation = profiles[profile]

  return `${cloudinaryBase}/${transformation}/${publicId}`
}
