'use client'

import { use, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRealtimeRefresh } from '@/lib/hooks/useRealtimeRefresh'

type AdmissionDocument = { label: string; name: string; url?: string; mimeType?: string }

function getDocumentEntries(value: unknown): AdmissionDocument[] {
  if (typeof value !== 'string' || !value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').map((name) => ({
        label: 'Document',
        name: name.startsWith('https://') ? name.split('/').pop() || name : name,
        url: name.startsWith('https://') ? name : undefined,
        mimeType: undefined,
      }))
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed)
        .filter(([key, document]) => key !== 'studentEmail' && Boolean(document))
        .map(([label, document]) => typeof document === 'object' && document !== null
          ? {
              label,
              name: 'name' in document && typeof document.name === 'string' ? document.name : label,
              url: 'url' in document && typeof document.url === 'string' ? document.url : undefined,
              mimeType: 'mimeType' in document && typeof document.mimeType === 'string' ? document.mimeType : undefined,
            }
          : { label, name: String(document), mimeType: undefined })
    }
  } catch {
    return value.split(',').map((name) => name.trim()).filter(Boolean).map((name) => ({ label: 'Document', name }))
  }
  return []
}

export default function AdmissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [admission, setAdmission] = useState<any | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewDocument, setPreviewDocument] = useState<AdmissionDocument | null>(null)
  const fileRef = useRef<HTMLDivElement | null>(null)
  const documentEntries = getDocumentEntries(admission?.documentsMediaIds)

  async function load() {
    const [resA, resC] = await Promise.all([
      fetch(`/api/admissions/${id}`),
      fetch(`/api/admin/admissions/${id}/comments`)
    ])
    if (resA.ok) setAdmission(await resA.json())
    if (resC.ok) setComments(await resC.json())
  }

  useRealtimeRefresh(load)

  useEffect(() => { load() }, [id])

  async function postComment() {
    if (!text.trim()) return
    setLoading(true)
    const res = await fetch(`/api/admin/admissions/${id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    if (res.ok) { setText(''); await load() }
    else alert('Failed to post')
    setLoading(false)
  }

  async function updateStatus(status: 'APPROVED' | 'REJECTED') {
    setError(null)
    const response = await fetch(`/api/admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      const result = await response.json().catch(() => ({}))
      setError(result.error || 'Failed to update application status')
      return
    }
    await load()
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
                  {documentEntries.length ? documentEntries.map((document, index) => (
                    <div key={`${document.label}-${index}`} className="border rounded p-2 text-sm">
                      <span className="font-medium">{document.label}: </span>
                      {document.url ? (
                        <div className="mt-2 flex flex-wrap gap-3">
                          {document.mimeType === 'application/pdf' || document.mimeType?.startsWith('image/') ? (
                            <button type="button" onClick={() => setPreviewDocument(document)} className="text-blue-600 underline">Preview</button>
                          ) : null}
                          <a href={document.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open / download</a>
                        </div>
                      ) : <span>{document.name} (filename only)</span>}
                    </div>
                  )) : <p className="text-sm text-gray-500">No document details were submitted.</p>}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="bg-white rounded shadow p-4">
                <h4 className="font-semibold">Status</h4>
                <p className="mt-2">{admission.status}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => void updateStatus('APPROVED')} className="px-3 py-2 bg-green-100 rounded">Approve</button>
                  <button onClick={() => void updateStatus('REJECTED')} className="px-3 py-2 bg-red-100 rounded">Reject</button>
                </div>
                {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <div className="bg-white rounded shadow p-4">
                <h4 className="font-semibold">Comments</h4>
                <div className="mt-3 space-y-3 max-h-64 overflow-auto">
                  {comments.map((c) => (
                    <div key={c.id} className="border rounded p-2">
                      <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
                      <div className="mt-1 text-sm">{c.body ?? c.message ?? c.text ?? 'Comment'}</div>
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
      {previewDocument?.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label={`${previewDocument.label} preview`}>
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="font-semibold">{previewDocument.name}</h2>
              <button type="button" onClick={() => setPreviewDocument(null)} className="rounded border px-3 py-1 text-sm">Close</button>
            </div>
            <div className="min-h-0 flex-1 bg-gray-100">
              {previewDocument.mimeType?.startsWith('image/') ? (
                <img src={previewDocument.url} alt={previewDocument.name} className="h-full w-full object-contain" />
              ) : (
                <iframe src={previewDocument.url} title={previewDocument.name} className="h-full w-full" />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
