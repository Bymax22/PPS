'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        role: 'ADMIN',
        callbackUrl: '/admin',
      })

      if (!res) {
        throw new Error('Sign in failed')
      }

      if (res.error) {
        throw new Error(res.error)
      }

      const destination = res.url || '/admin'
      router.push(destination)
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your admin credentials. This page is intended for authorized administrators only.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#003087]/20"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#003087] focus:outline-none focus:ring-2 focus:ring-[#003087]/20"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#003087] px-4 py-3 text-white font-semibold hover:bg-[#00225f] disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in as admin'}
          </button>
        </form>
      </div>
    </div>
  )
}
