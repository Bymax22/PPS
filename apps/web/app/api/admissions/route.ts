import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prisma } = await import('@/lib/prisma')

    const studentName = `${body.studentFirstName || ''} ${body.studentLastName || ''}`.trim()

    const documents = {
      schoolReport: body.schoolReportName || null,
      birthCertificate: body.birthCertificateName || null,
      passportPhoto: body.passportPhotoName || null,
      immunizations: body.immunizationsName || null
    }

    const admission = await prisma.admissionForm.create({
      data: {
        studentName,
        dateOfBirth: body.studentDob ? new Date(body.studentDob) : new Date(),
        nationalId: body.nationalId || null,
        gender: body.studentGender || null,
        parentName: `${body.parentFirstName || ''} ${body.parentLastName || ''}`.trim(),
        parentEmail: body.parentEmail || null,
        parentPhone: body.parentPhone || null,
        parentOccupation: body.parentOccupation || null,
        previousSchool: body.previousSchool || null,
        previousGrade: body.previousGrade || null,
        applyingForGrade: parseInt(body.studentGrade || '0', 10) || 0,
        preferredSubjects: body.preferredSubjects || null,
        documentsUrl: JSON.stringify(documents),
        consentSigned: !!body.agreeTerms,
        submittedAt: new Date()
      }
    })

    return NextResponse.json({ id: admission.id })
  } catch (err) {
    console.error('admission error', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
