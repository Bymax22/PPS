'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setMessage('Password must be at least 8 characters'); return }
    if (password !== confirm) { setMessage('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setMessage('Password reset. You can now sign in.')
      setTimeout(() => router.push('/portal/student/login'), 1200)
    } catch (err: any) {
      setMessage(err?.message || 'Unable to reset password')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-24">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" placeholder="New password" className="w-full p-2 border rounded" />
        <input value={confirm} onChange={(e) => setConfirm(e.target.value)} required type="password" placeholder="Confirm password" className="w-full p-2 border rounded" />
        {message && <p className="text-sm text-gray-600">{message}</p>}
        <div className="flex justify-between items-center">
          <button disabled={loading} className="px-4 py-2 bg-[var(--campus-gold)] rounded">Reset Password</button>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-600">Back</button>
        </div>
      </form>
    </div>
  )
}
