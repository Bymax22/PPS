import crypto from 'crypto'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM_ADDRESS || 'noreply@progresspreparatoryschools.com'
const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || process.env.EMAIL_FROM_NAME || 'Progress Prep Schools'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:2000'
const SECRET = process.env.NEXTAUTH_SECRET || process.env.SECRET || 'dev_secret'

function createToken(payload: string, expiresInSeconds = 3600) {
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
  const encodedPayload = Buffer.from(payload, 'utf8').toString('base64url')
  const data = `${encodedPayload}:${expires}`
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
  return Buffer.from(`${data}:${signature}`, 'utf8').toString('base64url')
}

function verifyToken(token: string) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8')
    const parts = decoded.split(':')
    if (parts.length < 3) return null

    const signature = parts.pop() as string
    const expires = Number(parts.pop())
    const encodedPayload = parts.join(':')
    const data = `${encodedPayload}:${expires}`
    const expected = crypto.createHmac('sha256', SECRET).update(data).digest('hex')
    if (expected !== signature) return null
    if (Date.now() / 1000 > expires) return null

    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8')
    return { payload, expires }
  } catch {
    return null
  }
}

async function sendBrevoEmail(options: {
  to: string
  name?: string
  subject: string
  htmlContent: string
  textContent?: string
}) {
  if (!BREVO_API_KEY) {
    throw new Error('Missing BREVO_API_KEY in environment')
  }

  const body = {
    sender: {
      name: BREVO_FROM_NAME,
      email: BREVO_FROM_EMAIL,
    },
    to: [
      {
        email: options.to,
        name: options.name || options.to,
      },
    ],
    subject: options.subject,
    htmlContent: options.htmlContent,
    textContent: options.textContent || options.htmlContent.replace(/<[^>]*>/g, ''),
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const result = await res.text()
    throw new Error(`Brevo send failed: ${res.status} ${result}`)
  }

  return true
}

export function createVerificationToken(userId: string) {
  return createToken(`verify:${userId}`, 60 * 60 * 24)
}

export function createResetToken(userId: string) {
  return createToken(`reset:${userId}`, 60 * 60)
}

export function verifySignedToken(token: string) {
  const validated = verifyToken(token)
  if (!validated) return null
  const [type, id] = validated.payload.split(':')
  if (!type || !id) return null
  return { type, id, expires: validated.expires }
}

export async function sendVerificationEmail(email: string, fullName: string, token: string) {
  const verificationUrl = `${APP_URL}/portal/verify-email?token=${encodeURIComponent(token)}`

  return sendBrevoEmail({
    to: email,
    name: fullName,
    subject: 'Verify your email for Progress Preparatory Schools',
    htmlContent: `
      <p>Hi ${fullName},</p>
      <p>Thanks for creating an account. Click the link below to verify your email address:</p>
      <p><a href="${verificationUrl}" style="color:#003087;">Verify my email</a></p>
      <p>If you did not create an account, you can ignore this message.</p>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  return sendBrevoEmail({
    to: email,
    subject: 'Reset your Progress Preparatory Schools password',
    htmlContent: `
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p><a href="${resetLink}" style="color:#003087;">Reset my password</a></p>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
    `,
  })
}

export async function sendWelcomeEmail(email: string, fullName: string) {
  return sendBrevoEmail({
    to: email,
    name: fullName,
    subject: 'Welcome to Progress Preparatory Schools',
    htmlContent: `
      <p>Hi ${fullName},</p>
      <p>Welcome to Progress Preparatory Schools. Your account is ready, and you can sign in at <a href="${APP_URL}" style="color:#003087;">${APP_URL}</a>.</p>
      <p>If you have any questions, reply to this email.</p>
    `,
  })
}
