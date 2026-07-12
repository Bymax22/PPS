'use client'

import { useEffect, useMemo, useState } from 'react'

type TeacherRow = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  classes: string
  lastUpdated: string
}

type ClassOption = {
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

export default function AdminTeachersPage() {
  const [rows, setRows] = useState<TeacherRow[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [qualifications, setQualifications] = useState('')
  const [specialties, setSpecialties] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [assignTeacherId, setAssignTeacherId] = useState('')
  const [assignClassIds, setAssignClassIds] = useState<string[]>([])
  const [assigningTeacher, setAssigningTeacher] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/teachers', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load teachers')
      const json = await res.json()
      setRows(json.teachers ?? [])
      setClasses(json.classes ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(
    () => rows.filter((row) => {
      const normalized = `${row.name} ${row.email} ${row.phone ?? ''} ${row.subject ?? ''} ${row.classes}`.toLowerCase()
      return normalized.includes(query.toLowerCase())
    }),
    [rows, query]
  )

  const exportCsv = () => {
    const csv = [
      ['Teacher', 'Email', 'Phone', 'Subject', 'Classes', 'Last Updated'],
      ...filteredRows.map((row) => [
        csvEscape(row.name),
        csvEscape(row.email),
        csvEscape(row.phone),
        csvEscape(row.subject),
        csvEscape(row.classes),
        csvEscape(new Date(row.lastUpdated).toLocaleDateString())
      ])
    ]
      .map((line) => line.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teachers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          password,
          qualifications: qualifications || undefined,
          specialties: specialties || undefined,
          hourlyRate: hourlyRate ? Number(hourlyRate) : undefined
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setMessage('Teacher registered successfully.')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setPassword('')
      setQualifications('')
      setSpecialties('')
      setHourlyRate('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  const handleAssignTeacher = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAssigningTeacher(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/teachers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: assignTeacherId, classIds: assignClassIds })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Assignment failed')
      setMessage('Teacher classes updated successfully.')
      setAssignTeacherId('')
      setAssignClassIds([])
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assignment failed')
    } finally {
      setAssigningTeacher(false)
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
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teachers</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Teacher registration</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create teacher accounts with qualifications and specialties.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                First name
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Last name
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-700">
              Email address
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Phone number
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Min 8 characters" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Qualifications
                <input value={qualifications} onChange={(event) => setQualifications(event.target.value)} placeholder="e.g., B.Ed, M.Sc" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Specialties
                <input value={specialties} onChange={(event) => setSpecialties(event.target.value)} placeholder="e.g., Math, Physics" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-700">
              Hourly rate (USD)
              <input type="number" min="0" step="0.01" value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-3xl bg-[#003087] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Registering…' : 'Register teacher'}
              </button>
            </div>
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </form>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Teachers overview</h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Total teachers: {rows.length}</div>
          </div>
        </section>
      </div>

      {error ? <div className="rounded-[2rem] bg-rose-50 p-8 text-rose-700 shadow-[0_24px_60px_rgba(248,113,113,0.15)]">{error}</div> : null}

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Existing teachers</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Assign teachers to classes</h2>
          <p className="mt-2 text-sm text-slate-600">Choose an existing teacher and attach them to one or more classes.</p>
        </div>
        <form onSubmit={handleAssignTeacher} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-2 text-sm text-slate-700">
            Teacher
            <select value={assignTeacherId} onChange={(event) => setAssignTeacherId(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
              <option value="">Select teacher</option>
              {rows.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
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
          <button type="submit" disabled={assigningTeacher || !assignTeacherId} className="rounded-3xl bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
            {assigningTeacher ? 'Saving…' : 'Save classes'}
          </button>
        </form>
      </section>

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teachers list</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">All teacher accounts</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search teachers..."
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Teacher</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Phone</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subject</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Classes</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Loading teachers…</td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.phone ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.subject ?? 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.classes}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(row.lastUpdated).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No teacher accounts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
