import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaComment, FaGraduationCap} from 'react-icons/fa'

const footerSections = [
  {
    title: 'Academic Programs',
    links: [
      { name: 'Primary School (Grade 1-7)', href: '/programs/primary' },
      { name: 'Junior Secondary (Grade 8-9)', href: '/programs/junior' },
      { name: 'Senior Secondary (Grade 10-12)', href: '/programs/senior' },
      { name: 'Curriculum Overview', href: '/programs/curriculum' },
      { name: 'Special Education Needs', href: '/programs/sen' }
    ]
  },
  {
    title: 'Platform Features',
    links: [
      { name: 'Student Learning Portal', href: '/platform/student' },
      { name: 'Parent Monitoring Dashboard', href: '/platform/parent' },
      { name: 'Teacher Management System', href: '/platform/teacher' },
      { name: 'Virtual Classroom', href: '/platform/classroom' },
      { name: 'Progress Analytics', href: '/platform/analytics' }
    ]
  },
  {
    title: 'Admissions',
    links: [
      { name: 'Application Process', href: '/admissions/process' },
      { name: 'Entry Requirements', href: '/admissions/requirements' },
      { name: 'Fee Structure & Payments', href: '/admissions/fees' },
      { name: 'Scholarships & Financial Aid', href: '/admissions/scholarships' },
      { name: 'International Students', href: '/admissions/international' }
    ]
  },
  {
    title: 'School Information',
    links: [
      { name: 'About Our School', href: '/about' },
      { name: 'Faculty & Staff', href: '/about/faculty' },
      { name: 'Academic Calendar', href: '/calendar' },
      { name: 'School Policies', href: '/policies' },
      { name: 'Careers at Progress', href: '/careers' }
    ]
  }
]

const socialLinks = [
  {
    name: 'Facebook',
    href: '#',
    icon: FaFacebook,
    color: 'hover:bg-blue-500'
  },
  {
    name: 'Twitter',
    href: '#',
    icon: FaTwitter,
    color: 'hover:bg-sky-400'
  },
  {
    name: 'Instagram',
    href: '#',
    icon: FaInstagram,
    color: 'hover:bg-pink-500'
  },
  {
    name: 'LinkedIn',
    href: '#',
    icon: FaLinkedin,
    color: 'hover:bg-blue-600'
  },
  {
    name: 'YouTube',
    href: '#',
    icon: FaYoutube,
    color: 'hover:bg-red-500'
  }
]

const contactInfo = [
  {
    icon: FaPhone,
    title: 'Call Us',
    content: '+260 973 981 498',
    subtitle: 'Mon-Fri: 7:30AM-5:30PM'
  },
  {
    icon: FaEnvelope,
    title: 'Email Us',
    content: 'info@progressprep.edu.zm',
    subtitle: '24/7 Support'
  },
  {
    icon: FaMapMarkerAlt,
    title: 'Visit Us',
    content: 'Lusaka, Zambia',
    subtitle: 'Virtual Campus Tour Available'
  },
  {
    icon: FaComment,
    title: 'Live Chat',
    content: 'Available 24/7',
    subtitle: 'Instant Support'
  }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#0713FB] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                PP
              </div>
              <div>
                <h3 className="text-xl font-bold">Progress Preparatory School</h3>
                <p className="text-gray-400">The Hallmark of Excellence</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Zambia&apos;s premier online learning institution providing quality education from Grade 1 to 12 
              through innovative virtual platforms, expert teachers, and proven academic excellence since 2010.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-1 bg-white/10 rounded px-2 py-1 border border-white/20">
                <div className="w-2 h-2 bg-[#0EF117] rounded-full"></div>
                <span className="text-xs font-semibold">Ministry Accredited</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 rounded px-2 py-1 border border-white/20">
                <div className="w-2 h-2 bg-[#0EF117] rounded-full"></div>
                <span className="text-xs font-semibold">ISO 9001 Certified</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2 pt-2">
              {socialLinks.map((social) => {
                const SocialIcon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-8 h-8 bg-white/10 rounded flex items-center justify-center text-sm border border-white/20 transition-all duration-300 hover:scale-110 ${social.color}`}
                    aria-label={social.name}
                  >
                    <SocialIcon />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid sm:grid-cols-2 gap-3">
            {contactInfo.map((contact, index) => {
              const ContactIcon = contact.icon
              return (
                <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#0713FB] rounded flex items-center justify-center">
                      <ContactIcon className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{contact.title}</div>
                      <div className="text-gray-300 font-bold text-xs">{contact.content}</div>
                      <div className="text-gray-400 text-xs">{contact.subtitle}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h4 className="text-sm font-bold text-white border-l-2 border-[#0EF117] pl-2">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-1 group text-xs"
                    >
                      <div className="w-1 h-1 bg-[#0EF117] rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-[#0713FB] rounded-xl p-4 mb-8">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="text-lg font-bold mb-1">Stay Updated</h3>
              <p className="text-blue-100 text-xs">
                Subscribe to our newsletter for academic updates, event announcements, and educational insights.
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-3 py-2 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-1 focus:ring-white text-sm"
              />
              <button className="bg-white text-gray-900 px-4 py-2 rounded font-bold hover:scale-105 transition-all duration-300 shadow text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-center lg:text-left text-xs">
              <div className="font-semibold">
                © 2025 Progress Preparatory School. All rights reserved. Developed by Bymax.
              </div>
              <div className="mt-1">
                The Hallmark of Excellence
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>

            {/* Accreditation Badges */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-white/10 rounded px-2 py-1 border border-white/20">
                <div className="text-xs">🏆</div>
                <span className="text-xs">Quality Education</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 rounded px-2 py-1 border border-white/20">
                <div className="text-xs">⭐</div>
                <span className="text-xs">5-Star Rated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex flex-col space-y-2">
          {/* WhatsApp */}
          <a
            href="https://wa.me/260973981498"
            className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300 animate-bounce"
            aria-label="Chat on WhatsApp"
          >
            <FaComment className="text-sm" />
          </a>
          
          {/* Enrollment CTA */}
          <Link
            href="/enroll"
            className="w-10 h-10 bg-[#0713FB] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-300"
            aria-label="Start Enrollment"
          >
            <FaGraduationCap className="text-sm" />
          </Link>
        </div>
      </div>
    </footer>
  )
}