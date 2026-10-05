import { NextRequest, NextResponse } from 'next/server'
import { readXmlValue } from '@/lib/paymentGateways'
import { verifyAndSettleDpoPayment } from '@/lib/dpoPayment'

const xmlResponse = (message: string, status: number) =>
  new NextResponse(`<Response>${message}</Response>`, {
    status,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > 64 * 1024) return xmlResponse('Invalid request', 413)

  const xml = await request.text()
  if (!xml || xml.length > 64 * 1024) return xmlResponse('Invalid request', 400)

  const reference = readXmlValue(xml, 'CompanyRef') ?? readXmlValue(xml, 'TransactionRef')
  const transactionToken = readXmlValue(xml, 'TransactionToken')
  if (!reference || !transactionToken) {
    return xmlResponse('Missing transaction reference or token', 400)
  }

  try {
    await verifyAndSettleDpoPayment(reference, transactionToken)
    return xmlResponse('OK', 200)
  } catch (error) {
    console.error('DPO callback could not verify payment', { reference, error })
    return xmlResponse('Payment verification failed', 502)
  }
}
