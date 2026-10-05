'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { formatZMW } from '@/lib/currency'

interface ParentPayment {
  id: string
  childName: string
  amount: number
  currency: string
  status: string
  date: string
  description: string
  method: string
}

export default function ParentPaymentsPage() {
  const [payments, setPayments] = useState<ParentPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [returnMessage, setReturnMessage] = useState('')

  const refreshPayments = useCallback(async () => {
    const response = await fetch('/api/parent/payments', { cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Payment history could not be loaded.')
    if (!Array.isArray(data)) throw new Error('Payment history response was invalid.')
    setPayments(data)
    setError('')
  }, [])

  useEffect(() => {
    const result = new URLSearchParams(window.location.search).get('paymentStatus')
    if (result === 'success') setReturnMessage('Payment confirmed. The subscription is active.')
    else if (result === 'pending') setReturnMessage('Payment is still being confirmed. This page will refresh automatically.')
    else if (result === 'verification-error') setReturnMessage('Payment could not be verified yet. Please check again shortly.')

    let active = true
    const load = async () => {
      try {
        await refreshPayments()
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Payment history could not be loaded.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    const interval = window.setInterval(() => { void load() }, 10_000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [refreshPayments])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/parent" className="text-sm font-medium text-[#003087] hover:underline">
          ← Back to parent dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Payment history</h1>
        <p className="mt-2 text-slate-600">Subscription payment status for your children.</p>

        {returnMessage && (
          <p role="status" className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">{returnMessage}</p>
        )}
        {error && (
          <div role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
            <button onClick={() => void refreshPayments().catch(refreshError => setError(refreshError.message))} className="ml-2 font-semibold underline">
              Retry
            </button>
          </div>
        )}

        <section className="mt-6 space-y-3">
          {loading && <p className="rounded-xl bg-white p-5 text-slate-600">Loading payment history…</p>}
          {!loading && !payments.length && !error && (
            <p className="rounded-xl bg-white p-5 text-slate-600">No payment records yet.</p>
          )}
          {payments.map(payment => (
            <article key={payment.id} className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900">{payment.description}</h2>
                  <p className="mt-1 text-sm text-slate-600">{payment.childName} · {payment.method.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(payment.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatZMW(payment.amount)}</p>
                  <p className={`mt-1 text-sm font-medium ${payment.status === 'SUCCEEDED' ? 'text-green-700' : payment.status === 'FAILED' ? 'text-red-700' : 'text-amber-700'}`}>
                    {payment.status === 'SUCCEEDED' ? 'Paid' : payment.status === 'FAILED' ? 'Failed' : 'Awaiting confirmation'}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
