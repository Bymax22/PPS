// app/(dashboard)/parent/page.tsx
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
  Users, 
  Award, 
  CreditCard,
  MessageCircle,
  UserPlus,
  UserMinus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  FileText,
  Home,
  Settings,
  LogOut,
  Plus,
  Minus,
  Send,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'

// Types
interface Child {
  id: string
  userId: string
  grade: number
  schoolYear?: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    profileImage?: string
  }
  progress?: ProgressSummary
  attendance?: AttendanceSummary
}

interface ProgressSummary {
  averageScore: number
  completedLessons: number
  totalLessons: number
  passedExams: number
  totalExams: number
  recentActivity: Activity[]
}

interface AttendanceSummary {
  present: number
  absent: number
  late: number
  excused: number
  percentage: number
}

interface Activity {
  id: string
  type: string
  title: string
  date: Date
  score?: number
  status: string
}

interface PaymentMethod {
  id: string
  type: string
  last4?: string
  isDefault: boolean
}

export default function ParentDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<string | null>(null)
  const [showAddChild, setShowAddChild] = useState(false)
  const [showMakePayment, setShowMakePayment] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [scrolled, setScrolled] = useState(false)

  // Mock data - replace with actual API calls
  const [children, setChildren] = useState<Child[]>([
    {
      id: '1',
      userId: 'user1',
      grade: 10,
      schoolYear: '2024',
      user: {
        firstName: 'parent',
        lastName: 'parent',
        email: 'parent@example.com',
        phone: '+260XXXXXXXXX'
      }
    },
    {
      id: '2',
      userId: 'user2',
      grade: 8,
      schoolYear: '2024',
      user: {
        firstName: 'Emma',
        lastName: 'Doe',
        email: 'emma.doe@example.com'
      }
    }
  ])

  const [progressData, setProgressData] = useState<Record<string, ProgressSummary>>({
    '1': {
      averageScore: 85,
      completedLessons: 24,
      totalLessons: 30,
      passedExams: 8,
      totalExams: 10,
      recentActivity: [
        { id: '1', type: 'exam', title: 'Mathematics Final', date: new Date(), score: 88, status: 'passed' },
        { id: '2', type: 'lesson', title: 'Physics - Chapter 5', date: new Date(), status: 'completed' },
        { id: '3', type: 'assignment', title: 'Chemistry Lab Report', date: new Date(), score: 92, status: 'graded' }
      ]
    },
    '2': {
      averageScore: 78,
      completedLessons: 18,
      totalLessons: 25,
      passedExams: 5,
      totalExams: 8,
      recentActivity: [
        { id: '1', type: 'exam', title: 'English Literature', date: new Date(), score: 82, status: 'passed' },
        { id: '2', type: 'lesson', title: 'History - World Wars', date: new Date(), status: 'completed' }
      ]
    }
  })

  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceSummary>>({
    '1': {
      present: 28,
      absent: 2,
      late: 1,
      excused: 1,
      percentage: 89
    },
    '2': {
      present: 25,
      absent: 3,
      late: 2,
      excused: 1,
      percentage: 81
    }
  })

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Assignment', message: 'John has a new math assignment due tomorrow', date: new Date(), read: false, childId: '1' },
    { id: '2', title: 'Payment Reminder', message: 'School fees payment due in 5 days', date: new Date(), read: false, childId: null },
    { id: '3', title: 'Exam Results', message: 'Emma\'s science exam results are available', date: new Date(), read: true, childId: '2' }
  ])

  const [messages, setMessages] = useState([
    { id: '1', from: 'Mr. Smith', fromRole: 'Teacher', message: 'John has been showing great improvement in mathematics.', date: new Date(), read: false, childId: '1' },
    { id: '2', from: 'Ms. Johnson', fromRole: 'Teacher', message: 'Emma needs to complete her pending assignments.', date: new Date(), read: true, childId: '2' }
  ])

  const [payments, setPayments] = useState([
    { id: '1', childId: '1', amount: 500, status: 'paid', date: new Date(), description: 'Term 1 Fees', method: 'Credit Card' },
    { id: '2', childId: '2', amount: 500, status: 'pending', date: new Date(), description: 'Term 1 Fees', method: null }
  ])

  const [savedCards, setSavedCards] = useState<PaymentMethod[]>([
    { id: '1', type: 'visa', last4: '4242', isDefault: true },
    { id: '2', type: 'mastercard', last4: '5555', isDefault: false }
  ])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const selectedChildData = selectedChild ? children.find(c => c.id === selectedChild) : null
  const selectedProgress = selectedChild ? progressData[selectedChild] : null
  const selectedAttendance = selectedChild ? attendanceData[selectedChild] : null

  const totalOutstanding = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

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
                    P
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Parent Portal</p>
                    <p className="text-sm text-gray-500">Sarah Johnson</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <MobileNavItem href="/parent" icon={Home} label="Dashboard" active />
                <MobileNavItem href="/parent/children" icon={Users} label="My Children" />
                <MobileNavItem href="/parent/payments" icon={CreditCard} label="Payments" />
                <MobileNavItem href="/parent/messages" icon={MessageCircle} label="Messages" />
                <MobileNavItem href="/parent/settings" icon={Settings} label="Settings" />
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
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: '#003087' }}
                >
                  <Users className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold" style={{ color: '#003087' }}>
                  Parent Portal
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#0EF117' }} />
                )}
              </button>

              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Parent</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#003087' }}
                >
                  SJ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:block px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="flex gap-6">
            {['overview', 'children', 'payments', 'messages', 'settings'].map((tab) => (
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
      <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Welcome Banner */}
        <div className="mb-8 p-6 rounded-xl" style={{ backgroundColor: '#003087' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/80">Welcome back,</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mt-1">
                Sarah Johnson
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Managing {children.length} child{children.length !== 1 ? 'ren' : ''} • {totalOutstanding > 0 ? `${totalOutstanding} USD outstanding` : 'All fees paid'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddChild(true)}
                className="px-4 py-2 rounded-lg bg-white text-[#003087] font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Child
              </button>
              <button
                onClick={() => setShowMakePayment(true)}
                className="px-4 py-2 rounded-lg bg-[#0EF117] text-[#003087] font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Make Payment
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Users}
            label="My Children"
            value={children.length}
            subtitle="Active students"
          />
          <StatCard 
            icon={BarChart3}
            label="Avg. Performance"
            value={`${Math.round(children.reduce((sum, child) => sum + (progressData[child.id]?.averageScore || 0), 0) / children.length)}%`}
            subtitle="Across all children"
          />
          <StatCard 
            icon={CheckCircle}
            label="Attendance Rate"
            value={`${Math.round(children.reduce((sum, child) => sum + (attendanceData[child.id]?.percentage || 0), 0) / children.length)}%`}
            subtitle="Average attendance"
          />
          <StatCard 
            icon={CreditCard}
            label="Outstanding"
            value={`$${totalOutstanding}`}
            subtitle="Due for payment"
          />
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Child</label>
            <div className="flex gap-3 flex-wrap">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedChild === child.id
                      ? 'bg-[#003087] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {child.user.firstName} {child.user.lastName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If no child selected and multiple children, show summary */}
        {!selectedChild && children.length > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {children.map(child => (
              <ChildSummaryCard
                key={child.id}
                child={child}
                progress={progressData[child.id]}
                attendance={attendanceData[child.id]}
                onSelect={() => setSelectedChild(child.id)}
              />
            ))}
          </div>
        )}

        {/* Detailed View for Selected Child */}
        {(selectedChild || children.length === 1) && (
          <>
            {children.length === 1 && !selectedChild && setSelectedChild(children[0].id)}
            
            {selectedChildData && selectedProgress && selectedAttendance && (
              <>
                {/* Child Profile Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: '#003087' }}>
                        {selectedChildData.user.firstName[0]}{selectedChildData.user.lastName[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {selectedChildData.user.firstName} {selectedChildData.user.lastName}
                        </h3>
                        <p className="text-gray-600">Grade {selectedChildData.grade} • {selectedChildData.schoolYear}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Mail className="w-3 h-3" />
                            {selectedChildData.user.email}
                          </span>
                          {selectedChildData.user.phone && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <Phone className="w-3 h-3" />
                              {selectedChildData.user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {/* Remove child logic */}}
                        className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" />
                        Remove
                      </button>
                      <Link
                        href={`/parent/messages?child=${selectedChildData.id}`}
                        className="px-3 py-2 rounded-lg text-[#003087] hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message Teacher
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <MetricCard
                    label="Average Score"
                    value={`${selectedProgress.averageScore}%`}
                    subtitle="Overall performance"
                    color="#003087"
                  />
                  <MetricCard
                    label="Lessons Completed"
                    value={`${selectedProgress.completedLessons}/${selectedProgress.totalLessons}`}
                    subtitle={`${Math.round((selectedProgress.completedLessons / selectedProgress.totalLessons) * 100)}% complete`}
                    color="#0EF117"
                  />
                  <MetricCard
                    label="Exams Passed"
                    value={`${selectedProgress.passedExams}/${selectedProgress.totalExams}`}
                    subtitle={`${Math.round((selectedProgress.passedExams / selectedProgress.totalExams) * 100)}% pass rate`}
                    color="#003087"
                  />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - 2/3 */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Recent Activity */}
                    <DashboardCard title="Recent Activity" icon={Clock}>
                      <div className="space-y-3">
                        {selectedProgress.recentActivity.map(activity => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))}
                      </div>
                    </DashboardCard>

                    {/* Attendance Overview */}
                    <DashboardCard title="Attendance Overview" icon={Calendar}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <AttendanceStat label="Present" value={selectedAttendance.present} color="#0EF117" />
                          <AttendanceStat label="Absent" value={selectedAttendance.absent} color="#dc2626" />
                          <AttendanceStat label="Late" value={selectedAttendance.late} color="#f59e0b" />
                          <AttendanceStat label="Excused" value={selectedAttendance.excused} color="#003087" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Overall Attendance</span>
                            <span className="font-semibold" style={{ color: selectedAttendance.percentage >= 85 ? '#0EF117' : '#f59e0b' }}>
                              {selectedAttendance.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all"
                              style={{ 
                                width: `${selectedAttendance.percentage}%`,
                                backgroundColor: selectedAttendance.percentage >= 85 ? '#0EF117' : '#f59e0b'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </DashboardCard>

                    {/* Teacher Messages */}
                    <DashboardCard title="Teacher Messages" icon={MessageCircle}>
                      {messages.filter(m => m.childId === selectedChild).length > 0 ? (
                        <div className="space-y-3">
                          {messages.filter(m => m.childId === selectedChild).map(msg => (
                            <MessageItem key={msg.id} message={msg} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState message="No messages from teachers" />
                      )}
                      <Link 
                        href={`/parent/messages?child=${selectedChild}`}
                        className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                        style={{ color: '#003087' }}
                      >
                        Send a message →
                      </Link>
                    </DashboardCard>
                  </div>

                  {/* Right Column - 1/3 */}
                  <div className="space-y-6">
                    {/* Payment Status */}
                    <DashboardCard title="Payment Status" icon={CreditCard}>
                      <div className="space-y-3">
                        {payments.filter(p => p.childId === selectedChild).map(payment => (
                          <PaymentStatusCard key={payment.id} payment={payment} />
                        ))}
                        {payments.filter(p => p.childId === selectedChild).length === 0 && (
                          <EmptyState message="No payment records" />
                        )}
                      </div>
                      <button
                        onClick={() => setShowMakePayment(true)}
                        className="w-full mt-4 py-2 px-4 rounded-lg text-white font-medium transition-colors hover:bg-opacity-90"
                        style={{ backgroundColor: '#003087' }}
                      >
                        Make a Payment
                      </button>
                    </DashboardCard>

                    {/* Upcoming Events */}
                    <DashboardCard title="Upcoming Events" icon={Calendar}>
                      <div className="space-y-3">
                        <EventItem 
                          title="Parent-Teacher Meeting"
                          date={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                          type="meeting"
                        />
                        <EventItem 
                          title="Term Exams Start"
                          date={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
                          type="exam"
                        />
                        <EventItem 
                          title="Fee Payment Deadline"
                          date={new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)}
                          type="payment"
                        />
                      </div>
                    </DashboardCard>

                    {/* Notifications */}
                    <DashboardCard title="Notifications" icon={Bell}>
                      {notifications.filter(n => !n.childId || n.childId === selectedChild).slice(0, 3).map(notification => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                      {notifications.length === 0 && (
                        <EmptyState message="No new notifications" />
                      )}
                    </DashboardCard>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Add Child Modal */}
      {showAddChild && (
        <AddChildModal onClose={() => setShowAddChild(false)} onAdd={(child) => {
          // Add child logic
          setShowAddChild(false)
        }} />
      )}

      {/* Make Payment Modal */}
      {showMakePayment && (
        <PaymentModal 
          children={children}
          selectedChild={selectedChild}
          savedCards={savedCards}
          onClose={() => setShowMakePayment(false)}
          onPay={(data) => {
            // Process payment logic
            setShowMakePayment(false)
          }}
        />
      )}
    </div>
  )
}

// Component Definitions

function StatCard({ icon: Icon, label, value, subtitle }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308710' }}>
          <Icon className="w-5 h-5" style={{ color: '#003087' }} />
        </div>
        <span className="text-2xl font-bold" style={{ color: '#003087' }}>{value}</span>
      </div>
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  )
}

function MetricCard({ label, value, subtitle, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
    </div>
  )
}

function DashboardCard({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308710' }}>
            <Icon className="w-4 h-4" style={{ color: '#003087' }} />
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

function ChildSummaryCard({ child, progress, attendance, onSelect }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={onSelect}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#003087' }}>
          {child.user.firstName[0]}{child.user.lastName[0]}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{child.user.firstName} {child.user.lastName}</h3>
          <p className="text-sm text-gray-500">Grade {child.grade}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Avg. Score</p>
          <p className="font-semibold" style={{ color: '#003087' }}>{progress?.averageScore}%</p>
        </div>
        <div>
          <p className="text-gray-500">Attendance</p>
          <p className="font-semibold" style={{ color: '#0EF117' }}>{attendance?.percentage}%</p>
        </div>
      </div>
      <button className="mt-4 text-sm font-medium hover:opacity-80" style={{ color: '#003087' }}>
        View Details →
      </button>
    </div>
  )
}

function ActivityItem({ activity }: any) {
  const getIcon = () => {
    switch(activity.type) {
      case 'exam': return <Award className="w-4 h-4" />
      case 'lesson': return <BookOpen className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getColor = () => {
    if (activity.status === 'passed' || activity.status === 'completed') return '#0EF117'
    if (activity.status === 'graded') return '#003087'
    return '#f59e0b'
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getColor()}15` }}>
        <div style={{ color: getColor() }}>{getIcon()}</div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium text-gray-900">{activity.title}</p>
          <span className="text-xs text-gray-400">
            {new Date(activity.date).toLocaleDateString()}
          </span>
        </div>
        {activity.score && (
          <p className="text-sm text-gray-600 mt-1">Score: {activity.score}%</p>
        )}
      </div>
    </div>
  )
}

function AttendanceStat({ label, value, color }: any) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

function MessageItem({ message }: any) {
  return (
    <div className={`p-3 rounded-lg ${!message.read ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{message.from}</p>
          <p className="text-xs text-gray-500">{message.fromRole}</p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(message.date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-700">{message.message}</p>
    </div>
  )
}

function PaymentStatusCard({ payment }: any) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
      <div>
        <p className="font-medium text-gray-900">${payment.amount}</p>
        <p className="text-xs text-gray-500">{payment.description}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(payment.date).toLocaleDateString()}
        </p>
      </div>
      <div 
        className="px-2 py-1 rounded-lg text-xs font-semibold text-white"
        style={{ backgroundColor: payment.status === 'paid' ? '#0EF117' : '#f59e0b' }}
      >
        {payment.status === 'paid' ? 'Paid' : 'Pending'}
      </div>
    </div>
  )
}

function EventItem({ title, date, type }: any) {
  const getColor = () => {
    switch(type) {
      case 'meeting': return '#003087'
      case 'exam': return '#dc2626'
      default: return '#f59e0b'
    }
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: getColor() }}>
        <Calendar className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  )
}

function NotificationItem({ notification }: any) {
  return (
    <div className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-1">
        <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
        {!notification.read && (
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0EF117' }} />
        )}
      </div>
      <p className="text-xs text-gray-600">{notification.message}</p>
      <p className="text-xs text-gray-400 mt-1">
        {new Date(notification.date).toLocaleDateString()}
      </p>
    </div>
  )
}

function EmptyState({ message }: any) {
  return (
    <div className="text-center py-6">
      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">{message}</p>
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

// Modal Components

function AddChildModal({ onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    grade: '',
    schoolYear: new Date().getFullYear().toString()
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Child</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              >
                <option value="">Select Grade</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Year</label>
              <input
                type="text"
                value={formData.schoolYear}
                onChange={(e) => setFormData({...formData, schoolYear: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onAdd(formData)}
            className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:bg-opacity-90"
            style={{ backgroundColor: '#003087' }}
          >
            Add Child
          </button>
        </div>
      </div>
    </div>
  )
}

function PaymentModal({ children, selectedChild, savedCards, onClose, onPay }: any) {
  const [amount, setAmount] = useState('')
  const [selectedChildId, setSelectedChildId] = useState(selectedChild || children[0]?.id)
  const [selectedCard, setSelectedCard] = useState(savedCards.find(c => c.isDefault)?.id)
  const [useNewCard, setUseNewCard] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '', name: '' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Make Payment</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Child</label>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            >
              {children.map((child: Child) => (
                <option key={child.id} value={child.id}>
                  {child.user.firstName} {child.user.lastName} - Grade {child.grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <div className="space-y-2">
              {!useNewCard && savedCards.map((card: PaymentMethod) => (
                <label key={card.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="card"
                    value={card.id}
                    checked={selectedCard === card.id}
                    onChange={() => setSelectedCard(card.id)}
                    className="text-[#003087]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {card.type.toUpperCase()} •••• {card.last4}
                    </p>
                    {card.isDefault && <span className="text-xs text-green-600">Default</span>}
                  </div>
                </label>
              ))}
              
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="card"
                  checked={useNewCard}
                  onChange={() => setUseNewCard(true)}
                  className="text-[#003087]"
                />
                <span className="text-gray-700">Use New Card</span>
              </label>
            </div>
          </div>

          {useNewCard && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <button
            onClick={() => onPay({ childId: selectedChildId, amount, method: useNewCard ? 'new' : 'saved' })}
            className="w-full py-3 rounded-lg text-white font-medium transition-colors hover:bg-opacity-90"
            style={{ backgroundColor: '#003087' }}
          >
            Pay ${amount || '0'}
          </button>
        </div>
      </div>
    </div>
  )
}