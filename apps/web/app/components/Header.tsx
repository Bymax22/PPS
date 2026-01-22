'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa'

const navigation = [
  {
    name: 'Programs',
    href: '/programs',
    dropdown: [
      { name: 'Primary School (G1-7)', href: '/programs/primary', description: 'Ages 6-12' },
      { name: 'Junior Secondary (G8-9)', href: '/programs/junior', description: 'Ages 13-14' },
      { name: 'Senior Secondary (G10-12)', href: '/programs/senior', description: 'Ages 15-18' },
      { name: 'Curriculum Overview', href: '/programs/curriculum', description: 'Complete syllabus' }
    ]
  },
  {
    name: 'Platform',
    href: '/platform',
    dropdown: [
      { name: 'Student Portal', href: '/platform/student', description: 'Learning dashboard' },
      { name: 'Parent Portal', href: '/platform/parent', description: 'Progress monitoring' },
      { name: 'Teacher Portal', href: '/platform/teacher', description: 'Class management' },
      { name: 'Admin Portal', href: '/platform/admin', description: 'School administration' }
    ]
  },
  {
    name: 'Admissions',
    href: '/admissions',
    dropdown: [
      { name: 'Application Process', href: '/admissions/process', description: 'Step-by-step guide' },
      { name: 'Requirements', href: '/admissions/requirements', description: 'Entry criteria' },
      { name: 'Fee Structure', href: '/admissions/fees', description: 'Tuition & payments' },
      { name: 'Scholarships', href: '/admissions/scholarships', description: 'Financial aid' }
    ]
  },
  {
    name: 'About',
    href: '/about',
    dropdown: [
      { name: 'Our Story', href: '/about/story', description: 'History & mission' },
      { name: 'Faculty', href: '/about/faculty', description: 'Meet our teachers' },
      { name: 'Accreditations', href: '/about/accreditations', description: 'Certifications' },
      { name: 'Careers', href: '/about/careers', description: 'Join our team' }
    ]
  },
  {
    name: 'Results',
    href: '/results'
  }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', checkMobile)
    checkMobile() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setActiveDropdown(null)
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Mobile Optimized */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group min-h-[44px]"
            onMouseEnter={() => setActiveDropdown(null)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <Image
                  src="/logo.png"
                  alt="Progress Preparatory"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 32px, 40px"
                  priority
                />
              </div>
              {/* Logo Text - Responsive */}
              <div className="flex flex-col">
                <div className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 leading-tight">
                  Progress Preparatory
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight hidden sm:block">
                  The Hallmark of Excellence
                </div>
                <div className="text-xs sm:text-sm text-gray-600 leading-tight sm:hidden">
                  Excellence in Education
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm min-h-[44px] ${
                    pathname === item.href
                      ? 'text-[#0713FB] bg-blue-50'
                      : 'text-gray-700 hover:text-[#0713FB] hover:bg-gray-50'
                  }`}
                >
                  <span>{item.name}</span>
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
                        className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-all duration-300 group min-h-[44px]"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          pathname === dropdownItem.href ? 'bg-[#0713FB]' : 'bg-gray-300 group-hover:bg-[#0713FB]'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm group-hover:text-[#0713FB] truncate ${
                            pathname === dropdownItem.href ? 'text-[#0713FB]' : 'text-gray-900'
                          }`}>
                            {dropdownItem.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{dropdownItem.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 font-medium hover:text-[#0713FB] transition-colors duration-300 text-sm min-h-[44px] flex items-center"
            >
              Login
            </Link>
            <Link
              href="/enroll"
              className="bg-[#0713FB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#060EDB] transition-all duration-300 text-sm min-h-[44px] flex items-center"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center touch-button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in-0"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Mobile Menu Panel */}
            <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white z-50 animate-in slide-in-from-top-5 overflow-y-auto hide-scrollbar">
              <div className="px-4 py-4 safe-bottom">
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                      <div className="flex flex-col">
                        <Link
                          href={item.href}
                          className="flex items-center justify-between py-4 px-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px] touch-button"
                          onClick={() => !item.dropdown && setIsMenuOpen(false)}
                        >
                          <span className="text-sm font-semibold">{item.name}</span>
                          {item.dropdown && (
                            <FaChevronDown 
                              className={`text-xs transition-transform duration-300 ${
                                activeDropdown === item.name ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </Link>
                        
                        {/* Mobile Dropdown */}
                        {item.dropdown && (
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                            className="lg:hidden absolute right-4 top-4 p-2 text-gray-500"
                            aria-label={`Toggle ${item.name} dropdown`}
                          />
                        )}
                        
                        {item.dropdown && activeDropdown === item.name && (
                          <div className="ml-3 space-y-1 border-l-2 border-gray-200 pl-3 py-2">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className="block py-3 px-3 text-gray-700 hover:text-[#0713FB] hover:bg-gray-50 rounded-lg transition-colors touch-button"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="font-medium text-sm">{dropdownItem.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{dropdownItem.description}</div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </nav>

                {/* Mobile CTA Buttons */}
                <div className="pt-6 mt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full text-center py-3.5 text-[#0713FB] font-medium border-2 border-[#0713FB] rounded-lg hover:bg-[#0713FB] hover:text-white transition-all duration-300 active:scale-[0.98] touch-button"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login to Portal
                  </Link>
                  <Link
                    href="/enroll"
                    className="block w-full text-center py-3.5 bg-[#0713FB] text-white font-semibold rounded-lg hover:bg-[#060EDB] transition-all duration-300 active:scale-[0.98] touch-button"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Enrollment
                  </Link>
                </div>

                {/* Contact Info - Mobile */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Call Us</div>
                      <a 
                        href="tel:+260211123456" 
                        className="text-[#0713FB] hover:underline touch-button inline-flex items-center py-1"
                      >
                        +260 211 123 456
                      </a>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Email</div>
                      <a 
                        href="mailto:info@progressprep.edu.zm" 
                        className="text-[#0713FB] hover:underline touch-button inline-flex items-center py-1"
                      >
                        info@progressprep.edu.zm
                      </a>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm mb-1">Office Hours</div>
                      <div className="text-gray-600 text-sm">
                        Mon-Fri: 8AM - 5PM
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links - Mobile Only */}
                <div className="pt-6 mt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm mb-3">Follow Us</div>
                    <div className="flex justify-center space-x-4">
                      {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors touch-button"
                          aria-label={`Follow on ${social}`}
                        >
                          {social.charAt(0)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}