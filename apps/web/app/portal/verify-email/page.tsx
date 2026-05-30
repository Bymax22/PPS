'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error')
        setMessage('Missing verification token.')
        return
      }

      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Verification failed')
        }
        setStatus('success')
        setMessage('Your email has been verified. You can now sign in.')
      } catch (err: any) {
        setStatus('error')
        setMessage(err?.message || 'Unable to verify email.')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>
        <p className={`mb-6 ${status === 'success' ? 'text-green-600' : 'text-rose-600'}`}>{message}</p>
        {status === 'success' ? (
          <button onClick={() => router.push('/portal')} className="px-4 py-2 rounded bg-[#003087] text-white">
            Go to portal
          </button>
        ) : (
          <button onClick={() => router.refresh()} className="px-4 py-2 rounded bg-gray-100 text-gray-800">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
