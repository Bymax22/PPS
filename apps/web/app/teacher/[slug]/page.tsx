'use client'

import Link from 'next/link'
import { use, useEffect, useState, type ReactNode } from 'react'
import { BookOpen, Video, Monitor } from 'lucide-react'

interface TeacherSubpageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

interface TeacherClass {
  id: string
  name: string
  grade: number
  subject: string
  students: { id: string; firstName: string; lastName: string }[]
}

interface Lesson {
  id: string
  title: string
  type: string
  status: string
  scheduledAt?: string
  class?: {
    name: string
  }
}

export default function TeacherSubpage({ params }: TeacherSubpageProps) {
  const resolvedParams = use(
    params instanceof Promise ? params : Promise.resolve(params)
  ) as { slug?: string }

  const slug = resolvedParams?.slug ?? ''
  const [payload, setPayload] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const title = (slug || 'dashboard')
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

  useEffect(() => {
    setLoading(true)
    setError(null)

    let url = '/api/teacher/dashboard'
    if (slug === 'classes' || slug === 'students') {
      url = '/api/teacher/classes'
    } else if (slug === 'lessons' || slug === 'live') {
      url = '/api/teacher/lessons'
    }

    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.text()
          throw new Error(body || 'Unable to load data')
        }
        return res.json()
      })
      .then((payload) => {
        setPayload(payload)
      })
      .catch((err) => {
        console.error('Teacher subpage fetch error', err)
        setError(err.message || 'Unable to load this page.')
      })
      .finally(() => setLoading(false))
  }, [slug])

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-600">Loading {title.toLowerCase()}…</p>
    }

    if (error) {
      return <p className="text-red-600">{error}</p>
    }

    if (slug === 'classes') {
      const classes = payload?.classes ?? payload ?? []
      if (!classes.length) {
        return <p className="text-gray-600">No classes assigned yet.</p>
      }
      return (
        <div className="space-y-4">
          {classes.map((cls: TeacherClass) => (
            <div key={cls.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{cls.name}</p>
                  <p className="text-sm text-slate-500">Grade {cls.grade} · {cls.subject}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">{cls.students.length} students</span>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cls.students.slice(0, 6).map((student) => (
                  <div key={student.id} className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700">
                    {student.firstName} {student.lastName}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (slug === 'lessons' || slug === 'live') {
      const lessons = Array.isArray(payload) ? payload : payload?.lessons ?? []
      const filtered = slug === 'live'
        ? lessons.filter((lesson: Lesson) => lesson.status === 'LIVE' || lesson.type === 'LIVE')
        : lessons

      if (!filtered.length) {
        return (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">No {slug === 'live' ? 'live lessons' : 'lessons'} are available right now.</p>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {filtered.map((lesson: Lesson) => (
            <div key={lesson.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{lesson.title}</p>
                  <p className="text-sm text-slate-500">{lesson.class?.name || 'Assigned class'} · {lesson.type}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{lesson.status}</span>
              </div>
              {lesson.scheduledAt ? (
                <p className="mt-3 text-sm text-slate-500">Scheduled at {new Date(lesson.scheduledAt).toLocaleString()}</p>
              ) : null}
            </div>
          ))}
        </div>
      )
    }

    if (slug === 'exams' || slug === 'ratings' || slug === 'assignments') {
      const exams = payload?.exams ?? []
      const assignments = slug === 'assignments'
        ? exams.filter((exam: any) => exam.type === 'ASSIGNMENT')
        : exams

      if (!assignments.length) {
        return (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">No {slug === 'assignments' ? 'assignments' : 'exams'} found for your classes.</p>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {assignments.map((exam: any) => (
            <div key={exam.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{exam.title}</p>
                  <p className="text-sm text-slate-500">{exam.type} · Class {exam.classId}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{exam.status ?? 'Pending'}</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                <span>Total marks: {exam.totalMarks ?? 'N/A'}</span>
                <span>Passing marks: {exam.passingMarks ?? 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (slug === 'students') {
      const classes = payload?.classes ?? []
      const students = classes.flatMap((cls: any) => cls.students ?? [])
      const uniqueStudents = Array.from(new Map(students.map((s: any) => [s.id, s])).values())

      if (!uniqueStudents.length) {
        return (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">No students assigned to your classes yet.</p>
          </div>
        )
      }

      return (
        <div className="space-y-4">
          {uniqueStudents.map((student: any) => (
            <div key={student.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">{student.firstName} {student.lastName}</p>
              <p className="text-sm text-slate-500">{student.email ?? 'No email provided'}</p>
            </div>
          ))}
        </div>
      )
    }

    if (slug === 'calendar') {
      const lessons = payload?.lessons ?? []
      if (!lessons.length) {
        return (
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-gray-600">No scheduled lessons available for your calendar.</p>
          </div>
        )
      }

      const upcoming = lessons
        .filter((lesson: Lesson) => lesson.scheduledAt)
        .sort((a: Lesson, b: Lesson) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())

      return (
        <div className="space-y-4">
          {upcoming.map((lesson: Lesson) => (
            <div key={lesson.id} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{lesson.title}</p>
                  <p className="text-sm text-slate-500">{lesson.class?.name || 'Assigned class'} · {lesson.type}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{lesson.status}</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">Scheduled for {new Date(lesson.scheduledAt!).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )
    }

    const classes = payload?.classes ?? []
    const lessons = payload?.lessons ?? []
    const exams = payload?.exams ?? []

    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-600">
          This section is available and ready for content. Use the sidebar to navigate between teacher tools.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Card label="Classes" value={classes.length} icon={<BookOpen className="h-5 w-5" />} />
          <Card label="Lessons" value={lessons.length} icon={<Video className="h-5 w-5" />} />
          <Card label="Exams" value={exams.length} icon={<Monitor className="h-5 w-5" />} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-[112px] lg:pt-[120px]">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teacher tools</p>
            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
          </div>
          <Link
            href="/teacher"
            className="inline-flex items-center rounded-full bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
          >
            Back to Dashboard
          </Link>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}

function Card({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-slate-900 text-xl font-semibold">{value}</div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">{icon}</div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
    </div>
  )
}
