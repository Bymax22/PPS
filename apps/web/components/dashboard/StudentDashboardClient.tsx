'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  Menu, 
  X,
  ChevronRight, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Target, 
  Users, 
  Award, 
  PlayCircle, 
  Download, 
  MessageCircle, 
  CreditCard, 
  FileText,
  Trophy as TrophyIcon,
  Home,
  LogOut,
  User,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import StudentStats from '@/components/dashboard/StudentStats'
import UpcomingSchedule from '@/components/dashboard/UpcomingSchedule'
import RecentProgress from '@/components/dashboard/RecentProgress'
import ActiveClasses from '@/components/dashboard/ActiveClasses'
import RecentExams from '@/components/dashboard/RecentExams'
import ResourcesWidget from '@/components/dashboard/ResourcesWidget'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import StudentDashboardSidebar from '@/components/StudentDashboardSidebar'

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const hasActiveSubscription = subscriptions?.some((s: any) => s.isActive === true) ?? false
  const unreadCount = notifications?.filter((n: any) => !n.read).length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: '#003087' }}
                  >
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">Grade {user.studentProfile.grade}</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <MobileNavItem href="/student" icon={Home} label="Dashboard" active />
                <MobileNavItem href="/student/classes" icon={BookOpen} label="My Classes" />
                <MobileNavItem href="/student/exams" icon={Award} label="Exams" />
                <MobileNavItem href="/student/resources" icon={FileText} label="Resources" />
                <MobileNavItem href="/student/messages" icon={MessageCircle} label="Messages" />
                <MobileNavItem href="/student/settings" icon={Settings} label="Settings" />
              </nav>
              
              <div className="absolute bottom-8 left-0 right-0 px-6">
                <button className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors w-full p-3">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setSidebarCollapsed((s) => !s)}
                className="hidden lg:inline-flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
              </button>
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#003087' }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold" style={{ color: '#003087' }}>
                  EduPortal
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Button */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#0EF117' }} />
                )}
              </button>

              {/* Desktop User Menu */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#003087' }}
                >
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:block px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="flex gap-6">
            {['overview', 'classes', 'exams', 'resources', 'messages'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab 
                    ? 'text-[#003087]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#003087' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="lg:grid lg:gap-6" style={{ gridTemplateColumns: sidebarCollapsed ? '72px 1fr' : '280px 1fr' }}>
          <aside className={`hidden lg:block pt-2 ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
            <StudentDashboardSidebar
              collapsed={sidebarCollapsed}
              studentName={`${user.firstName} ${user.lastName}`}
              grade={user.studentProfile?.grade}
              schoolYear={null}
              parentName={user.studentProfile?.parent ? `${user.studentProfile.parent.firstName} ${user.studentProfile.parent.lastName}` : 'N/A'}
              activeClasses={stats?.activeClasses ?? 0}
              nextLessonTitle={upcomingLessons?.[0]?.class?.name ?? upcomingLessons?.[0]?.title ?? 'No upcoming lessons'}
            />
          </aside>

          <main className="lg:col-start-2">
            {/* Pastel top summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(90deg,#e6f0ff,#f3fbff)' }}>
                <p className="text-xs text-slate-600 uppercase tracking-wider">Active Subscriptions</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{subscriptions?.length ?? 0}</p>
                <p className="text-sm text-slate-500 mt-1">View details</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(90deg,#e9fbe9,#f7fff7)' }}>
                <p className="text-xs text-slate-600 uppercase tracking-wider">Classes Enrolled</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{stats?.activeClasses ?? 0}</p>
                <p className="text-sm text-slate-500 mt-1">View classes</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(90deg,#fff7e6,#fffbf0)' }}>
                <p className="text-xs text-slate-600 uppercase tracking-wider">Lessons Completed</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{stats?.completedLessons ?? 0}</p>
                <p className="text-sm text-slate-500 mt-1">This month</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'linear-gradient(90deg,#f0f7ff,#fff)' }}>
                <p className="text-xs text-slate-600 uppercase tracking-wider">Next Lesson</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{upcomingLessons?.[0]?.title ?? '—'}</p>
                <p className="text-sm text-slate-500 mt-1">{upcomingLessons?.[0] ? new Date(upcomingLessons[0].scheduledAt).toLocaleString() : ''}</p>
              </div>
            </div>
        {/* Welcome Banner */}
        <div className="mb-8 p-6 rounded-xl shadow-sm bg-gradient-to-r from-[#003087] to-[#0a4fb6]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">Welcome back,</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Grade {user.studentProfile.grade} • Student ID: {user.id.slice(-8)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-lg bg-white/10">
                <p className="text-xs text-white/70">Active Classes</p>
                <p className="text-2xl font-bold text-white">{stats.activeClasses}</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/10">
                <p className="text-xs text-white/70">Completion Rate</p>
                <p className="text-2xl font-bold text-white">{stats.averageProgress}%</p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-white/10">
                <p className="text-xs text-white/70">Exams Passed</p>
                <p className="text-2xl font-bold text-white">{stats.passedExams}/{stats.totalExams}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={BookOpen}
            label="Active Classes"
            value={stats.activeClasses}
            subtitle="Currently enrolled"
          />
          <StatCard 
            icon={CheckCircle}
            label="Completed Lessons"
            value={stats.completedLessons}
            subtitle={`${stats.averageProgress}% of total`}
          />
          <StatCard 
            icon={TrophyIcon}
            label="Exams Passed"
            value={`${stats.passedExams}/${stats.totalExams}`}
            subtitle={stats.passedExams > 0 ? "Keep going!" : "Start taking exams"}
          />
          <StatCard 
            icon={Clock}
            label="Next Class"
            value={upcomingLessons[0]?.title?.split(' ').slice(0, 2).join(' ') || "None"}
            subtitle={upcomingLessons[0] ? new Date(upcomingLessons[0].scheduledAt).toLocaleDateString() : "No upcoming"}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Schedule */}
            <DashboardCard title="Upcoming Schedule" icon={Calendar}>
              <UpcomingSchedule lessons={upcomingLessons} />
            </DashboardCard>

            {/* Two Column Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard title="Recent Progress" icon={TrendingUp}>
                {recentProgress?.length > 0 ? (
                  <RecentProgress progressRecords={recentProgress.slice(0, 3)} />
                ) : (
                  <EmptyState 
                    message="No progress records yet" 
                    action={{ label: "Browse Classes", href: "/student/classes" }}
                  />
                )}
              </DashboardCard>

              <DashboardCard title="Performance Overview" icon={Target}>
                {examAttempts?.length > 0 ? (
                  <PerformanceChart examAttempts={examAttempts} />
                ) : (
                  <EmptyState message="Complete exams to see your performance" />
                )}
              </DashboardCard>
            </div>

            {/* Active Classes */}
            <DashboardCard title="Active Classes" icon={Users}>
              {enrollments?.length > 0 ? (
                <ActiveClasses enrollments={enrollments.slice(0, 2)} />
              ) : (
                <EmptyState 
                  message="No active classes" 
                  action={{ label: "Browse Programs", href: "/portal/student/register" }}
                />
              )}
              {enrollments?.length > 2 && (
                <Link 
                  href="/student/classes"
                  className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                  style={{ color: '#003087' }}
                >
                  View all {enrollments.length} classes →
                </Link>
              )}
            </DashboardCard>

            {/* Recent Exams */}
            <DashboardCard title="Recent Exams" icon={Award}>
              {examAttempts?.length > 0 ? (
                <RecentExams examAttempts={examAttempts.slice(0, 2)} />
              ) : (
                <EmptyState message="No exam attempts yet" />
              )}
              {examAttempts?.length > 2 && (
                <Link 
                  href="/student/exams"
                  className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                  style={{ color: '#003087' }}
                >
                  View all exams →
                </Link>
              )}
            </DashboardCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <DashboardCard title="Quick Actions" icon={PlayCircle}>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionCard 
                  href="/student/classes"
                  label="My Classes"
                  icon={BookOpen}
                />
                <QuickActionCard 
                  href="/student/exams"
                  label="Exam Center"
                  icon={Award}
                />
                <QuickActionCard 
                  href="/student/resources"
                  label="Resources"
                  icon={Download}
                />
                <QuickActionCard 
                  href="/student/messages"
                  label="Messages"
                  icon={MessageCircle}
                />
              </div>
            </DashboardCard>

            {/* Subscription Status */}
            <DashboardCard title="Subscription" icon={CreditCard}>
              <SubscriptionStatus subscriptions={subscriptions} />
            </DashboardCard>

            {/* Recent Resources */}
            <DashboardCard title="Recent Resources" icon={FileText}>
              {recentResources?.length > 0 ? (
                <ResourcesWidget resources={recentResources.slice(0, 3)} />
              ) : (
                <EmptyState message="No resources available" />
              )}
              {recentResources?.length > 3 && (
                <Link 
                  href="/student/resources"
                  className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                  style={{ color: '#003087' }}
                >
                  Browse all resources →
                </Link>
              )}
            </DashboardCard>

            {/* Notifications */}
            <DashboardCard title="Notifications" icon={Bell}>
              {notifications?.length > 0 ? (
                <NotificationsPanel 
                  notifications={notifications.slice(0, 3)}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                />
              ) : (
                <EmptyState message="No new notifications" />
              )}
              {notifications?.length > 3 && (
                <Link 
                  href="/student/notifications"
                  className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                  style={{ color: '#003087' }}
                >
                  View all notifications →
                </Link>
              )}
            </DashboardCard>

            {/* Parent Connection */}
            {user.studentProfile.parent && (
              <DashboardCard title="Parent Connection" icon={Users}>
                <div className="space-y-3">
                  <InfoRow label="Name" value={`${user.studentProfile.parent.firstName} ${user.studentProfile.parent.lastName}`} />
                  <InfoRow label="Email" value={user.studentProfile.parent.email} />
                  {user.studentProfile.parent.phone && (
                    <InfoRow label="Phone" value={user.studentProfile.parent.phone} />
                  )}
                  <button 
                    className="w-full mt-4 py-2 px-4 rounded-lg text-white font-medium text-sm transition-colors hover:bg-opacity-90"
                    style={{ backgroundColor: '#003087' }}
                  >
                    Send Message
                  </button>
                </div>
              </DashboardCard>
            )}

            {/* Recent Payments */}
            {payments?.length > 0 && (
              <DashboardCard title="Recent Payments" icon={CreditCard}>
                <div className="space-y-2">
                  {payments.slice(0, 2).map((payment: any) => (
                    <PaymentCard key={payment.id} payment={payment} />
                  ))}
                </div>
                {payments.length > 2 && (
                  <Link 
                    href="/student/payments"
                    className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                    style={{ color: '#003087' }}
                  >
                    View payment history →
                  </Link>
                )}
              </DashboardCard>
            )}
          </div>
        </div>
        </main>
      </div>
    </div>
  </div>
  )
}

// Component Definitions

function StatCard({ icon: Icon, label, value, subtitle }: any) {
  const bgMap: any = {
    'Active Classes': 'from-blue-100 to-blue-50',
    'Completed Lessons': 'from-emerald-100 to-emerald-50',
    'Exams Passed': 'from-violet-100 to-violet-50',
    'Next Class': 'from-yellow-100 to-yellow-50'
  }
  const colorMap: any = {
    'Active Classes': '#0b61d6',
    'Completed Lessons': '#059669',
    'Exams Passed': '#6d28d9',
    'Next Class': '#b45309'
  }

  const bgClass = bgMap[label] || 'from-slate-100 to-white'
  const iconColor = colorMap[label] || '#003087'

  return (
    <div className={`rounded-2xl p-4 shadow-sm`}>
      <div className={`flex items-center justify-between gap-4 bg-gradient-to-r ${bgClass} p-4 rounded-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/70">
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">{label}</p>
            <p className="text-lg font-bold text-slate-900">{value}</p>
          </div>
        </div>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
    </div>
  )
}

function DashboardCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50">
            <Icon className="w-4 h-4 text-slate-700" />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-sm text-slate-500">{''}</div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

function QuickActionCard({ href, label, icon: Icon }: any) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white hover:shadow-md transition-shadow text-center"
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#00308710]">
        <Icon className="w-5 h-5 text-[#003087]" />
      </div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </Link>
  )
}

function EmptyState({ message, action }: any) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center bg-gray-50">
        <AlertCircle className="w-8 h-8 text-slate-400" />
      </div>
      <p className="text-gray-600 text-sm font-medium">{message}</p>
      {action && (
        <Link 
          href={action.href}
          className="inline-block mt-3 text-sm font-medium text-[#003087] hover:opacity-90"
        >
          {action.label} →
        </Link>
      )}
    </div>
  )
}

function MobileNavItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-[#003087] text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  )
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

function PaymentCard({ payment }: any) {
  const statusConfig: any = {
    SUCCEEDED: { color: '#0EF117', label: 'Paid' },
    PENDING: { color: '#003087', label: 'Pending' },
    FAILED: { color: '#dc2626', label: 'Failed' }
  }
  
  const config = statusConfig[payment.status] || statusConfig.PENDING
  
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
      <div>
        <p className="font-semibold text-gray-900">${payment.amount}</p>
        <p className="text-xs text-gray-500 mt-0.5">{payment.paymentMethod.replace('_', ' ')}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(payment.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div 
        className="px-2 py-1 rounded-lg text-xs font-semibold text-white"
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </div>
    </div>
  )
}