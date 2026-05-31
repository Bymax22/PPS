import { NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Missing file upload' }, { status: 400 })
    }

    const resourceTypeValue = formData.get('resourceType')
    const folderValue = formData.get('folder')

    const resourceType = typeof resourceTypeValue === 'string' && resourceTypeValue.trim() ? resourceTypeValue.trim() : 'auto'
    const folder = typeof folderValue === 'string' && folderValue.trim() ? folderValue.trim() : 'pps_resources'
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
