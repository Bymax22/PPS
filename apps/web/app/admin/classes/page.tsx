'use client'

import { useEffect, useMemo, useState } from 'react'

type ClassRow = {
  id: string
  name: string
  grade: number | null
  subject: string | null
  capacity: number
  programName: string
  enrolledCount: number
  teachers: string[]
}

type ProgramOption = {
  id: string
  name: string
}

type SubjectOption = {
  id: string
  name: string
}

function csvEscape(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ''
  const formatted = String(value)
  return formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')
    ? `"${formatted.replace(/"/g, '""')}"`
    : formatted
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [programId, setProgramId] = useState('')
  const [grade, setGrade] = useState('')
  const [subject, setSubject] = useState('')
  const [capacity, setCapacity] = useState('30')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/classes', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load classes')
      const json = await res.json()
      setClasses(json.classes ?? [])
      setPrograms(json.programs ?? [])
      setSubjects(json.subjects ?? [])
      if (!programId && json.programs?.[0]?.id) setProgramId(json.programs[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(
    () => classes.filter((row) => {
      const normalized = `${row.name} ${row.subject ?? ''} ${row.programName} ${row.teachers.join(' ')} ${row.enrolledCount}`.toLowerCase()
      return normalized.includes(query.toLowerCase())
    }),
    [classes, query]
  )

  const exportCsv = () => {
    const csv = [
      ['Class', 'Program', 'Grade', 'Subject', 'Capacity', 'Enrolled', 'Teachers'],
      ...filteredRows.map((row) => [
        csvEscape(row.name),
        csvEscape(row.programName),
        csvEscape(row.grade),
        csvEscape(row.subject),
        csvEscape(row.capacity),
        csvEscape(row.enrolledCount),
        csvEscape(row.teachers.join(', '))
      ])
    ].map((line) => line.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'classes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, programId, grade: grade ? Number(grade) : undefined, subject: subject || undefined, capacity: Number(capacity) })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setMessage('Class created successfully.')
      setName('')
      setGrade('')
      setSubject('')
      setCapacity('30')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-8 py-10">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Classes</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Class management</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create and monitor class sections that link programs, grades, subjects, and teachers.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Class name
                <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Program
                <select value={programId} onChange={(event) => setProgramId(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>{program.name}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-700">
                Grade
                <input value={grade} onChange={(event) => setGrade(event.target.value)} type="number" min="1" placeholder="Grade" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Subject
                <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject name" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Capacity
                <input value={capacity} onChange={(event) => setCapacity(event.target.value)} type="number" min="1" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            {subjects.length ? (
              <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                Common subjects: {subjects.map((subjectItem) => subjectItem.name).join(', ')}
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-3xl bg-[#003087] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Creating…' : 'Create class'}
              </button>
              <div className="text-sm text-slate-500">New classes refresh automatically after creation.</div>
            </div>
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </form>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Classes overview</h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Total classes: {classes.length}</div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Programs available: {programs.length}</div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Tracked subjects: {subjects.length}</div>
          </div>
        </section>
      </div>

      {error ? <div className="rounded-[2rem] bg-rose-50 p-8 text-rose-700 shadow-[0_24px_60px_rgba(248,113,113,0.15)]">{error}</div> : null}

      <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Class list</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">All active classes</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search classes..."
              className="w-full min-w-[220px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
            />
            <button onClick={load} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Refresh
            </button>
            <button onClick={exportCsv} className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Class</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Program</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Grade</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subject</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Capacity</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Enrolled</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Teachers</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">Loading classes…</td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.programName}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.grade ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.subject ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.capacity}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.enrolledCount}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.teachers.join(', ') || 'Unassigned'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">No classes available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
