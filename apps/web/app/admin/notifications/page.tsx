'use client'

import { useEffect, useMemo, useState } from 'react'

type NoticeLog = {
  id: string
  createdAt: string
  title: string
  body: string
  type: string
  recipients: number
  sentToEmail: boolean
}

const targetOptions = [
  { value: 'ALL', label: 'All users' },
  { value: 'INDIVIDUAL', label: 'Individual emails / IDs' },
  { value: 'CLASS', label: 'Class name or ID' },
  { value: 'SESSION', label: 'Session title or ID' },
  { value: 'GRADE', label: 'Grade number' }
] as const

type TargetType = (typeof targetOptions)[number]['value']

export default function AdminNotificationsPage() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [targetType, setTargetType] = useState<TargetType>('ALL')
  const [targetValue, setTargetValue] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<NoticeLog[]>([])
  const [refreshing, setRefreshing] = useState(true)

  const loadLogs = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/admin/notifications', { cache: 'no-store', credentials: 'include' })
      if (!res.ok) throw new Error('Unable to load logs')
      const json = await res.json()
      setLogs(json.notifications ?? [])
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Failed to load logs')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const sendNotice = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body, targetType, targetValue, sendEmail })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to send notice')
      setStatus(`Notice delivered to ${json.sentCount} recipients.`)
      setSubject('')
      setBody('')
      setTargetValue('')
      await loadLogs()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setLoading(false)
    }
  }

  const preview = useMemo(
    () => `${subject || 'Subject preview'}\n\n${body || 'Message preview appears here.'}`,
    [subject, body]
  )

  return (
    <div className="space-y-8 py-10">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Notifications</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Create and send real-time notices</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Send announcements to all users, specific individuals, a class, session, or grade.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Target</span>
                <select
                  value={targetType}
                  onChange={(event) => setTargetType(event.target.value as TargetType)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                >
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Target details</span>
                <input
                  value={targetValue}
                  onChange={(event) => setTargetValue(event.target.value)}
                  placeholder={
                    targetType === 'ALL'
                      ? 'No value needed'
                      : targetType === 'INDIVIDUAL'
                      ? 'Email addresses or IDs, comma-separated'
                      : targetType === 'CLASS'
                      ? 'Class name or ID'
                      : targetType === 'SESSION'
                      ? 'Session title or ID'
                      : 'Grade number'
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block col-span-2">
                <span className="text-sm font-semibold text-slate-700">Subject</span>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="Enter a short subject"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Message body</span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={8}
                placeholder="Write the notice content here."
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900"
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={sendEmail} onChange={(event) => setSendEmail(event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-slate-900" />
                Send as email as well
              </label>
              <button
                onClick={sendNotice}
                disabled={loading || !body || !subject}
                className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Sending…' : 'Send notice'}
              </button>
            </div>

            {status ? <p className="text-sm text-slate-600">{status}</p> : null}
          </div>

          <aside className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
            <h2 className="text-xl font-semibold">Live notice preview</h2>
            <div className="mt-6 whitespace-pre-wrap rounded-3xl bg-slate-900 p-6 text-sm leading-6 text-slate-300">
              {preview}
            </div>
            <div className="mt-8 space-y-4 text-sm text-slate-400">
              <p>Use target filters to address specific groups.</p>
              <p>The notice will create records for delivery and recording in the platform.</p>
              <p>Enable email to send the same notice to recipient inboxes via Brevo.</p>
            </div>
          </aside>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sent notices</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent notification history</h2>
          </div>
          <button onClick={loadLogs} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            {refreshing ? 'Refreshing…' : 'Refresh logs'}
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Sent</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subject</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Recipients</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {logs.length ? (
                logs.map((log) => (
                  <tr key={log.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{log.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{log.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{log.recipients}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{log.sentToEmail ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">No notices sent yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
