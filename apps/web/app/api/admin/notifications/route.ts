import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendBrevoEmail } from '@/lib/email'

const recipientLimit = 200

export async function GET() {
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const notifications = await prisma.notification.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { firstName: true, lastName: true } } }
  })

  return NextResponse.json({
    notifications: notifications.map((notification) => ({
      id: notification.id,
      createdAt: notification.createdAt.toISOString(),
      title: notification.title,
      body: notification.body,
      type: notification.type,
      recipients: 1,
      sentToEmail: notification.sentToEmail
    }))
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(undefined, undefined, await getAuthOptions())
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { subject, body: message, targetType, targetValue, sendEmail } = body as {
    subject: string
    body: string
    targetType: string
    targetValue: string
    sendEmail: boolean
  }

  if (!subject || !message || !targetType) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  let recipients = []

  if (targetType === 'ALL') {
    recipients = await prisma.user.findMany({ where: { status: 'ACTIVE' } })
  } else if (targetType === 'INDIVIDUAL') {
    const identifiers = targetValue
n      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    recipients = await prisma.user.findMany({
      where: {
        OR: identifiers.map((identifier) => ({
          email: identifier,
          id: identifier
        }))
      }
    })
  } else if (targetType === 'CLASS') {
    recipients = await prisma.user.findMany({
      where: {
        enrollments: {
          some: {
            class: {
              OR: [{ name: targetValue }, { id: targetValue }]
            }
          }
        }
      }
    })
  } else if (targetType === 'SESSION') {
    recipients = await prisma.user.findMany({
      where: {
        sessionAttendees: {
          some: {
            lesson: {
              OR: [{ title: targetValue }, { id: targetValue }]
            }
          }
        }
      }
    })
  } else if (targetType === 'GRADE') {
    const gradeValue = Number(targetValue)
    if (Number.isNaN(gradeValue)) {
      return NextResponse.json({ error: 'Invalid grade value' }, { status: 400 })
    }
    recipients = await prisma.user.findMany({
      where: {
        enrollments: {
          some: {
            class: { grade: gradeValue }
          }
        }
      }
    })
  }

  if (!recipients.length) {
    return NextResponse.json({ error: 'No recipients found' }, { status: 404 })
  }

  if (recipients.length > recipientLimit) {
    return NextResponse.json({ error: `Too many recipients. Limit is ${recipientLimit}.` }, { status: 413 })
  }

  const notificationType = targetType === 'INDIVIDUAL' ? 'MESSAGE' : 'ANNOUNCEMENT'
  const communicationType = targetType === 'INDIVIDUAL' ? 'DIRECT_MESSAGE' : 'BROADCAST'

  const createNotifications = recipients.map((recipient) =>
    prisma.notification.create({
      data: {
        userId: recipient.id,
        type: notificationType as any,
        title: subject,
        body: message,
        link: '/portal',
        metadata: JSON.stringify({ targetType, targetValue }),
        read: false,
        sentToEmail: Boolean(sendEmail),
        sentToSms: false,
        sentToPush: true
      }
    })
  )

  const createCommunications = recipients.map((recipient) =>
    prisma.communication.create({
      data: {
        senderId: admin.id,
        receiverId: recipient.id,
        type: communicationType as any,
        subject,
        body: message,
        read: false
      }
    })
  )

  await prisma.$transaction([...createNotifications, ...createCommunications])

  if (sendEmail) {
    await Promise.allSettled(
      recipients.map((recipient) =>
        sendBrevoEmail({
          to: recipient.email,
          name: `${recipient.firstName} ${recipient.lastName}`,
          subject,
          htmlContent: `<p>${message.replace(/\n/g, '<br />')}</p>`,
          textContent: message
        })
      )
    )
  }

  return NextResponse.json({ sentCount: recipients.length })
}
