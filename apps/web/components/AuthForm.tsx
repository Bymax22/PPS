"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function getDestination(role: string) {
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

export default function AuthForm({ role = 'STUDENT' }: { role?: string }) {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' })

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.firstName || !form.lastName) {
      setError('Please provide your full name.')
      return
    }
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      const target = getDestination(role)
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
        callbackUrl: target
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error || 'Unable to sign in after registration')
      }

      router.push(signInResult?.url || target)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const target = getDestination(role)
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
        callbackUrl: target
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error || 'Invalid email or password')
      }

      router.push(signInResult?.url || target)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto rounded-[2rem] bg-slate-100 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-slate-900">{isRegister ? 'Create account' : 'Welcome back'}</h2>
        <p className="mt-2 text-sm text-slate-600">{isRegister ? 'Register a new portal account and stay connected across the school platform.' : `Sign in to your ${role.toLowerCase()} portal.`}</p>
      </div>

      <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-4">
        {isRegister && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full rounded-3xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none"
            />
            <input
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full rounded-3xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none"
            />
          </div>
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-3xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-3xl bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:outline-none"
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRegister ? 'Register now' : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="w-full rounded-3xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {isRegister ? 'Already have an account? Sign in' : 'Create a new account'}
        </button>
      </form>
    </div>
  )
}
