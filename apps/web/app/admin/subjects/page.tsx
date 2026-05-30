'use client'

import { useEffect, useState } from 'react'

type SubjectRow = {
  id: string
  name: string
  createdAt: string
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/subjects', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load subjects')
      const json = await res.json()
      setSubjects(json.subjects ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = subjects.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))

  const exportCsv = () => {
    const csv = [
      ['Subject', 'Created At'],
      ...filteredRows.map((row) => [`"${row.name.replace(/"/g, '""')}"`, row.createdAt])
    ].map((line) => line.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subjects.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Create failed')
      setMessage('Subject created successfully.')
      setName('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    load()
    const timer = window.setInterval(load, 5000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8 py-10">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Subjects</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Subject catalog</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Add and review the full list of subjects available for classes and lessons.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-700">
            <p className="text-sm font-medium text-slate-900">Live update</p>
            <p className="mt-2 text-sm">This page refreshes every 5 seconds so new subjects appear immediately.</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          <label className="space-y-2 text-sm text-slate-700">
            Subject name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="New subject"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            />
          </label>
          <div className="flex items-end justify-between gap-3">
            <button type="submit" disabled={saving} className="w-full rounded-3xl bg-[#003087] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00256e] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? 'Saving…' : 'Add subject'}
            </button>
            <button type="button" onClick={exportCsv} className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Export CSV
            </button>
          </div>
        </form>
        {message ? <p className="mt-4 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-700">{error}</p> : null}
      </section>

      <section className="rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Subject list</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Available subjects</h2>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search subjects..."
            className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subject</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">Loading subjects…</td>
                </tr>
              ) : filteredRows.length ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{row.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(row.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">No subjects added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
