import { NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Missing file upload' }, { status: 400 })
    }

    const resourceType = String(formData.get('resourceType') || 'auto')
    const folder = String(formData.get('folder') || 'pps_resources')
    const result = await uploadToCloudinary(file, { folder, resourceType })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
    })
  } catch (error: any) {
    console.error('Cloudinary upload error', error)
    return NextResponse.json({ error: error?.message || 'Cloudinary upload failed' }, { status: 500 })
  }
}
