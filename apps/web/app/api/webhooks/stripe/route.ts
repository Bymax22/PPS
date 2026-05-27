import { NextResponse } from 'next/server'
// Stripe removed — use Pesapal/mobile money webhooks instead

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') || ''

  try {
    // Stripe webhook verification removed — not using Stripe
    // Use Pesapal or mobile money webhook handlers instead
    console.log('stripe webhook endpoint deprecated — use pesapal webhooks')
    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('webhook error', err)
    return NextResponse.json({ error: 'invalid webhook' }, { status: 400 })
  }
}
