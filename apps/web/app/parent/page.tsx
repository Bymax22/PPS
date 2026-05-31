// app/(dashboard)/parent/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { formatZMW } from '@/lib/currency'
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
  const pathname = usePathname()
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

  // Poll parent dashboard for realtime mockup data
  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const res = await fetch('/api/parent/dashboard')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return

        if (data.children) setChildren(data.children)

        if (data.children) {
          const pd: Record<string, any> = {}
          const ad: Record<string, any> = {}
          data.children.forEach((c: any) => {
            if (c.progress) pd[c.id] = c.progress
            if (c.attendance) ad[c.id] = c.attendance
          })
          setProgressData(pd)
          setAttendanceData(ad)
        }

        if (data.notifications) setNotifications(data.notifications)
        if (data.messages) setMessages(data.messages)
        if (data.payments) setPayments(data.payments)
        if (data.savedCards) setSavedCards(data.savedCards)
      } catch (err) {
        console.error('Parent dashboard fetch error', err)
      }
    }

    fetchData()
    const id = setInterval(fetchData, 5000)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (!selectedChild && children.length === 1) {
      setSelectedChild(children[0].id)
    }
  }, [children, selectedChild])

  const selectedChildData = selectedChild ? children.find(c => c.id === selectedChild) : null
  const selectedProgress = selectedChild ? progressData[selectedChild] : null
  const selectedAttendance = selectedChild ? attendanceData[selectedChild] : null

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/parent' },
    { icon: Users, label: 'My Children', href: '/parent/children' },
    { icon: CreditCard, label: 'Payments', href: '/parent/payments' },
    { icon: MessageCircle, label: 'Messages', href: '/parent/messages' },
    { icon: Calendar, label: 'Events', href: '/parent/events' },
    { icon: Settings, label: 'Settings', href: '/parent/settings' }
  ]

  const totalOutstanding = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#003087] text-white transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col py-6 px-5">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-bold">P</div>
            <div>
              <p className="text-sm text-slate-200">Parent Portal</p>
              <p className="font-semibold text-white">Sarah Johnson</p>
            </div>
          </div>
          <nav className="space-y-2 flex-1 overflow-y-auto pr-1">
            {sidebarItems.map(item => {
              const isActive = pathname === item.href || (item.href !== '/parent' && pathname?.startsWith(item.href))
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-white/20 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <button className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/20">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-72">
        <header className={`sticky top-0 z-30 border-b border-slate-200/70 bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h1 className="text-xl font-semibold text-slate-900">Parent Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-400" />}
              </button>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#003087] text-white font-semibold">SJ</div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">Sarah Johnson</p>
                  <p className="text-xs text-slate-500">Parent</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
            <section className="mb-6 overflow-hidden rounded-[32px] bg-[#003087] px-6 py-8 text-white shadow-lg shadow-slate-500/10 sm:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-200">Parent Portal</p>
                  <h2 className="mt-3 text-3xl font-semibold">Good to see you, Sarah</h2>
                  <p className="mt-3 max-w-2xl text-sm text-slate-200/90">
                    You’re supporting {children.length} student{children.length !== 1 ? 's' : ''}. {totalOutstanding > 0 ? `${formatZMW(totalOutstanding)} outstanding balance` : 'All accounts are current.'}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
                  <button onClick={() => setShowAddChild(true)} className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#003087] shadow-sm transition hover:brightness-95">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Child
                  </button>
                  <button onClick={() => setShowMakePayment(true)} className="inline-flex items-center justify-center rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-[#003087] shadow-sm transition hover:brightness-95">
                    <CreditCard className="mr-2 h-4 w-4" /> Make Payment
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-4">
              <StatCard icon={Users} label="My Children" value={children.length} subtitle="Active learners" />
              <StatCard icon={BarChart3} label="Avg. Performance" value={`${Math.round(children.reduce((sum, child) => sum + (progressData[child.id]?.averageScore || 0), 0) / children.length)}%`} subtitle="Across all children" />
              <StatCard icon={CheckCircle} label="Attendance Rate" value={`${Math.round(children.reduce((sum, child) => sum + (attendanceData[child.id]?.percentage || 0), 0) / children.length)}%`} subtitle="Attendance average" />
              <StatCard icon={CreditCard} label="Outstanding" value={formatZMW(totalOutstanding)} subtitle="Pending dues" />
            </section>

            <section className="mt-6 rounded-[32px] bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Choose a child</h3>
                  <p className="text-sm text-slate-500">View individual performance, attendance, and payments.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChild(child.id)}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${selectedChild === child.id ? 'bg-[#003087] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      {child.user.firstName} {child.user.lastName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {children.map(child => (
                  <div key={child.id} className="rounded-3xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-slate-500">{child.grade}</p>
                        <h4 className="mt-2 text-lg font-semibold text-slate-900">{child.user.firstName} {child.user.lastName}</h4>
                      </div>
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[#003087] text-white text-lg font-semibold">
                        {child.user.firstName[0]}{child.user.lastName[0]}
                      </div>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-slate-500">
                      <p>{child.schoolYear}</p>
                      <p>{progressData[child.id]?.averageScore}% average score</p>
                      <p>{attendanceData[child.id]?.percentage}% attendance</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="space-y-6">
                <DashboardCard title="Recent Activity" icon={Clock}>
                  <div className="space-y-4">
                    {selectedProgress?.recentActivity.map(activity => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </div>
                </DashboardCard>

                <DashboardCard title="Attendance Overview" icon={Calendar}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <AttendanceStat label="Present" value={selectedAttendance?.present ?? 0} color="#0EF117" />
                      <AttendanceStat label="Absent" value={selectedAttendance?.absent ?? 0} color="#dc2626" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <AttendanceStat label="Late" value={selectedAttendance?.late ?? 0} color="#f59e0b" />
                      <AttendanceStat label="Excused" value={selectedAttendance?.excused ?? 0} color="#003087" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Overall attendance</span>
                        <span className={`font-semibold ${selectedAttendance?.percentage >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{selectedAttendance?.percentage ?? 0}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-[#003087] transition-all" style={{ width: `${selectedAttendance?.percentage ?? 0}%` }} />
                      </div>
                    </div>
                  </div>
                </DashboardCard>

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
                  <Link href={`/parent/messages?child=${selectedChild}`} className="mt-4 inline-flex text-sm font-semibold text-[#003087] hover:underline">
                    Send a message →
                  </Link>
                </DashboardCard>
              </div>

              <div className="space-y-6">
                <DashboardCard title="Payment Status" icon={CreditCard}>
                  <div className="space-y-4">
                    {payments.filter(payment => payment.childId === selectedChild).map(payment => (
                      <PaymentStatusCard key={payment.id} payment={payment} />
                    ))}
                    {!payments.filter(payment => payment.childId === selectedChild).length && (
                      <EmptyState message="No payment records" />
                    )}
                  </div>
                  <button onClick={() => setShowMakePayment(true)} className="mt-4 w-full rounded-2xl bg-[#003087] px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                    Make a Payment
                  </button>
                </DashboardCard>

                <DashboardCard title="Notifications" icon={Bell}>
                  <div className="space-y-3">
                    {notifications.filter(notification => !notification.childId || notification.childId === selectedChild).slice(0, 3).map(notification => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                    {!notifications.filter(notification => !notification.childId || notification.childId === selectedChild).length && (
                      <EmptyState message="No new notifications" />
                    )}
                  </div>
                </DashboardCard>

                <DashboardCard title="Quick Actions" icon={Settings}>
                  <div className="space-y-3">
                    <Link href="/parent/payments" className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200">View payment history</Link>
                    <Link href="/parent/messages" className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200">Message a teacher</Link>
                    <Link href="/parent/events" className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-200">View upcoming events</Link>
                  </div>
                </DashboardCard>
              </div>
            </section>
          </div>
        </main>
      </div>

      {mobileMenuOpen && <div className="fixed inset-0 z-30 lg:hidden bg-black/50" onClick={() => setMobileMenuOpen(false)} />}

      {showAddChild && (
        <AddChildModal onClose={() => setShowAddChild(false)} onAdd={(child) => {
          setShowAddChild(false)
        }} />
      )}

      {showMakePayment && (
        <PaymentModal 
          children={children}
          selectedChild={selectedChild}
          savedCards={savedCards}
          onClose={() => setShowMakePayment(false)}
          onPay={async (data: any) => {
            try {
              const res = await fetch('/api/parent/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              })
              if (!res.ok) throw new Error('Payment API error')
              const payment = await res.json()
              setPayments(prev => [{
                id: payment.id || `mock-${Date.now()}`,
                childId: data.childId,
                amount: Number(data.amount),
                status: payment.status || 'PENDING',
                date: new Date(),
                description: data.description || 'Manual Payment',
                method: data.paymentMethod || data.method,
                currency: 'ZMW'
              }, ...prev])
            } catch (err) {
              console.error('Payment failed', err)
            } finally {
              setShowMakePayment(false)
            }
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
        <p className="font-medium text-gray-900">{formatZMW(payment.amount)}</p>
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
  const [method, setMethod] = useState<'saved_card'|'new_card'|'mobile_money'|'bank_transfer'>(selectedCard ? 'saved_card' : 'mobile_money')
  const [mobileProvider, setMobileProvider] = useState('MTN')
  const [mobileNumber, setMobileNumber] = useState('')
  const [bankReference, setBankReference] = useState('')

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ZMW)</label>
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
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="method" checked={method === 'saved_card'} onChange={() => { setMethod('saved_card'); setUseNewCard(false) }} />
                  <span className="text-gray-700">Saved Card</span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="method" checked={method === 'new_card'} onChange={() => { setMethod('new_card'); setUseNewCard(true) }} />
                  <span className="text-gray-700">New Card</span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="method" checked={method === 'mobile_money'} onChange={() => setMethod('mobile_money')} />
                  <span className="text-gray-700">Mobile Money</span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="method" checked={method === 'bank_transfer'} onChange={() => setMethod('bank_transfer')} />
                  <span className="text-gray-700">Bank Transfer</span>
                </label>
              </div>
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

          {method === 'new_card' && (
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

          {method === 'mobile_money' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <select value={mobileProvider} onChange={(e) => setMobileProvider(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]">
                  <option value="MTN">MTN Mobile Money</option>
                  <option value="AIRTEL">Airtel Money</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="e.g. 0974123456" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]" />
              </div>
              <p className="text-xs text-gray-500">You'll be prompted to approve the mobile money payment on your phone.</p>
            </div>
          )}

          {method === 'bank_transfer' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Transaction ID</label>
                <input type="text" value={bankReference} onChange={(e) => setBankReference(e.target.value)} placeholder="Enter bank transaction reference" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]" />
              </div>
              <p className="text-xs text-gray-500">Use the following bank details: PPS School Ltd — Zambia National Bank — A/C 1234567890</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <button
            onClick={() => {
              const payload: any = {
                childId: selectedChildId,
                amount: Number(amount) || 0,
                currency: 'ZMW'
              }

              if (method === 'saved_card') {
                payload.paymentMethod = 'card'
                payload.cardId = selectedCard
              } else if (method === 'new_card') {
                payload.paymentMethod = 'card'
                payload.card = newCard
              } else if (method === 'mobile_money') {
                payload.paymentMethod = 'mobile_money'
                payload.mobileProvider = mobileProvider
                payload.mobileNumber = mobileNumber
              } else if (method === 'bank_transfer') {
                payload.paymentMethod = 'bank_transfer'
                payload.bankReference = bankReference
              }

              onPay(payload)
            }}
            className="w-full py-3 rounded-lg text-white font-medium transition-colors hover:bg-opacity-90"
            style={{ backgroundColor: '#003087' }}
          >
            Pay {formatZMW(Number(amount) || 0)}
          </button>
        </div>
      </div>
    </div>
  )
}