import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const session = await getServerSession(await getAuthOptions())
  const admin = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null

  if (!admin || admin.role !== 'ADMIN') {
    return (
      <section className="rounded-xl bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin access required</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Admin access only</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">You must sign in with an administrator account to use the admin dashboard.</p>
      </section>
    )
  }

  return (
      <div className="space-y-8 py-10">
        <section className="rounded-xl bg-[#003087] p-10 shadow-[0_24px_80px_rgba(0,48,135,0.18)] text-white">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200/70">Admin dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold">Welcome back, {admin.firstName}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200/90">Monitor enrollments, payments, parents, teachers, classes and live sessions from one centralized admin workspace.</p>
            </div>
            <div className="rounded-xl bg-white/10 px-6 py-4 text-sm text-white">
              <p className="uppercase tracking-[0.24em] text-slate-200/70">Important</p>
              <p className="mt-3 text-lg font-semibold">Use quick links below to manage students, classes, sessions, and messages.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Enrollments', href: '/admin/enrollments' },
            { label: 'Parents', href: '/admin/parents' },
            { label: 'Students', href: '/admin/students' },
            { label: 'Teachers', href: '/admin/teachers' },
            { label: 'Classes', href: '/admin/classes' },
            { label: 'Subjects', href: '/admin/subjects' },
            { label: 'Payments', href: '/admin/payments' },
            { label: 'Sessions', href: '/admin/sessions' },
            { label: 'Notices', href: '/admin/notifications' },
            { label: 'Admissions', href: '/admin/admissions' }
          ].map((section) => (
            <a
              key={section.label}
              href={section.href}
              className="rounded-xl bg-white p-6 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{section.label}</p>
              <p className="mt-4 text-xl font-semibold">Open {section.label}</p>
            </a>
          ))}
        </section>

        <section className="rounded-xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin toolkit</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Next steps for admin operations</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Planned management actions include creating classes, subjects, student accounts, staff accounts, and sessions.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {['Create class', 'Create subject', 'Register student', 'Register teacher', 'Register parent', 'Create session'].map((action) => (
              <div key={action} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{action}</p>
                <p className="mt-2 text-sm text-slate-500">Coming soon</p>
              </div>
            ))}
          </div>
        </section>

        <AdminDashboardClient />
      </div>
  )
}
