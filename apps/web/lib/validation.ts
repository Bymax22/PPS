import { z } from 'zod'

export const emailSchema = z.string().trim().email('Please enter a valid email address')
export const nameSchema = z.string().trim().min(2, 'Name must be at least 2 characters')
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

export const adminStudentPayloadSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  grade: z.union([z.number(), z.string().regex(/\d+/)]).transform((value) => Number(value)),
  schoolYear: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  parentEmail: z.string().trim().email().optional().or(z.literal('')),
  classIds: z.array(z.string().cuid()).optional()
})

export const adminTeacherPayloadSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().trim().optional(),
  qualifications: z.string().trim().optional(),
  specialties: z.string().trim().optional(),
  hourlyRate: z.union([z.number(), z.string().regex(/\d+(\.\d+)?/)]).transform((value) => Number(value)).optional(),
  classIds: z.array(z.string().cuid()).optional()
})

export const adminNotificationPayloadSchema = z.object({
  subject: z.string().trim().min(3, 'Subject is required'),
  body: z.string().trim().min(3, 'Message is required'),
  targetType: z.enum(['ALL', 'INDIVIDUAL', 'CLASS', 'SESSION', 'GRADE']),
  targetValue: z.string().trim().optional(),
  sendEmail: z.boolean().optional()
})

export const adminClassPayloadSchema = z.object({
  name: z.string().trim().min(3, 'Class name is required'),
  programId: z.string().cuid('Valid program id is required'),
  grade: z.union([z.number().int().nonnegative(), z.string().regex(/\d+/)]).optional().transform((value) => value === undefined ? undefined : Number(value)),
  subject: z.string().trim().optional(),
  capacity: z.union([z.number().int().positive(), z.string().regex(/\d+/)]).optional().transform((value) => value === undefined ? undefined : Number(value)),
  teacherIds: z.array(z.string().cuid()).optional()
})

export const adminSubjectPayloadSchema = z.object({
  name: z.string().trim().min(2, 'Subject name is required'),
  code: z.string().trim().optional(),
  programId: z.string().cuid().optional()
})

export const adminParentPayloadSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().trim().optional()
})

export const adminSessionPayloadSchema = z.object({
  title: z.string().trim().min(3, 'Title is required'),
  classId: z.string().cuid('A valid class is required'),
  description: z.string().trim().optional(),
  type: z.enum(['LIVE', 'RECORDED', 'HYBRID']),
  status: z.enum(['DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED']),
  scheduledAt: z.string().optional(),
  duration: z.number().int().positive().optional(),
  roomId: z.string().trim().optional()
})

export const adminClassUpdatePayloadSchema = z.object({
  classId: z.string().cuid('Valid class id is required'),
  teacherIds: z.array(z.string().cuid()).optional(),
  grade: z.union([z.number().int().nonnegative(), z.string().regex(/\d+/)]).optional().transform((value) => value === undefined ? undefined : Number(value)),
  subject: z.string().trim().optional(),
  capacity: z.union([z.number().int().positive(), z.string().regex(/\d+/)]).optional().transform((value) => value === undefined ? undefined : Number(value))
})

export const adminSessionReassignPayloadSchema = z.object({
  lessonId: z.string().cuid('Valid lesson id is required'),
  classId: z.string().cuid('Valid class id is required')
})

export const adminTeacherUpdatePayloadSchema = z.object({
  teacherId: z.string().cuid('Valid teacher id is required'),
  classIds: z.array(z.string().cuid()).optional()
})

export const adminStudentUpdatePayloadSchema = z.object({
  studentId: z.string().cuid('Valid student id is required'),
  classIds: z.array(z.string().cuid()).optional()
})

export function parseValidation<T>(schema: z.ZodType<T>, payload: unknown) {
  const result = schema.safeParse(payload)
  if (!result.success) {
    return {
      ok: false as const,
      error: result.error.issues[0]?.message ?? 'Invalid payload',
      issues: result.error.issues
    }
  }

  return { ok: true as const, data: result.data }
}
