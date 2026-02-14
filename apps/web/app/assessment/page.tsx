'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BarChart, FileText, Users, Target, CheckCircle, Calendar, Award, BookOpen } from 'lucide-react'

export default function AssessmentPage() {
  const methods = [
    {
      title: 'Continuous Assessment',
      description: 'Regular quizzes, assignments, and classwork to track ongoing progress.',
      icon: BarChart
    },
    {
      title: 'Formative Assessment',
      description: 'Observations and feedback to guide learning and development.',
      icon: Target
    },
    {
      title: 'Summative Assessment',
      description: 'End-of-term examinations and projects measuring overall achievement.',
      icon: FileText
    },
    {
      title: 'Cambridge Checkpoint',
      description: 'International benchmark tests for Cambridge students.',
      icon: Award
    }
  ]

  const schedule = [
    { term: 'Term 1', period: 'January - April', assessments: 'Continuous assessment + Mid-term tests' },
    { term: 'Term 2', period: 'May - August', assessments: 'Continuous assessment + Projects' },
    { term: 'Term 3', period: 'September - December', assessments: 'End-of-year examinations' }
  ]

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
            Measuring Success
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Assessment Approach
          </h1>
          <p className="text-lg text-gray-600">
            A comprehensive approach to tracking and supporting student progress
          </p>
        </motion.div>

        {/* Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white mb-16"
        >
          <h2 className="text-2xl font-serif font-bold mb-4">Our Assessment Philosophy</h2>
          <p className="text-gray-200 leading-relaxed max-w-3xl">
            At Progress Preparatory School, we believe assessment should support learning, not just measure it. 
            Our balanced approach combines continuous evaluation with formal examinations to provide a complete 
            picture of each child's development.
          </p>
        </motion.div>

        {/* Assessment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] text-center mb-12">
            Assessment Methods
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methods.map((method, index) => {
              const Icon = method.icon
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-[var(--campus-gold)] mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Assessment Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] text-center mb-12">
            Assessment Schedule
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {schedule.map((term, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[var(--campus-gold)]" />
                  <h3 className="font-bold text-[#003087]">{term.term}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{term.period}</p>
                <p className="text-xs text-gray-500">{term.assessments}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reporting */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#003087] mb-4">
                Progress Reports
              </h2>
              <p className="text-gray-600 mb-6">
                Parents receive comprehensive reports three times per year, including:
              </p>
              <ul className="space-y-3">
                {[
                  'Academic achievement in all subjects',
                  'Personal and social development',
                  'Teacher comments and recommendations',
                  'Attendance and participation records',
                  'Comparison with age-appropriate benchmarks'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-[#003087] mb-4">Parent Portal Access</h3>
              <p className="text-sm text-gray-500 mb-4">
                Track your child's progress in real-time through our secure parent portal.
              </p>
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 text-[#003087] font-semibold text-sm hover:text-[var(--campus-gold)] transition-colors"
              >
                Access Parent Portal
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}