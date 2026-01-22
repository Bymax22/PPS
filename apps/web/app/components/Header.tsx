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
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
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
                  // Fallback if logo doesn't exist
                  const img = e.currentTarget as HTMLImageElement
                  img.style.display = 'none'
                }}
                priority
              />
              {/* Fallback logo */}
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
                          <div className="text-xs text-gray-500">{dropdownItem.description}</div>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-5">
            <div className="px-4 py-4">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between py-3 px-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                      {item.dropdown && <FaChevronDown className="text-xs" />}
                    </Link>
                    {item.dropdown && (
                      <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block py-2 px-3 text-gray-600 hover:text-[#0713FB] hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="font-medium text-sm">{dropdownItem.name}</div>
                            <div className="text-xs text-gray-400">{dropdownItem.description}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  className="block w-full text-center py-3 text-[#0713FB] font-medium border border-[#0713FB] rounded-lg hover:bg-[#0713FB] hover:text-white transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login to Portal
                </Link>
                <Link
                  href="/enroll"
                  className="block w-full text-center py-3 bg-[#0713FB] text-white font-semibold rounded-lg hover:bg-[#060EDB] transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Enrollment
                </Link>
              </div>

              {/* Contact Info */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900">Call Us</div>
                    <div className="text-[#0713FB]">+260 211 123 456</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-[#0713FB]">info@progressprep.edu.zm</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}