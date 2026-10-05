import { NextResponse } from 'next/server'
import { z } from 'zod'

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
  previousSchool: z.string().optional(),
  previousGrade: z.union([z.string(), z.number()]).optional(),
  studentGrade: z.union([z.string(), z.number()]),
  preferredSubjects: z.unknown().optional(),
  schoolReportName: z.string().optional(),
  birthCertificateName: z.string().optional(),
  passportPhotoName: z.string().optional(),
  immunizationsName: z.string().optional(),
  agreeTerms: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const parsed = admissionSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid application details' }, { status: 400 })
    }
    const body = parsed.data
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
      schoolReport: body.schoolReportName || null,
      birthCertificate: body.birthCertificateName || null,
      passportPhoto: body.passportPhotoName || null,
      immunizations: body.immunizationsName || null
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

    return NextResponse.json({ id: admission.id }, { status: 201 })
  } catch (err) {
    console.error('admission error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
