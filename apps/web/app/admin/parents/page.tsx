'use client'

import { useEffect, useMemo, useState } from 'react'

type ParentRow = {
  id: string
  name: string
  email: string
  phone: string | null
  subscription: string
  childrenCount: number
  lastUpdated: string
}

function csvEscape(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ''
  const formatted = String(value)
  return formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')
    ? `"${formatted.replace(/"/g, '""')}"`
    : formatted
}

export default function AdminParentsPage() {
  const [rows, setRows] = useState<ParentRow[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/parents', { cache: 'no-store' })
      if (!res.ok) throw new Error('Unable to load parents')
      const json = await res.json()
      setRows(json.parents ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(
    () => rows.filter((row) => {
      const normalized = `${row.name} ${row.email} ${row.phone ?? ''} ${row.subscription} ${row.childrenCount}`.toLowerCase()
      return normalized.includes(query.toLowerCase())
    }),
    [rows, query]
  )

  const exportCsv = () => {
    const csv = [
      ['Parent', 'Email', 'Phone', 'Children', 'Subscription', 'Last Updated'],
      ...filteredRows.map((row) => [
        csvEscape(row.name),
        csvEscape(row.email),
        csvEscape(row.phone),
        csvEscape(row.childrenCount),
        csvEscape(row.subscription),
        csvEscape(new Date(row.lastUpdated).toLocaleDateString())
      ])
    ]
      .map((line) => line.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'parents.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    load()
    const timer = window.setInterval(load, 5000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8 py-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Parents</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Parent accounts</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">See guardian contact details, family size, and subscription status.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="w-full sm:w-auto">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search parents..."
                className="w-full min-w-[220px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={load} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Refresh
              </button>
              <button onClick={exportCsv} className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-[2rem] bg-rose-50 p-8 text-rose-700 shadow-[0_24px_60px_rgba(248,113,113,0.15)]">{error}</div> : null}

      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <table className="min-w-full border-separate border-spacing-0 text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Parent</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Phone</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Children</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subscription</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Loading parents…</td>
              </tr>
            ) : filteredRows.length ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.phone ?? 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.childrenCount}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.subscription}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(row.lastUpdated).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No parent accounts available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
