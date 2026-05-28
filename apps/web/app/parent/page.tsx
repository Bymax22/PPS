import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { BarChart2, ChevronRight, FileText, MessageCircle, ShieldCheck, User } from 'lucide-react'
import PortalLayout from '@/components/PortalLayout'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const portalCards = [
  { label: 'Student', subtitle: 'Your classes, lessons and progress', href: '/portal/student/login', icon: User, accent: 'bg-slate-900 text-white' },
  { label: 'Parent', subtitle: 'Child progress, payments and updates', href: '/portal/parent/login', icon: User, accent: 'bg-slate-800 text-white' },
  { label: 'Teacher', subtitle: 'Class roster, grading and notes', href: '/portal/teacher/login', icon: FileText, accent: 'bg-slate-700 text-white' },
  { label: 'Admin', subtitle: 'System health and subscriptions', href: '/admin', icon: ShieldCheck, accent: 'bg-slate-600 text-white' }
]

function formatDate(date?: Date) {
  if (!date) return 'TBA'
  return date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default async function ParentPage() {
  const session = await getServerSession(await getAuthOptions())

  if (!session?.user?.email) {
    return (
      <PortalLayout role="parent">
        <div className="space-y-8">
          <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Parent portal</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Choose your account to continue</h1>
              <p className="mt-4 text-base leading-7 text-slate-600">Switch between parent, student, teacher and admin access to keep every portal connected and up to date.</p>
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

  const parent = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      children: {
        include: {
          user: {
            include: {
              enrollments: { include: { class: { include: { program: true } } } },
              progressRecords: {
                orderBy: { updatedAt: 'desc' },
                take: 4,
                include: { lesson: { include: { class: true } } }
              }
            }
          }
        }
      },
      payments: { orderBy: { createdAt: 'desc' }, take: 1 },
      notifications: { orderBy: { createdAt: 'desc' }, take: 4 }
    }
  })

  if (!parent) {
    return (
      <PortalLayout role="parent">
        <div className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-3xl font-semibold text-slate-900">Parent dashboard</h1>
          <p className="mt-4 text-slate-600">We could not find your parent profile. Please sign in through the parent portal or register.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/portal/parent/login" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">Sign in</Link>
            <Link href="/portal/parent/register" className="inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">Register</Link>
          </div>
        </div>
      </PortalLayout>
    )
  }

  const children = parent.children
  const activeChildren = children.length
  const totalProgress = children.reduce((sum, child) => {
    const progressValues = child.user.progressRecords.map((record) => record.percentageWatched)
    return sum + (progressValues.length ? progressValues.reduce((a, b) => a + b, 0) / progressValues.length : 0)
  }, 0)
  const averageChildProgress = activeChildren ? Math.round(totalProgress / activeChildren) : 0

  return (
    <PortalLayout role="parent">
      <div className="space-y-8">
        <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Parent dashboard</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Welcome back, {parent.firstName}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Manage your child’s progress, payments, and linked accounts in one connected portal experience.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Children</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{activeChildren}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Average progress</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{averageChildProgress}%</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Last payment</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{parent.payments[0]?.createdAt ? new Date(parent.payments[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Child overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Your family at a glance</h2>
                </div>
                <User className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-4">
                {children.length ? (
                  children.map((child) => {
                    const childProgress = child.user.progressRecords.length
                      ? Math.round(child.user.progressRecords.reduce((sum, item) => sum + item.percentageWatched, 0) / child.user.progressRecords.length)
                      : 0
                    return (
                      <div key={child.id} className="rounded-3xl bg-slate-50 p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-900">{child.user.firstName} {child.user.lastName}</p>
                            <p className="mt-1 text-sm text-slate-600">Grade {child.grade} • {child.user.enrollments.length} enrolled classes</p>
                          </div>
                          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{childProgress}%</span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">No linked children found. Link your child profile to see progress and activity here.</div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Recent activities</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest learning updates</h2>
                </div>
                <MessageCircle className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-4 text-sm text-slate-600">
                {children.flatMap((child) => child.user.progressRecords).length ? (
                  children.flatMap((child) => child.user.progressRecords).slice(0, 5).map((record) => (
                    <div key={record.id} className="rounded-3xl bg-slate-50 p-4">
                      <p className="font-medium text-slate-900">{record.lesson.title}</p>
                      <p className="mt-1 leading-6">{record.lesson.class?.name ?? 'Lesson'} • {record.percentageWatched}% complete</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-4">No recent child activity yet. Once your child begins lessons, progress updates will appear here.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Payments</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Latest invoice</h2>
                </div>
                <FileText className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 text-sm text-slate-600">
                {parent.payments.length ? (
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="font-medium text-slate-900">{parent.payments[0].currency} {parent.payments[0].amount.toFixed(2)}</p>
                    <p className="mt-2">{new Date(parent.payments[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-5">No recent payments found. Manage your invoices in the payment portal.</div>
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
                        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${portal.accent}`}>
                          <Icon className="h-5 w-5" />
                        </span>
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
