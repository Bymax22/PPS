'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  FaHome, 
  FaUserGraduate, 
  FaChartLine, 
  FaCalendarCheck,
  FaComments,
  FaCog,
  FaBars,
  FaTimes,
  FaUserPlus,
  FaDollarSign,
  FaReceipt
} from 'react-icons/fa'

const menuItems = [
  { name: 'Dashboard', href: '/parent', icon: FaHome },
  { name: 'My Students', href: '/parent/students', icon: FaUserGraduate },
  { name: 'Progress Tracking', href: '/parent/progress', icon: FaChartLine },
  { name: 'Attendance', href: '/parent/attendance', icon: FaCalendarCheck },
  { name: 'Payment', href: '/parent/payment', icon: FaDollarSign },
  { name: 'Subscription', href: '/parent/subscription', icon: FaReceipt },
  { name: 'Communications', href: '/parent/communications', icon: FaComments },
  { name: 'Link Student', href: '/parent/link-student', icon: FaUserPlus },
  { name: 'Settings', href: '/parent/settings', icon: FaCog },
]

export default function ParentSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0713FB] text-white rounded-lg"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-xl border-r border-gray-200
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300
        flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-[#0713FB] rounded-xl flex items-center justify-center text-white font-bold">
            PP
          </div>
          <div>
            <div className="font-bold text-gray-900">Parent Portal</div>
            <div className="text-sm text-gray-500">Progress Preparatory</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#0713FB] text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#0713FB]'
                  }
                `}
              >
                <Icon className={`text-lg ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#0713FB]'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#0EF117] rounded-full flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {session?.user?.name}
              </div>
              <div className="text-sm text-gray-500">Parent</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}