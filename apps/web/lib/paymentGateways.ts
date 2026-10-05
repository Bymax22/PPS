import { createHmac, timingSafeEqual } from 'node:crypto'

export type MobileMoneyNetwork = 'MTN' | 'AIRTEL'
export type PaymentGateway = 'BROADPAY' | 'DPO'

export class PaymentGatewayError extends Error {
  constructor(
    message: string,
    readonly statusCode: 502 | 503 = 502
  ) {
    super(message)
  }
}

export function getApplicationUrl(): URL {
  const configuredUrl = process.env.APP_URL || process.env.NEXTAUTH_URL
  if (!configuredUrl) {
    throw new PaymentGatewayError('APP_URL or NEXTAUTH_URL must be configured for payment callbacks.', 503)
  }

  try {
    const url = new URL(configuredUrl)
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
      throw new Error('Payment callback URLs must use HTTPS.')
    }
    return url
  } catch (error) {
    throw new PaymentGatewayError(
      error instanceof Error ? error.message : 'The application URL is invalid.',
      503
    )
  }
}

export function normalizeZambianPhone(phone: string): string | null {
  const digits = phone.replace(/[\s()-]/g, '')
  if (/^0\d{9}$/.test(digits)) return `+260${digits.slice(1)}`
  if (/^\+260\d{9}$/.test(digits)) return digits
  if (/^260\d{9}$/.test(digits)) return `+${digits}`
  return null
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function readXmlValue(xml: string, tagName: string): string | null {
  const escapedName = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = xml.match(new RegExp(`<${escapedName}>([^<]*)</${escapedName}>`, 'i'))
  if (!match) return null

  return match[1]
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
}

export function verifyBroadPaySignature(
  payload: Record<string, unknown>,
  secret: string
): boolean {
  const providedSignature = payload.signature
  const signedFields = payload.signedFields
  if (typeof providedSignature !== 'string' || typeof signedFields !== 'string') return false

  const fieldNames = signedFields.split(',')
  if (fieldNames.some(field => !field)) return false
  if (!fieldNames.includes('merchantReference') || !fieldNames.includes('status')) return false
  if (new Set(fieldNames).size !== fieldNames.length) return false

  const pairs: string[] = []
  for (const fieldName of fieldNames) {
    const value = payload[fieldName]
    if (
      value === undefined ||
      (value !== null && typeof value === 'object') ||
      (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean' && value !== null)
    ) {
      return false
    }
    pairs.push(`${fieldName}=${value === null ? '' : String(value)}`)
  }

  const expected = createHmac('sha256', secret).update(pairs.join(',')).digest()
  let actual: Buffer
  try {
    actual = Buffer.from(providedSignature, 'base64')
  } catch {
    return false
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export async function requestBroadPayCheckout(input: {
  amount: number
  currency: string
  reference: string
  firstName: string
  lastName: string
  email: string
  phone: string
}): Promise<string> {
  const publicKey = process.env.BROADPAY_PUBLIC_KEY
  if (!publicKey || !process.env.BROADPAY_SECRET_KEY) {
    throw new PaymentGatewayError('BroadPay public and secret keys are not configured.', 503)
  }

  const appUrl = getApplicationUrl()
  const response = await fetch('https://checkout.broadpay.io/gateway/api/v1/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      transactionName: `PPS subscription ${input.reference}`,
      amount: input.amount,
      currency: input.currency,
      transactionReference: input.reference,
      customerFirstName: input.firstName,
      customerLastName: input.lastName,
      customerEmail: input.email,
      customerPhone: input.phone,
      customerCountryCode: 'ZM',
      merchantPublicKey: publicKey,
      webhookUrl: new URL('/api/payments/broadpay/webhook', appUrl).toString(),
      returnUrl: new URL('/parent/payments?paymentStatus=pending', appUrl).toString(),
      autoReturn: true,
    }),
    signal: AbortSignal.timeout(15_000),
  })

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok || !body || typeof body !== 'object') {
    throw new PaymentGatewayError(`BroadPay checkout could not be created (HTTP ${response.status}).`)
  }

  const result = body as { isError?: unknown; paymentUrl?: unknown; message?: unknown }
  if (result.isError === true || typeof result.paymentUrl !== 'string') {
    const message = typeof result.message === 'string' ? result.message : 'BroadPay rejected the checkout request.'
    throw new PaymentGatewayError(message)
  }

  let checkoutUrl: URL
  try {
    checkoutUrl = new URL(result.paymentUrl)
  } catch {
    throw new PaymentGatewayError('BroadPay returned an invalid checkout URL.')
  }
  if (checkoutUrl.protocol !== 'https:' || checkoutUrl.hostname !== 'checkout.broadpay.io') {
    throw new PaymentGatewayError('BroadPay returned an unexpected checkout URL.')
  }

  return checkoutUrl.toString()
}

function requireDpoSetting(name: string): string {
  const value = process.env[name]
  if (!value) throw new PaymentGatewayError(`${name} is required to enable DPO mobile money.`, 503)
  return value
}

async function postDpoXml(xml: string): Promise<string> {
  const response = await fetch('https://secure.3gdirectpay.com/API/v6/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/xml; charset=utf-8', Accept: 'application/xml' },
    body: xml,
    signal: AbortSignal.timeout(15_000),
  })
  const responseXml = await response.text()
  if (!response.ok) {
    throw new PaymentGatewayError(`DPO request failed (HTTP ${response.status}).`)
  }
  return responseXml
}

function getDpoServiceXml(): string {
  const serviceType = escapeXml(requireDpoSetting('DPO_SERVICE_TYPE'))
  const serviceDescription = escapeXml(process.env.DPO_SERVICE_DESCRIPTION || 'PPS learning subscription')
  const serviceDate = new Date().toISOString().slice(0, 16).replace(/-/g, '/').replace('T', ' ')
  return `<Services><Service><ServiceType>${serviceType}</ServiceType><ServiceDescription>${serviceDescription}</ServiceDescription><ServiceDate>${serviceDate}</ServiceDate></Service></Services>`
}

export async function requestDpoCheckout(input: {
  amount: number
  currency: string
  reference: string
  firstName: string
  lastName: string
  email: string
  phone: string
  network: MobileMoneyNetwork
}): Promise<{ checkoutUrl: string; transactionToken: string }> {
  const companyToken = requireDpoSetting('DPO_COMPANY_TOKEN')
  const checkoutUrlSetting = requireDpoSetting('DPO_CHECKOUT_URL')
  const country = escapeXml(requireDpoSetting('DPO_DEFAULT_PAYMENT_COUNTRY'))
  const mnoSetting = input.network === 'MTN' ? 'DPO_MTN_MNO' : 'DPO_AIRTEL_MNO'
  const mno = escapeXml(requireDpoSetting(mnoSetting))
  const appUrl = getApplicationUrl()
  const redirectUrl = new URL('/api/payments/dpo/return', appUrl).toString()
  const xml = `<API3G><CompanyToken>${escapeXml(companyToken)}</CompanyToken><Request>createToken</Request><Transaction><PaymentAmount>${input.amount.toFixed(2)}</PaymentAmount><PaymentCurrency>${escapeXml(input.currency)}</PaymentCurrency><CompanyRef>${escapeXml(input.reference)}</CompanyRef><RedirectURL>${escapeXml(redirectUrl)}</RedirectURL><BackURL>${escapeXml(redirectUrl)}</BackURL><customerFirstName>${escapeXml(input.firstName)}</customerFirstName><customerLastName>${escapeXml(input.lastName)}</customerLastName><customerEmail>${escapeXml(input.email)}</customerEmail><customerPhone>${escapeXml(input.phone)}</customerPhone><DefaultPayment>MO</DefaultPayment><DefaultPaymentCountry>${country}</DefaultPaymentCountry><DefaultPaymentMNO>${mno}</DefaultPaymentMNO></Transaction>${getDpoServiceXml()}</API3G>`

  const responseXml = await postDpoXml(xml)
  const result = readXmlValue(responseXml, 'Result')
  const transactionToken = readXmlValue(responseXml, 'TransToken')
  if (result !== '000' || !transactionToken) {
    const explanation = readXmlValue(responseXml, 'ResultExplanation')
    throw new PaymentGatewayError(explanation || `DPO rejected the checkout request (result ${result || 'unknown'}).`)
  }

  let url: URL
  try {
    url = new URL(checkoutUrlSetting)
  } catch {
    throw new PaymentGatewayError('DPO_CHECKOUT_URL must be a complete hosted checkout URL.', 503)
  }
  if (url.protocol !== 'https:') {
    throw new PaymentGatewayError('DPO_CHECKOUT_URL must use HTTPS.', 503)
  }
  url.searchParams.set('ID', transactionToken)
  return { checkoutUrl: url.toString(), transactionToken }
}

export async function verifyDpoTransaction(input: {
  transactionToken: string
  reference: string
}): Promise<{ paid: boolean; responseXml: string }> {
  const companyToken = requireDpoSetting('DPO_COMPANY_TOKEN')
  const xml = `<API3G><CompanyToken>${escapeXml(companyToken)}</CompanyToken><Request>verifyToken</Request><TransactionToken>${escapeXml(input.transactionToken)}</TransactionToken><CompanyRef>${escapeXml(input.reference)}</CompanyRef></API3G>`
  const responseXml = await postDpoXml(xml)
  return { paid: readXmlValue(responseXml, 'Result') === '000', responseXml }
}
