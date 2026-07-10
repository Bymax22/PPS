'use client'

import { useEffect, useMemo, useState } from 'react'

type EnrollmentRow = {
  id: string
  enrolledAt: string
  status: string
  studentName: string
  studentEmail: string
  studentPhone: string
  grade: number | null
  subject: string | null
  programType: string | null
  latestPaymentStatus: string | null
}

type ParentRow = {
  id: string
  name: string
  email: string
  phone: string | null
  nationalId: string | null
  children: Array<{ name: string; email: string; phone: string | null; grade: number | null }>
  activeSubscription: string | null
  lastUpdated: string
}

type TeacherRow = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  classes: string[]
  lastUpdated: string
}

type ClassRow = {
  id: string
  name: string
  grade: number | null
  subject: string | null
  programType: string | null
  teachers: string[]
  enrolledCount: number
  capacity: number
}

type PaymentRow = {
  id: string
  createdAt: string
  amount: number
  currency: string
  status: string
  payer: string
  email: string
  subscription: string | null
}

type SessionRow = {
  id: string
  title: string
  className: string
  programType: string | null
  lessonType: string
  status: string
  scheduledAt: string | null
  attendees: number
}

type DashboardData = {
  summary: {
    totalStudents: number
    totalParents: number
    totalTeachers: number
    totalClasses: number
    totalEnrollments: number
    totalPayments: number
    totalRevenue: number
    activeSubscriptions: number
  }
  enrollments: EnrollmentRow[]
  parents: ParentRow[]
  teachers: TeacherRow[]
  classes: ClassRow[]
  payments: PaymentRow[]
  sessions: SessionRow[]
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch('/api/admin/dashboard', { cache: 'no-store', credentials: 'include' })
  if (!response.ok) {
    throw new Error(`Unable to load admin dashboard data: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export default function AdminDashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const refresh = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = await fetchDashboardData()
      setData(payload)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    const interval = window.setInterval(() => {
      void refresh()
    }, 5000)
    const onFocus = () => {
      void refresh()
    }

    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  const summaryCards = useMemo(
    () => [
      { label: 'Students', value: data?.summary.totalStudents ?? 0 },
      { label: 'Parents', value: data?.summary.totalParents ?? 0 },
      { label: 'Teachers', value: data?.summary.totalTeachers ?? 0 },
      { label: 'Classes', value: data?.summary.totalClasses ?? 0 },
      { label: 'Enrollments', value: data?.summary.totalEnrollments ?? 0 },
      { label: 'Revenue', value: `$${data?.summary.totalRevenue.toFixed(0) ?? 0}` },
      { label: 'Active subscriptions', value: data?.summary.activeSubscriptions ?? 0 },
      { label: 'Payments', value: data?.summary.totalPayments ?? 0 }
    ],
    [data]
  )

  if (error) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-semibold text-slate-900">Admin dashboard error</h2>
        <p className="mt-4 text-slate-600">{error}</p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mt-6 rounded-xl bg-[#003087] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Retry connection
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Live update</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Real-time campus overview</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Data refreshes automatically every 5 seconds so you can review enrollments, payments, and sessions with confidence.</p>
          </div>
          <div className="rounded-xl bg-[#e8eefb] px-5 py-4 text-slate-700">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Status</p>
            <p className="mt-2 text-lg font-semibold">{isLoading ? 'Refreshing…' : 'Live'}</p>
            <p className="mt-1 text-sm text-slate-500">{lastUpdated ? `Updated ${lastUpdated}` : 'Waiting for first refresh'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article key={card.label} className="rounded-xl bg-[#00264d] p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)]">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold text-slate-900">Latest enrollments</h3>
          <p className="text-sm text-slate-500">Showing the most recent enrollment activity and payment status.</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Student</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Class</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Program</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Payment</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {data?.enrollments.length ? (
                data.enrollments.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <div className="font-semibold">{row.studentName}</div>
                      <div className="text-xs text-slate-500">{row.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <div>{row.subject ?? 'No subject'}</div>
                      <div className="text-xs text-slate-500">Grade {row.grade ?? 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.programType ?? 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{row.status}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{row.latestPaymentStatus ?? 'No payment'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(row.enrolledAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                    No recent enrollments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6 rounded-xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Family and parent overview</h3>
              <p className="mt-2 text-sm text-slate-500">Top families, children count, and active billing status.</p>
            </div>
          </div>

          <div className="space-y-4">
            {data?.parents.length ? (
              data.parents.map((parent) => (
                <div key={parent.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{parent.name}</p>
                      <p className="text-sm text-slate-500">{parent.email} • {parent.phone ?? 'No phone'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{parent.activeSubscription ?? 'No active plan'}</div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Children</p>
                      <p className="mt-2 text-sm text-slate-700">{parent.children.length}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Last updated</p>
                      <p className="mt-2 text-sm text-slate-700">{new Date(parent.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No parent accounts available yet.</p>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-xl bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Upcoming sessions</h3>
            <p className="mt-2 text-sm text-slate-500">Upcoming lessons and attendance counts for the next sessions.</p>
          </div>

          <div className="space-y-4">
            {data?.sessions.length ? (
              data.sessions.map((session) => (
                <div key={session.id} className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{session.title}</p>
                      <p className="text-sm text-slate-500">{session.className}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{session.status}</div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>{session.lessonType}</span>
                    <span>{session.programType ?? 'Unknown program'}</span>
                    <span>{session.attendees} attendees</span>
                    <span>{session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : 'No schedule'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No sessions are scheduled yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold text-slate-900">Teacher and class snapshot</h3>
          <p className="text-sm text-slate-500">Active instructors, offered classes, and student capacity.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="bg-slate-100 px-6 py-4">
              <h4 className="text-lg font-semibold text-slate-900">Teachers</h4>
            </div>
            <div className="divide-y divide-slate-200">
              {data?.teachers.length ? (
                data.teachers.map((teacher) => (
                  <div key={teacher.id} className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{teacher.name}</p>
                    <p className="text-sm text-slate-500">{teacher.email} • {teacher.phone ?? 'No phone'}</p>
                    <p className="mt-3 text-sm text-slate-600">Classes: {teacher.classes.join(', ') || 'None assigned'}</p>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-sm text-slate-500">No teacher records found.</div>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="bg-slate-100 px-6 py-4">
              <h4 className="text-lg font-semibold text-slate-900">Classes</h4>
            </div>
            <div className="divide-y divide-slate-200">
              {data?.classes.length ? (
                data.classes.map((classRow) => (
                  <div key={classRow.id} className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{classRow.name}</p>
                    <p className="text-sm text-slate-500">Grade {classRow.grade ?? 'N/A'} • {classRow.subject ?? 'No subject'}</p>
                    <p className="mt-3 text-sm text-slate-600">Teachers: {classRow.teachers.join(', ') || 'Unassigned'}</p>
                    <p className="mt-2 text-sm text-slate-600">Capacity: {classRow.enrolledCount}/{classRow.capacity}</p>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-sm text-slate-500">No class records available.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-semibold text-slate-900">Recent payments</h3>
          <p className="text-sm text-slate-500">Latest completed and pending payments for students and parents.</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Payer</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Subscription</th>
              </tr>
            </thead>
            <tbody>
              {data?.payments.length ? (
                data.payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-200 even:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">
                      <div className="font-semibold">{payment.payer}</div>
                      <div className="text-xs text-slate-500">{payment.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{payment.currency.toUpperCase()} {payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{payment.status}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{payment.subscription ?? 'One-time'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No payments recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
