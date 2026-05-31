// app/(dashboard)/teacher/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bell, 
  Menu, 
  X,
  ChevronRight, 
  BookOpen, 
  Calendar, 
  Users, 
  Award, 
  FileText,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Video,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Plus,
  Send,
  TrendingUp,
  UserCheck,
  UserX,
  GraduationCap,
  FolderOpen,
  ClipboardList,
  PieChart,
  Mail,
  Phone,
  MapPin,
  Star,
  Monitor
} from 'lucide-react'

// Types
interface ClassSchedule {
  id: string
  day: string
  time: string
  duration: number
}

interface TeacherClass {
  id: string
  name: string
  grade: number
  subject: string
  program: {
    name: string
    type: string
  }
  students: Student[]
  schedule: ClassSchedule[]
}

interface Student {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  grade: number
  profileImage?: string
  attendance: AttendanceRecord[]
  progress: ProgressRecord[]
  parent?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
}

interface AttendanceRecord {
  id: string
  date: Date
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  remarks?: string
}

interface ProgressRecord {
  id: string
  lessonId: string
  lessonTitle: string
  percentageWatched: number
  completedAt?: Date
  score?: number
}

interface Lesson {
  id: string
  title: string
  description: string
  type: 'LIVE' | 'RECORDED' | 'HYBRID'
  status: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED'
  scheduledAt?: Date
  duration: number
  classId: string
  createdAt: Date
}

interface Exam {
  id: string
  title: string
  description: string
  type: 'QUIZ' | 'ASSIGNMENT' | 'PRACTICE' | 'MIDTERM' | 'FINAL'
  scheduledAt?: Date
  duration: number
  totalMarks: number
  passingMarks: number
  classId: string
  submissions?: ExamSubmission[]
}

interface ExamSubmission {
  id: string
  studentId: string
  studentName: string
  score: number
  percentage: number
  submittedAt: Date
  status: 'PENDING' | 'GRADED' | 'FLAGGED'
}

interface Resource {
  id: string
  title: string
  description: string
  type: string
  fileUrl: string
  fileSize: number
  downloadCount: number
  createdAt: Date
}

interface Message {
  id: string
  from: string
  fromRole: string
  to: string
  message: string
  date: Date
  read: boolean
  childId?: string
}

interface Notification {
  id: string
  title: string
  message: string
  date: Date
  read: boolean
  type: string
}

export default function TeacherDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCreateLesson, setShowCreateLesson] = useState(false)
  const [showCreateExam, setShowCreateExam] = useState(false)
  const [showUploadResource, setShowUploadResource] = useState(false)
  const [showGradeSubmission, setShowGradeSubmission] = useState(false)
  const [gradingExamId, setGradingExamId] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Poll teacher dashboard for realtime mockup data
  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const res = await fetch('/api/teacher/dashboard')
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return

        if (data.classes) setTeacherClasses(data.classes.map((c: any) => ({
          id: c.id,
          name: c.name,
          grade: c.grade,
          subject: c.subject,
          program: c.program,
          schedule: c.schedule || [],
          students: c.students || []
        })))

        if (data.lessons) setLessons(data.lessons)
        if (data.exams) setExams(data.exams)
        if (data.resources) setResources(data.resources)
        if (data.messages) setMessages(data.messages)
        if (data.notifications) setNotifications(data.notifications)
      } catch (err) {
        console.error('Teacher dashboard fetch error', err)
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.students.length, 0)
  const totalLessons = lessons.length
  const totalExams = exams.length
  const pendingGrading = exams.reduce((sum, e) => sum + (e.submissions?.filter(s => s.status === 'PENDING').length || 0), 0)

  // Sidebar navigation items
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/teacher' },
    { icon: BookOpen, label: 'My Classes', href: '/teacher/classes' },
    { icon: Video, label: 'Lessons', href: '/teacher/lessons' },
    { icon: Monitor, label: 'Live Sessions', href: '/teacher/live' },
    { icon: Star, label: 'Ratings', href: '/teacher/ratings' },
    { icon: FileText, label: 'Assignments', href: '/teacher/assignments' },
    { icon: Award, label: 'Exams', href: '/teacher/exams' },
    { icon: Users, label: 'Students', href: '/teacher/students' },
    { icon: UserCheck, label: 'Attendance', href: '/teacher/attendance' },
    { icon: BarChart3, label: 'Grades', href: '/teacher/grades' },
    { icon: MessageCircle, label: 'Messages', href: '/teacher/messages' },
    { icon: Calendar, label: 'Calendar', href: '/teacher/calendar' },
    { icon: FileText, label: 'Reports', href: '/teacher/reports' },
    { icon: Settings, label: 'Settings', href: '/teacher/settings' }
  ]

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <div className={`fixed lg:static top-[112px] bottom-0 left-0 z-40 w-72 flex flex-col transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ backgroundColor: '#003087' }}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold">
              📚
            </div>
            <h1 className="text-lg font-bold text-white">PPS LMS</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/teacher' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white/80 hover:text-white hover:bg-white/10 ${
                  isActive ? 'bg-white/20 text-white' : ''
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full pt-[112px] lg:pt-[120px]">
        {/* Header */}
        <header className={`sticky top-0 z-30 bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
                </button>
                <h2 className="text-xl font-bold text-gray-900">Teacher Dashboard</h2>
              </div>

              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500" />
                  )}
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">Mr. David Smith</p>
                    <p className="text-xs text-gray-500">Physics Teacher</p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: '#003087' }}
                  >
                    DS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Welcome Banner */}
            <div className="mb-6 p-6 rounded-xl bg-white shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Welcome back,</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Mr. David Smith 👋</h2>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCardNew 
                icon={BookOpen}
                label="Classes Assigned"
                value={teacherClasses.length}
                subtitle="all classes"
                color="blue"
              />
              <StatCardNew 
                icon={Users}
                label="Students"
                value={totalStudents}
                subtitle="enrolled learners"
                color="green"
              />
              <StatCardNew 
                icon={Video}
                label="Lessons This Week"
                value="8"
                subtitle="view schedule"
                color="purple"
              />
              <StatCardNew 
                icon={ClipboardList}
                label="Pending Tasks"
                value={pendingGrading}
                subtitle="tasks to do"
                color="orange"
              />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                {/* My Classes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" style={{ color: '#003087' }} />
                      My Classes
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="space-y-3">
                      {teacherClasses.map(cls => (
                        <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                          <div>
                            <p className="font-medium text-gray-900">{cls.name}</p>
                            <p className="text-sm text-gray-500">{cls.students.length} students enrolled</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold text-white bg-green-500">Live</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5" style={{ color: '#003087' }} />
                      Today's Schedule
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="space-y-3">
                      <ScheduleItemNew time="10:00 AM" className="Grade 10 Physics" duration="60 min" status="LIVE" />
                      <ScheduleItemNew time="1:00 PM" className="Grade 11 Physics" duration="60 min" status="UPCOMING" />
                      <ScheduleItemNew time="3:00 PM" className="Grade 9 Science" duration="60 min" status="UPCOMING" />
                    </div>
                  </div>
                </div>

                {/* Recent Submissions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" style={{ color: '#003087' }} />
                      Recent Submissions
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="space-y-3">
                      <SubmissionItem title="Algebra Set 5" className="Grade 10 Physics" count="23 / 32 submitted" />
                      <SubmissionItem title="Lab Report" className="Grade 11 Physics" count="28 / 30 submitted" />
                      <SubmissionItem title="Physics Quiz 2" className="Grade 9 Science" count="35 / 35 submitted" />
                    </div>
                  </div>
                </div>

                {/* Class Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" style={{ color: '#003087' }} />
                      Class Performance
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="h-64 flex items-end justify-between gap-4">
                      <PerformanceBar label="Physics" percentage={85} />
                      <PerformanceBar label="Math" percentage={78} />
                      <PerformanceBar label="Chemistry" percentage={82} />
                      <PerformanceBar label="Biology" percentage={88} />
                      <PerformanceBar label="English" percentage={75} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - 1/3 */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Settings className="w-5 h-5" style={{ color: '#003087' }} />
                      Quick Actions
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3">
                      <QuickActionButton 
                        icon={Plus}
                        label="Create Lesson"
                        onClick={() => setShowCreateLesson(true)}
                        color="#003087"
                      />
                      <QuickActionButton 
                        icon={Video}
                        label="Start Live Session"
                        color="#003087"
                      />
                      <QuickActionButton 
                        icon={FileText}
                        label="Create Assignment"
                        onClick={() => setShowCreateExam(true)}
                        color="#003087"
                      />
                      <QuickActionButton 
                        icon={Upload}
                        label="Upload Resource"
                        onClick={() => setShowUploadResource(true)}
                        color="#003087"
                      />
                    </div>
                  </div>
                </div>

                {/* Announcements */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Bell className="w-5 h-5" style={{ color: '#003087' }} />
                      Announcements
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="space-y-3">
                      <AnnouncementItem title="Midterm Exams Schedule" date="May 15, 2025" icon={Calendar} />
                      <AnnouncementItem title="New Lesson Materials" date="May 12, 2025" icon={FileText} />
                      <AnnouncementItem title="Staff Meeting" date="May 10, 2025" icon={Users} />
                    </div>
                    <Link 
                      href="/teacher/announcements"
                      className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                      style={{ color: '#003087' }}
                    >
                      View all announcements →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Close Mobile Menu on Overlay Click */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Modals */}
      {showCreateLesson && (
        <CreateLessonModal 
          classes={teacherClasses}
          selectedClass={teacherClasses[0]?.id}
          onClose={() => setShowCreateLesson(false)}
          onCreate={(lesson) => {
            setLessons([...lessons, lesson])
            setShowCreateLesson(false)
          }}
        />
      )}

      {showCreateExam && (
        <CreateExamModal 
          classes={teacherClasses}
          selectedClass={teacherClasses[0]?.id}
          onClose={() => setShowCreateExam(false)}
          onCreate={(exam) => {
            setExams([...exams, exam])
            setShowCreateExam(false)
          }}
        />
      )}

      {showUploadResource && (
        <UploadResourceModal 
          classes={teacherClasses}
          selectedClass={teacherClasses[0]?.id}
          onClose={() => setShowUploadResource(false)}
          onUpload={(resource) => {
            setResources([...resources, resource])
            setShowUploadResource(false)
          }}
        />
      )}

      {showGradeSubmission && (
        <GradeSubmissionModal 
          examId={gradingExamId}
          onClose={() => setShowGradeSubmission(false)}
          onGrade={(submission) => {
            setShowGradeSubmission(false)
          }}
        />
      )}
    </div>
  )
}
// Component Definitions

function StatCardNew({ icon: Icon, label, value, subtitle, color }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
    green: { bg: 'bg-green-50', border: 'border-green-100', text: 'text-green-600', icon: 'text-green-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', icon: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600', icon: 'text-orange-600' }
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-4 sm:p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${c.text} mt-1`}>{value}</p>
      <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
    </div>
  )
}

function ScheduleItemNew({ time, className, duration, status }: any) {
  const isLive = status === 'LIVE'
  const statusColor = isLive ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white`} style={{ backgroundColor: '#003087' }}>
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{time}</p>
          <p className="text-sm text-gray-500">{className}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{duration}</p>
        <span className={`${statusColor} text-white text-xs font-semibold px-2 py-1 rounded mt-1 inline-block`}>
          {status}
        </span>
      </div>
    </div>
  )
}

function SubmissionItem({ title, className, count }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{className}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{count}</p>
      </div>
    </div>
  )
}

function PerformanceBar({ label, percentage }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 rounded-lg overflow-hidden bg-gray-100 h-48 flex flex-col-reverse">
        <div 
          className="bg-gradient-to-t from-blue-500 to-blue-400 transition-all"
          style={{ height: `${percentage}%` }}
        />
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-xs text-gray-500">{percentage}%</p>
    </div>
  )
}

function QuickActionButton({ icon: Icon, label, onClick, color }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors text-center"
    >
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  )
}

function AnnouncementItem({ title, date, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 rounded-lg mt-0.5 flex items-center justify-center" style={{ backgroundColor: '#00308715' }}>
        <Icon className="w-4 h-4" style={{ color: '#003087' }} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  )
}

// Old component definitions

function DashboardCard({ title, icon: Icon, children, action }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308710' }}>
              <Icon className="w-4 h-4" style={{ color: '#003087' }} />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>
          {action}
        </div>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}

function ScheduleItem({ schedule }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308715' }}>
          <Calendar className="w-4 h-4" style={{ color: '#003087' }} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{schedule.day}</p>
          <p className="text-sm text-gray-500">{schedule.time} ({schedule.duration} min)</p>
        </div>
      </div>
      <button className="text-sm font-medium hover:opacity-80" style={{ color: '#003087' }}>
        Start Class
      </button>
    </div>
  )
}

function LessonItem({ lesson }: any) {
  const getStatusColor = () => {
    switch(lesson.status) {
      case 'COMPLETED': return '#0EF117'
      case 'LIVE': return '#dc2626'
      case 'SCHEDULED': return '#003087'
      default: return '#9ca3af'
    }
  }

  return (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getStatusColor()}15` }}>
          <Video className="w-4 h-4" style={{ color: getStatusColor() }} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{lesson.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{lesson.duration} minutes</p>
          {lesson.scheduledAt && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(lesson.scheduledAt).toLocaleDateString()} at {new Date(lesson.scheduledAt).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Eye className="w-4 h-4 text-gray-500" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

function ExamItem({ exam, onGrade }: any) {
  const pendingSubmissions = exam.submissions?.filter((s: any) => s.status === 'PENDING').length || 0

  return (
    <div className="p-3 rounded-lg bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-medium text-gray-900">{exam.title}</p>
          <p className="text-sm text-gray-500">{exam.type}</p>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold text-white`} style={{ 
          backgroundColor: exam.scheduledAt && exam.scheduledAt > new Date() ? '#003087' : '#0EF117' 
        }}>
          {exam.scheduledAt && exam.scheduledAt > new Date() ? 'Upcoming' : 'Available'}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span>Total Marks: {exam.totalMarks}</span>
        <span className="mx-2">•</span>
        <span>Passing: {exam.passingMarks}</span>
        <span className="mx-2">•</span>
        <span>Duration: {exam.duration} min</span>
      </div>
        {pendingSubmissions > 0 && (
        <button
          onClick={() => onGrade(exam.id)}
          className="mt-2 text-sm font-medium hover:opacity-80 flex items-center gap-1"
          style={{ color: '#003087' }}
        >
          <Edit className="w-3 h-3" />
          Grade {pendingSubmissions} pending submission(s)
        </button>
      )}
    </div>
  )
}

function ResourceItem({ resource }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308715' }}>
          <FileText className="w-4 h-4" style={{ color: '#003087' }} />
        </div>
        <div>
          <p className="font-medium text-gray-900">{resource.title}</p>
          <p className="text-xs text-gray-500">
            {(resource.fileSize / 1024).toFixed(1)} KB • {resource.downloadCount} downloads
          </p>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-lg">
        <Download className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  )
}

function StudentItem({ student, onSelect, isSelected }: any) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
        isSelected ? 'bg-[#003087] text-white' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {student.firstName[0]}{student.lastName[0]}
      </div>
      <div className="flex-1 text-left">
        <p className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
          {student.firstName} {student.lastName}
        </p>
        <p className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
          Grade {student.grade}
        </p>
      </div>
      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
    </button>
  )
}

function MessageItem({ message }: any) {
  return (
    <div className={`p-3 rounded-lg ${!message.read ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-1">
        <p className="font-medium text-gray-900 text-sm">{message.from}</p>
        <span className="text-xs text-gray-400">
          {new Date(message.date).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
    </div>
  )
}

function QuickActionCard({ href, label, icon: Icon }: any) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center group"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308715' }}>
        <Icon className="w-5 h-5" style={{ color: '#003087' }} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </Link>
  )
}

function InfoRow({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {Icon && <Icon className="w-3 h-3 text-gray-400" />}
      <span className="text-gray-500 w-24">{label}:</span>
      <span className="text-gray-900 flex-1">{value}</span>
    </div>
  )
}

function EmptyState({ message }: any) {
  return (
    <div className="text-center py-8">
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

function CreateLessonModal({ classes, selectedClass, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RECORDED',
    classId: selectedClass || classes[0]?.id || '',
    scheduledAt: '',
    duration: 45,
    content: ''
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Create New Lesson</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({...formData, classId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            >
              {classes.map((cls: TeacherClass) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              placeholder="e.g., Introduction to Algebra"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              placeholder="Lesson description and learning objectives"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              >
                <option value="LIVE">Live</option>
                <option value="RECORDED">Recorded</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
          </div>

          {(formData.type === 'LIVE' || formData.type === 'HYBRID') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
          )}

          {formData.type === 'RECORDED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Content</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003087] transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload video file</p>
                <p className="text-xs text-gray-500 mt-1">MP4, MOV up to 2GB</p>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/teacher/lessons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                  })
                  const data = await res.json()
                  onCreate(data)
                } catch (err) {
                  onCreate({ ...formData, id: Date.now().toString(), status: 'DRAFT', createdAt: new Date() })
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium hover:bg-opacity-90"
              style={{ backgroundColor: '#003087' }}
            >
              Create Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateExamModal({ classes, selectedClass, onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'QUIZ',
    classId: selectedClass || classes[0]?.id || '',
    scheduledAt: '',
    duration: 60,
    totalMarks: 100,
    passingMarks: 50
  })

  const [questions, setQuestions] = useState([
    { id: 1, text: '', type: 'MCQ', marks: 1, options: ['', '', '', ''], correctAnswer: '' }
  ])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Create New Exam</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({...formData, classId: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            >
              {classes.map((cls: TeacherClass) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              >
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="PRACTICE">Practice</option>
                <option value="MIDTERM">Midterm</option>
                <option value="FINAL">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData({...formData, totalMarks: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passing Marks</label>
              <input
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData({...formData, passingMarks: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Questions</label>
            {questions.map((q, idx) => (
              <div key={q.id} className="border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Question {idx + 1}</span>
                  <button
                    onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Question text"
                  value={q.text}
                  onChange={(e) => {
                    const newQuestions = [...questions]
                    newQuestions[idx].text = e.target.value
                    setQuestions(newQuestions)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const newQuestions = [...questions]
                      newQuestions[idx].type = e.target.value
                      setQuestions(newQuestions)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="ESSAY">Essay</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Marks"
                    value={q.marks}
                    onChange={(e) => {
                      const newQuestions = [...questions]
                      newQuestions[idx].marks = parseInt(e.target.value)
                      setQuestions(newQuestions)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                {q.type === 'MCQ' && (
                  <div className="mt-2 space-y-1">
                    {q.options.map((opt, optIdx) => (
                      <input
                        key={optIdx}
                        type="text"
                        placeholder={`Option ${optIdx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newQuestions = [...questions]
                          newQuestions[idx].options[optIdx] = e.target.value
                          setQuestions(newQuestions)
                        }}
                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      />
                    ))}
                    <input
                      type="text"
                      placeholder="Correct answer"
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const newQuestions = [...questions]
                        newQuestions[idx].correctAnswer = e.target.value
                        setQuestions(newQuestions)
                      }}
                      className="w-full px-3 py-1 border border-green-300 rounded-lg text-sm mt-2"
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setQuestions([...questions, { id: questions.length + 1, text: '', type: 'MCQ', marks: 1, options: ['', '', '', ''], correctAnswer: '' }])}
              className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#003087] hover:text-[#003087] transition-colors"
            >
              + Add Question
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
          <button
            onClick={async () => {
              try {
                const res = await fetch('/api/teacher/exams', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...formData, questions })
                })
                const data = await res.json()
                onCreate(data)
              } catch (err) {
                onCreate({ ...formData, id: Date.now().toString(), questions, submissions: [] })
              }
            }}
            className="w-full py-3 rounded-lg text-white font-medium hover:bg-opacity-90"
            style={{ backgroundColor: '#003087' }}
          >
            Create Exam
          </button>
        </div>
      </div>
    </div>
  )
}

function UploadResourceModal({ classes, selectedClass, onClose, onUpload }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF_NOTE',
    classId: selectedClass || classes[0]?.id || '',
    file: null as File | null,
  })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Upload Resource</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {classes.map((cls: TeacherClass) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="PDF_NOTE">PDF Note</option>
                <option value="WORKSHEET">Worksheet</option>
                <option value="PAST_PAPER">Past Paper</option>
                <option value="SOLUTION_MANUAL">Solution Manual</option>
                <option value="VIDEO_TUTORIAL">Video Tutorial</option>
                <option value="STUDY_GUIDE">Study Guide</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003087] transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to choose a file</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, MP4 up to 50MB</p>
              {formData.file && (
                <p className="text-sm text-gray-700 mt-3">Selected file: {formData.file.name}</p>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx,.mp4,.ppt,.pptx"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                setFormData((prev) => ({ ...prev, file }))
                setUploadError(null)
              }}
            />
            {uploadError && <p className="text-sm text-rose-600 mt-2">{uploadError}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!formData.file) {
                  setUploadError('Please choose a file to upload.')
                  return
                }

                setUploading(true)
                setUploadError(null)
                try {
                  const uploadPayload = new FormData()
                  uploadPayload.append('file', formData.file)
                  if (formData.type === 'VIDEO_TUTORIAL') {
                    uploadPayload.append('resourceType', 'video')
                  }

                  const uploadRes = await fetch('/api/cloudinary/upload', {
                    method: 'POST',
                    body: uploadPayload,
                  })
                  const uploadData = await uploadRes.json()
                  if (!uploadRes.ok) {
                    throw new Error(uploadData.error || 'Upload failed')
                  }

                  const payload = {
                    title: formData.title,
                    description: formData.description,
                    type: formData.type,
                    classId: formData.classId,
                    cloudinaryUrl: uploadData.url,
                    cloudinaryPublicId: uploadData.public_id,
                    fileSize: uploadData.bytes || formData.file.size,
                  }

                  const res = await fetch('/api/teacher/resources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  })
                  const data = await res.json()
                  onUpload(data)
                } catch (err: any) {
                  console.error('Upload error', err)
                  setUploadError(err?.message || 'Unable to upload file')
                } finally {
                  setUploading(false)
                }
              }}
              disabled={uploading}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#003087' }}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function GradeSubmissionModal({ onClose, onGrade, examId, studentId, studentName }: any) {
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student: John Doe</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score (out of 100)</label>
              <input
                type="number"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter score"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Provide feedback to the student..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const payload = { examId, studentId, score: parseInt(grade), feedback }
                  const res = await fetch('/api/teacher/exams/grade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  })
                  const data = await res.json()
                  onGrade(data)
                } catch (err) {
                  onGrade({ score: parseInt(grade), feedback })
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#003087' }}
            >
              Submit Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}