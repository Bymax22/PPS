'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Message {
  id: string
  sender: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  subject?: string | null
  body: string
  type: string
  read: boolean
  createdAt: string
}

export default function TeacherMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [receiverId, setReceiverId] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/teacher/messages')
      if (!res.ok) throw new Error('Unable to load messages')
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load messages')
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage() {
    if (!receiverId || !body) {
      setError('Please add a recipient and message body.')
      return
    }

    setSending(true)
    setError(null)
    setSuccess('')

    try {
      const res = await fetch('/api/teacher/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId, subject, body, type: 'DIRECT_MESSAGE' })
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Unable to send message')
      }
      setSuccess('Message sent successfully.')
      setReceiverId('')
      setSubject('')
      setBody('')
      await fetchMessages()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[112px] lg:pt-[120px]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teacher messages</p>
            <h1 className="text-3xl font-semibold text-slate-900">Messages</h1>
          </div>
          <Link
            href="/teacher"
            className="inline-flex items-center rounded-full bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Inbox</h2>
                  <p className="text-sm text-slate-500">Latest messages sent to your account.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{messages.length} messages</span>
              </div>

              {loading ? (
                <p className="mt-6 text-slate-500">Loading messages…</p>
              ) : error ? (
                <p className="mt-6 text-sm text-red-600">{error}</p>
              ) : !messages.length ? (
                <p className="mt-6 text-slate-500">No messages yet.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="rounded-3xl border border-gray-200 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{message.subject || 'No subject'}</p>
                          <p className="text-sm text-slate-500">
                            From {message.sender.firstName || ''} {message.sender.lastName || ''} ({message.sender.email})
                          </p>
                        </div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{new Date(message.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">{message.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Compose message</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Recipient ID</label>
                  <input
                    value={receiverId}
                    onChange={(event) => setReceiverId(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                    placeholder="Paste the recipient user ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Subject</label>
                  <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                    placeholder="Message subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
                    placeholder="Write your message here"
                  />
                </div>

                {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

                <button
                  type="button"
                  disabled={sending}
                  onClick={sendMessage}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
