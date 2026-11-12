import { describe, expect, it } from 'vitest'
import { buildAdmissionConfirmationEmail } from './email'

describe('admission confirmation email', () => {
  it('builds a parent-facing confirmation email with the application reference', () => {
    const email = buildAdmissionConfirmationEmail({
      parentName: 'Jane Doe',
      studentName: 'Musa Doe',
      applyingForGrade: 'Grade 7',
      referenceId: 'admission_1234567890',
      appUrl: 'https://progresspreparatoryschools.com',
    })

    expect(email.subject).toContain('Application received')
    expect(email.subject).toContain('APP-')
    expect(email.htmlContent).toContain('Grade 7')
    expect(email.textContent).toContain('Musa Doe')
  })
})
