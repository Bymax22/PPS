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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#003087' }}>
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/student/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter((n: any) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#0EF117' }}></span>
                )}
              </Link>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#003087' }}
                >
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-500">Grade {user.studentProfile.grade}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="mb-8">
          <StudentStats 
            activeClasses={stats.activeClasses}
            completedLessons={stats.completedLessons}
            passedExams={stats.passedExams}
            totalExams={stats.totalExams}
            averageProgress={stats.averageProgress}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SectionCard title="Upcoming Schedule" icon={Calendar}>
              <UpcomingSchedule lessons={upcomingLessons} />
            </SectionCard>

            <SectionCard title="Recent Progress" icon={TrendingUp}>
              <RecentProgress progressRecords={recentProgress} />
            </SectionCard>

            <SectionCard title="Performance Overview" icon={Target}>
              <PerformanceChart examAttempts={examAttempts} />
            </SectionCard>

            <SectionCard title="My Classes" icon={Users}>
              <ActiveClasses enrollments={enrollments} />
            </SectionCard>

            <SectionCard title="Recent Exams" icon={Award}>
              <RecentExams examAttempts={examAttempts} />
            </SectionCard>

            <SectionCard title="Learning Resources" icon={FileText}>
              <ResourcesWidget resources={recentResources} />
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Quick Actions" icon={PlayCircle}>
              <div className="space-y-3">
                <QuickActionButton 
                  href="/student/classes"
                  label="View All Classes"
                  icon={BookOpen}
                  color="#003087"
                />
                <QuickActionButton 
                  href="/student/exams"
                  label="Take an Exam"
                  icon={Award}
                  color="#0EF117"
                />
                <QuickActionButton 
                  href="/student/resources"
                  label="Browse Resources"
                  icon={Download}
                  color="#003087"
                />
                <QuickActionButton 
                  href="/student/messages"
                  label="Send Message"
                  icon={MessageCircle}
                  color="#0EF117"
                />
              </div>
            </SectionCard>

            <SubscriptionStatus subscriptions={subscriptions} />

            <SectionCard title="Notifications" icon={Bell}>
              <NotificationsPanel 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              />
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
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" style={{ color: '#003087' }} />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
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
