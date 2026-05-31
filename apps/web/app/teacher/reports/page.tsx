'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TeacherReportsPage() {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/teacher/dashboard')
      .then(async (res) => {
        if (!res.ok) throw new Error('Unable to load reports')
        return res.json()
      })
      .then((data) => {
        setReportData(data)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to load reports')
      })
      .finally(() => setLoading(false))
  }, [])

  const totalStudents = reportData?.classes?.reduce((count: number, cls: any) => count + (cls.students?.length ?? 0), 0) ?? 0
  const totalLiveLessons = reportData?.lessons?.filter((lesson: any) => lesson.type === 'LIVE' || lesson.status === 'LIVE').length ?? 0
  const pendingExams = reportData?.exams?.filter((exam: any) => exam.submissions?.some((submission: any) => submission.status === 'PENDING')).length ?? 0

  return (
    <div className="min-h-screen bg-slate-50 pt-[112px] lg:pt-[120px]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teacher reports</p>
            <h1 className="text-3xl font-semibold text-slate-900">Reports</h1>
          </div>
          <Link
            href="/teacher"
            className="inline-flex items-center rounded-full bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
          >
            Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading report summary…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Classes" value={reportData?.classes?.length ?? 0} />
              <SummaryCard label="Students" value={totalStudents} />
              <SummaryCard label="Live lessons" value={totalLiveLessons} />
              <SummaryCard label="Pending grading" value={pendingExams} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Latest activity</h2>
              <div className="mt-5 space-y-4">
                <ReportRow label="Upcoming lessons" value={reportData?.lessons?.filter((lesson: any) => lesson.scheduledAt).length ?? 0} />
                <ReportRow label="Exam submissions" value={reportData?.exams?.flatMap((exam: any) => exam.submissions ?? []).length ?? 0} />
                <ReportRow label="Notifications" value={reportData?.notifications?.length ?? 0} />
                <ReportRow label="Resources shared" value={reportData?.resources?.length ?? 0} />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Class performance overview</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Use this page to monitor attendance, grading and lesson completion across your classes. The dashboard above summarizes the most recent performance metrics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function ReportRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-sm text-slate-700">{label}</p>
      <p className="font-semibold text-slate-900">{value}</p>
    </div>
  )
}
