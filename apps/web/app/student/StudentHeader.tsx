'use client'

import { useSession, signOut } from 'next-auth/react'
import { FaBell, FaSignOutAlt, FaUser } from 'react-icons/fa'

export default function StudentHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search classes, assignments, materials..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-[#0713FB] transition-colors">
            <FaBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-[#0EF117] rounded-full flex items-center justify-center text-white font-bold text-sm">
                {session?.user?.name?.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {session?.user?.name}
                </div>
                <div className="text-xs text-gray-500">Student</div>
              </div>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
                <FaUser className="text-gray-400" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => signOut()}
                className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FaSignOutAlt className="text-gray-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}