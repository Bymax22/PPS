// app/(dashboard)/teacher/page.tsx
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
  MapPin
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
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [showCreateLesson, setShowCreateLesson] = useState(false)
  const [showCreateExam, setShowCreateExam] = useState(false)
  const [showUploadResource, setShowUploadResource] = useState(false)
  const [showGradeSubmission, setShowGradeSubmission] = useState(false)
  const [gradingExamId, setGradingExamId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [scrolled, setScrolled] = useState(false)

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

  // Mock data - replace with API calls
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([
    {
      id: '1',
      name: 'Mathematics Grade 10',
      grade: 10,
      subject: 'Mathematics',
      program: { name: 'Online Full Time', type: 'ONLINE_FULL_TIME' },
      schedule: [
        { id: '1', day: 'Monday', time: '09:00', duration: 60 },
        { id: '2', day: 'Wednesday', time: '09:00', duration: 60 },
        { id: '3', day: 'Friday', time: '09:00', duration: 60 }
      ],
      students: [
        {
          id: '1',
          userId: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          grade: 10,
          attendance: [],
          progress: [],
          parent: {
            firstName: 'Mike',
            lastName: 'Doe',
            email: 'mike.doe@example.com',
            phone: '+1234567890'
          }
        },
        {
          id: '2',
          userId: 'user2',
          firstName: 'Emma',
          lastName: 'Smith',
          email: 'emma.smith@example.com',
          grade: 10,
          attendance: [],
          progress: []
        }
      ]
    },
    {
      id: '2',
      name: 'Physics Grade 11',
      grade: 11,
      subject: 'Physics',
      program: { name: 'Online Full Time', type: 'ONLINE_FULL_TIME' },
      schedule: [
        { id: '1', day: 'Tuesday', time: '11:00', duration: 60 },
        { id: '2', day: 'Thursday', time: '11:00', duration: 60 }
      ],
      students: []
    }
  ])

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Introduction to Algebra',
      description: 'Basic algebraic concepts and equations',
      type: 'RECORDED',
      status: 'COMPLETED',
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: 45,
      classId: '1',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Quadratic Equations',
      description: 'Solving quadratic equations using various methods',
      type: 'LIVE',
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 60,
      classId: '1',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ])

  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Algebra Midterm',
      description: 'Covers all algebra topics from chapters 1-5',
      type: 'MIDTERM',
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 90,
      totalMarks: 100,
      passingMarks: 50,
      classId: '1',
      submissions: [
        {
          id: '1',
          studentId: '1',
          studentName: 'John Doe',
          score: 85,
          percentage: 85,
          submittedAt: new Date(),
          status: 'GRADED'
        }
      ]
    }
  ])

  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Algebra Formula Sheet',
      description: 'Comprehensive formula reference',
      type: 'PDF_NOTE',
      fileUrl: '/resources/formula-sheet.pdf',
      fileSize: 1024 * 1024,
      downloadCount: 45,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Parent - John Doe',
      fromRole: 'parent',
      to: 'teacher',
      message: 'My son is struggling with algebra. Can you provide additional resources?',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      childId: '1'
    }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Student Enrollment',
      message: 'A new student has been enrolled in your Physics class',
      date: new Date(),
      read: false,
      type: 'enrollment'
    }
  ])

  const selectedClassData = selectedClass ? teacherClasses.find(c => c.id === selectedClass) : teacherClasses[0]
  const selectedStudentData = selectedStudent && selectedClassData 
    ? selectedClassData.students.find(s => s.id === selectedStudent)
    : null

  const totalStudents = teacherClasses.reduce((sum, c) => sum + c.students.length, 0)
  const totalLessons = lessons.length
  const totalExams = exams.length
  const pendingGrading = exams.reduce((sum, e) => sum + (e.submissions?.filter(s => s.status === 'PENDING').length || 0), 0)

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
                    T
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Teacher Portal</p>
                    <p className="text-sm text-gray-500">Mr. Johnson</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <nav className="space-y-2">
                <MobileNavItem href="/teacher" icon={Home} label="Dashboard" active />
                <MobileNavItem href="/teacher/classes" icon={BookOpen} label="My Classes" />
                <MobileNavItem href="/teacher/students" icon={Users} label="Students" />
                <MobileNavItem href="/teacher/exams" icon={Award} label="Exams" />
                <MobileNavItem href="/teacher/messages" icon={MessageCircle} label="Messages" />
                <MobileNavItem href="/teacher/settings" icon={Settings} label="Settings" />
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
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-bold" style={{ color: '#003087' }}>
                  Teacher Portal
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
                  <p className="text-sm font-medium text-gray-900">Mr. Johnson</p>
                  <p className="text-xs text-gray-500">Mathematics Teacher</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#003087' }}
                >
                  MJ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden lg:block px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <div className="flex gap-6">
            {['overview', 'classes', 'students', 'exams', 'resources', 'messages'].map((tab) => (
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
                Mr. Johnson
              </h2>
              <p className="text-white/70 text-sm mt-2">
                Teaching {teacherClasses.length} classes • {totalStudents} students
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateLesson(true)}
                className="px-4 py-2 rounded-lg bg-white text-[#003087] font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Create Lesson
              </button>
              <button
                onClick={() => setShowCreateExam(true)}
                className="px-4 py-2 rounded-lg bg-white text-[#003087] font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2"
              >
                <ClipboardList className="w-4 h-4" />
                Create Exam
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={BookOpen}
            label="My Classes"
            value={teacherClasses.length}
            subtitle="Active courses"
          />
          <StatCard 
            icon={Users}
            label="Total Students"
            value={totalStudents}
            subtitle="Enrolled learners"
          />
          <StatCard 
            icon={ClipboardList}
            label="Pending Grading"
            value={pendingGrading}
            subtitle="Exams to grade"
          />
          <StatCard 
            icon={TrendingUp}
            label="Avg. Performance"
            value="78%"
            subtitle="Class average"
          />
        </div>

        {/* Class Selector */}
        {teacherClasses.length > 0 && (
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Select Class</label>
            <div className="flex gap-3 flex-wrap">
              {teacherClasses.map(cls => (
                <button
                  key={cls.id}
                  onClick={() => {
                    setSelectedClass(cls.id)
                    setSelectedStudent(null)
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedClass === cls.id || (!selectedClass && cls.id === teacherClasses[0]?.id)
                      ? 'bg-[#003087] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cls.name} ({cls.students.length} students)
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedClassData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Class Schedule */}
              <DashboardCard title="Class Schedule" icon={Calendar}>
                <div className="space-y-3">
                  {selectedClassData.schedule.map((schedule, idx) => (
                    <ScheduleItem key={idx} schedule={schedule} />
                  ))}
                </div>
              </DashboardCard>

              {/* Lessons */}
              <DashboardCard 
                title="Lessons" 
                icon={Video}
                action={
                  <button
                    onClick={() => setShowCreateLesson(true)}
                    className="text-sm font-medium hover:opacity-80 flex items-center gap-1"
                    style={{ color: '#003087' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Lesson
                  </button>
                }
              >
                {lessons.filter(l => l.classId === selectedClass).length > 0 ? (
                  <div className="space-y-3">
                    {lessons.filter(l => l.classId === selectedClass).map(lesson => (
                      <LessonItem key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No lessons created yet" />
                )}
              </DashboardCard>

              {/* Exams */}
              <DashboardCard 
                title="Exams" 
                icon={Award}
                action={
                  <button
                    onClick={() => setShowCreateExam(true)}
                    className="text-sm font-medium hover:opacity-80 flex items-center gap-1"
                    style={{ color: '#003087' }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Exam
                  </button>
                }
              >
                {exams.filter(e => e.classId === selectedClass).length > 0 ? (
                  <div className="space-y-3">
                    {exams.filter(e => e.classId === selectedClass).map(exam => (
                      <ExamItem key={exam.id} exam={exam} onGrade={(id: string) => { setGradingExamId(id); setShowGradeSubmission(true) }} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No exams created yet" />
                )}
              </DashboardCard>

              {/* Resources */}
              <DashboardCard 
                title="Class Resources" 
                icon={FolderOpen}
                action={
                  <button
                    onClick={() => setShowUploadResource(true)}
                    className="text-sm font-medium hover:opacity-80 flex items-center gap-1"
                    style={{ color: '#003087' }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                }
              >
                {resources.length > 0 ? (
                  <div className="space-y-3">
                    {resources.map(resource => (
                      <ResourceItem key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No resources uploaded" />
                )}
              </DashboardCard>
            </div>

            {/* Right Column - 1/3 */}
            <div className="space-y-6">
              {/* Students List */}
              <DashboardCard 
                title="Students" 
                icon={Users}
                action={
                  <span className="text-sm text-gray-500">
                    {selectedClassData.students.length} enrolled
                  </span>
                }
              >
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {selectedClassData.students.length > 0 ? (
                    selectedClassData.students.map(student => (
                      <StudentItem 
                        key={student.id} 
                        student={student}
                        onSelect={() => setSelectedStudent(student.id)}
                        isSelected={selectedStudent === student.id}
                      />
                    ))
                  ) : (
                    <EmptyState message="No students enrolled" />
                  )}
                </div>
              </DashboardCard>

              {/* Student Details (when selected) */}
              {selectedStudentData && (
                <DashboardCard title="Student Details" icon={UserCheck}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#003087' }}>
                        {selectedStudentData.firstName[0]}{selectedStudentData.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedStudentData.firstName} {selectedStudentData.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">Grade {selectedStudentData.grade}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <InfoRow label="Email" value={selectedStudentData.email} icon={Mail} />
                      {selectedStudentData.phone && (
                        <InfoRow label="Phone" value={selectedStudentData.phone} icon={Phone} />
                      )}
                      {selectedStudentData.parent && (
                        <>
                          <div className="pt-2 mt-2 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Parent Information</p>
                            <InfoRow label="Parent" value={`${selectedStudentData.parent.firstName} ${selectedStudentData.parent.lastName}`} />
                            <InfoRow label="Parent Email" value={selectedStudentData.parent.email} icon={Mail} />
                            {selectedStudentData.parent.phone && (
                              <InfoRow label="Parent Phone" value={selectedStudentData.parent.phone} icon={Phone} />
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 py-2 px-3 rounded-lg text-white text-sm font-medium hover:bg-opacity-90" style={{ backgroundColor: '#003087' }}>
                        <MessageCircle className="w-4 h-4 inline mr-2" />
                        Message
                      </button>
                      <button className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">
                        <Eye className="w-4 h-4 inline mr-2" />
                        View Profile
                      </button>
                    </div>
                  </div>
                </DashboardCard>
              )}

              {/* Recent Messages */}
              <DashboardCard title="Recent Messages" icon={MessageCircle}>
                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.slice(0, 3).map(msg => (
                      <MessageItem key={msg.id} message={msg} />
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No messages" />
                )}
                <Link 
                  href="/teacher/messages"
                  className="inline-block mt-4 text-sm font-medium hover:opacity-80"
                  style={{ color: '#003087' }}
                >
                  View all messages →
                </Link>
              </DashboardCard>

              {/* Quick Actions */}
              <DashboardCard title="Quick Actions" icon={Settings}>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionCard 
                    href="/teacher/attendance"
                    label="Take Attendance"
                    icon={UserCheck}
                  />
                  <QuickActionCard 
                    href="/teacher/grades"
                    label="Enter Grades"
                    icon={Edit}
                  />
                  <QuickActionCard 
                    href="/teacher/reports"
                    label="Generate Report"
                    icon={Download}
                  />
                  <QuickActionCard 
                    href="/teacher/analytics"
                    label="Analytics"
                    icon={PieChart}
                  />
                </div>
              </DashboardCard>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showCreateLesson && (
        <CreateLessonModal 
          classes={teacherClasses}
          selectedClass={selectedClass}
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
          selectedClass={selectedClass}
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
          selectedClass={selectedClass}
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
          studentId={selectedStudent}
          studentName={selectedStudentData ? `${selectedStudentData.firstName} ${selectedStudentData.lastName}` : 'Student'}
          onClose={() => setShowGradeSubmission(false)}
          onGrade={(submission) => {
            setShowGradeSubmission(false)
            // optionally trigger a refresh; dashboard polling will pick up changes
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
    file: null
  })

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

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003087] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload file</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, MP4 up to 50MB</p>
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
                  // For now send metadata; file upload is mocked
                  const payload = { ...formData, cloudinaryUrl: '', cloudinaryPublicId: '', fileSize: 0 }
                  const res = await fetch('/api/teacher/resources', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  })
                  const data = await res.json()
                  onUpload(data)
                } catch (err) {
                  onUpload({ ...formData, id: Date.now().toString(), createdAt: new Date(), downloadCount: 0 })
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: '#003087' }}
            >
              Upload
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