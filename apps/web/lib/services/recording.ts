// apps/web/lib/services/recording.ts
import { prisma } from '@/lib/prisma'

export async function createRecordingMetadata(
  lessonId: string,
  data: {
    recordingId: string
    storagePath: string
    duration?: number
    fileSize?: number
    transcriptUrl?: string
    thumbnailUrl?: string
    metadata?: any
  }
) {
  return prisma.lessonRecording.create({
    data: {
      lessonId,
      recordingId: data.recordingId,
      storagePath: data.storagePath,
      duration: data.duration,
      fileSize: data.fileSize,
      transcriptUrl: data.transcriptUrl,
      thumbnailUrl: data.thumbnailUrl,
      metadata: data.metadata,
      isPublished: true,
      accessLevel: 'ENROLLED',
    },
  })
}

export async function publishRecording(recordingId: string) {
  return prisma.lessonRecording.update({
    where: { id: recordingId },
    data: { isPublished: true },
  })
}

export async function unpublishRecording(recordingId: string) {
  return prisma.lessonRecording.update({
    where: { id: recordingId },
    data: { isPublished: false },
  })
}

export async function updateRecordingMetadata(
  recordingId: string,
  data: Partial<{
    duration: number
    fileSize: number
    transcriptUrl: string
    thumbnailUrl: string
    accessLevel: string
    metadata: any
  }>
) {
  return prisma.lessonRecording.update({
    where: { id: recordingId },
    data,
  })
}

export async function getRecordingsByLesson(lessonId: string) {
  return prisma.lessonRecording.findMany({
    where: { lessonId, isPublished: true },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getLessonRecording(recordingId: string) {
  return prisma.lessonRecording.findUnique({
    where: { id: recordingId },
    include: {
      lesson: {
        select: { id: true, title: true, classId: true },
      },
    },
  })
}

export async function getRecordingAccessLevel(recordingId: string, userId: string) {
  const recording = await prisma.lessonRecording.findUnique({
    where: { id: recordingId },
    include: {
      lesson: {
        select: {
          classId: true,
        },
      },
    },
  })

  if (!recording) return null

  if (recording.accessLevel === 'PUBLIC') return 'public'

  // Check if user is enrolled in the class
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      classId: recording.lesson.classId,
    },
  })

  if (enrollment) return 'enrolled'
  return null
}
