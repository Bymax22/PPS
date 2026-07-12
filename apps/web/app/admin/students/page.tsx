'use client'

import { useEffect, useMemo, useState } from 'react'

type ParentOption = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type ClassOption = {
  id: string
  name: string
}

type StudentRow = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  grade: number
  schoolYear: string | null
  parentName: string | null
  lastUpdated: string
}

function csvEscape(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ''
  const formatted = String(value)
  return formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')
    ? `"${formatted.replace(/"/g, '""')}"`
    : formatted
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [parents, setParents] = useState<ParentOption[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [schoolYear, setSchoolYear] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [assignStudentId, setAssignStudentId] = useState('')
  const [assignClassIds, setAssignClassIds] = useState<string[]>([])
  const [assigningStudent, setAssigningStudent] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/students', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load students')
      const json = await res.json()
      setStudents(json.students ?? [])
      setParents(json.parents ?? [])
      setClasses(json.classes ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(
    () => students.filter((row) => {
      const normalized = `${row.firstName} ${row.lastName} ${row.email} ${row.parentName ?? ''} ${row.grade} ${row.schoolYear ?? ''}`.toLowerCase()
      return normalized.includes(query.toLowerCase())
    }),
    [students, query]
  )

  const exportCsv = () => {
    const csv = [
      ['Student', 'Email', 'Phone', 'Grade', 'School Year', 'Parent', 'Last Updated'],
      ...filteredRows.map((row) => [
        csvEscape(`${row.firstName} ${row.lastName}`),
        csvEscape(row.email),
        csvEscape(row.phone),
        csvEscape(row.grade),
        csvEscape(row.schoolYear),
        csvEscape(row.parentName),
        csvEscape(new Date(row.lastUpdated).toLocaleDateString())
      ])
    ].map((line) => line.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          password,
          grade: Number(grade),
          schoolYear: schoolYear || undefined,
          parentEmail: parentEmail || undefined
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setMessage('Student registered successfully.')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setGrade('')
      setSchoolYear('')
      setParentEmail('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAssignStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAssigningStudent(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/students', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: assignStudentId, classIds: assignClassIds })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Assignment failed')
      setMessage('Student classes updated successfully.')
      setAssignStudentId('')
      setAssignClassIds([])
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assignment failed')
    } finally {
      setAssigningStudent(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div className="space-y-8 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Students</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Student registration</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create student accounts and optionally connect them to a parent.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-700">
            <p className="text-sm font-medium text-slate-900">Live roster</p>
            <p className="mt-2 text-sm">Student records refresh automatically every 5 seconds.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                First name
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Last name
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Email
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Phone
                <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Password
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Grade
                <input value={grade} onChange={(event) => setGrade(event.target.value)} type="number" min="1" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                School year
                <input value={schoolYear} onChange={(event) => setSchoolYear(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Parent email
                <input value={parentEmail} onChange={(event) => setParentEmail(event.target.value)} placeholder="Optional" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button disabled={saving} type="submit" className="inline-flex items-center justify-center rounded-3xl bg-[#003087] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Registering…' : 'Register student'}
              </button>
              <p className="text-sm text-slate-500">Student accounts refresh automatically after creation.</p>
            </div>
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </form>

          <aside className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Parents available</p>
            <div className="mt-4 space-y-2">
              {parents.length ? parents.map((parent) => (
                <div key={parent.id} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <p className="font-medium text-slate-900">{parent.firstName} {parent.lastName}</p>
                  <p className="text-slate-500">{parent.email}</p>
                </div>
              )) : <p className="text-slate-500">No parent accounts found yet.</p>}
            </div>
          </aside>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Existing students</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Assign students to classes</h2>
          <p className="mt-2 text-sm text-slate-600">Choose an existing student and assign them to one or more classes.</p>
        </div>
        <form onSubmit={handleAssignStudent} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-2 text-sm text-slate-700">
            Student
            <select value={assignStudentId} onChange={(event) => setAssignStudentId(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>{student.firstName} {student.lastName}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Classes
            <select multiple value={assignClassIds} onChange={(event) => setAssignClassIds(Array.from(event.target.selectedOptions, (option) => option.value))} className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={assigningStudent || !assignStudentId} className="rounded-3xl bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
            {assigningStudent ? 'Saving…' : 'Save classes'}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Student roster</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">All student accounts</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search students..."
              className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Grade</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">School year</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Parent</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Loading students…</td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.firstName} {row.lastName}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.grade}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.schoolYear ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.parentName ?? 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(row.lastUpdated).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No student records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
