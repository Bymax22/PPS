export type ApplicationProgramType = 'campus' | 'home' | 'online'

export function buildApplicationFormHref(program: string | null, grade: string | null) {
  const params = new URLSearchParams()

  if (program && ['campus', 'home', 'online'].includes(program)) {
    params.set('program', program)
  }

  if (grade && grade.trim()) {
    params.set('grade', grade.trim())
  }

  const queryString = params.toString()
  return queryString ? `/application-form?${queryString}` : '/application-form'
}

type SearchParamsLike = URLSearchParams | { get: (key: string) => string | null } | null

export function getApplicationSelectionFromSearchParams(searchParams: SearchParamsLike) {
  const programParam = searchParams?.get('program') ?? ''
  const gradeParam = searchParams?.get('grade') ?? ''

  const normalizedProgram: ApplicationProgramType | null =
    programParam === 'campus' || programParam === 'home' || programParam === 'online'
      ? (programParam as ApplicationProgramType)
      : null

  const normalizedGrade = gradeParam.trim() || ''

  return {
    program: normalizedProgram,
    grade: normalizedGrade,
  }
}
