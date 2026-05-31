import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

const quickLinks = [
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
]

const toolkitActions = [
  { title: 'Create class', description: 'Launch a new class with subjects and teachers.' },
  { title: 'Create subject', description: 'Add a new subject to the school curriculum.' },
  { title: 'Register student', description: 'Add a student account to the portal.' },
  { title: 'Register teacher', description: 'Create a new teacher profile.' },
  { title: 'Register parent', description: 'Link a parent account to their children.' },
  { title: 'Create session', description: 'Schedule a live session for classes.' }
]

export default async function AdminPage() {
  const session = await getServerSession(await getAuthOptions())
  const admin = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null

  if (!admin || admin.role !== 'ADMIN') {
    return (
      <section className="rounded-3xl bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin access required</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Admin access only</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">You must sign in with an administrator account to use the admin dashboard.</p>
      </section>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] bg-[#003087] px-6 py-10 shadow-[0_24px_80px_rgba(0,48,135,0.18)] sm:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-200/75">Admin workspace</p>
              <h1 className="mt-4 text-4xl font-semibold text-white">Welcome back, {admin.firstName}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200/90">Monitor enrollments, payments, parents, teachers, classes and live sessions from one centralized admin workspace.</p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 text-white shadow-lg shadow-slate-900/10">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200/70">Admin summary</p>
              <p className="mt-3 text-lg font-semibold">Quickly access the management tools you use most.</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((section) => (
            <Link
              key={section.label}
              href={section.href}
              className="rounded-[28px] bg-white p-6 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{section.label}</p>
              <p className="mt-4 text-xl font-semibold">Open {section.label}</p>
            </Link>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-[32px] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin toolkit</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Next steps for admin operations</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Use these actions to keep the campus running smoothly and move new students into the right classes.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {toolkitActions.map((action) => (
                <div key={action.title} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">{action.title}</p>
                  <p className="mt-2 text-sm text-slate-500">{action.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Support</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Admin operations</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Need to connect with admissions, finance, or the academic team? Use the admin toolkit links above to quickly open the right panel.</p>
              <div className="mt-6 space-y-3">
                <Link href="/admin/admissions" className="block rounded-2xl bg-[#003087] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Review admissions</Link>
                <Link href="/admin/payments" className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">Manage payments</Link>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin notes</p>
              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                <p>Remember to review the latest session schedules and confirm teacher assignments before the next term begins.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <AdminDashboardClient />
        </section>
      </div>
    </main>
  )
}
