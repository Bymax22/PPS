// app/api/parent/messages/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parent = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Get messages for parent (from teachers about their children)
    const messages = await prisma.communication.findMany({
      where: {
        receiverId: parent.id,
        type: 'DIRECT_MESSAGE'
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { teacherId, subject, message, childId } = body

    const parent = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Create message
    const newMessage = await prisma.communication.create({
      data: {
        senderId: parent.id,
        receiverId: teacherId,
        subject,
        body: message,
        type: 'DIRECT_MESSAGE'
      }
    })

    // Create notification for teacher
    await prisma.notification.create({
      data: {
        userId: teacherId,
        type: 'MESSAGE',
        title: 'New message from parent',
        body: `${parent.firstName} ${parent.lastName} sent you a message regarding their child`,
        link: `/teacher/messages/${newMessage.id}`
      }
    })

    return NextResponse.json(newMessage)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}