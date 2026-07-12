import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNotificationHooks } from '@/lib/notifications'
import { logAuditAction } from '@/lib/audit'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, type, classId, cloudinaryUrl, cloudinaryPublicId, fileSize } = body

    if (!title || !type || !classId) {
      return NextResponse.json({ error: 'Title, type, and class are required' }, { status: 400 })
    }

    const normalizedTitle = String(title).trim()
    const normalizedDescription = typeof description === 'string' ? description.trim() : undefined
    const isVideo = type === 'VIDEO_TUTORIAL'
    const resourceStatus = isVideo ? 'PROCESSING' : 'READY'
    const publishNow = !isVideo

    const resource = await prisma.resource.create({
      data: {
        title: normalizedTitle,
        description: normalizedDescription,
        type,
        classId,
        fileSize: Number(fileSize) || 0,
        accessLevel: 'PUBLIC',
        isPublished: publishNow,
        publishedAt: publishNow ? new Date() : undefined,
        status: resourceStatus,
        authorId: session.user.id,
        media: cloudinaryUrl || cloudinaryPublicId ? {
          create: {
            provider: 'CLOUDINARY',
            originalUrl: cloudinaryUrl || '',
            publicId: cloudinaryPublicId || undefined,
            filename: normalizedTitle,
            mimeType: 'application/octet-stream',
            size: Number(fileSize) || 0,
            uploaderId: session.user.id,
            metadata: {
              cloudinaryUrl,
              cloudinaryPublicId,
              status: resourceStatus,
              uploadedAt: new Date().toISOString(),
            },
          }
        } : undefined,
      },
      include: {
        media: true,
      }
    })

    await logAuditAction({
      userId: session.user.id,
      action: `Uploaded resource ${normalizedTitle}`,
      entity: 'Resource',
      entityId: resource.id,
      newValue: {
        title: normalizedTitle,
        type,
        classId,
        status: resourceStatus,
      }
    })

    if (publishNow) {
      const enrollments = await prisma.enrollment.findMany({
        where: { classId, status: 'ACTIVE' },
        select: { userId: true },
      })

      await Promise.allSettled(
        enrollments.map((enrollment) =>
          sendNotificationHooks({
            userId: enrollment.userId,
            type: 'ANNOUNCEMENT',
            title: `New resource available: ${normalizedTitle}`,
            body: `New ${type.replace('_', ' ').toLowerCase()} has been added for your class.`,
            link: `/student/resources`,
            metadata: { resourceId: resource.id, classId }
          })
        )
      )
    }

    return NextResponse.json(resource)
  } catch (error: any) {
    console.error('Create resource error:', error)
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')

    const resources = await prisma.resource.findMany({
      where: classId ? { classId } : {},
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(resources)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
