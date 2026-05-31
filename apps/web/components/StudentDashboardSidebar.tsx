"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

  const navItems = [
    { href: '/student', label: 'Dashboard', icon: Home },
    { href: '/student/classes', label: 'My Classes', icon: BookOpen },
    { href: '/student/live', label: 'Live Lessons', icon: PlayCircle },
    { href: '/student/recordings', label: 'Recordings', icon: Video },
    { href: '/student/assignments', label: 'Assignments', icon: FileText },
    { href: '/student/exams', label: 'Exams', icon: Award },
    { href: '/student/progress', label: 'Progress', icon: BarChart2 },
    { href: '/student/calendar', label: 'Calendar', icon: Calendar },
    { href: '/student/messages', label: 'Messages', icon: MessageSquare },
    { href: '/student/notifications', label: 'Notifications', icon: Bell },
    { href: '/student/payments', label: 'Payments', icon: CreditCard },
    { href: '/student/profile', label: 'Profile', icon: User },
    { href: '/support', label: 'Help & Support', icon: HelpCircle }
  ]

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
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/student' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${collapsed ? 'justify-center' : 'justify-start'} transition-colors ${isActive ? 'bg-white/20 text-white' : 'hover:bg-white/5 text-white/90'}`}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
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
