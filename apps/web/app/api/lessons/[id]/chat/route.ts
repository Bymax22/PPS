// app/api/lessons/[id]/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId } = await params
    const body = await req.json()
    const { message } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify user is in the lesson
    const attendee = await prisma.sessionAttendee.findFirst({
      where: {
        lessonId,
        userId: user.id
      }
    })

    if (!attendee) {
      return NextResponse.json({ error: 'Not in this lesson' }, { status: 403 })
    }

    // Create chat message
    const chatMessage = await prisma.chatMessage.create({
      data: {
        lessonId,
        userId: user.id,
        message: message.substring(0, 1000),
        isSystem: false
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: chatMessage
    })
  } catch (error) {
    console.error('Error sending chat message:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: lessonId } = await params
    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify user is in the lesson
    const attendee = await prisma.sessionAttendee.findFirst({
      where: {
        lessonId,
        userId: user.id
      }
    })

    if (!attendee) {
      return NextResponse.json({ error: 'Not in this lesson' }, { status: 403 })
    }

    // Get chat messages
    const messages = await prisma.chatMessage.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit
    })

    const total = await prisma.chatMessage.count({ where: { lessonId } })

    return NextResponse.json({
      messages,
      total,
      hasMore: offset + limit < total
    })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
