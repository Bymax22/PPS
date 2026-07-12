import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FileText, ArrowLeft } from 'lucide-react'
import ResourcesWidget from '@/components/dashboard/ResourcesWidget'
import StudentDashboardSidebar from '@/components/StudentDashboardSidebar'

export default async function StudentResourcesPage() {
  const session = await getServerSession(await getAuthOptions())

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#003087' }}>Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your resources.</p>
          <Link
            href="/portal/student/login"
            className="inline-flex items-center justify-center rounded-full bg-[#003087] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00286d]"
          >
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: true,
      enrollments: { include: { class: true } },
      examAttempts: { include: { exam: true }, orderBy: { createdAt: 'desc' }, take: 5 },
      subscriptions: { where: { status: 'ACTIVE' }, include: { plan: true, payments: { orderBy: { createdAt: 'desc' }, take: 1 } } },
      payments: { orderBy: { createdAt: 'desc' }, take: 3 },
      notifications: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  })

  if (!user?.studentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#003087' }}>Profile Not Found</h2>
          <p className="text-gray-600 mb-6">No student profile found for your account. Please contact support.</p>
        </div>
      </div>
    )
  }

  const enrolledClassIds = user.enrollments.map((enrollment) => enrollment.classId)

  const resources = await prisma.resource.findMany({
    where: {
      classId: { in: enrolledClassIds },
      isPublished: true,
      status: 'READY',
      isDeleted: false
    },
    orderBy: { createdAt: 'desc' },
    include: {
      media: true,
      author: true,
    }
  })

  const recentResources = resources.map((resource) => ({
    id: resource.id,
    title: resource.title,
    description: resource.description,
    type: resource.type,
    subject: resource.subject ?? undefined,
    author: resource.author ? `${resource.author.firstName ?? ''} ${resource.author.lastName ?? ''}`.trim() : undefined,
    createdAt: resource.createdAt,
    cloudinaryUrl: resource.media?.originalUrl ?? null,
    fileUrl: resource.media?.originalUrl ?? null,
    status: resource.status,
    downloadCount: resource.downloadCount ?? 0,
  }))

  const upcomingLessons = user.enrollments.length
    ? await prisma.lesson.findMany({
        where: {
          classId: { in: enrolledClassIds },
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED'
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
        include: { class: true }
      })
    : []

  const recentProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: { lesson: { include: { class: true } } }
  })

  const completedLessons = recentProgress.filter((p) => p.percentageWatched === 100).length
  const averageProgress = recentProgress.length
    ? Math.round(recentProgress.reduce((sum, p) => sum + p.percentageWatched, 0) / recentProgress.length)
    : 0
  const passedExams = user.examAttempts.filter((e) => e.isPassed === true).length
  const totalExams = user.examAttempts.length

  const formattedNotifications = user.notifications.map((notification) => ({
    ...notification,
    createdAt: new Date(notification.createdAt)
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Resources</h1>
            <p className="mt-2 text-sm text-gray-600">Browse ready study materials and video tutorials for your classes.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <Link href="/student" className="text-slate-500 hover:text-slate-700">Dashboard</Link>
              <span>•</span>
              <span className="font-medium text-slate-800">Resources</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
          <aside>
            <StudentDashboardSidebar
              studentName={`${user.firstName} ${user.lastName}`}
              grade={String(user.studentProfile.grade)}
              schoolYear={user.studentProfile.schoolYear ?? null}
              parentName={user.studentProfile.parentName ?? ''}
              activeClasses={user.enrollments.length}
              nextLessonTitle={upcomingLessons[0]?.title ?? 'No upcoming lessons'}
            />
          </aside>

          <main className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Student Resources</p>
                  <p className="text-xs text-slate-500">Ready materials for your enrolled classes.</p>
                </div>
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to dashboard
                </Link>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p><strong>Student:</strong> {user.firstName} {user.lastName}</p>
                <p><strong>Grade:</strong> {user.studentProfile.grade}</p>
                <p><strong>Classes:</strong> {user.enrollments.length}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Your learning snapshot</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Completed lessons</span>
                  <span>{completedLessons}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Passed exams</span>
                  <span>{passedExams}/{totalExams}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Average progress</span>
                  <span>{averageProgress}%</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <ResourcesWidget resources={recentResources} />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
