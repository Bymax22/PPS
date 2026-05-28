'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setMessage('If this email exists we sent password reset instructions.')
    } catch (err: any) {
      setMessage(err?.message || 'Unable to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-24">
      <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="Enter your email" className="w-full p-2 border rounded" />
        {message && <p className="text-sm text-gray-600">{message}</p>}
        <div className="flex justify-between items-center">
          <button disabled={loading} className="px-4 py-2 bg-[var(--campus-gold)] rounded">Send Reset Link</button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-600">Back</button>
        </div>
      </form>
    </div>
  )
}
