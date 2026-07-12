import { NextRequest, NextResponse } from 'next/server'
import { handleTranscodingWebhook } from '@/lib/videoTranscoding'
import { prisma } from '@/lib/prisma'
import { publishLessonEvent } from '@/lib/redis'
import { sendNotificationHooks } from '@/lib/notifications'
import { logAuditAction } from '@/lib/audit'

/**
 * POST /api/webhooks/video-transcoding
 * Handle Mux video transcoding webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Verify webhook signature (in production, verify with Mux webhook secret)
    const eventType = body.type
    const eventData = body.data

    console.log(`[Webhook] Video transcoding event: ${eventType}`)

    if (eventType === 'video.asset.ready') {
      // Find the media asset and mark as ready
      const muxAssetId = eventData.id

      const mediaAsset = await prisma.mediaAsset.findFirst({
        where: {
          metadata: {
            path: ['muxAssetId'],
            equals: muxAssetId,
          },
        },
      })

      if (mediaAsset) {
        await prisma.mediaAsset.update({
          where: { id: mediaAsset.id },
          data: {
            metadata: {
              ...mediaAsset.metadata,
              status: 'completed',
              playbackId: eventData.playback_ids?.[0]?.id,
              duration: eventData.duration,
              completedAt: new Date().toISOString(),
            },
          },
        })

        // Notify related lessons if this is a video resource
        const resource = await prisma.resource.findFirst({
          where: { mediaId: mediaAsset.id },
          include: { class: { include: { lessons: true } } },
        })

        if (resource) {
        await prisma.resource.update({
          where: { id: resource.id },
          data: {
            status: 'READY',
            isPublished: true,
            publishedAt: resource.publishedAt ?? new Date(),
          },
        })

        await logAuditAction({
          userId: resource.authorId,
          action: `Resource ${resource.title} became ready`,
          entity: 'Resource',
          entityId: resource.id,
          newValue: {
            status: 'READY',
            isPublished: true,
          },
        })

        if (resource.classId) {
          const enrollments = await prisma.enrollment.findMany({
            where: { classId: resource.classId, status: 'ACTIVE' },
            select: { userId: true },
          })

          await Promise.allSettled(
            enrollments.map((enrollment) =>
              sendNotificationHooks({
                userId: enrollment.userId,
                type: 'ANNOUNCEMENT',
                title: `New video resource is ready: ${resource.title}`,
                body: `Your teacher has uploaded a new video tutorial for your class.`,
                link: `/student/resources`,
                metadata: { resourceId: resource.id, classId: resource.classId },
              })
            )
          )
        }

        if (resource?.class?.lessons) {
          for (const lesson of resource.class.lessons) {
            await publishLessonEvent(lesson.id, 'video:ready', {
              resourceId: resource.id,
              videoId: muxAssetId,
              title: resource.title,
            })
          }
        }
      }

      await handleTranscodingWebhook('video.asset.ready', body)
    }

    if (eventType === 'video.asset.errored') {
      const muxAssetId = eventData.id

      const mediaAsset = await prisma.mediaAsset.findFirst({
        where: {
          metadata: {
            path: ['muxAssetId'],
            equals: muxAssetId,
          },
        },
      })

      if (mediaAsset) {
        await prisma.mediaAsset.update({
          where: { id: mediaAsset.id },
          data: {
            metadata: {
              ...mediaAsset.metadata,
              status: 'failed',
              error: eventData.errors?.[0]?.detail || 'Transcoding failed',
              failedAt: new Date().toISOString(),
            },
          },
        })

        const resource = await prisma.resource.findFirst({
          where: { mediaId: mediaAsset.id },
        })

        if (resource) {
          await prisma.resource.update({
            where: { id: resource.id },
            data: { status: 'FAILED' },
          })

          await logAuditAction({
            userId: resource.authorId,
            action: `Resource ${resource.title} failed processing`,
            entity: 'Resource',
            entityId: resource.id,
            newValue: { status: 'FAILED' },
          })
        }
      }

      await handleTranscodingWebhook('video.asset.errored', body)

      // Send notification to administrators
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
      })

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            type: 'SYSTEM_ALERT',
            title: 'Video Transcoding Failed',
            body: `Transcoding failed for video: ${eventData.errors?.[0]?.detail || 'Unknown error'}`,
            link: '/admin/media',
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed',
    })
  } catch (err: any) {
    console.error('Webhook handling error:', err)
    return NextResponse.json(
      { error: err?.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
