'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Menu,
  X,
  Search,
  GraduationCap,
  Globe,
  School,
  BookOpen,
  Laptop,
  Users,
  Calendar,
  DollarSign,
  UserPlus,
  Home,
  Award,
  Shield,
  Target,
  Eye,
  BarChart,
  Music,
  Palette,
  Trophy,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Newspaper,
  Linkedin,
  Instagram,
  Facebook
} from 'lucide-react'
import { cn } from '@/lib/utils'
import PortalModal from '@/components/PortalModal'

/* ================= PROMO DATA ================= */

const promos = [
  { text: 'Internationally Recognised Curriculum', icon: GraduationCap },
  { text: 'Physical & Virtual Learning Options Available', icon: Globe },
  { text: 'Modern Facilities & Smart Classrooms', icon: School },
  { text: 'Holistic Education – Academics, Arts & Sports', icon: BookOpen },
  { text: 'Digital Learning Platforms & Innovation Labs', icon: Laptop },
  { text: 'Strong Community & Global Partnerships', icon: Users },
]

function PromoTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % promos.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = promos[index].icon

  return (
    <div className="flex items-center justify-center w-full h-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#003087] max-w-xs"
        >
          <CurrentIcon size={16} strokeWidth={2.5} className="shrink-0" />
          <span className="line-clamp-2">{promos[index].text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ================= HEADER ================= */

export default function CampusHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openMobileTab, setOpenMobileTab] = useState<string | null>(null)
  const [portalModalOpen, setPortalModalOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const nav = [
    {
      title: 'About',
      image: '/images/about.jpg',
      description:
        'Discover our vision, mission and leadership guiding our institution.',
      items: [
        { name: 'Vision & Mission', href: '/about', icon: Eye },
        { name: 'Leadership', href: '/leadership', icon: Users },
        { name: 'Location – Lusaka', href: '/location', icon: MapPin },
        { name: 'Accreditations', href: '/accreditations', icon: Award },
        { name: 'Safeguarding', href: '/safeguarding', icon: Shield },
      ],
    },
    {
      title: 'Learning',
      image: '/images/learning.jpg',
      description:
        'ECZ Curriculum integrated with Cambridge international standards.',
      items: [
        { name: 'Baby Class – Grade 7', href: '/learning', icon: GraduationCap },
        { name: 'Explore Programs', href: '/programs', icon: BookOpen },
        { name: 'Cambridge Integration', href: '/cambridge', icon: Globe },
        { name: 'Assessment Approach', href: '/assessment', icon: BarChart },
        { name: 'Co-Curricular', href: '/activities', icon: Trophy },
      ],
    },
    {
      title: 'Admissions',
      image: '/images/admissions.jpg',
      description:
        'Flexible learning options tailored for every child.',
      items: [
        { name: 'On-Campus Learning', href: '/on-campus', icon: Home },
        { name: 'Home One-on-One', href: '/home-tuition', icon: Home },
        { name: 'Online Sessions', href: '/online-sessions', icon: Laptop },
        { name: 'Tuition & Fees', href: '/tuition', icon: DollarSign },
        { name: 'Enroll Now', href: '/apply', icon: UserPlus },
        { name: 'Book Appointment', href: '/book-appointment', icon: Calendar },
      ],
    },
    {
      title: 'Community',
      image: '/images/community.jpg',
      description:
        'Partnering with families and building global citizens.',
      items: [
        { name: 'Portals', href: '#', onClick: () => setPortalModalOpen(true), icon: Users },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'News', href: '/news', icon: Newspaper },
        { name: 'Alumni', href: '/alumni', icon: Users },
        { name: 'Contact Us', href: '/contact', icon: Phone },
      ],
    },
  ]

  const quickLinks = [
    { name: 'Apply Now', href: '/apply', icon: UserPlus },
    { name: 'Book Tour', href: '/book-appointment', icon: Calendar },
    { name: 'Tuition Fees', href: '/tuition', icon: DollarSign },
    { name: 'Contact', href: '/contact', icon: Phone },
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/progresspreparatory', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/progresspreparatory', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/progress-preparatory', label: 'LinkedIn' },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-500 flex flex-col',
          scrolled ? 'shadow-lg bg-white' : 'bg-white'
        )}
      >

        {/* TOP UTILITY BAR */}
        <div className="bg-[#00205B] text-white text-xs order-last lg:order-first">
          <div className="container mx-auto px-6 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href="tel:+260771050500" className="flex items-center gap-1 hover:text-[var(--campus-gold)] transition-colors">
                <Phone size={12} /> Call
              </a>
              <span className="text-gray-500">|</span>
              <a href="mailto:progresspreparatoryschool@gmail.com" className="flex items-center gap-1 hover:text-[var(--campus-gold)] transition-colors">
                <Mail size={12} /> Email
              </a>
            </div>
            <div className="flex items-center gap-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--campus-gold)] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={14} />
                  </a>
                )
              })}
              <span className="text-gray-500">|</span>
              <button 
                onClick={() => setPortalModalOpen(true)}
                className="hover:text-[var(--campus-gold)] transition-colors flex items-center gap-1"
              >
                <Users size={14} /> Portals
              </button>
              <Link href="/alumni" className="hover:text-[var(--campus-gold)] transition-colors">
                Alumni
              </Link>
              <Link href="/contact" className="hover:text-[var(--campus-gold)] transition-colors">
                Contact
              </Link>
              <button className="hover:text-[var(--campus-gold)] transition-colors">
                <Search size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* MAIN NAV */}
        <nav className="bg-white order-first lg:order-last">
          <div className="container mx-auto px-6 flex justify-between items-center h-20">

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <Image
                src="/logo.png"
                alt="Progress Preparatory School"
                width={48}
                height={48}
                className="w-12 h-12 group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="text-lg lg:text-2xl font-serif font-bold text-[#003087] group-hover:text-[var(--campus-gold)] transition-colors">
                  Progress
                </div>
                <div className="text-[9px] lg:text-[10px] uppercase tracking-widest text-gray-500">
                  Preparatory School
                </div>
              </div>
            </Link>

            {/* DESKTOP PROMO */}
            <div className="hidden lg:flex flex-1 mx-10">
              <PromoTicker />
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-8 relative ml-8">
              {nav.map((item) => (
                <div
                  key={item.title}
                  onMouseEnter={() => setActiveMenu(item.title)}
                  onMouseLeave={() => setActiveMenu(null)}
                  className="relative"
                >
                  <button className="flex items-center gap-1 uppercase text-sm font-semibold text-gray-700 hover:text-[#003087] transition-colors">
                    {item.title}
                    <ChevronDown size={16} className={cn(
                      'transition-transform duration-300',
                      activeMenu === item.title && 'rotate-180'
                    )} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === item.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                        className="fixed left-0 right-0 top-36 mx-auto w-[min(calc(100vw-2rem),950px)] bg-[#003087] text-white shadow-2xl z-40 rounded-2xl overflow-hidden"
                      >
                        <div className="grid grid-cols-3">
                          <div className="relative h-full min-h-[300px]">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute bottom-6 left-6">
                              <h3 className="text-2xl font-serif font-bold text-white mb-2">{item.title}</h3>
                              <p className="text-sm text-gray-200 max-w-[200px]">{item.description}</p>
                            </div>
                          </div>

                          <div className="col-span-2 p-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                              {item.items.map((sub) => {
                                const Icon = sub.icon
                                return (
                                  <div key={sub.name}>
                                    {sub.onClick ? (
                                      <button
                                        onClick={() => {
                                          sub.onClick()
                                          setActiveMenu(null)
                                        }}
                                        className="flex items-start gap-3 text-left group w-full"
                                      >
                                        {Icon && (
                                          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-[var(--campus-gold)] transition-colors">
                                            <Icon className="w-4 h-4 text-white group-hover:text-gray-900" />
                                          </div>
                                        )}
                                        <div>
                                          <span className="text-white group-hover:text-[var(--campus-gold)] transition-colors font-medium">
                                            {sub.name}
                                          </span>
                                          <p className="text-xs text-gray-300 mt-1">
                                            {getSubtitle(sub.name)}
                                          </p>
                                        </div>
                                      </button>
                                    ) : (
                                      <Link
                                        href={sub.href}
                                        onClick={() => setActiveMenu(null)}
                                        className="flex items-start gap-3 text-left group"
                                      >
                                        {Icon && (
                                          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-[var(--campus-gold)] transition-colors">
                                            <Icon className="w-4 h-4 text-white group-hover:text-gray-900" />
                                          </div>
                                        )}
                                        <div>
                                          <span className="text-white group-hover:text-[var(--campus-gold)] transition-colors font-medium">
                                            {sub.name}
                                          </span>
                                          <p className="text-xs text-gray-300 mt-1">
                                            {getSubtitle(sub.name)}
                                          </p>
                                        </div>
                                      </Link>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href="/apply"
                  className="px-4 py-2 bg-[var(--campus-gold)] text-gray-900 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors"
                >
                  Enroll
                </Link>
                <Link
                  href="/book-appointment"
                  className="px-4 py-2 border-2 border-[#003087] text-[#003087] rounded-lg font-semibold text-sm hover:bg-[#003087] hover:text-white transition-colors"
                >
                  Visit
                </Link>
              </div>
            </div>

            {/* APPLY + MOBILE SECTION */}
            <div className="flex items-center gap-4">

              {/* MOBILE PROMO */}
              <div className="lg:hidden flex-1 max-w-[180px]">
                <PromoTicker />
              </div>

              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#003087] text-white order-last lg:order-none overflow-y-auto max-h-[calc(100vh-80px)]"
            >
              <div className="px-6 py-6 space-y-6">
                {nav.map((item) => (
                  <div key={item.title} className="border-b border-blue-400/30 pb-4">
                    <button
                      onClick={() =>
                        setOpenMobileTab(
                          openMobileTab === item.title ? null : item.title
                        )
                      }
                      className="flex justify-between items-center w-full text-left font-bold text-lg py-2"
                    >
                      {item.title}
                      <ChevronDown
                        size={18}
                        className={cn(
                          'transition-transform duration-300',
                          openMobileTab === item.title && 'rotate-180'
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {openMobileTab === item.title && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <div className="relative h-32 rounded-xl overflow-hidden mb-4">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {item.items.map((sub) => (
                            sub.onClick ? (
                              <button
                                key={sub.name}
                                onClick={() => {
                                  sub.onClick()
                                  setMobileMenuOpen(false)
                                }}
                                className="block w-full text-left py-2 px-3 rounded-lg hover:bg-white/10 text-sm"
                              >
                                {sub.name}
                              </button>
                            ) : (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 px-3 rounded-lg hover:bg-white/10 text-sm"
                              >
                                {sub.name}
                              </Link>
                            )
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Mobile Quick Links */}
                <div className="pt-4 space-y-3">
                  <p className="text-xs uppercase tracking-wider text-blue-300">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-3">
                    {quickLinks.map((link) => {
                      const Icon = link.icon
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-[var(--campus-gold)]" />
                          <span className="text-sm">{link.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Mobile Social Links */}
                <div className="pt-4 flex justify-center gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                </div>

                {/* Mobile Contact */}
                <div className="pt-4 text-center text-xs text-blue-200">
                  <p>Plot 332/8137 Hellen Kaunda Road, Lusaka</p>
                  <p className="mt-2">0771 050 500 | progresspreparatoryschool@gmail.com</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Portal Modal */}
      <PortalModal isOpen={portalModalOpen} onClose={() => setPortalModalOpen(false)} />
    </>
  )
}

// Helper function to get subtitles for menu items
function getSubtitle(name: string): string {
  const subtitles: Record<string, string> = {
    'Vision & Mission': 'Our purpose and goals',
    'Leadership': 'Meet our team',
    'Location – Lusaka': 'Visit our campus',
    'Accreditations': 'Our certifications',
    'Safeguarding': 'Child protection',
    'Baby Class – Grade 7': 'Complete learning journey',
    'Explore Programs': 'Find your path',
    'Cambridge Integration': 'International curriculum',
    'Assessment Approach': 'Tracking progress',
    'Co-Curricular': 'Activities & clubs',
    'On-Campus Learning': 'Learn at our facilities',
    'Home One-on-One': 'Tutoring at your home',
    'Online Sessions': 'Learn from anywhere',
    'Tuition & Fees': 'Investment in education',
    'Enroll Now': 'Start your application',
    'Book Appointment': 'Schedule a visit',
    'Portals': 'Access your account',
    'Events': 'Join us',
    'News': 'Latest updates',
    'Alumni': 'Stay connected',
    'Contact Us': 'Get in touch'
  }
  return subtitles[name] || 'Learn more'
}