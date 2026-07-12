'use client'

import { useEffect, useMemo, useState } from 'react'

type SessionRow = {
  id: string
  title: string
  className: string
  lessonType: string
  status: string
  program: string
  scheduledAt: string | null
  attendees: number
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

export default function AdminSessionsPage() {
  const [rows, setRows] = useState<SessionRow[]>([])
  const [query, setQuery] = useState('')
  const [classOptions, setClassOptions] = useState<ClassOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [classId, setClassId] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('RECORDED')
  const [status, setStatus] = useState('DRAFT')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState('')
  const [roomId, setRoomId] = useState('')
  const [assignLessonId, setAssignLessonId] = useState('')
  const [assignClassId, setAssignClassId] = useState('')
  const [assigningLesson, setAssigningLesson] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/sessions', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load sessions')
      const json = await res.json()
      setRows(json.sessions ?? [])
      setClasses(json.classes ?? [])
      setClassOptions(json.classes ?? [])
      if (!classId && json.classes?.[0]?.id) setClassId(json.classes[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          classId,
          description: description || undefined,
          type,
          status,
          scheduledAt: scheduledAt || undefined,
          duration: duration ? Number(duration) : undefined,
          roomId: roomId || undefined
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setMessage('Session created successfully.')
      setTitle('')
      setDescription('')
      setType('RECORDED')
      setStatus('DRAFT')
      setScheduledAt('')
      setDuration('')
      setRoomId('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  const filteredRows = useMemo(
    () => rows.filter((row) => {
      const normalized = `${row.title} ${row.className} ${row.lessonType} ${row.status} ${row.program} ${row.attendees}`.toLowerCase()
      return normalized.includes(query.toLowerCase())
    }),
    [rows, query]
  )

  const exportCsv = () => {
    const csv = [
      ['Session', 'Class', 'Program', 'Type', 'Status', 'Attendees', 'Scheduled'],
      ...filteredRows.map((row) => [
        csvEscape(row.title),
        csvEscape(row.className),
        csvEscape(row.program),
        csvEscape(row.lessonType),
        csvEscape(row.status),
        csvEscape(row.attendees),
        csvEscape(row.scheduledAt ? new Date(row.scheduledAt).toLocaleString() : 'TBD')
      ])
    ]
      .map((line) => line.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sessions.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleAssignLesson = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAssigningLesson(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: assignLessonId, classId: assignClassId })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Assignment failed')
      setMessage('Session class updated successfully.')
      setAssignLessonId('')
      setAssignClassId('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assignment failed')
    } finally {
      setAssigningLesson(false)
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
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sessions</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Create session</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Schedule live or recorded lessons for classes.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="space-y-2 text-sm text-slate-700">
              Session title
              <input value={title} onChange={(event) => setTitle(event.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Class
              <select value={classId} onChange={(event) => setClassId(event.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                <option value="">Select class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Type
                <select value={type} onChange={(event) => setType(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                  <option value="LIVE">Live</option>
                  <option value="RECORDED">Recorded</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Status
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
                  <option value="DRAFT">Draft</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="LIVE">Live</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Scheduled date & time
                <input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Duration (minutes)
                <input type="number" min="0" value={duration} onChange={(event) => setDuration(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
              </label>
            </div>
            <label className="space-y-2 text-sm text-slate-700">
              Room ID
              <input value={roomId} onChange={(event) => setRoomId(event.target.value)} placeholder="e.g., Zoom room, Jitsi room" className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900" />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center rounded-3xl bg-[#003087] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Creating…' : 'Create session'}
              </button>
            </div>
            {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
            {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          </form>
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live summary</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Sessions overview</h2>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Total sessions: {rows.length}</div>
            <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">Classes available: {classes.length}</div>
          </div>
        </section>
      </div>

      {error ? <div className="rounded-[2rem] bg-rose-50 p-8 text-rose-700 shadow-[0_24px_60px_rgba(248,113,113,0.15)]">{error}</div> : null}

      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Existing sessions</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Move sessions to another class</h2>
          <p className="mt-2 text-sm text-slate-600">Reassign an existing lesson or session to a different class when the timetable changes.</p>
        </div>
        <form onSubmit={handleAssignLesson} className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-2 text-sm text-slate-700">
            Session
            <select value={assignLessonId} onChange={(event) => setAssignLessonId(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
              <option value="">Select session</option>
              {rows.map((sessionItem) => (
                <option key={sessionItem.id} value={sessionItem.id}>{sessionItem.title}</option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-700">
            Class
            <select value={assignClassId} onChange={(event) => setAssignClassId(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900">
              <option value="">Select class</option>
              {classOptions.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>{classItem.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={assigningLesson || !assignLessonId || !assignClassId} className="rounded-3xl bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
            {assigningLesson ? 'Saving…' : 'Move session'}
          </button>
        </form>
      </section>

      <div className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sessions list</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">All active sessions</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search sessions..."
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Session</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Class</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Program</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Attendees</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Loading sessions…</td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{row.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.className}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.program}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.lessonType}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.attendees}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.scheduledAt ? new Date(row.scheduledAt).toLocaleString() : 'TBD'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No session records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
