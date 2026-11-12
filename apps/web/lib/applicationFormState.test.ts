import { describe, expect, it } from 'vitest'
import {
  buildApplicationFormHref,
  getApplicationSelectionFromSearchParams,
} from './applicationFormState'

describe('application form state handoff', () => {
  it('serializes the selected program and grade into a url', () => {
    expect(buildApplicationFormHref('campus', 'Grade 7')).toBe('/application-form?program=campus&grade=Grade+7')
  })

  it('reads the selected program and grade back from query params', () => {
    const params = new URLSearchParams('program=campus&grade=Grade+7')

    expect(getApplicationSelectionFromSearchParams(params)).toEqual({
      program: 'campus',
      grade: 'Grade 7',
    })
  })
})
