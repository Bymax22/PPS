'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaChevronDown, FaBars, FaTimes, FaSearch, FaBell, FaUser, FaHome, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa'

const navigation = [
  {
    name: 'Programs',
    href: '/programs',
    icon: '📚',
    dropdown: [
      { name: 'Primary (G1-7)', href: '/programs/primary', icon: '👶' },
      { name: 'Junior (G8-9)', href: '/programs/junior', icon: '🧒' },
      { name: 'Senior (G10-12)', href: '/programs/senior', icon: '👨‍🎓' },
      { name: 'Curriculum', href: '/programs/curriculum', icon: '📋' }
    ]
  },
  {
    name: 'Platform',
    href: '/platform',
    icon: '💻',
    dropdown: [
      { name: 'Student', href: '/platform/student', icon: '🎒' },
      { name: 'Parent', href: '/platform/parent', icon: '👨‍👩‍👧‍👦' },
      { name: 'Teacher', href: '/platform/teacher', icon: '👩‍🏫' },
      { name: 'Admin', href: '/platform/admin', icon: '⚙️' }
    ]
  },
  {
    name: 'Admissions',
    href: '/admissions',
    icon: '📝',
    dropdown: [
      { name: 'Apply Now', href: '/admissions/apply', icon: '✍️' },
      { name: 'Fees', href: '/admissions/fees', icon: '💰' },
      { name: 'Scholarships', href: '/admissions/scholarships', icon: '🏆' }
    ]
  },
  {
    name: 'Results',
    href: '/results',
    icon: '📊'
  },
  {
    name: 'About',
    href: '/about',
    icon: '🏫'
  }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsMenuOpen(false)
        setShowSearch(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    checkMobile()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
    setShowSearch(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Mobile Quick Actions
  const quickActions = [
    { name: 'Home', icon: <FaHome />, href: '/', color: 'text-blue-600' },
    { name: 'Student', icon: <FaGraduationCap />, href: '/student', color: 'text-green-600' },
    { name: 'Parent', icon: <FaUser />, href: '/parent', color: 'text-purple-600' },
    { name: 'Teacher', icon: <FaChalkboardTeacher />, href: '/teacher', color: 'text-orange-600' },
    { name: 'Notification', icon: <FaBell />, href: '/notifications', color: 'text-red-600' },
  ]

  return (
    <>
      {/* MOBILE-ONLY HEADER (Shows only on mobile) */}
      <div className="lg:hidden">
        {/* Main Mobile Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
          isScrolled 
            ? 'bg-white shadow-lg border-b border-gray-200' 
            : 'bg-white'
        }`}>
          <div className="px-4">
            <div className="flex items-center justify-between h-14">
              {/* Mobile Logo - Compact */}
              <Link 
                href="/" 
                className="flex items-center space-x-2 min-h-[44px]"
              >
                <div className="relative w-16 h-16">
                  <Image
                    src="/logo.png"
                    alt="Progress Preparatory"
                    fill
                    className="object-contain"
                    sizes="64px"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-black text-xl text-[#0713FB] leading-tight">
                    Progress
                  </div>
                  <div className="text-sm text-[#0EF117] font-bold leading-tight">
                    Prep School
                  </div>
                </div>
              </Link>

              {/* Mobile Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* Portal Button */}
                <Link
                  href="/student"
                  className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Portal"
                >
                  <FaUser className="text-sm" />
                </Link>

                {/* Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2.5 rounded-full bg-[#0713FB] text-white hover:bg-[#060EDB] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar - Removed */}
          </div>
        </header>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-md border-t border-white/10 shadow-[0_-2px_20px_rgba(0,0,0,0.3)] safe-bottom">
          <div className="flex items-center justify-around px-2 py-2">
            {quickActions.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[60px] min-h-[60px] transition-all ${
                  pathname === item.href 
                    ? 'text-[#0713FB] bg-white/20 backdrop-blur-sm' 
                    : 'text-gray-300 hover:text-[#0EF117] hover:bg-white/10'
                }`}
              >
                <div className={`text-lg ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-medium mt-0.5">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-in fade-in-0"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="fixed top-14 left-0 right-0 bottom-16 bg-white z-50 animate-in slide-in-from-top-5 overflow-y-auto hide-scrollbar">
              <div className="px-4 py-3">
                {/* User Profile Section */}
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0713FB] to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    PP
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm">Welcome to Progress Prep!</div>
                    <div className="text-xs text-gray-600 mt-0.5">Zambia's Premier Online School</div>
                  </div>
                  <Link
                    href="/login"
                    className="px-3 py-1.5 bg-[#0713FB] text-white text-xs font-semibold rounded-lg hover:bg-[#060EDB] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                </div>

                {/* Main Navigation */}
                <div className="space-y-1 mb-6">
                  {navigation.map((item) => (
                    <div key={item.name} className="group">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 py-3 px-2 text-gray-900 hover:text-[#0713FB] transition-colors flex-1 min-h-[44px]"
                          onClick={() => !item.dropdown && setIsMenuOpen(false)}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium text-sm flex-1">{item.name}</span>
                        </Link>
                        
                        {item.dropdown && (
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                            className="p-2 text-gray-400 hover:text-[#0713FB] transition-colors"
                            aria-label={`Toggle ${item.name}`}
                          >
                            <FaChevronDown 
                              className={`text-xs transition-transform duration-200 ${
                                activeDropdown === item.name ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        )}
                      </div>
                      
                      {/* Mobile Dropdown */}
                      {item.dropdown && activeDropdown === item.name && (
                        <div className="ml-8 space-y-1 border-l-2 border-gray-200 pl-4 py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="flex items-center space-x-3 py-2.5 px-2 text-gray-700 hover:text-[#0713FB] transition-colors group min-h-[44px]"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="text-base">{dropdownItem.icon}</span>
                              <span className="text-sm flex-1">{dropdownItem.name}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#0713FB] transition-colors" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Quick Links */}
                <div className="mb-6">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">Quick Links</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Calendar', icon: '📅', href: '/calendar' },
                      { name: 'Assignments', icon: '📝', href: '/assignments' },
                      { name: 'Grades', icon: '📈', href: '/grades' },
                      { name: 'Library', icon: '📚', href: '/library' },
                    ].map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center space-x-2 p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Important CTAs */}
                <div className="space-y-2 mb-6">
                  <Link
                    href="/enroll"
                    className="block w-full text-center py-3 bg-gradient-to-r from-[#0713FB] to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all active:scale-[0.98] text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🚀 Start Free Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="block w-full text-center py-3 border-2 border-[#0713FB] text-[#0713FB] font-semibold rounded-lg hover:bg-blue-50 transition-all active:scale-[0.98] text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📞 Contact Admissions
                  </Link>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3 text-sm">
                    <a 
                      href="tel:+260211123456" 
                      className="flex items-center space-x-3 text-gray-700 hover:text-[#0713FB] transition-colors py-1"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600">📞</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-xs">Call Admissions</div>
                        <div className="text-[#0713FB] font-medium">+260 211 123 456</div>
                      </div>
                    </a>
                    <a 
                      href="mailto:info@progressprep.edu.zm" 
                      className="flex items-center space-x-3 text-gray-700 hover:text-[#0713FB] transition-colors py-1"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600">✉️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-xs">Email Us</div>
                        <div className="text-[#0713FB] font-medium text-xs">info@progressprep.edu.zm</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* DESKTOP HEADER - Your existing header code (unchanged) */}
      <div className="hidden lg:block">
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
            : 'bg-white/90 backdrop-blur-sm'
        }`}>
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center space-x-3 group"
                onMouseEnter={() => setActiveDropdown(null)}
              >
                <div className="flex items-center space-x-3">
                  <Image
                    src="/logo.png"
                    alt="Progress Preparatory"
                    width={40}
                    height={40}
                    className="h-10 w-auto"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement
                      img.style.display = 'none'
                    }}
                    priority
                  />
                  <div className="flex flex-col">
                    <div className="font-bold text-xl text-gray-900">
                      Progress Preparatory School
                    </div>
                    <div className="text-sm text-gray-600">
                      The Hallmark of Excellence
                    </div>
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="flex items-center space-x-1">
                {navigation.map((item) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? 'text-[#0713FB] bg-blue-50'
                          : 'text-gray-700 hover:text-[#0713FB] hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm">{item.name}</span>
                      {item.dropdown && (
                        <FaChevronDown className={`text-xs transition-transform duration-300 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.dropdown && activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in-0 zoom-in-95">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-all duration-300 group"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                              pathname === dropdownItem.href ? 'bg-[#0713FB]' : 'bg-gray-300 group-hover:bg-[#0713FB]'
                            }`}></div>
                            <div>
                              <div className={`font-medium text-sm group-hover:text-[#0713FB] ${
                                pathname === dropdownItem.href ? 'text-[#0713FB]' : 'text-gray-900'
                              }`}>
                                {dropdownItem.name}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-[#0713FB] transition-colors duration-300 text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/enroll"
                  className="bg-[#0713FB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#060EDB] transition-all duration-300 text-sm"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer for mobile bottom nav */}
      <div className="lg:hidden h-16"></div>
    </>
  )
}