import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { BarChart2, Calendar, ChevronRight, FileText, GraduationCap, MessageCircle, ShieldCheck, User } from 'lucide-react'
import PortalLayout from '@/components/PortalLayout'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const portalCards = [
  { label: 'Student', subtitle: 'Your classes, lessons and progress', href: '/portal/student/login', icon: GraduationCap, accent: 'bg-slate-900 text-white' },
  { label: 'Parent', subtitle: 'Child progress, payments and updates', href: '/portal/parent/login', icon: User, accent: 'bg-slate-800 text-white' },
  { label: 'Teacher', subtitle: 'Class roster, grading and notes', href: '/portal/teacher/login', icon: FileText, accent: 'bg-slate-700 text-white' },
  { label: 'Admin', subtitle: 'System health and subscriptions', href: '/admin', icon: ShieldCheck, accent: 'bg-slate-600 text-white' }
]

function formatDate(date?: Date) {
  if (!date) return 'TBA'
  return date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

export default async function StudentPage() {
  const session = await getServerSession(await getAuthOptions())

  if (!session?.user?.email) {
    return (
      <PortalLayout role="student">
        <div className="space-y-8">
          <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Student portal</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Choose your account to continue</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">Access your student dashboard, progress and upcoming lessons. If you are using another account, switch quickly to stay connected with the full school portal.</p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {portalCards.map((portal) => {
                const Icon = portal.icon
                return (
                  <Link key={portal.label} href={portal.href} className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${portal.accent}`}> 
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-6">
                      <p className="text-lg font-semibold text-slate-900">{portal.label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{portal.subtitle}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                      Continue <ChevronRight className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </PortalLayout>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: {
        include: {
          parent: {
            select: { firstName: true, lastName: true, email: true }
          }
        }
      },
      enrollments: {
        include: {
          class: {
            include: { program: true }
          }
        }
      },
      progressRecords: {
        orderBy: { updatedAt: 'desc' },
        take: 5,
        include: {
          lesson: {
            include: {
              class: true
            }
          }
        }
      },
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 4
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  })

  if (!user) {
    return (
      <PortalLayout role="student">
        <div className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-semibold text-slate-900">Student dashboard</h1>
          <p className="mt-4 text-slate-600">We could not find a student profile for your account. Please sign in again or register through the student portal.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/portal/student/login" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">Sign in</Link>
            <Link href="/portal/student/register" className="inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">Register</Link>
          </div>
        </div>
      </PortalLayout>
    )
  }

  const upcomingLessons = user.enrollments.length
    ? await prisma.lesson.findMany({
        where: {
          classId: { in: user.enrollments.map((entry) => entry.classId) },
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED'
        },
        orderBy: { scheduledAt: 'asc' },
        take: 3,
        include: { class: true }
      })
    : []

  const averageProgress = user.progressRecords.length
    ? Math.round(user.progressRecords.reduce((sum, item) => sum + item.percentageWatched, 0) / user.progressRecords.length)
    : 0

  return (
    <PortalLayout role="student">
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Student dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Welcome back, {user.firstName}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Your student portal is connected to the school database. Browse your lessons, progress and linked accounts without leaving the portal.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Active classes</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{user.enrollments.length}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Average progress</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{averageProgress}%</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Last payment</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{user.payments[0]?.createdAt ? new Date(user.payments[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Next lessons</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upcoming schedule</h2>
                </div>
                <Calendar className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-4">
                {upcomingLessons.length > 0 ? (
                  upcomingLessons.map((lesson) => (
                    <div key={lesson.id} className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{lesson.title}</p>
                          <p className="mt-2 text-sm text-slate-600">{lesson.class?.name ?? 'Class'} • {formatDate(new Date(lesson.scheduledAt ?? new Date()))}</p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Join</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">No scheduled lessons found. Your dashboard will show upcoming classes once they're assigned to your enrolled programs.</div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Progress</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Continue learning</h2>
                </div>
                <BarChart2 className="h-6 w-6 text-slate-600" />
              </div>

              <div className="mt-8 space-y-4">
                {user.progressRecords.length ? (
                  user.progressRecords.map((record) => (
                    <div key={record.id} className="rounded-3xl bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-900">{record.lesson.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{record.lesson.class?.name ?? 'Lesson'} • {record.percentageWatched}% complete</p>
                        </div>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Updated</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">You have no progress records yet. Start a lesson or view your enrolled classes to begin tracking progress.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Student profile</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">{user.firstName} {user.lastName}</h2>
                </div>
                <User className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div>Grade: {user.studentProfile?.grade ?? 'Unknown'}</div>
                <div>School year: {user.studentProfile?.schoolYear ?? 'Not set'}</div>
                <div>Parent: {user.studentProfile?.parent ? `${user.studentProfile.parent.firstName} ${user.studentProfile.parent.lastName}` : 'No linked parent'}</div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Notifications</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent updates</h2>
                </div>
                <MessageCircle className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-3 text-sm text-slate-600">
                {user.notifications.length ? (
                  user.notifications.map((notification) => (
                    <div key={notification.id} className="rounded-3xl bg-slate-50 p-4">
                      <p className="font-medium text-slate-900">{notification.title}</p>
                      <p className="mt-1 leading-6">{notification.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-4">No recent notifications yet. Notifications will appear here as your classes and lessons update.</div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-slate-100 p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Connected portals</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Switch accounts</h2>
                </div>
              </div>
              <div className="mt-8 grid gap-4">
                {portalCards.map((portal) => {
                  const Icon = portal.icon
                  return (
                    <Link key={portal.label} href={portal.href} className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${portal.accent}`}> <Icon className="h-5 w-5" /> </span>
                        <div>
                          <p className="font-semibold text-slate-900">{portal.label}</p>
                          <p className="text-sm text-slate-600">{portal.subtitle}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-500" />
                    </Link>
                  )
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PortalLayout>
  )
}
