'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type AdmissionItem = {
  id: string
  studentName: string
  parentName?: string
  parentEmail?: string
  parentPhone?: string
  applyingForGrade?: number | string | null
  status: string
  notes?: string | null
  documentsMediaIds?: string | null
  documentsUrl?: string[] | null
  consentSigned?: boolean
  submittedAt?: string
}

function parseDocuments(value?: string | null) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.filter(Boolean)
  } catch {
    // fall back to comma-separated values
  }
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

export default function AdminAdmissionsPage() {
  const [items, setItems] = useState<AdmissionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<AdmissionItem | null>(null)

  const stats = useMemo(() => {
    const counts = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1
      return acc
    }, {})

    return [
      { label: 'Total', value: items.length },
      { label: 'Under review', value: counts.UNDER_REVIEW ?? 0 },
      { label: 'Approved', value: counts.APPROVED ?? 0 },
      { label: 'Enrolled', value: counts.ENROLLED ?? 0 }
    ]
  }, [items])

  async function load() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/admissions?take=50', { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      const nextItems = (data.items || []) as AdmissionItem[]
      setItems(nextItems)
      if (!selected && nextItems[0]) setSelected(nextItems[0])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load(); const t = setInterval(() => { void load() }, 5000); return () => clearInterval(t) }, [])

  async function changeStatus(id: string, status: string) {
    setLoading(true)
    await fetch(`/api/admissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    await load()
    setLoading(false)
  }

  async function enroll(id: string) {
    setLoading(true)
    const res = await fetch(`/api/admin/admissions/${id}/enroll`, { method: 'POST' })
    const data = await res.json()
    if (!res.ok) alert(data.error || 'Enroll failed')
    else alert('Enrollment created')
    await load()
    setLoading(false)
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Admissions Review</h1>
            <p className="mt-1 text-sm text-gray-600">Monitor applications, review supporting documents, and convert approved applicants into enrollments.</p>
          </div>
          <Link href="/admin" className="rounded border border-gray-200 bg-white px-3 py-2 text-sm">Back</Link>
        </header>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((application) => (
                    <tr key={application.id} className="cursor-pointer border-t hover:bg-gray-50" onClick={() => setSelected(application)}>
                      <td className="p-3">{application.id.slice(0, 8)}</td>
                      <td className="p-3">{application.studentName}</td>
                      <td className="p-3">{application.applyingForGrade ?? '—'}</td>
                      <td className="p-3">{application.status}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={(e) => { e.stopPropagation(); void changeStatus(application.id, 'UNDER_REVIEW') }} disabled={loading} className="rounded bg-yellow-100 px-2 py-1 text-sm">Review</button>
                          <button onClick={(e) => { e.stopPropagation(); void changeStatus(application.id, 'APPROVED') }} disabled={loading} className="rounded bg-green-100 px-2 py-1 text-sm">Approve</button>
                          <button onClick={(e) => { e.stopPropagation(); void changeStatus(application.id, 'REJECTED') }} disabled={loading} className="rounded bg-red-100 px-2 py-1 text-sm">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="min-h-[240px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              {!selected && <p className="text-sm text-gray-500">Select an application to preview details and documents.</p>}
              {selected && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selected.studentName}</h3>
                  <p className="mt-1 text-sm text-gray-600">Grade: {selected.applyingForGrade ?? '—'}</p>
                  <p className="text-sm text-gray-600">Status: {selected.status}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    {selected.parentName ? <p>Parent: {selected.parentName}</p> : null}
                    {selected.parentEmail ? <p>Email: {selected.parentEmail}</p> : null}
                    {selected.parentPhone ? <p>Phone: {selected.parentPhone}</p> : null}
                    {selected.notes ? <p>Notes: {selected.notes}</p> : null}
                    <p>Consent signed: {selected.consentSigned ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">Documents</h4>
                    <ul className="mt-2 space-y-2">
                      {(() => {
                        const documents = parseDocuments(selected.documentsMediaIds || (selected.documentsUrl ? JSON.stringify(selected.documentsUrl) : null))
                        return documents.length ? documents.map((document, index) => (
                          <li key={`${document}-${index}`}>
                            <a target="_blank" rel="noreferrer" href={document} className="text-sm text-blue-600 underline">{document.split('/').pop() || document}</a>
                          </li>
                        )) : <li className="text-sm text-gray-500">No documents attached yet.</li>
                      })()}
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => void enroll(selected.id)} disabled={loading || selected.status !== 'APPROVED'} className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Create Enrollment</button>
                    <button onClick={() => void changeStatus(selected.id, 'REJECTED')} disabled={loading} className="rounded bg-red-100 px-3 py-2 text-sm">Reject</button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
