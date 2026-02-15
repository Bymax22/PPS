'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight,
  MessageSquare,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react'

export default function CampusFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#00205B] text-white relative">
      {/* Simple top border */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FFB915] via-[#FFB915] to-[#FFB915]" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Progress Preparatory School"
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg"
              />
              <div>
                <span className="font-serif text-xl font-bold text-white block leading-tight">Progress</span>
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                  Preparatory School
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Providing a values-driven, internationally minded education in Lusaka. Nurturing young minds from Baby Class to Grade 7.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 bg-white/5 rounded text-xs text-gray-300">
                Cambridge International
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded text-xs text-gray-300">
                Fully Accredited
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-white/5 hover:bg-[#FFB915] flex items-center justify-center text-gray-400 hover:text-[#00205B] transition-colors"
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold mb-4 text-[#FFB915]">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Our Programs', href: '/programs' },
                { name: 'Enroll Now', href: '/apply' },
                { name: 'Create Account', href: '/portal' },
                { name: 'Events Calendar', href: '/events' },
                { name: 'Latest News', href: '/news' },
                { name: 'Safeguarding', href: '/safeguarding' },
                { name: 'Accreditations', href: '/accreditations' },
                { name: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-white flex items-center"
                  >
                    <ChevronRight size={12} className="text-[#FFB915] mr-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Admissions */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold mb-4 text-[#FFB915]">
              Admissions
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'How to Apply', href: '/admissions' },
                { name: 'Tuition & Fees', href: '/tuition' },
                { name: 'Baby Class - Grade 7', href: '/learning' },
                { name: 'On-Campus Learning', href: '/on-campus' },
                { name: 'Online Learning', href: '/online-sessions' },
                { name: 'Home Tuition', href: '/home-tuition' },
                { name: 'Scholarships', href: '/admissions/scholarships' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-white flex items-center"
                  >
                    <ChevronRight size={12} className="text-[#FFB915] mr-1" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Early Bird */}
            <div className="mt-4 p-3 bg-white/5 rounded border border-white/10">
              <p className="text-xs text-[#FFB915] font-medium mb-0.5">Early Bird Deadline</p>
              <p className="text-sm text-white">January 31, 2026</p>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold mb-4 text-[#FFB915]">
              Contact & Location
            </h4>
            
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex gap-2">
                <MapPin size={16} className="text-[#FFB915] shrink-0 mt-0.5" />
                <span>
                  Plot 332/8137 Hellen Kaunda Road,<br />
                  off Alick Nkata Road, Lusaka, Zambia
                </span>
              </div>
              
              <div className="flex gap-2">
                <Phone size={16} className="text-[#FFB915] shrink-0" />
                <div>
                  <div>0771 050 500</div>
                  <div className="text-xs text-gray-500">Main Line</div>
                </div>
              </div>

              <div className="flex gap-2">
                <MessageSquare size={16} className="text-[#FFB915] shrink-0" />
                <div>
                  <div>0775 455 565</div>
                  <div className="text-xs text-gray-500">WhatsApp Only</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Mail size={16} className="text-[#FFB915] shrink-0" />
                <span className="break-all">progresspreparatoryschool@gmail.com</span>
              </div>
            </div>

            {/* Hours */}
            <div className="mb-6 p-3 bg-white/5 rounded border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-[#FFB915]" />
                <span className="text-sm font-medium text-white">Office Hours</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-gray-400">Mon - Thu:</span>
                <span className="text-white">7:30 AM - 4:30 PM</span>
                <span className="text-gray-400">Friday:</span>
                <span className="text-white">7:30 AM - 12:00 PM</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Stay Updated</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 text-sm px-3 py-2 outline-none flex-1 rounded-l border border-gray-700 focus:border-[#FFB915] transition-colors placeholder:text-gray-600"
                />
                <button className="px-3 py-2 bg-[#FFB915] hover:bg-yellow-400 rounded-r transition-colors">
                  <ArrowRight size={16} className="text-[#00205B]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="text-gray-500">
              © {currentYear} Progress Preparatory School. All rights reserved. Developed by <a href="https://wa.me/260964165614" target="_blank" rel="noopener noreferrer" className="text-[#FFB915] hover:text-yellow-400">Bymax Zambia</a>.
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-gray-500 hover:text-[#FFB915] transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/terms" className="text-gray-500 hover:text-[#FFB915] transition-colors">
                Terms of Use
              </Link>
              <span className="text-gray-700">|</span>
              <Link href="/cookies" className="text-gray-500 hover:text-[#FFB915] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Accreditation */}
          <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-xs text-gray-600">
            <span>Member of the Independent Schools Association of Zambia</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span>Cambridge Associate School</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span>Ministry of Education Approved</span>
          </div>
        </div>
      </div>
    </footer>
  )
}