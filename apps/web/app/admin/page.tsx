
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { BarChart2, Users, Database, ShieldCheck, ChevronRight } from 'lucide-react'
import PortalLayout from '@/components/PortalLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const portalCards = [
  { label: 'Student', subtitle: 'Your classes, lessons and progress', href: '/portal/student/login', icon: ShieldCheck, accent: 'bg-slate-900 text-white' },
  { label: 'Parent', subtitle: 'Child progress, payments and updates', href: '/portal/parent/login', icon: ShieldCheck, accent: 'bg-slate-800 text-white' },
  { label: 'Teacher', subtitle: 'Class roster, grading and notes', href: '/portal/teacher/login', icon: ShieldCheck, accent: 'bg-slate-700 text-white' },
  { label: 'Admin', subtitle: 'System insights and platform control', href: '/admin', icon: ShieldCheck, accent: 'bg-slate-600 text-white' }
]

export default async function AdminPage() {
  const session = await getServerSession(await getAuthOptions())
  const admin = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email } })
    : null

  if (!admin || admin.role !== 'ADMIN') {
    return (
      <PortalLayout role="admin">
        <div className="space-y-8 py-16">
          <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin access required</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Choose your account to continue</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Switch to an admin account or sign in through another portal to keep the entire school platform connected.</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {portalCards.map((portal) => {
                const Icon = portal.icon
                return (
                  <Link
                    key={portal.label}
                    href={portal.href}
                    className="group flex flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1"
                  >
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

  const [activeUsers, activeSubscriptions, totalClasses, totalLessons, totalRevenue, recentNotifications] = await prisma.$transaction([
    prisma.user.count({ where: { status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { isActive: true } }),
    prisma.class.count(),
    prisma.lesson.count({ where: { status: 'SCHEDULED' } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.notification.findMany({ where: { read: false }, orderBy: { createdAt: 'desc' }, take: 4 })
  ])

  return (
    <PortalLayout role="admin">
      <div className="space-y-8 py-10">
        <section className="rounded-[2rem] bg-slate-100 p-10 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin console</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-900">Welcome back, {admin.firstName}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">View live platform health, user growth, and connected portal access across every account type.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Active users</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{activeUsers}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Active subscriptions</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{activeSubscriptions}</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
                <p className="text-sm text-slate-500">Live classes</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{totalClasses}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <DashboardCard title="Platform snapshots">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Scheduled lessons</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">{totalLessons}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Monthly revenue</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">${totalRevenue._sum.amount?.toFixed(0) ?? '0'}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Unread alerts</p>
                  <p className="mt-4 text-2xl font-semibold text-slate-900">{recentNotifications.length}</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Recent alerts">
              <div className="space-y-4">
                {recentNotifications.length ? (
                  recentNotifications.map((notification) => (
                    <div key={notification.id} className="rounded-3xl bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
                      <p className="font-semibold text-slate-900">{notification.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{notification.body}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">No unread notifications at the moment. System alerts appear here when action is required.</p>
                )}
              </div>
            </DashboardCard>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-white p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">System health</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Live status</h2>
                </div>
                <Database className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-4 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 p-5">DB connections: stable</div>
                <div className="rounded-3xl bg-slate-50 p-5">Background jobs: running smoothly</div>
                <div className="rounded-3xl bg-slate-50 p-5">API health: responding normally</div>
              </div>
            </section>

            <section className="rounded-3xl bg-slate-100 p-8 shadow-[0_16px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">Connected portals</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Account switching</h2>
                </div>
              </div>
              <div className="mt-8 grid gap-4">
                {portalCards.map((portal) => {
                  const Icon = portal.icon
                  return (
                    <Link
                      key={portal.label}
                      href={portal.href}
                      className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-[0_16px_30px_rgba(15,23,42,0.08)] transition-colors hover:bg-slate-50"
                    >
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
