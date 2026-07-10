'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'

function getDashboardPath(role?: string | null) {
  switch (role) {
    case 'TEACHER':
      return '/teacher'
    case 'PARENT':
      return '/parent'
    case 'ADMIN':
      return '/admin'
    default:
      return '/student'
  }
}

interface VerifyEmailClientProps {
  token: string | null
  email: string | null
  firstName?: string | null
  lastName?: string | null
}

export default function VerifyEmailClient({ token: initialToken, email: initialEmail, firstName, lastName }: VerifyEmailClientProps) {
  const router = useRouter()
  const token = initialToken
  const email = initialEmail
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'waiting'>('loading')
  const [message, setMessage] = useState('Verifying your email...')
  const [resending, setResending] = useState(false)
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim()

  async function handleResend() {
    if (!email) return

    setResending(true)
    try {
      const res = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Unable to resend verification email')
      }

      setStatus('waiting')
      setMessage(`A fresh verification email has been sent to ${email}. Please check your inbox or spam folder.`)
    } catch (err: any) {
      setStatus('waiting')
      setMessage(err?.message || 'Unable to resend verification email. Please try again.')
    } finally {
      setResending(false)
    }
  }

  useEffect(() => {
    if (!token) {
      if (email) {
        setStatus('waiting')
        setMessage(`A verification email has been sent to ${email}. Please check your inbox or spam folder.`)
      } else {
        setStatus('error')
        setMessage('Missing verification information. Please try registering again.')
      }
      return
    }

    async function verify() {
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
        setMessage('Your email has been verified successfully. You can now continue to your dashboard.')
        const destination = getDashboardPath(data.role)
        setTimeout(() => router.push(destination), 1200)
      } catch (err: any) {
        setStatus('error')
        setMessage(err?.message || 'Unable to verify email. The link may have expired.')
      }
    }

    verify()
  }, [token, email])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          )}
          {status === 'success' && (
            <CheckCircle className="w-12 h-12 text-green-600" />
          )}
          {status === 'error' && (
            <AlertCircle className="w-12 h-12 text-red-600" />
          )}
          {status === 'waiting' && (
            <Mail className="w-12 h-12 text-blue-600" />
          )}
        </div>

        <h1 className="text-2xl font-bold mb-2 text-gray-900">Email Verification</h1>
        
        {email && status === 'waiting' && (
          <p className="text-sm text-gray-600 mb-2">
            {displayName ? `Hi ${displayName},` : 'Hi there,'}
          </p>
        )}
        
        <p className={`mb-6 text-sm leading-relaxed ${
          status === 'success' ? 'text-green-700' : 
          status === 'error' ? 'text-red-700' : 
          'text-gray-700'
        }`}>
          {message}
        </p>

        {status === 'waiting' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">We&apos;ve sent a verification email to your inbox. Check your spam folder too.</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors disabled:opacity-60"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
            <button
              onClick={() => router.push('/portal/parent/register')}
              className="w-full px-4 py-2 text-sm border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            >
              Register with a different email
            </button>
          </div>
        )}

        {status === 'success' && (
          <button 
            onClick={() => router.push('/portal')}
            className="w-full px-4 py-3 bg-[#003087] hover:bg-[#001f5b] text-white rounded-lg font-medium transition-colors"
          >
            Go to Portal
          </button>
        )}

        {status === 'error' && (
          <button 
            onClick={() => router.refresh()}
            className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
