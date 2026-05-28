import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')
    const admission = await prisma.admissionForm.findUnique({ where: { id } })
    if (!admission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([600, 800])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const { width, height } = page.getSize()
    const fontSize = 12

    page.drawText('Enrollment Application', { x: 40, y: height - 50, size: 18, font, color: rgb(0.0, 0.2, 0.5) })
    page.drawText(`Applicant: ${admission.studentName}`, { x: 40, y: height - 80, size: fontSize, font })
    page.drawText(`DOB: ${admission.dateOfBirth?.toISOString().split('T')[0] || ''}`, { x: 40, y: height - 100, size: fontSize, font })
    page.drawText(`Applying for: ${admission.applyingForGrade || ''}`, { x: 40, y: height - 120, size: fontSize, font })
    page.drawText(`Parent: ${admission.parentName || ''}`, { x: 40, y: height - 140, size: fontSize, font })
    page.drawText(`Email: ${admission.parentEmail || ''}`, { x: 40, y: height - 160, size: fontSize, font })
    page.drawText(`Phone: ${admission.parentPhone || ''}`, { x: 40, y: height - 180, size: fontSize, font })
    page.drawText(`Status: ${admission.status}`, { x: 40, y: height - 200, size: fontSize, font })

    page.drawText('Submitted data:', { x: 40, y: height - 230, size: 14, font })
    const docJson = admission.documentsUrl ? JSON.stringify(admission.documentsUrl) : ''
    page.drawText(docJson, { x: 40, y: height - 250, size: 9, font, maxWidth: 520 })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="admission-${id}.pdf"`
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
