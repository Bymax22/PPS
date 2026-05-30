import PortalLayout from '@/components/PortalLayout'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const session = await getServerSession(await getAuthOptions())
  const admin = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null

  if (!admin || admin.role !== 'ADMIN') {
    return (
      <PortalLayout role="admin">
        <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin access required</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">Admin access only</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">You must sign in with an administrator account to use the admin dashboard.</p>
        </section>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout role="admin">
      <div className="space-y-8 py-10">
        <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Welcome back, {admin.firstName}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">View live platform performance, enrollments, families, staff, classes, payments and active sessions in one place.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Enrollments', href: '/admin/enrollments' },
            { label: 'Parents', href: '/admin/parents' },
            { label: 'Teachers', href: '/admin/teachers' },
            { label: 'Payments', href: '/admin/payments' },
            { label: 'Sessions', href: '/admin/sessions' },
            { label: 'Admissions', href: '/admin/admissions' }
          ].map((section) => (
            <a
              key={section.label}
              href={section.href}
              className="rounded-[2rem] bg-white p-6 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{section.label}</p>
              <p className="mt-4 text-xl font-semibold">Open {section.label}</p>
            </a>
          ))}
        </section>

        <AdminDashboardClient />
      </div>
    </PortalLayout>
  )
}
