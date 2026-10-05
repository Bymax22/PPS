import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { settlePayment } from '@/lib/paymentSettlement'
import { verifyBroadPaySignature } from '@/lib/paymentGateways'

export async function POST(request: NextRequest) {
  const secret = process.env.BROADPAY_SECRET_KEY
  if (!secret) {
    console.error('BroadPay webhook received while BROADPAY_SECRET_KEY is not configured')
    return NextResponse.json({ error: 'Payment webhook is not configured' }, { status: 503 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid webhook JSON' }, { status: 400 })
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const event = payload as Record<string, unknown>
  if (!verifyBroadPaySignature(event, secret)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }
  if (typeof event.merchantReference !== 'string' || typeof event.status !== 'string') {
    return NextResponse.json({ error: 'Webhook is missing its signed reference or status' }, { status: 400 })
  }

  const payment = await prisma.payment.findUnique({
    where: { transactionRef: event.merchantReference },
    select: { id: true, paymentMethod: true },
  })
  if (!payment || payment.paymentMethod !== 'BROADPAY') {
    return NextResponse.json({ error: 'Payment reference not found' }, { status: 404 })
  }

  const status = event.status.toUpperCase()
  const settlementStatus = status === 'TXN_AUTH_SUCCESSFUL'
    ? 'SUCCEEDED'
    : status === 'TXN_AUTH_UNSUCCESSFUL'
      ? 'FAILED'
      : 'PROCESSING'
  const amountValue = event.amount
  const amount = typeof amountValue === 'number'
    ? amountValue
    : typeof amountValue === 'string' && amountValue.trim() !== ''
      ? Number(amountValue)
      : undefined
  if (amountValue !== undefined && (amount === undefined || !Number.isFinite(amount))) {
    return NextResponse.json({ error: 'Webhook amount is invalid' }, { status: 400 })
  }
  const currency = typeof event.currency === 'string' ? event.currency : undefined

  try {
    await settlePayment({ reference: event.merchantReference, status: settlementStatus, amount, currency })
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('BroadPay webhook could not settle payment', { paymentId: payment.id, error })
    return NextResponse.json({ error: 'Payment could not be reconciled' }, { status: 500 })
  }
}
