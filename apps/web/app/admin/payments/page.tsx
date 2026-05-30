'use client'

import { useEffect, useMemo, useState } from 'react'

type PaymentRow = {
  id: string
  date: string
  payer: string
  email: string
  amount: number
  currency: string
  status: string
  subscription: string | null
}

function csvEscape(value: string | number | null | undefined) {
  if (value === null || value === undefined) return ''
  const formatted = String(value)
  return formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')
    ? `"${formatted.replace(/"/g, '""')}"`
    : formatted
}

export default function AdminPaymentsPage() {
  const [rows, setRows] = useState<PaymentRow[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/payments', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load payments')
      const json = await res.json()
      setRows(json.payments ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }

  const filteredRows = useMemo(
    () => rows.filter((row) => {
      const normalized = `${row.payer} ${row.email} ${row.status} ${row.subscription ?? ''} ${row.amount} ${row.currency}`.toLowerCase()
      return normalized.includes(query.toLowerCase())
    }),
    [rows, query]
  )

  const exportCsv = () => {
    const csv = [
      ['Date', 'Payer', 'Email', 'Amount', 'Currency', 'Status', 'Subscription'],
      ...filteredRows.map((row) => [
        csvEscape(new Date(row.date).toLocaleDateString()),
        csvEscape(row.payer),
        csvEscape(row.email),
        csvEscape(row.amount),
        csvEscape(row.currency),
        csvEscape(row.status),
        csvEscape(row.subscription)
      ])
    ]
      .map((line) => line.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payments.csv'
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
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Payments</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Payment transactions</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Track recent payments, status, and subscription activity.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <div className="w-full sm:w-auto">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search payments..."
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
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Payer</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subscription</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Loading payments…</td>
              </tr>
            ) : filteredRows.length ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.payer}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{row.currency.toUpperCase()} {row.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.status}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{row.subscription ?? 'One-time'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">No payment records available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
