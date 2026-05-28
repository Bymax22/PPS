'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Menu, ChevronRight, BookOpen, Calendar, TrendingUp, Target, Users, Award, PlayCircle, Download, MessageCircle, CreditCard, FileText } from 'lucide-react'
import StudentStats from '@/components/dashboard/StudentStats'
import UpcomingSchedule from '@/components/dashboard/UpcomingSchedule'
import RecentProgress from '@/components/dashboard/RecentProgress'
import ActiveClasses from '@/components/dashboard/ActiveClasses'
import RecentExams from '@/components/dashboard/RecentExams'
import ResourcesWidget from '@/components/dashboard/ResourcesWidget'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus'
import PerformanceChart from '@/components/dashboard/PerformanceChart'

export default function StudentDashboardClient({ 
  user, 
  upcomingLessons, 
  recentProgress, 
  recentResources,
  enrollments,
  examAttempts,
  subscriptions,
  payments,
  notifications,
  stats
}: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to mark notification as read', error)
    }
  }

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' })
    } catch (error) {
      console.error('Failed to mark all notifications as read', error)
    }
  }

  const hasActive = subscriptions?.some((s: any) => s.status === 'active') ?? false;

  return (
    <div className="min-h-screen bg-slate-50 pt-6 lg:pt-20">
      <div className="bg-[#003087] text-white pb-10">
        <div className="container mx-auto px-6 pt-10 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.28em] text-sky-200">Student portal</p>
              <h1 className="text-4xl font-bold mt-3">Welcome back, {user.firstName}</h1>
              <p className="mt-3 text-sm text-slate-200 max-w-2xl">
                Your learning dashboard gives you quick access to upcoming classes, assignments, progress, and helpful links.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-white/10 p-5 shadow-sm border border-white/10">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Active classes</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.activeClasses}</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 shadow-sm border border-white/10">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Avg progress</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.averageProgress}%</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 shadow-sm border border-white/10">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-200">Passed exams</p>
                  <p className="mt-3 text-3xl font-semibold">{stats.passedExams}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 flex items-center gap-4 border border-white/10">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold text-lg">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="text-sm text-slate-100">
                  <p className="font-semibold">{user.firstName} {user.lastName}</p>
                  <p className="text-xs">Parent: {user.studentProfile.parent ? `${user.studentProfile.parent.firstName} ${user.studentProfile.parent.lastName}` : '—'}</p>
                  <p className="text-xs">Class: Grade {user.studentProfile.grade}</p>
                  <p className="mt-2">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${hasActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {hasActive ? 'Subscription active' : 'No subscription'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 -mt-10 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#003087] flex items-center justify-center text-white text-xl font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-slate-500">Grade {user.studentProfile.grade}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Next class</p>
                <p className="mt-2 font-medium text-slate-900">{upcomingLessons[0]?.title ?? 'No scheduled lessons'}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notifications</p>
                <p className="mt-2 font-medium text-slate-900">{notifications.filter((n: any) => !n.read).length} unread</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Quick links</h2>
            <div className="space-y-3">
              <QuickActionButton href="/student/classes" label="My Classes" icon={BookOpen} color="#003087" />
              <QuickActionButton href="/student/exams" label="Exam Center" icon={Award} color="#0EF117" />
              <QuickActionButton href="/student/resources" label="Resource Hub" icon={Download} color="#003087" />
              <QuickActionButton href="/student/messages" label="Messages" icon={MessageCircle} color="#0EF117" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Student snapshot</h2>
            <StudentStats 
              activeClasses={stats.activeClasses}
              completedLessons={stats.completedLessons}
              passedExams={stats.passedExams}
              totalExams={stats.totalExams}
              averageProgress={stats.averageProgress}
            />
          </div>
        </aside>

        <section className="space-y-6">
          <SectionCard title="Upcoming Schedule" icon={Calendar}>
            <UpcomingSchedule lessons={upcomingLessons} />
          </SectionCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Recent Progress"
              icon={TrendingUp}
              isEmpty={!recentProgress || recentProgress.length === 0}
              emptyContent={(
                <div className="text-center py-6">
                  <p className="font-semibold">No progress records yet</p>
                  <p className="text-sm text-gray-500 mt-2">Start watching lessons to track your progress</p>
                  <div className="mt-4">
                    <Link href="/student/classes" className="inline-block px-4 py-2 rounded-lg bg-[#003087] text-white">Browse Classes</Link>
                  </div>
                </div>
              )}
            >
              <RecentProgress progressRecords={recentProgress} />
            </SectionCard>

            <SectionCard
              title="Performance Overview"
              icon={Target}
              isEmpty={!examAttempts || examAttempts.length === 0}
              emptyContent={(
                <div className="text-center py-6">
                  <p className="font-semibold">Complete exams to see your performance chart</p>
                </div>
              )}
            >
              <PerformanceChart examAttempts={examAttempts} />
            </SectionCard>
          </div>

          <SectionCard
            title="My Classes"
            icon={Users}
            isEmpty={!enrollments || enrollments.length === 0}
            emptyContent={(
              <div className="text-center py-6">
                <p className="font-semibold">No active classes</p>
                <p className="text-sm text-gray-500 mt-2">Enroll in a program to start learning</p>
                <div className="mt-4">
                  <Link href="/portal/student/register" className="inline-block px-4 py-2 rounded-lg bg-[#003087] text-white">Browse Programs</Link>
                </div>
              </div>
            )}
          >
            <ActiveClasses enrollments={enrollments} />
          </SectionCard>

          <SectionCard
            title="Recent Exams"
            icon={Award}
            isEmpty={!examAttempts || examAttempts.length === 0}
            emptyContent={(
              <div className="text-center py-6">
                <p className="font-semibold">No exam attempts yet</p>
                <p className="text-sm text-gray-500 mt-2">Check your classes for available exams</p>
              </div>
            )}
          >
            <RecentExams examAttempts={examAttempts} />
          </SectionCard>
        </section>

        <aside className="space-y-6">
          <SectionCard
            title="Notifications"
            icon={Bell}
            isEmpty={!notifications || notifications.filter((n: any) => !n.read).length === 0}
            emptyContent={(
              <div className="text-center py-6">
                <p className="font-semibold">No new notifications</p>
                <p className="text-sm text-gray-500 mt-2">You're all caught up!</p>
              </div>
            )}
          >
            <NotificationsPanel 
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
          </SectionCard>

          <SectionCard
            title="Learning Resources"
            icon={FileText}
            isEmpty={!recentResources || recentResources.length === 0}
            emptyContent={(
              <div className="text-center py-6">
                <p className="font-semibold">No resources available</p>
              </div>
            )}
          >
            <ResourcesWidget resources={recentResources} />
          </SectionCard>

          {user.studentProfile.parent && (
            <SectionCard title="Parent Connection" icon={Users}>
              <div className="space-y-3">
                <InfoRow label="Name" value={`${user.studentProfile.parent.firstName} ${user.studentProfile.parent.lastName}`} />
                <InfoRow label="Email" value={user.studentProfile.parent.email} />
                {user.studentProfile.parent.phone && (
                  <InfoRow label="Phone" value={user.studentProfile.parent.phone} />
                )}
                <button 
                  className="w-full mt-3 py-2 px-4 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#003087' }}
                >
                  Contact Parent
                </button>
              </div>
            </SectionCard>
          )}

          {payments.length > 0 && (
            <SectionCard title="Recent Payments" icon={CreditCard}>
              <div className="space-y-3">
                {payments.map((payment: any) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </div>
            </SectionCard>
          )}
        </aside>
      </main>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children, isEmpty = false, emptyContent = null }: any) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div
        className="p-6 border-b border-gray-200 cursor-pointer"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(!open) }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" style={{ color: '#003087' }} />
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transform transition-transform ${open ? 'rotate-90' : ''}`} />
        </div>
      </div>
      {open && (
        <div className="p-6">
          {isEmpty ? (emptyContent ?? null) : children}
        </div>
      )}
    </div>
  )
}

function QuickActionButton({ href, label, icon: Icon, color }: any) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" style={{ color }} />
        <span className="text-gray-900">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </Link>
  )
}

function InfoRow({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-900 mt-1">{value}</p>
    </div>
  )
}

function PaymentCard({ payment }: any) {
  const statusColors: any = {
    SUCCEEDED: '#0EF117',
    PENDING: '#003087',
    FAILED: '#dc2626'
  }
  
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
      <div>
        <p className="font-medium text-gray-900">${payment.amount}</p>
        <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
      </div>
      <div 
        className="px-2 py-1 rounded text-xs font-semibold text-white"
        style={{ backgroundColor: statusColors[payment.status] }}
      >
        {payment.status}
      </div>
    </div>
  )
}
