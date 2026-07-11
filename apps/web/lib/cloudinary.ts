import crypto from 'crypto'

interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

function parseCloudinaryUrl(url: string): CloudinaryConfig | null {
  const match = url.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/)
  if (!match) return null
  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  }
}

function getCloudinaryConfig(): CloudinaryConfig {
  const urlConfig = process.env.CLOUDINARY_URL ? parseCloudinaryUrl(process.env.CLOUDINARY_URL) : null
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || urlConfig?.cloudName
  const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || urlConfig?.apiKey
  const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || urlConfig?.apiSecret

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary credentials. Provide CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.')
  }

  return { cloudName, apiKey, apiSecret }
}

export async function uploadToCloudinary(file: Blob, options?: { folder?: string; resourceType?: string }) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()
  const folder = options?.folder
  const resourceType = options?.resourceType || 'auto'
  const timestamp = Math.floor(Date.now() / 1000)

  const params: Record<string, string> = {
    timestamp: timestamp.toString(),
  }

  if (folder) {
    params.folder = folder
  }

  const signatureString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&') + apiSecret

  const signature = crypto.createHash('sha1').update(signatureString).digest('hex')

  const body = new FormData()
  body.append('file', file)
  body.append('api_key', apiKey)
  body.append('timestamp', timestamp.toString())
  body.append('signature', signature)
  if (folder) {
    body.append('folder', folder)
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body,
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.error?.message || 'Cloudinary upload failed')
  }

  return json
}
