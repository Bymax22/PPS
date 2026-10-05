import { NextRequest, NextResponse } from 'next/server'
import { getApplicationUrl } from '@/lib/paymentGateways'
import { verifyAndSettleDpoPayment } from '@/lib/dpoPayment'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const reference = params.get('CompanyRef') ?? params.get('TransactionRef')
  const transactionToken = params.get('TransactionToken')
  if (!reference || !transactionToken) {
    return NextResponse.json({ error: 'DPO return is missing its transaction reference or token' }, { status: 400 })
  }

  let status = 'pending'
  try {
    const payment = await verifyAndSettleDpoPayment(reference, transactionToken)
    status = payment.status === 'SUCCEEDED' ? 'success' : 'pending'
  } catch (error) {
    console.error('DPO customer return could not verify payment', { reference, error })
    status = 'verification-error'
  }

  try {
    const destination = new URL('/parent/payments', getApplicationUrl())
    destination.searchParams.set('paymentStatus', status)
    return NextResponse.redirect(destination)
  } catch (error) {
    console.error('DPO return redirect is not configured', error)
    return NextResponse.json({ error: 'Payment return URL is not configured' }, { status: 503 })
  }
}
