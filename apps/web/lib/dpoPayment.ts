import { prisma } from '@/lib/prisma'
import { readXmlValue, verifyDpoTransaction } from '@/lib/paymentGateways'
import { settlePayment } from '@/lib/paymentSettlement'

export async function verifyAndSettleDpoPayment(reference: string, transactionToken: string) {
  const payment = await prisma.payment.findUnique({
    where: { transactionRef: reference },
    select: { id: true, paymentMethod: true, gatewayResponse: true },
  })
  if (!payment || payment.paymentMethod !== 'DPO') {
    throw new Error('DPO payment reference was not found.')
  }
  const metadata = payment.gatewayResponse
  if (
    !metadata ||
    typeof metadata !== 'object' ||
    Array.isArray(metadata) ||
    !('transactionToken' in metadata) ||
    metadata.transactionToken !== transactionToken
  ) {
    throw new Error('DPO transaction token does not match this payment.')
  }

  const verification = await verifyDpoTransaction({ reference, transactionToken })
  const result = readXmlValue(verification.responseXml, 'Result')
  if (!result) throw new Error('DPO verification did not include a transaction result.')

  const amountValue =
    readXmlValue(verification.responseXml, 'TransactionAmount') ??
    readXmlValue(verification.responseXml, 'PaymentAmount')
  const currency =
    readXmlValue(verification.responseXml, 'TransactionCurrency') ??
    readXmlValue(verification.responseXml, 'PaymentCurrency') ??
    undefined
  const amount = amountValue === null ? undefined : Number(amountValue)
  if (amountValue !== null && !Number.isFinite(amount)) {
    throw new Error('DPO verification returned an invalid transaction amount.')
  }

  return settlePayment({
    reference,
    status: verification.paid ? 'SUCCEEDED' : 'PROCESSING',
    amount,
    currency,
  })
}
