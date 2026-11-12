import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createCloudinaryUploadSignature } from '@/lib/cloudinary'

const allowedFormats = 'pdf,jpg,jpeg,png'

export async function POST() {
  try {
    const folder = `pps_admissions/${crypto.randomUUID()}`
    return NextResponse.json(createCloudinaryUploadSignature(folder, allowedFormats))
  } catch (error) {
    console.error('Unable to create admissions upload signature', error)
    return NextResponse.json({ error: 'Document uploads are temporarily unavailable' }, { status: 503 })
  }
}