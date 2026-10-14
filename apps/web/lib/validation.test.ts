import { describe, it, expect } from 'vitest'
import {
  parseValidation,
  adminStudentPayloadSchema,
  adminTeacherPayloadSchema,
  adminNotificationPayloadSchema,
  adminSessionPayloadSchema,
  adminClassPayloadSchema,
  adminClassUpdatePayloadSchema,
  adminTeacherUpdatePayloadSchema,
  adminStudentUpdatePayloadSchema,
  adminSessionReassignPayloadSchema
} from './validation'

describe('admin validation helpers', () => {
  it('accepts valid student payloads', () => {
    const result = parseValidation(adminStudentPayloadSchema, {
      firstName: 'Amina',
      lastName: 'Banda',
      email: 'amina@example.com',
      password: 'securepass123',
      grade: '3',
      classIds: ['clz1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.grade).toBe(3)
    }
  })

  it('rejects invalid teacher payloads', () => {
    const result = parseValidation(adminTeacherPayloadSchema, {
      firstName: 'A',
      lastName: 'B',
      email: 'bad-email',
      password: 'short'
    })

    expect(result.ok).toBe(false)
  })

  it('validates notification payloads', () => {
    const result = parseValidation(adminNotificationPayloadSchema, {
      subject: 'School update',
      body: 'A message for parents',
      targetType: 'ALL'
    })

    expect(result.ok).toBe(true)
  })

  it('validates session payloads', () => {
    const result = parseValidation(adminSessionPayloadSchema, {
      title: 'Math revision',
      classId: 'clz1234567890abcdef123456',
      type: 'LIVE',
      status: 'SCHEDULED'
    })

    expect(result.ok).toBe(true)
  })

  it('validates class creation details and positive grades', () => {
    expect(parseValidation(adminClassPayloadSchema, {
      name: 'Grade 4 Math',
      programId: 'clz1234567890abcdef123456',
      grade: 4,
      subject: 'Math',
      capacity: 25
    }).ok).toBe(true)

    expect(parseValidation(adminClassPayloadSchema, {
      name: 'Grade 4 Math',
      programId: 'clz1234567890abcdef123456',
      grade: 0
    }).ok).toBe(false)
  })

  it('validates class update payloads', () => {
    const result = parseValidation(adminClassUpdatePayloadSchema, {
      classId: 'clz1234567890abcdef123456',
      capacity: '25',
      grade: '4',
      teacherIds: ['ctc1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.grade).toBe(4)
      expect(result.data.capacity).toBe(25)
    }
  })

  it('allows clearing a class grade and rejects invalid or duplicate teacher assignments', () => {
    expect(parseValidation(adminClassUpdatePayloadSchema, {
      classId: 'clz1234567890abcdef123456',
      grade: null,
      subject: '',
      teacherIds: []
    }).ok).toBe(true)

    expect(parseValidation(adminClassUpdatePayloadSchema, {
      classId: 'clz1234567890abcdef123456',
      grade: '0'
    }).ok).toBe(false)

    expect(parseValidation(adminClassUpdatePayloadSchema, {
      classId: 'clz1234567890abcdef123456',
      teacherIds: ['ctc1234567890abcdef123456', 'ctc1234567890abcdef123456']
    }).ok).toBe(false)
  })

  it('validates teacher update payloads', () => {
    const result = parseValidation(adminTeacherUpdatePayloadSchema, {
      teacherId: 'ctc1234567890abcdef123456',
      classIds: ['clz1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
  })

  it('validates student update payloads', () => {
    const result = parseValidation(adminStudentUpdatePayloadSchema, {
      studentId: 'cst1234567890abcdef123456',
      classIds: ['clz1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
  })

  it('validates session reassign payloads', () => {
    const result = parseValidation(adminSessionReassignPayloadSchema, {
      lessonId: 'cls1234567890abcdef123456',
      classId: 'clz1234567890abcdef123456'
    })

    expect(result.ok).toBe(true)
  })
})
