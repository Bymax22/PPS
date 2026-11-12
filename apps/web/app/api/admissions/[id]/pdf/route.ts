import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib'

type StoredDocument = { name?: unknown; url?: unknown; mimeType?: unknown }

function safeText(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Not provided'
  const text = typeof value === 'string' ? value : String(value)
  return text.replace(/https?:\/\/\S+/gi, '[link omitted]').replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ').trim() || 'Not provided'
}

function readableValue(value: unknown): string {
  if (Array.isArray(value)) return value.map((item) => safeText(item)).join(', ')
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).map(([key, item]) => `${key}: ${safeText(item)}`).join(', ')
  }
  return safeText(value)
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines.length ? lines : ['Not provided']
}

function parseStoredData(value: string | null): Record<string, unknown> {
  if (!value) return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed as Record<string, unknown>
      : {}
  } catch {
    return {}
  }
}

function getAttachmentNames(storedData: Record<string, unknown>): string[] {
  return Object.entries(storedData)
    .filter(([key, value]) => key !== 'studentEmail' && key !== 'applicationDetails' && Boolean(value))
    .map(([label, value]) => {
      if (typeof value === 'object' && value !== null && 'name' in value) {
        return `${label}: ${safeText((value as StoredDocument).name)}`
      }
      if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
        try {
          return `${label}: ${decodeURIComponent(new URL(value).pathname.split('/').pop() || 'Attached document')}`
        } catch {
          return `${label}: Attached document`
        }
      }
      return `${label}: ${safeText(value)}`
    })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { prisma } = await import('@/lib/prisma')
    const admission = await prisma.admissionForm.findUnique({ where: { id } })
    if (!admission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const pdfDoc = await PDFDocument.create()
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const navy = rgb(0, 0.188, 0.529)
    const gold = rgb(0.984, 0.69, 0.231)
    const ink = rgb(0.12, 0.16, 0.22)
    const muted = rgb(0.38, 0.42, 0.48)
    const pale = rgb(0.95, 0.965, 0.98)
    const storedData = parseStoredData(admission.documentsMediaIds)
    const details = typeof storedData.applicationDetails === 'object' && storedData.applicationDetails !== null
      ? storedData.applicationDetails as Record<string, unknown>
      : {}
    const attachments = getAttachmentNames(storedData)
    const logoBytes = await readFile(join(process.cwd(), 'public', 'logo.png'))
    const logo = await pdfDoc.embedPng(logoBytes)
    const pages: PDFPage[] = []
    let page: PDFPage
    let cursorY = 0
    const pageWidth = 595
    const pageHeight = 842
    const margin = 44
    const contentWidth = pageWidth - margin * 2
    const columnGap = 16
    const columnWidth = (contentWidth - columnGap) / 2

    function addPage() {
      page = pdfDoc.addPage([pageWidth, pageHeight])
      pages.push(page)
      page.drawRectangle({ x: 0, y: pageHeight - 124, width: pageWidth, height: 124, color: navy })
      page.drawRectangle({ x: margin, y: pageHeight - 102, width: 76, height: 76, color: rgb(1, 1, 1) })
      page.drawImage(logo, { x: margin + 2, y: pageHeight - 100, width: 72, height: 72 })
      page.drawText('PROGRESS PREPARATORY SCHOOL', {
        x: margin + 94, y: pageHeight - 53, size: 16, font: boldFont, color: rgb(1, 1, 1),
      })
      page.drawText('STUDENT ADMISSION APPLICATION', {
        x: margin + 94, y: pageHeight - 76, size: 10, font: regularFont, color: gold,
      })
      page.drawText(`REFERENCE  APP-${id.slice(0, 8).toUpperCase()}`, {
        x: margin + 94, y: pageHeight - 96, size: 9, font: regularFont, color: rgb(1, 1, 1),
      })
      page.drawRectangle({ x: 0, y: pageHeight - 128, width: pageWidth, height: 4, color: gold })
      cursorY = pageHeight - 158
    }

    function ensureSpace(height: number) {
      if (cursorY - height < 58) addPage()
    }

    function drawSection(title: string) {
      ensureSpace(40)
      page.drawRectangle({ x: margin, y: cursorY - 21, width: contentWidth, height: 26, color: pale })
      page.drawRectangle({ x: margin, y: cursorY - 21, width: 4, height: 26, color: gold })
      page.drawText(title.toUpperCase(), { x: margin + 13, y: cursorY - 13, size: 9, font: boldFont, color: navy })
      cursorY -= 39
    }

    function fieldLines(label: string, value: unknown, x: number, width: number) {
      const labelText = safeText(label)
      const valueText = readableValue(value)
      const lines = wrapText(valueText, regularFont, 10, width)
      page.drawText(labelText.toUpperCase(), { x, y: cursorY, size: 7.5, font: boldFont, color: muted })
      lines.forEach((line, index) => {
        page.drawText(line, { x, y: cursorY - 14 - index * 13, size: 10, font: regularFont, color: ink })
      })
      return 25 + lines.length * 13
    }

    function drawPair(left: [string, unknown], right: [string, unknown]) {
      const leftLines = wrapText(readableValue(left[1]), regularFont, 10, columnWidth)
      const rightLines = wrapText(readableValue(right[1]), regularFont, 10, columnWidth)
      const rowHeight = 25 + Math.max(leftLines.length, rightLines.length) * 13
      ensureSpace(rowHeight + 10)
      const startY = cursorY
      const leftHeight = fieldLines(left[0], left[1], margin, columnWidth)
      cursorY = startY
      const rightHeight = fieldLines(right[0], right[1], margin + columnWidth + columnGap, columnWidth)
      cursorY = startY - Math.max(leftHeight, rightHeight) - 10
    }

    function drawSingle(label: string, value: unknown) {
      const lines = wrapText(readableValue(value), regularFont, 10, contentWidth)
      const rowHeight = 25 + lines.length * 13
      ensureSpace(rowHeight + 10)
      const height = fieldLines(label, value, margin, contentWidth)
      cursorY -= height + 10
    }

    addPage()
    page.drawText(`Application status: ${safeText(admission.status)}`, {
      x: margin, y: cursorY, size: 9, font: boldFont, color: navy,
    })
    page.drawText(`Submitted: ${admission.submittedAt.toISOString().slice(0, 10)}`, {
      x: pageWidth - margin - 150, y: cursorY, size: 9, font: regularFont, color: muted,
    })
    cursorY -= 33

    drawSection('Student information')
    drawPair(['Applicant name', admission.studentName], ['Date of birth', admission.dateOfBirth.toISOString().slice(0, 10)])
    drawPair(['Gender', admission.gender], ['Nationality', details.studentNationality])
    drawPair(['Student email', storedData.studentEmail], ['National ID', admission.nationalId])
    drawPair(['Applying for grade', admission.applyingForGrade], ['Program', details.programType])
    drawPair(['Previous school', admission.previousSchool], ['Previous grade', admission.previousGrade])

    drawSection('Parent / guardian')
    drawPair(['Parent / guardian name', admission.parentName], ['Relationship', details.parentRelationship])
    drawPair(['Email address', admission.parentEmail], ['Phone number', admission.parentPhone])
    drawSingle('Occupation', admission.parentOccupation)

    drawSection('Address')
    drawSingle('Street / residential address', details.address)
    drawPair(['City', details.city], ['Province', details.province])

    drawSection('Program preferences and additional information')
    drawPair(['Preferred start date', details.preferredStartDate], ['Preferred schedule', details.preferredSchedule])
    drawSingle('Preferred subjects', admission.preferredSubjects)
    drawSingle('Special needs or medical conditions', details.specialNeeds)
    drawSingle('How the family heard about the school', details.howHeard)

    drawSection('Consent and supporting documents')
    drawPair(['Application information confirmed', admission.consentSigned ? 'Yes' : 'No'], ['Photo / video consent', details.agreePhotos ? 'Yes' : 'No'])
    if (attachments.length) {
      attachments.forEach((attachment, index) => drawSingle(`Attachment ${index + 1}`, attachment))
    } else {
      drawSingle('Attachments', 'No supporting documents attached')
    }

    if (admission.notes) {
      drawSection('Review notes')
      drawSingle('Notes', admission.notes)
    }

    pages.forEach((pdfPage, index) => {
      pdfPage.drawLine({ start: { x: margin, y: 38 }, end: { x: pageWidth - margin, y: 38 }, thickness: 0.7, color: gold })
      pdfPage.drawText('Progress Preparatory School  |  Admissions Office', {
        x: margin, y: 23, size: 8, font: regularFont, color: muted,
      })
      pdfPage.drawText(`Page ${index + 1} of ${pages.length}`, {
        x: pageWidth - margin - 64, y: 23, size: 8, font: regularFont, color: muted,
      })
    })

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="PPS-application-${id.slice(0, 8)}.pdf"`,
        'Cache-Control': 'private, no-store',
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
