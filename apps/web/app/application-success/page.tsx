'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Mail, Calendar, FileText, Home } from 'lucide-react'

export default function ApplicationSuccessPage() {
  const params = useSearchParams()
  const id = params.get('id')
  const [admission, setAdmission] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!id) return
    fetch(`/api/admissions/${id}`).then(r => r.json()).then(setAdmission).catch(() => {})
  }, [id])

  async function downloadPdf() {
    if (!id) return
    const res = await fetch(`/api/admissions/${id}/pdf`)
    if (!res.ok) return alert('Unable to download PDF')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admission-${id}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  async function pay() {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admissions/${id}/payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentMethod: 'BANK_TRANSFER' }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Unable to create payment')
      alert('Payment initiated. Follow the instructions to complete payment.')
    } catch (err: any) {
      alert(err?.message || 'Payment failed')
    } finally { setLoading(false) }
  }

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-4">Application Submitted!</h1>
          <p className="text-xl text-gray-600 mb-8">Thank you for applying to Progress Preparatory School</p>

          <div className="bg-gradient-to-br from-[#003087] to-[#001f5b] text-white rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">What happens next?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="bg-white/10 rounded-xl p-4 mb-3 w-fit">
                  <Mail className="w-6 h-6 text-[var(--campus-gold)]" />
                </div>
                <h3 className="font-bold mb-2">1. Confirmation Email</h3>
                <p className="text-sm text-gray-200">You'll receive a confirmation email within 24 hours</p>
              </div>

              <div>
                <div className="bg-white/10 rounded-xl p-4 mb-3 w-fit">
                  <Calendar className="w-6 h-6 text-[var(--campus-gold)]" />
                </div>
                <h3 className="font-bold mb-2">2. Assessment Scheduled</h3>
                <p className="text-sm text-gray-200">We'll contact you to schedule an assessment</p>
              </div>

              <div>
                <div className="bg-white/10 rounded-xl p-4 mb-3 w-fit">
                  <FileText className="w-6 h-6 text-[var(--campus-gold)]" />
                </div>
                <h3 className="font-bold mb-2">3. Application Review</h3>
                <p className="text-sm text-gray-200">Our admissions team will review your application</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-500 mb-2">Your Application Reference Number</p>
            <p className="text-3xl font-mono font-bold text-[#003087]">{admission?.id ? `APP-${admission.id.slice(0,8).toUpperCase()}` : 'Processing...'}</p>
            <p className="text-xs text-gray-400 mt-2">Please quote this number in all correspondence</p>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button onClick={downloadPdf} className="px-4 py-2 bg-[#003087] text-white rounded">Download PDF</button>
            <button onClick={pay} disabled={loading} className="px-4 py-2 bg-[var(--campus-gold)] rounded">Pay Enrollment Fee</button>
          </div>

          {admission && (
            <div className="mt-6 p-4 bg-white rounded shadow">
              <h3 className="font-semibold">Application details</h3>
              <p className="text-sm">Applicant: {admission.studentName}</p>
              <p className="text-sm">Applying for: {admission.applyingForGrade}</p>
              <p className="text-sm">Status: {admission.status}</p>
            </div>
          )}

          <div className="space-y-4 mt-8">
            <h3 className="font-bold text-gray-900">Next Steps:</h3>
            <ul className="text-left space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Check your email for confirmation and further instructions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Prepare for the assessment (if applicable to your child's age group)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Ensure all documents are ready for submission</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors">
              <Home className="w-5 h-5" />
              Return to Home
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors">
              Contact Admissions
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
