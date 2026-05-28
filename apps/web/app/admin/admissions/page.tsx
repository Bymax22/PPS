'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminAdmissionsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)

  async function load() {
    try {
      const res = await fetch('/api/admin/admissions?take=50')
      if (!res.ok) return
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {}
  }

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t) }, [])

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
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Admissions Review</h1>
          <div className="flex gap-2">
            <Link href="/admin" className="px-3 py-1 bg-white border rounded">Back</Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded shadow overflow-hidden">
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
                  {items.map(a => (
                    <tr key={a.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(a)}>
                      <td className="p-3">{a.id.slice(0,8)}</td>
                      <td className="p-3">{a.studentName}</td>
                      <td className="p-3">{a.applyingForGrade}</td>
                      <td className="p-3">{a.status}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); changeStatus(a.id, 'UNDER_REVIEW') }} disabled={loading} className="px-2 py-1 bg-yellow-100 rounded">Review</button>
                          <button onClick={(e) => { e.stopPropagation(); changeStatus(a.id, 'APPROVED') }} disabled={loading} className="px-2 py-1 bg-green-100 rounded">Approve</button>
                          <button onClick={(e) => { e.stopPropagation(); changeStatus(a.id, 'REJECTED') }} disabled={loading} className="px-2 py-1 bg-red-100 rounded">Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded shadow p-4 min-h-[200px]">
              {!selected && <p className="text-sm text-gray-500">Select an application to preview details and documents.</p>}
              {selected && (
                <div>
                  <h3 className="font-semibold text-lg">{selected.studentName}</h3>
                  <p className="text-sm text-gray-600">Grade: {selected.applyingForGrade}</p>
                  <p className="text-sm text-gray-600">Status: {selected.status}</p>
                  <div className="mt-3">
                    <h4 className="font-semibold">Documents</h4>
                    <ul className="mt-2 space-y-2">
                      {(selected.documentsUrl || []).map((d: string, i: number) => (
                        <li key={i}><a target="_blank" rel="noreferrer" href={d} className="text-blue-600 underline">{d.split('/').pop() || d}</a></li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => enroll(selected.id)} disabled={loading || selected.status !== 'APPROVED'} className="px-3 py-2 bg-indigo-600 text-white rounded">Create Enrollment</button>
                    <button onClick={() => changeStatus(selected.id, 'REJECTED')} disabled={loading} className="px-3 py-2 bg-red-100 rounded">Reject</button>
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
