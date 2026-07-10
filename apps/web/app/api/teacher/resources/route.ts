import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, type, classId, cloudinaryUrl, cloudinaryPublicId, fileSize } = body

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        type,
        classId,
        fileSize: fileSize || 0,
        accessLevel: 'PUBLIC',
        authorId: session.user.id,
        media: cloudinaryUrl || cloudinaryPublicId ? {
          create: {
            originalUrl: cloudinaryUrl || '',
            fileName: title,
            mimeType: 'application/octet-stream',
            sizeBytes: fileSize || 0,
            uploaderId: session.user.id,
          }
        } : undefined
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const classId = searchParams.get('classId')

    const resources = await prisma.resource.findMany({ where: classId ? { classId } : {}, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(resources)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
