import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { getTeacherClassScope, teacherCanAccessClass } from '@/lib/teacherAccess'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'Missing file upload' }, { status: 400 })
    }

    const maxFileSize = 50 * 1024 * 1024
    if (file.size > maxFileSize) {
      return NextResponse.json({ error: 'Files must be 50 MB or smaller' }, { status: 413 })
    }
    const allowedMimeTypes = new Set([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'image/jpeg',
      'image/png',
    ])
    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json({ error: 'Supported files are PDF, Word, PowerPoint, MP4, JPEG, and PNG' }, { status: 415 })
    }

    const classId = formData.get('classId')
    if (typeof classId !== 'string' || !classId) {
      return NextResponse.json({ error: 'Class is required for uploads' }, { status: 400 })
    }
    const classScope = await getTeacherClassScope(session.user.id)
    if (!classScope || !teacherCanAccessClass(classScope, classId)) {
      return NextResponse.json({ error: 'You are not assigned to this class' }, { status: 403 })
    }

    const resourceType = file.type.startsWith('video/')
      ? 'video'
      : file.type.startsWith('image/')
        ? 'image'
        : 'raw'
    const safeFolder = `pps_resources/${classId}`
    const result = await uploadToCloudinary(file, { folder: safeFolder, resourceType })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
      filename: file.name,
      mimeType: file.type,
    })
  } catch (error: any) {
    console.error('Cloudinary upload error', error)
    return NextResponse.json({ error: error?.message || 'Cloudinary upload failed' }, { status: 500 })
  }
}
