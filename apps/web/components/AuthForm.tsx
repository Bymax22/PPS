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
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '' })

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.firstName || !form.lastName) {
      setError('Please provide your full name.')
      return
    }
    if (!form.password || form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
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
        role,
        callbackUrl: target,
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
        role,
        callbackUrl: target,
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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{isRegister ? 'Create account' : 'Sign in'}</h2>
      <form onSubmit={isRegister ? handleRegister : handleLogin} className="space-y-3">
        {isRegister && (
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              required
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        {isRegister && (
          <input
            required
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full p-2 border rounded"
          />
        )}
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <div className="flex items-center justify-between">
          <button disabled={loading} className="px-4 py-2 bg-[var(--campus-gold)] rounded font-semibold">{isRegister ? 'Register' : 'Sign in'}</button>
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-sm text-gray-600">{isRegister ? 'Have an account? Sign in' : "Don't have an account? Register"}</button>
        </div>
      </form>
    </div>
  )
}
