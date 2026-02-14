'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Laptop, User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function StudentRegisterPage() {
  const searchParams = useSearchParams()
  const program = searchParams.get('program')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration
    console.log('Registering for online learning:', formData)
    // Redirect to portal dashboard
    window.location.href = '/portal/dashboard'
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-md">
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Programs
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#003087] to-[#001f5b] p-6 text-white text-center">
            <Laptop className="w-12 h-12 text-[var(--campus-gold)] mx-auto mb-3" />
            <h1 className="text-2xl font-bold mb-1">Create Online Learning Account</h1>
            <p className="text-sm text-blue-200">Start your virtual learning journey</p>
          </div>

          {/* Program Info */}
          {program === 'online' && (
            <div className="bg-[var(--campus-gold)]/10 p-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-[var(--campus-gold)]" />
                <span className="text-gray-600">You're registering for: <span className="font-bold text-[#003087]">Online Learning Program</span></span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="student@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="0771 234 567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-[var(--campus-gold)] focus:outline-none"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                required
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <Link href="/terms" className="text-[#003087] hover:text-[var(--campus-gold)]">Terms of Service</Link> and <Link href="/privacy" className="text-[#003087] hover:text-[var(--campus-gold)]">Privacy Policy</Link> <span className="text-red-500">*</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors mt-6"
            >
              Create Account & Start Learning
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <Link href="/portal/student/login" className="text-[#003087] hover:text-[var(--campus-gold)] font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center text-sm"
        >
          <div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Laptop className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-600">Live Classes</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600">Recorded Sessions</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-600">1-on-1 Support</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}