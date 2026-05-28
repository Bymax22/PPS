"use client"

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { ArrowRight, Calendar, LogOut, ShieldCheck, User } from 'lucide-react'

interface StudentDashboardSidebarProps {
  studentName: string
  grade?: string | null
  schoolYear?: string | null
  parentName: string
  activeClasses: number
  nextLessonTitle: string
}

export default function StudentDashboardSidebar({
  studentName,
  grade,
  schoolYear,
  parentName,
  activeClasses,
  nextLessonTitle
}: StudentDashboardSidebarProps) {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#003087] to-[#047857] text-2xl font-semibold text-white shadow-lg shadow-[#003087]/20">
          {studentName.split(' ').map((part) => part[0]).slice(0, 2).join('')}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Current user</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{studentName}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Next lesson</p>
          <p className="mt-2 font-semibold text-slate-900">{nextLessonTitle}</p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Active classes</p>
          <p className="mt-2 font-semibold text-slate-900">{activeClasses}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-slate-700 font-semibold">Grade</p>
          <p className="mt-1">{grade ?? 'N/A'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-slate-700 font-semibold">School year</p>
          <p className="mt-1">{schoolYear ?? 'N/A'}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-slate-700 font-semibold">Parent contact</p>
          <p className="mt-1">{parentName}</p>
        </div>
      </div>

      <div className="mt-6 text-sm">
        <p className="text-slate-500">Quick actions</p>
        <div className="mt-3 space-y-3">
          <Link href="#schedule" className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:border-blue-500 hover:text-blue-700 transition">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-500" /> View schedule</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#progress" className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition">
            <span className="flex items-center gap-2"><BarChart2 className="h-4 w-4 text-slate-500" /> Track progress</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="#resources" className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-700 hover:border-sky-500 hover:text-sky-700 transition">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-500" /> Learning resources</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-[#003087] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#001f5b]"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  )
}
