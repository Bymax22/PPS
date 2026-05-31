"use client"

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  Home,
  BookOpen,
  PlayCircle,
  Video,
  FileText,
  Award,
  BarChart2,
  Calendar,
  MessageSquare,
  Bell,
  CreditCard,
  User,
  HelpCircle,
  LogOut
} from 'lucide-react'

interface StudentDashboardSidebarProps {
  collapsed?: boolean
  studentName: string
  grade?: string | null
  schoolYear?: string | null
  parentName: string
  activeClasses: number
  nextLessonTitle: string
}

export default function StudentDashboardSidebar({
  collapsed = false,
  studentName,
  grade,
  schoolYear,
  parentName,
  activeClasses,
  nextLessonTitle
}: StudentDashboardSidebarProps) {
  return (
    <aside className={`sticky top-6 h-[calc(100vh-48px)] ${collapsed ? 'w-20' : 'w-64'} overflow-auto rounded-2xl bg-gradient-to-b from-[#062b75] to-[#003087] p-3 text-white shadow-lg`}>
      <div className="flex items-center gap-3 px-2 py-3">
        <div className={`h-10 ${collapsed ? 'w-10' : 'w-10'} rounded-lg bg-white/10 flex items-center justify-center text-lg font-bold`}>PPS</div>
        {!collapsed && (
          <div>
            <p className="text-xs opacity-80">PPS LMS</p>
            <p className="font-semibold text-sm">Student</p>
          </div>
        )}
      </div>

      <nav className="mt-6 space-y-1 px-2">
        <Link href="/student" className={`flex items-center gap-3 rounded-lg px-3 py-2 ${collapsed ? 'justify-center' : 'justify-start'} bg-white/10 hover:bg-white/20`}>
          <Home className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Dashboard</span>}
        </Link>
        <Link href="/student/classes" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <BookOpen className="w-5 h-5" />
          {!collapsed && <span className="text-sm">My Classes</span>}
        </Link>
        <Link href="/student/live" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <PlayCircle className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Live Lessons</span>}
        </Link>
        <Link href="/student/recordings" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <Video className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Recordings</span>}
        </Link>
        <Link href="/student/assignments" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <FileText className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Assignments</span>}
        </Link>
        <Link href="/student/exams" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <Award className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Exams</span>}
        </Link>
        <Link href="/student/resources" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <BarChart2 className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Progress</span>}
        </Link>
        <Link href="/student/calendar" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <Calendar className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Calendar</span>}
        </Link>
        <Link href="/student/messages" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <MessageSquare className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Messages</span>}
        </Link>
        <Link href="/student/notifications" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <Bell className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Notifications</span>}
        </Link>
        <Link href="/student/payments" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <CreditCard className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Payments</span>}
        </Link>
        <Link href="/student/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <User className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Profile</span>}
        </Link>
        <Link href="/support" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5">
          <HelpCircle className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Help & Support</span>}
        </Link>
      </nav>

      <div className="mt-6 px-2">
        {!collapsed && (
          <div className="rounded-lg bg-white/6 p-3 text-xs">
            <p className="font-semibold">{studentName}</p>
            <p className="text-[11px] opacity-80">Grade {grade ?? 'N/A'}</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`mt-4 flex ${collapsed ? 'justify-center' : 'w-full items-center justify-center gap-2'} rounded-lg bg-white text-[#003087] py-2 font-semibold`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
