import { describe, it, expect } from 'vitest'
import {
  parseValidation,
  adminStudentPayloadSchema,
  adminTeacherPayloadSchema,
  adminNotificationPayloadSchema,
  adminSessionPayloadSchema,
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

  it('validates class update payloads', () => {
    const result = parseValidation(adminClassUpdatePayloadSchema, {
      classId: 'clz1234567890abcdef123456',
      capacity: '25',
      grade: '4',
      teacherIds: ['tch1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.grade).toBe(4)
      expect(result.data.capacity).toBe(25)
    }
  })

  it('validates teacher update payloads', () => {
    const result = parseValidation(adminTeacherUpdatePayloadSchema, {
      teacherId: 'tch1234567890abcdef123456',
      classIds: ['clz1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
  })

  it('validates student update payloads', () => {
    const result = parseValidation(adminStudentUpdatePayloadSchema, {
      studentId: 'std1234567890abcdef123456',
      classIds: ['clz1234567890abcdef123456']
    })

    expect(result.ok).toBe(true)
  })

  it('validates session reassign payloads', () => {
    const result = parseValidation(adminSessionReassignPayloadSchema, {
      lessonId: 'les1234567890abcdef123456',
      classId: 'clz1234567890abcdef123456'
    })

    expect(result.ok).toBe(true)
  })
})
