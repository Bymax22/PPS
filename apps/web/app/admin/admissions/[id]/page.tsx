'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

export default function AdmissionDetail({ params }: { params: { id: string } }) {
  const { id } = params
  const [admission, setAdmission] = useState<any | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLDivElement | null>(null)

  async function load() {
    const [resA, resC] = await Promise.all([
      fetch(`/api/admissions/${id}`),
      fetch(`/api/admin/admissions/${id}/comments`)
    ])
    if (resA.ok) setAdmission(await resA.json())
    if (resC.ok) setComments(await resC.json())
  }

  useEffect(() => { load() }, [id])

  async function postComment() {
    if (!text.trim()) return
    setLoading(true)
    const res = await fetch(`/api/admin/admissions/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    if (res.ok) { setText(''); await load() }
    else alert('Failed to post')
    setLoading(false)
  }

  return (
    <main className="p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Application Detail</h1>
          <Link href="/admin/admissions" className="px-3 py-1 bg-white border rounded">Back</Link>
        </header>

        {!admission && <div className="p-6 bg-white rounded shadow">Loading...</div>}

        {admission && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded shadow p-4">
                <h2 className="font-semibold text-lg">{admission.studentName}</h2>
                <p className="text-sm text-gray-600">Applied for: {admission.applyingForGrade}</p>
                <p className="mt-2 text-sm text-gray-700">{admission.personalStatement}</p>
              </div>

              <div className="bg-white rounded shadow p-4">
                <h3 className="font-semibold">Documents</h3>
                <div ref={fileRef} className="mt-3 space-y-3">
                  {(admission.documentsUrl || []).map((u: string, i: number) => (
                    <div key={i} className="border rounded p-2">
                      {u.endsWith('.pdf') ? (
                        <iframe src={u} className="w-full h-96" title={`doc-${i}`} />
                      ) : (
                        <img src={u} alt={`doc-${i}`} className="max-h-96 object-contain w-full" />
                      )}
                      <a href={u} target="_blank" rel="noreferrer" className="text-xs text-blue-600 mt-2 inline-block">Open in new tab</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white rounded shadow p-4">
                <h4 className="font-semibold">Status</h4>
                <p className="mt-2">{admission.status}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => fetch(`/api/admissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'APPROVED' }) }).then(load)} className="px-3 py-2 bg-green-100 rounded">Approve</button>
                  <button onClick={() => fetch(`/api/admissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'REJECTED' }) }).then(load)} className="px-3 py-2 bg-red-100 rounded">Reject</button>
                </div>
              </div>

              <div className="bg-white rounded shadow p-4">
                <h4 className="font-semibold">Comments</h4>
                <div className="mt-3 space-y-3 max-h-64 overflow-auto">
                  {comments.map(c => (
                    <div key={c.id} className="border rounded p-2">
                      <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                      <div className="mt-1 text-sm">{c.text}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border rounded p-2" rows={3} />
                  <div className="mt-2 flex gap-2">
                    <button onClick={postComment} disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">Post Comment</button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
