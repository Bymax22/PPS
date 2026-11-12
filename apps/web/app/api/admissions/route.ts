import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendApplicationConfirmationEmail } from '@/lib/email'

const admissionSchema = z.object({
  studentFirstName: z.string().trim().min(1),
  studentLastName: z.string().trim().min(1),
  studentEmail: z.string().trim().email().optional().or(z.literal('')),
  studentDob: z.string().min(1),
  studentGender: z.string().optional(),
  nationalId: z.string().optional(),
  parentFirstName: z.string().trim().min(1),
  parentLastName: z.string().trim().min(1),
  parentEmail: z.string().trim().email(),
  parentPhone: z.string().trim().min(1),
  parentOccupation: z.string().optional(),
  parentRelationship: z.string().optional(),
  studentNationality: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  previousSchool: z.string().optional(),
  previousGrade: z.union([z.string(), z.number()]).optional(),
  studentGrade: z.union([z.string(), z.number()]),
  programType: z.string().optional(),
  preferredStartDate: z.string().optional(),
  preferredSchedule: z.string().optional(),
  specialNeeds: z.string().optional(),
  howHeard: z.string().optional(),
  preferredSubjects: z.unknown().optional(),
  uploadFolder: z.string().regex(/^pps_admissions\/[0-9a-f-]{36}$/i).optional(),
  documents: z.object({
    schoolReport: z.object({ name: z.string(), url: z.string().url(), publicId: z.string(), mimeType: z.string() }).optional(),
    birthCertificate: z.object({ name: z.string(), url: z.string().url(), publicId: z.string(), mimeType: z.string() }).optional(),
    passportPhoto: z.object({ name: z.string(), url: z.string().url(), publicId: z.string(), mimeType: z.string() }).optional(),
    immunizations: z.object({ name: z.string(), url: z.string().url(), publicId: z.string(), mimeType: z.string() }).optional(),
  }).optional(),
  agreeTerms: z.boolean().optional(),
  agreePhotos: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const parsed = admissionSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid application details' }, { status: 400 })
    }
    const body = parsed.data
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    for (const document of Object.values(body.documents ?? {})) {
      if (!document) continue
      const documentUrl = new URL(document.url)
      if (
        !cloudName ||
        documentUrl.hostname !== 'res.cloudinary.com' ||
        !documentUrl.pathname.startsWith(`/${cloudName}/`) ||
        !body.uploadFolder ||
        !document.publicId.startsWith(`${body.uploadFolder}/`)
      ) {
        return NextResponse.json({ error: 'Invalid uploaded document reference' }, { status: 400 })
      }
    }
    const dateOfBirth = new Date(body.studentDob)
    const parseGrade = (value: string | number) => {
      if (typeof value === 'number') return value
      const normalized = value.trim().toLowerCase()
      const earlyYears: Record<string, number> = {
        'baby class': 0,
        nursery: 1,
        reception: 2,
      }
      if (normalized in earlyYears) return earlyYears[normalized]
      const gradeNumber = normalized.match(/^(?:grade\s*)?(\d+)$/)
      return gradeNumber ? Number(gradeNumber[1]) : Number.NaN
    }
    const applyingForGrade = parseGrade(body.studentGrade)
    const previousGrade = body.previousGrade === undefined || body.previousGrade === ''
      ? null
      : parseGrade(body.previousGrade)

    if (Number.isNaN(dateOfBirth.getTime())) {
      return NextResponse.json({ error: 'A valid date of birth is required' }, { status: 400 })
    }
    if (!Number.isInteger(applyingForGrade) || applyingForGrade < 0) {
      return NextResponse.json({ error: 'A valid applying grade is required' }, { status: 400 })
    }
    if (previousGrade !== null && (!Number.isInteger(previousGrade) || previousGrade < 0)) {
      return NextResponse.json({ error: 'A valid previous grade is required' }, { status: 400 })
    }
    if (!body.agreeTerms) {
      return NextResponse.json({ error: 'Consent is required to submit an application' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')

    const studentName = `${body.studentFirstName || ''} ${body.studentLastName || ''}`.trim()

    const documents = {
      studentEmail: body.studentEmail || null,
      applicationDetails: {
        programType: body.programType || null,
        studentNationality: body.studentNationality || null,
        parentRelationship: body.parentRelationship || null,
        address: body.address || null,
        city: body.city || null,
        province: body.province || null,
        preferredStartDate: body.preferredStartDate || null,
        preferredSchedule: body.preferredSchedule || null,
        specialNeeds: body.specialNeeds || null,
        howHeard: body.howHeard || null,
        agreePhotos: body.agreePhotos ?? false,
      },
      ...(body.documents ?? {}),
    }

    const admission = await prisma.admissionForm.create({
      data: {
        studentName,
        dateOfBirth,
        nationalId: body.nationalId || null,
        gender: body.studentGender || null,
        parentName: `${body.parentFirstName || ''} ${body.parentLastName || ''}`.trim(),
        parentEmail: body.parentEmail,
        parentPhone: body.parentPhone,
        parentOccupation: body.parentOccupation || null,
        previousSchool: body.previousSchool || null,
        previousGrade,
        applyingForGrade,
        preferredSubjects: body.preferredSubjects || null,
        documentsMediaIds: JSON.stringify(documents),
        consentSigned: body.agreeTerms,
        submittedAt: new Date()
      }
    })

    let emailSent = false
    try {
      const parentName = `${body.parentFirstName || ''} ${body.parentLastName || ''}`.trim() || body.parentEmail
      await sendApplicationConfirmationEmail({
        email: body.parentEmail,
        parentName,
        studentName,
        applyingForGrade: body.studentGrade,
        referenceId: admission.id,
      })
      emailSent = true

      const admissionsInbox = process.env.ADMISSIONS_EMAIL || process.env.EMAIL_TO_ADDRESS
      if (admissionsInbox) {
        await sendApplicationConfirmationEmail({
          email: admissionsInbox,
          parentName,
          studentName,
          applyingForGrade: body.studentGrade,
          referenceId: admission.id,
        })
      }
    } catch (error) {
      console.error('Unable to send application confirmation email', error)
      emailSent = false
    }

    return NextResponse.json({ id: admission.id, emailSent }, { status: 201 })
  } catch (err) {
    console.error('admission error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
