'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowRight, 
  GraduationCap, 
  Home, 
  Globe, 
  Laptop, 
  Users,
  BookOpen,
  Sparkles,
  ChevronRight,
  UserPlus,
  BarChart,
  Lock,
  CheckCircle
} from 'lucide-react'
import { useState } from 'react'

export default function AboutSchool() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const programs = [
    {
      id: 'campus',
      title: 'At Our Campus',
      description: 'One-on-one sessions in our state-of-the-art facilities with direct access to all learning resources.',
      icon: Home,
      features: ['Face-to-face interaction', 'Access to labs & library', 'Structured environment'],
      href: '/on-campus'
    },
    {
      id: 'home',
      title: 'At Your Home',
      description: 'Personalized one-on-one tutoring in the comfort of your own home, at your convenience.',
      icon: Home,
      features: ['Convenient location', 'Flexible scheduling', 'Comfortable setting'],
      href: '/home-tuition'
    },
    {
      id: 'online',
      title: 'Online Sessions',
      description: 'Interactive virtual learning with our expert teachers from anywhere, anytime.',
      icon: Laptop,
      features: ['Learn from anywhere', 'Recorded sessions', 'Digital resources'],
      href: '/online-sessions'
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Welcome to Progress
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Excellence in Education
          </h2>
          <p className="text-lg text-gray-600">
            Progress Preparatory School is a distinguished pre and primary school committed to delivering 
            an exceptional educational experience from Baby Class to Grade 7.
          </p>
        </motion.div>

        {/* Learning Programs - Selection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#003087] mb-4">
              Flexible Learning Programs
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the learning format that best suits your child's needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {programs.map((program) => {
              const Icon = program.icon
              const isSelected = selectedProgram === program.id
              
              return (
                <motion.div
                  key={program.id}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedProgram(program.id)}
                  className={`
                    group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer
                    ${isSelected 
                      ? 'border-[var(--campus-gold)] shadow-xl ring-4 ring-[var(--campus-gold)]/20' 
                      : 'border-gray-200 hover:border-[#003087]/30 shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-[var(--campus-gold)] rounded-full flex items-center justify-center z-10"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  <div className="p-8">
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 rounded-xl flex items-center justify-center mb-6 
                      transition-all duration-300 group-hover:scale-110
                      ${isSelected 
                        ? 'bg-[var(--campus-gold)] text-white' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-[#003087] group-hover:text-white'
                      }
                    `}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {program.title}
                    </h4>
                    <p className="text-gray-500 text-sm mb-6">
                      {program.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-6">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[var(--campus-gold)]' : 'bg-gray-300'}`} />
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Select/Selected Button */}
                    <Link
                      href={program.href}
                      className={`
                        inline-flex items-center justify-center w-full gap-2 px-4 py-3 rounded-xl font-semibold text-sm
                        transition-all duration-300
                        ${isSelected
                          ? 'bg-[var(--campus-gold)] text-gray-900 hover:bg-yellow-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-[#003087] hover:text-white'
                        }
                      `}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isSelected ? 'Continue with this option' : 'Select this option'}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Selection Help Text */}
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center text-sm text-gray-500 mt-6"
          >
            Click on any program to select it. You can change your selection anytime.
          </motion.p>
        </motion.div>

        {/* Portals Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
                Stay Connected
              </span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#003087] mb-6">
                Parent & Student Portals
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Access grades, assignments, and stay connected with your child's progress through our secure online portals.
              </p>

              <div className="space-y-4 mb-8">
                {/* Feature 1 */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[var(--campus-gold)]/10 rounded-lg">
                    <UserPlus className="w-5 h-5 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Create Account</h4>
                    <p className="text-sm text-gray-500">Simple registration process for parents and students</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[var(--campus-gold)]/10 rounded-lg">
                    <BarChart className="w-5 h-5 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Track Grades</h4>
                    <p className="text-sm text-gray-500">Real-time access to academic performance and progress reports</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[var(--campus-gold)]/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Assignments & Resources</h4>
                    <p className="text-sm text-gray-500">View homework, download materials, and submit work online</p>
                  </div>
                </div>

                {/* Feature 4 */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[var(--campus-gold)]/10 rounded-lg">
                    <Lock className="w-5 h-5 text-[var(--campus-gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure & Private</h4>
                    <p className="text-sm text-gray-500">Your family's data is protected with enterprise-grade security</p>
                  </div>
                </div>
              </div>

              {/* Portal Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/portal/register"
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-semibold hover:bg-[#002066] transition-all hover:scale-105"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Parent Account
                </Link>
                <Link
                  href="/portal/parent/login"
                  className="group flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-all"
                >
                  <Lock className="w-5 h-5" />
                  Login to Portal
                </Link>
              </div>
            </div>

            {/* Right Image/Illustration */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/student-spotlight.jpg"
                alt="Student Portal Dashboard"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/20 to-transparent" />
              
              {/* Floating Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Active Users</p>
                    <p className="text-2xl font-bold text-[#003087]">500+</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-500">Parent Satisfaction</p>
                    <p className="text-2xl font-bold text-[#003087]">98%</p>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div>
                    <p className="text-xs text-gray-500">Daily Access</p>
                    <p className="text-2xl font-bold text-[#003087]">24/7</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}