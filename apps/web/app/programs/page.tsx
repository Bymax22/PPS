'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Home, Laptop, Users, Clock, Calendar, CheckCircle, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const programs = [
  {
    id: 'campus',
    title: 'On-Campus Learning',
    icon: Home,
    description: 'One-on-one sessions in our state-of-the-art facilities with direct access to all learning resources.',
    features: [
      'Face-to-face interaction with teachers',
      'Access to science labs and library',
      'Structured learning environment',
      'Extracurricular activities',
      'Peer interaction and socialization'
    ],
    schedule: 'Monday - Friday, 8:00 AM - 3:00 PM',
    duration: 'Full academic year',
    href: '/on-campus'
  },
  {
    id: 'home',
    title: 'Home One-on-One',
    icon: Home,
    description: 'Personalized tutoring in the comfort of your own home, at your convenience.',
    features: [
      'Personalized attention',
      'Flexible scheduling',
      'Comfortable learning environment',
      'Parent involvement encouraged',
      'Customized learning pace'
    ],
    schedule: 'Flexible - morning, afternoon, or evening',
    duration: 'Per session or term packages',
    href: '/home-tuition'
  },
  {
    id: 'online',
    title: 'Online Sessions',
    icon: Laptop,
    description: 'Interactive virtual learning with our expert teachers from anywhere, anytime.',
    features: [
      'Learn from anywhere',
      'Recorded sessions for review',
      'Digital learning resources',
      'Real-time interaction',
      'Progress tracking online'
    ],
    schedule: 'Live sessions + recorded content',
    duration: 'Flexible packages available',
    href: '/online-sessions'
  }
]

export default function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4">
            Choose Your Path
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Explore Learning Programs
          </h1>
          <p className="text-lg text-gray-600">
            Select the learning format that best suits your child's needs
          </p>
        </motion.div>

        {/* Program Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {programs.map((program) => {
            const Icon = program.icon
            const isSelected = selectedProgram === program.id

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                  <div className={`
                    w-16 h-16 rounded-xl flex items-center justify-center mb-6 
                    transition-all duration-300 group-hover:scale-110
                    ${isSelected 
                      ? 'bg-[var(--campus-gold)] text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-500 text-sm mb-6">{program.description}</p>

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
                    {isSelected ? 'Select this program' : 'View details'}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Selected Program Details */}
        {selectedProgram && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-6">Program Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--campus-gold)]" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {programs.find(p => p.id === selectedProgram)?.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[var(--campus-gold)] rounded-full mt-2" />
                      <span className="text-sm text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--campus-gold)]" />
                    Schedule
                  </h3>
                  <p className="text-sm text-gray-200">{programs.find(p => p.id === selectedProgram)?.schedule}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--campus-gold)]" />
                    Duration
                  </h3>
                  <p className="text-sm text-gray-200">{programs.find(p => p.id === selectedProgram)?.duration}</p>
                </div>
                <Link
                  href={programs.find(p => p.id === selectedProgram)?.href || '#'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Continue with this program
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Click on any program to see more details. You can change your selection anytime.
        </p>
      </div>
    </main>
  )
}