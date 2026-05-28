'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Laptop, User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export function StudentRegisterForm() {
  const searchParams = useSearchParams()
  const program = searchParams.get('program')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms to continue.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: 'STUDENT'
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.')
      }

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password
      })

      if (signInResult?.error) {
        throw new Error('Unable to sign in after registration.')
      }

      router.push('/student')
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-slate-100">
      <div className="container mx-auto px-6 max-w-xl">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Programs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] overflow-hidden"
        >
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-white">
              <Laptop className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Create Online Learning Account</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Register once and stay connected to your student portal, linked parent account and classroom updates.</p>
          </div>

          {program === 'online' && (
            <div className="mt-8 rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-slate-900" />
                <span>You're registering for: <span className="font-semibold text-slate-900">Online Learning Program</span></span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block">First name</span>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  placeholder="John"
                />
              </label>
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block">Last name</span>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900 focus:outline-none"
                  placeholder="Doe"
                />
              </label>
            </div>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block">Email address</span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900 focus:outline-none"
                placeholder="student@example.com"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block">Phone number</span>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900 focus:outline-none"
                placeholder="0771 234 567"
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-3xl bg-slate-100 px-4 py-3 pr-12 text-sm text-slate-900 focus:outline-none"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block">Confirm password</span>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900 focus:outline-none"
                placeholder="Confirm your password"
              />
            </label>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                required
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="terms" className="text-sm leading-6 text-slate-600">
                I agree to the <Link href="/terms" className="font-semibold text-slate-900 hover:text-slate-700">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-slate-900 hover:text-slate-700">Privacy Policy</Link>.
              </label>
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-3xl bg-slate-900 px-5 py-4 text-base font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account & start learning'}
            </button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/portal/student/login" className="font-semibold text-slate-900 hover:text-slate-700">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-slate-600"
        >
          <div>
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-900">
              <Laptop className="w-5 h-5" />
            </div>
            <p>Live classes</p>
          </div>
          <div>
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-900">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p>Recorded sessions</p>
          </div>
          <div>
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-900">
              <User className="w-5 h-5" />
            </div>
            <p>Student support</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
