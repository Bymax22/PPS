import type { ReactNode } from 'react'
import PortalLayout from '@/components/PortalLayout'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PortalLayout role="admin">
      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-[2rem] bg-slate-950 p-8 text-slate-100 shadow-[0_24px_60px_rgba(15,23,42,0.15)] xl:block">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Admin panel</p>
          <h2 className="mt-6 text-2xl font-semibold">Platform controls</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">Quick access to key admin sections and real-time monitoring.</p>
          <div className="mt-10 space-y-2">
            <Link href="/admin" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Dashboard
            </Link>
            <Link href="/admin/enrollments" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Enrollments
            </Link>
            <Link href="/admin/parents" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Parents
            </Link>
            <Link href="/admin/teachers" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Teachers
            </Link>
            <Link href="/admin/payments" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Payments
            </Link>
            <Link href="/admin/sessions" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Sessions
            </Link>
            <Link href="/admin/admissions" className="block rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800">
              Admissions
            </Link>
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </PortalLayout>
  )
}
