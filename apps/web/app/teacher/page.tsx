// app/(dashboard)/teacher/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
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
  subjects?: string[]
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
  status?: 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED'
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
  const [showStartLiveSession, setShowStartLiveSession] = useState(false)
  const [showGradeSubmission, setShowGradeSubmission] = useState(false)
  const [gradingExamId, setGradingExamId] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const res = await fetch('/api/teacher/dashboard', { cache: 'no-store' })
        if (!res.ok) {
          console.error('Teacher dashboard request failed', res.status)
          return
        }
        const data = await res.json()
        if (!mounted) return

        if (data.teacher) {
          setTeacherName(data.teacher.name || 'Teacher')
          setTeacherRole(data.teacher.role ? String(data.teacher.role) : 'Teacher')
          setTeacherInitials(data.teacher.initials || 'T')
        }

        if (Array.isArray(data.classes)) {
          setTeacherClasses(data.classes.map((c: any) => ({
            id: c.id,
            name: c.name,
            grade: c.grade ?? 0,
            subject: c.subject ?? 'General',
            program: c.program ?? { name: 'General', type: 'ONLINE_FULL_TIME' },
            subjects: Array.isArray(c.subjects) ? c.subjects : [],
            schedule: c.schedule || [],
            students: c.students || []
          })))
        }

        if (Array.isArray(data.lessons)) setLessons(data.lessons)
        if (Array.isArray(data.exams)) setExams(data.exams)
        if (Array.isArray(data.resources)) setResources(data.resources)
        if (Array.isArray(data.messages)) setMessages(data.messages)
        if (Array.isArray(data.notifications)) setNotifications(data.notifications)
      } catch (err) {
        console.error('Teacher dashboard fetch error', err)
      } finally {
        setResourceLoading(false)
      }
    }

    void fetchData()
    const id = window.setInterval(() => {
      void fetchData()
    }, 30000)
    const onDataChange = () => { void fetchData() }
    window.addEventListener('pps:data-changed', onDataChange)
    return () => {
      mounted = false
      window.clearInterval(id)
      window.removeEventListener('pps:data-changed', onDataChange)
    }
  }, [])

  const [teacherName, setTeacherName] = useState('Teacher')
  const [teacherRole, setTeacherRole] = useState('Teacher')
  const [teacherInitials, setTeacherInitials] = useState('T')
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [resourceLoading, setResourceLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.students.length, 0)
  const totalLessons = lessons.length
  const totalExams = exams.length
  const pendingGrading = exams.reduce((sum, e) => sum + (e.submissions?.filter(s => s.status === 'PENDING').length || 0), 0)
  const weekStart = new Date()
  weekStart.setHours(0, 0, 0, 0)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const lessonsThisWeek = lessons.filter((lesson) => {
    if (!lesson.scheduledAt) return false
    const scheduledAt = new Date(lesson.scheduledAt)
    return scheduledAt >= weekStart && scheduledAt < weekEnd
  })
  const todaysLessons = lessonsThisWeek.filter((lesson) =>
    lesson.scheduledAt && new Date(lesson.scheduledAt).toDateString() === new Date().toDateString()
  )
  const recentSubmissions = exams.flatMap((exam) =>
    (exam.submissions ?? []).map((submission) => ({ exam, submission }))
  ).sort((a, b) => new Date(b.submission.submittedAt).getTime() - new Date(a.submission.submittedAt).getTime()).slice(0, 5)
  const classPerformance = exams.reduce<Map<string, { total: number; count: number }>>((performance, exam) => {
    const className = teacherClasses.find((classItem) => classItem.id === exam.classId)?.name ?? 'Class'
    const classResult = performance.get(className) ?? { total: 0, count: 0 }
    for (const submission of exam.submissions ?? []) {
      if (submission.status !== 'GRADED') continue
      const percentage = submission.percentage ?? (exam.totalMarks > 0 ? (submission.score / exam.totalMarks) * 100 : null)
      if (percentage === null || !Number.isFinite(percentage)) continue
      classResult.total += percentage
      classResult.count += 1
    }
    performance.set(className, classResult)
    return performance
  }, new Map<string, { total: number; count: number }>())
  const performanceBars = [...classPerformance.entries()]
    .filter(([, result]) => result.count > 0)
    .map(([label, result]) => ({ label, percentage: Math.round(result.total / result.count) }))
    .slice(0, 5)

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
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
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
                    <p className="text-sm font-medium text-gray-900">{teacherName}</p>
                    <p className="text-xs text-gray-500">{teacherRole}</p>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: '#003087' }}
                  >
                    {teacherInitials}
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{teacherName} 👋</h2>
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
                value={lessonsThisWeek.length}
                subtitle="scheduled lessons"
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
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold text-white ${lessons.some((lesson) => lesson.classId === cls.id && lesson.status === 'LIVE') ? 'bg-red-500' : 'bg-green-500'}`}>
                              {lessons.some((lesson) => lesson.classId === cls.id && lesson.status === 'LIVE') ? 'Live session' : 'Assigned'}
                            </span>
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
                      {todaysLessons.length ? todaysLessons.map((lesson) => {
                        const schedule = new Date(lesson.scheduledAt!)
                        const className = teacherClasses.find((classItem) => classItem.id === lesson.classId)?.name ?? 'Class'
                        return (
                          <ScheduleItemNew
                            key={lesson.id}
                            time={schedule.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            className={className}
                            duration={`${lesson.duration} min`}
                            status={lesson.status}
                          />
                        )
                      }) : <p className="text-sm text-gray-500">No lessons scheduled for today.</p>}
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
                      {recentSubmissions.length ? recentSubmissions.map(({ exam, submission }) => (
                        <SubmissionItem
                          key={submission.id}
                          title={exam.title}
                          className={teacherClasses.find((classItem) => classItem.id === exam.classId)?.name ?? 'Class'}
                          count={submission.status === 'GRADED' ? `Score: ${submission.score}` : 'Awaiting grade'}
                        />
                      )) : <p className="text-sm text-gray-500">No exam submissions yet.</p>}
                    </div>
                  </div>
                </div>

                {/* Resources */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5" style={{ color: '#003087' }} />
                      Recent Resources
                    </h3>
                  </div>
                  <div className="p-5">
                    {resourceLoading ? (
                      <p className="text-sm text-gray-500">Loading resources…</p>
                    ) : resources.length ? (
                      <div className="space-y-3">
                        {resources.map((resource) => (
                          <ResourceItem key={resource.id} resource={resource} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No resources uploaded yet.</p>
                    )}
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
                    {performanceBars.length ? (
                      <div className="h-64 flex items-end justify-between gap-4">
                        {performanceBars.map((bar) => (
                          <PerformanceBar key={bar.label} label={bar.label} percentage={bar.percentage} />
                        ))}
                      </div>
                    ) : <p className="text-sm text-gray-500">Class performance will appear after exam submissions are graded.</p>}
                  </div>
                </div>
              </div>

              {/* Right Column - 1/3 */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-5 h-5" style={{ color: '#003087' }} />
                      Exams and grading
                    </h3>
                  </div>
                  <div className="p-5 space-y-3">
                    {exams.length ? exams.map((exam) => (
                      <ExamItem
                        key={exam.id}
                        exam={exam}
                        onGrade={(examId: string) => {
                          setGradingExamId(examId)
                          setShowGradeSubmission(true)
                        }}
                      />
                    )) : <p className="text-sm text-gray-500">No exams have been created for your classes.</p>}
                  </div>
                </div>

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
                        onClick={() => setShowStartLiveSession(true)}
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
                      {notifications.length ? notifications.slice(0, 3).map((notification) => (
                        <AnnouncementItem
                          key={notification.id}
                          title={notification.title}
                          date={new Date(notification.date).toLocaleDateString()}
                          icon={notification.type === 'ANNOUNCEMENT' ? Bell : FileText}
                        />
                      )) : <p className="text-sm text-gray-500">No announcements yet.</p>}
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

      {showStartLiveSession && (
        <StartLiveSessionModal
          lessons={lessons}
          onClose={() => setShowStartLiveSession(false)}
          onStart={(lessonId: string) => {
            setLessons((prev) => prev.map((lesson) => lesson.id === lessonId ? { ...lesson, status: 'LIVE' } : lesson))
            setShowStartLiveSession(false)
            router.push(`/teacher/lessons/${lessonId}`)
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
          exam={exams.find((exam) => exam.id === gradingExamId) ?? null}
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
  const isReady = resource.status === 'READY' || !resource.status
  const badgeLabel = resource.status ? resource.status.replace('_', ' ') : 'Ready'
  const badgeColor = resource.status === 'PROCESSING' ? 'bg-yellow-100 text-amber-700' : resource.status === 'FAILED' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'

  const handleDownload = () => {
    if (!isReady || !resource.fileUrl) return
    window.open(resource.fileUrl, '_blank')
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#00308715' }}>
          <FileText className="w-4 h-4" style={{ color: '#003087' }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">{resource.title}</p>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeColor}`}>{badgeLabel}</span>
          </div>
          <p className="text-xs text-gray-500">
            {(resource.fileSize / 1024).toFixed(1)} KB • {resource.downloadCount} downloads
          </p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className={`p-2 rounded-lg ${isReady ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
        disabled={!isReady}
        title={isReady ? 'Download resource' : 'Resource not ready yet'}
      >
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
  const initialClass = classes.find((cls: TeacherClass) => cls.id === selectedClass) ?? classes[0]
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'RECORDED',
    classId: initialClass?.id || '',
    subject: initialClass?.subjects?.[0] || '',
    scheduledAt: '',
    duration: 45,
    content: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selectedClassData = classes.find((cls: TeacherClass) => cls.id === formData.classId)

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
              onChange={(e) => {
                const nextClass = classes.find((cls: TeacherClass) => cls.id === e.target.value)
                setFormData({ ...formData, classId: e.target.value, subject: nextClass?.subjects?.[0] || '' })
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003087]"
            >
              {classes.map((cls: TeacherClass) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          {selectedClassData?.subjects?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {selectedClassData.subjects.map((subject: string) => <option key={subject}>{subject}</option>)}
              </select>
            </div>
          )}

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

          <p className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
            The lesson is available to all students with an active enrollment in this class. Attendance is recorded when they join.
          </p>

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
          {error && <p role="alert" className="mb-3 text-sm text-rose-700">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={saving || !formData.title.trim() || !formData.classId}
              onClick={async () => {
                setSaving(true)
                setError(null)
                try {
                  const res = await fetch('/api/teacher/lessons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data?.error || 'Unable to create lesson')
                  onCreate(data)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Unable to create lesson')
                } finally {
                  setSaving(false)
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium hover:bg-opacity-90"
              style={{ backgroundColor: '#003087' }}
            >
              {saving ? 'Creating…' : 'Create Lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function StartLiveSessionModal({ lessons, onClose, onStart }: any) {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0]?.id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Start Live Session</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Choose lesson</label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {lessons.map((lesson: Lesson) => (
                  <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-sm text-rose-600">{error}</p>}
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
                if (!selectedLessonId) return
                setLoading(true)
                setError(null)
                try {
                  const res = await fetch('/api/lessons/live/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessonId: selectedLessonId, title: 'Live Lesson' }),
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data?.error || 'Unable to start live lesson')
                  onStart(selectedLessonId)
                } catch (err: any) {
                  setError(err?.message || 'Unable to start live lesson')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#003087' }}
            >
              {loading ? 'Starting…' : 'Go Live'}
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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          {error && <p role="alert" className="mb-3 text-sm text-rose-700">{error}</p>}
          <button
            disabled={saving || !formData.title.trim() || !formData.classId}
            onClick={async () => {
              setSaving(true)
              setError(null)
              try {
                const res = await fetch('/api/teacher/exams', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...formData, questions })
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data?.error || 'Unable to create exam')
                onCreate(data)
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Unable to create exam')
              } finally {
                setSaving(false)
              }
            }}
            className="w-full py-3 rounded-lg text-white font-medium hover:bg-opacity-90"
            style={{ backgroundColor: '#003087' }}
          >
            {saving ? 'Creating…' : 'Create Exam'}
          </button>
        </div>
      </div>
    </div>
  )
}

function UploadResourceModal({ classes, selectedClass, onClose, onUpload }: any) {
  const initialClass = classes.find((cls: TeacherClass) => cls.id === selectedClass) ?? classes[0]
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF_NOTE',
    classId: initialClass?.id || '',
    subject: initialClass?.subjects?.[0] || '',
    file: null as File | null,
  })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null)
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
                onChange={(e) => {
                  const nextClass = classes.find((cls: TeacherClass) => cls.id === e.target.value)
                  setFormData({ ...formData, classId: e.target.value, subject: nextClass?.subjects?.[0] || '' })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {classes.map((cls: TeacherClass) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {classes.find((cls: TeacherClass) => cls.id === formData.classId)?.subjects?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {classes.find((cls: TeacherClass) => cls.id === formData.classId).subjects.map((subject: string) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            )}

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
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, PPT, PPTX, MP4 up to 50MB</p>
              {formData.file && (
                <p className="text-sm text-gray-700 mt-3">Selected file: {formData.file.name}{selectedFileSize ? ` · ${(selectedFileSize / 1024 / 1024).toFixed(1)} MB` : ''}</p>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx,.mp4,.ppt,.pptx"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null
                if (file && file.size > 50 * 1024 * 1024) {
                  setUploadError('File must be 50MB or smaller.')
                  setFormData((prev) => ({ ...prev, file: null }))
                  setSelectedFileSize(null)
                  return
                }
                setFormData((prev) => ({ ...prev, file }))
                setSelectedFileSize(file?.size ?? null)
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

                if (!formData.title.trim()) {
                  setUploadError('Please enter a resource title.')
                  return
                }

                setUploading(true)
                setUploadError(null)
                try {
                  const uploadPayload = new FormData()
                  uploadPayload.append('file', formData.file)
                  uploadPayload.append('classId', formData.classId)

                  const uploadRes = await fetch('/api/cloudinary/upload', {
                    method: 'POST',
                    body: uploadPayload,
                  })
                  const uploadData = await uploadRes.json()
                  if (!uploadRes.ok) {
                    throw new Error(uploadData.error || 'Upload failed')
                  }

                  const payload = {
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    type: formData.type,
                    classId: formData.classId,
                    subject: formData.subject,
                    cloudinaryUrl: uploadData.url,
                    cloudinaryPublicId: uploadData.public_id,
                    fileSize: uploadData.bytes || formData.file.size,
                    fileName: uploadData.filename || formData.file.name,
                    mimeType: uploadData.mimeType || formData.file.type,
                  }

                  const res = await fetch('/api/teacher/resources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  })
                  const data = await res.json()
                  if (!res.ok) {
                    throw new Error(data.error || 'Failed to save resource metadata')
                  }

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

function GradeSubmissionModal({ onClose, onGrade, exam }: {
  onClose: () => void
  onGrade: (submission: unknown) => void
  exam: Exam | null
}) {
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [studentId, setStudentId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pendingSubmissions = exam?.submissions?.filter((submission) => submission.status !== 'GRADED') ?? []

  useEffect(() => {
    if (!pendingSubmissions.some((submission) => submission.studentId === studentId)) {
      setStudentId(pendingSubmissions[0]?.studentId ?? '')
    }
  }, [exam?.id, pendingSubmissions.map((submission) => submission.studentId).join(','), studentId])

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
              <label htmlFor="grade-student" className="block text-sm font-medium text-gray-700 mb-1">Student</label>
              <select
                id="grade-student"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                disabled={!pendingSubmissions.length}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {pendingSubmissions.map((submission) => (
                  <option key={submission.studentId} value={submission.studentId}>{submission.studentName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Score (out of {exam?.totalMarks ?? 100})</label>
              <input
                type="number"
                min="0"
                max={exam?.totalMarks ?? 100}
                required
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                disabled={!pendingSubmissions.length}
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
                disabled={!pendingSubmissions.length}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Provide feedback to the student..."
              />
            </div>
            {!pendingSubmissions.length && <p className="text-sm text-amber-700">There are no pending submissions to grade for this exam.</p>}
            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              disabled={saving || !studentId || !grade || !exam}
              onClick={async () => {
                setSaving(true)
                setError(null)
                try {
                  const score = Number(grade)
                  if (!Number.isFinite(score) || score < 0 || score > (exam?.totalMarks ?? 100)) {
                    throw new Error(`Score must be between 0 and ${exam?.totalMarks ?? 100}`)
                  }
                  const payload = { examId: exam?.id, studentId, score, feedback }
                  const res = await fetch('/api/teacher/exams/grade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || 'Unable to submit grade')
                  onGrade(data)
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Unable to submit grade')
                } finally {
                  setSaving(false)
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#003087' }}
            >
              {saving ? 'Submitting…' : 'Submit Grade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}