import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendNotificationHooks } from '@/lib/notifications'
import { logAuditAction } from '@/lib/audit'
import { getTeacherClassScope, teacherCanAccessClass } from '@/lib/teacherAccess'

const resourceTypes = new Set([
  'PDF_NOTE',
  'WORKSHEET',
  'PAST_PAPER',
  'SOLUTION_MANUAL',
  'FLASHCARD_SET',
  'VIDEO_TUTORIAL',
  'STUDY_GUIDE',
])

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, type, classId, cloudinaryUrl, cloudinaryPublicId, fileSize, fileName, mimeType, subject, year, examBoard } = body

    if (typeof title !== 'string' || !title.trim() || typeof classId !== 'string' ||
        typeof cloudinaryUrl !== 'string' || !cloudinaryUrl.startsWith('https://') ||
        !resourceTypes.has(type)) {
      return NextResponse.json({ error: 'A title, supported resource type, class, and uploaded file are required' }, { status: 400 })
    }

    const classScope = await getTeacherClassScope(session.user.id)
    if (!classScope || !teacherCanAccessClass(classScope, classId)) {
      return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
    }

    const normalizedTitle = String(title).trim()
    const normalizedDescription = typeof description === 'string' ? description.trim() : undefined
    const resource = await prisma.resource.create({
      data: {
        title: normalizedTitle,
        description: normalizedDescription,
        type,
        classId,
        subject: typeof subject === 'string' ? subject.trim() : undefined,
        year: Number.isInteger(Number(year)) && Number(year) > 1900 ? Number(year) : undefined,
        examBoard: typeof examBoard === 'string' ? examBoard.trim() : undefined,
        fileSize: Number(fileSize) || 0,
        accessLevel: 'ENROLLED',
        isPublished: true,
        publishedAt: new Date(),
        status: 'READY',
        authorId: session.user.id,
        media: {
          create: {
            provider: 'CLOUDINARY',
            originalUrl: cloudinaryUrl,
            publicId: cloudinaryPublicId || undefined,
            filename: typeof fileName === 'string' ? fileName : normalizedTitle,
            mimeType: typeof mimeType === 'string' ? mimeType : undefined,
            size: Number(fileSize) || 0,
            uploadedById: session.user.id,
            metadata: {
              cloudinaryUrl,
              cloudinaryPublicId,
              status: 'READY',
              uploadedAt: new Date().toISOString(),
            },
          }
        },
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
        status: resource.status,
      }
    })

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

    return NextResponse.json({ ...resource, status: 'READY', isPublished: true })
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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    let allowedClassIds: string[] | null = null
    if (user.role === 'TEACHER') {
      const scope = await getTeacherClassScope(user.id)
      allowedClassIds = scope?.classIds ?? []
      if (classId && !allowedClassIds.includes(classId)) {
        return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
      }
    } else if (user.role === 'STUDENT') {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id, status: 'ACTIVE' },
        select: { classId: true },
      })
      allowedClassIds = enrollments.map(({ classId: enrolledClassId }) => enrolledClassId)
      if (classId && !allowedClassIds.includes(classId)) {
        return NextResponse.json({ error: 'You are not enrolled in this class' }, { status: 403 })
      }
    } else if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'This account cannot access class resources' }, { status: 403 })
    }

    const resources = await prisma.resource.findMany({
      where: {
        ...(classId ? { classId } : allowedClassIds ? { classId: { in: allowedClassIds } } : {}),
        ...(user.role === 'ADMIN' || user.role === 'TEACHER' ? {} : { isPublished: true, status: 'READY', isDeleted: false }),
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(resources)
  } catch (error) {
    console.error('Failed to load class resources', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
