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
    <footer className="bg-[#00205B] text-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,215,0,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Top Accent Border with Animation */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003087] via-[var(--campus-gold)] to-[#003087]"
        animate={{ 
          backgroundPosition: ['0% 0%', '200% 0%'],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 100%' }}
      />

      {/* Decorative Gold Dot Pattern */}
      <div className="absolute top-20 right-20 opacity-10">
        <div className="grid grid-cols-3 gap-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-[var(--campus-gold)] rounded-full" />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        
        {/* Top Section - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          {/* Column 1: Brand & Socials (spans 3 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="Progress Preparatory School"
                width={56}
                height={56}
                className="w-14 h-14 rounded-2xl shadow-lg shadow-[#003087]/20"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold text-white leading-none">Progress</span>
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mt-1">
                  Preparatory School
                </span>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Providing a values-driven, internationally minded education in Lusaka. Nurturing young minds from Baby Class to Grade 7.
            </p>

            {/* Accreditation Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                Cambridge International
              </span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300 border border-white/10">
                Fully Accredited
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: 'https://facebook.com/progresspreparatory' },
                { icon: Twitter, href: 'https://twitter.com/progressschool' },
                { icon: Instagram, href: 'https://instagram.com/progresspreparatory' },
                { icon: Linkedin, href: 'https://linkedin.com/company/progress-preparatory' }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white/5 border border-gray-700 flex items-center justify-center 
                             text-gray-400 hover:bg-[var(--campus-gold)] hover:border-[var(--campus-gold)] hover:text-black 
                             transition-all duration-300"
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links (spans 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-[var(--campus-gold)]">
              Quick Links
            </h4>
            <ul className="space-y-3">
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
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 text-[var(--campus-gold)] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Admissions (spans 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-[var(--campus-gold)]">
              Admissions
            </h4>
            <ul className="space-y-3">
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
                    className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-200 text-sm flex items-center group"
                  >
                    <ChevronRight className="w-3 h-3 text-[var(--campus-gold)] opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Early Bird Badge */}
            <div className="mt-6 p-3 bg-[var(--campus-gold)]/10 rounded-lg border border-[var(--campus-gold)]/20">
              <p className="text-xs text-[var(--campus-gold)] font-semibold mb-1">Early Bird Deadline</p>
              <p className="text-sm text-white">March 31, 2024</p>
            </div>
          </motion.div>

          {/* Column 4: Contact & Info (spans 3 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h4 className="font-semibold mb-6 text-sm uppercase tracking-wider text-[var(--campus-gold)]">
              Contact & Location
            </h4>
            
            <div className="space-y-4 text-sm text-gray-400 mb-6">
              <div className="flex items-start gap-3 group hover:text-white transition-colors">
                <MapPin size={18} className="text-[var(--campus-gold)] mt-0.5 shrink-0" />
                <span>
                  Plot 332/8137 Hellen Kaunda Road,<br />
                  off Alick Nkata Road, Lusaka, Zambia
                </span>
              </div>
              
              <div className="flex items-center gap-3 group hover:text-white transition-colors">
                <Phone size={18} className="text-[var(--campus-gold)] shrink-0" />
                <div className="flex flex-col">
                  <span>0771 050 500</span>
                  <span className="text-xs text-gray-500">Main Line</span>
                </div>
              </div>

              <div className="flex items-center gap-3 group hover:text-white transition-colors">
                <MessageSquare size={18} className="text-[var(--campus-gold)] shrink-0" />
                <div className="flex flex-col">
                  <span>0775 455 565</span>
                  <span className="text-xs text-gray-500">WhatsApp Only</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group hover:text-white transition-colors">
                <Mail size={18} className="text-[var(--campus-gold)] shrink-0" />
                <span>progresspreparatoryschool@gmail.com</span>
              </div>
            </div>

            {/* Office Hours */}
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[var(--campus-gold)]" />
                <span className="text-sm font-semibold text-white">Office Hours</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-gray-400">Mon - Thu:</span>
                <span className="text-white">7:30 AM - 4:30 PM</span>
                <span className="text-gray-400">Friday:</span>
                <span className="text-white">7:30 AM - 12:00 PM</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Stay Updated</p>
              <div className="flex items-center">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="bg-white/5 text-sm px-4 py-3 outline-none flex-1 rounded-l-lg border border-gray-700 focus:border-[var(--campus-gold)] transition-colors placeholder-gray-600"
                />
                <button className="px-4 py-3 bg-[var(--campus-gold)] hover:bg-yellow-400 rounded-r-lg transition-colors group">
                  <ArrowRight className="text-black w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Subscribe to receive updates and news
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar with Decorative Elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                © {currentYear} Progress Preparatory School. All rights reserved. Developed by <a href="https://wa.me/260964165614" target="_blank" rel="noopener noreferrer" className="font-bold text-green-400 hover:text-green-300 transition-colors">Bymax Zambia</a>.
              </span>
              <span className="text-gray-700">|</span>
              <span className="text-xs text-gray-600">
                Baby Class to Grade 7
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-[var(--campus-gold)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-[var(--campus-gold)] transition-colors">
                Terms of Use
              </Link>
              <Link href="/cookies" className="text-xs text-gray-500 hover:text-[var(--campus-gold)] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Accreditation Strip */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs text-gray-600">
            <span>Member of the Independent Schools Association of Zambia</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span>Cambridge Associate School</span>
            <span className="w-1 h-1 bg-gray-700 rounded-full" />
            <span>Ministry of Education Approved</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}