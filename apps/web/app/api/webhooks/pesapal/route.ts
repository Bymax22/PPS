import { NextResponse } from 'next/server'
import { verifyPesapalNotification } from '@/lib/pesapal'

export async function POST(req: Request) {
  const body = await req.json()
  const ok = await verifyPesapalNotification(body)
  if (!ok) return NextResponse.json({ error: 'invalid' }, { status: 400 })
  // handle payment confirmation
  console.log('pesapal webhook', body)
  return NextResponse.json({ received: true })
}
