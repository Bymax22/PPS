import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { receiverId, subject, body: messageBody, type } = body

    const comm = await prisma.communication.create({
      data: {
        senderId: session.user.id,
        receiverId,
        type: type || 'DIRECT_MESSAGE',
        subject,
        body: messageBody
      }
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'MESSAGE',
        title: subject || 'New message',
        body: messageBody?.slice(0, 200) || 'You have a new message',
        link: `/teacher/messages`
      }
    })

    return NextResponse.json(comm)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const messages = await prisma.communication.findMany({
      where: { receiverId: session.user.id },
      include: { sender: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const formatted = messages.map((message) => ({
      id: message.id,
      sender: {
        id: message.sender.id,
        firstName: message.sender.firstName,
        lastName: message.sender.lastName,
        email: message.sender.email
      },
      subject: message.subject,
      body: message.body,
      type: message.type,
      read: message.read,
      createdAt: message.createdAt.toISOString()
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
