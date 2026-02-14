'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Home, Users, Clock, Calendar, BookOpen, CheckCircle, ChevronRight, Award, Shield } from 'lucide-react'

export default function OnCampusPage() {
  const features = [
    {
      icon: Users,
      title: 'Small Class Sizes',
      description: 'Individual attention with 1:12 teacher-student ratio'
    },
    {
      icon: Award,
      title: 'Qualified Teachers',
      description: 'Expert educators trained in learner-centered methods'
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'Secure campus with 24/7 security and supervision'
    },
    {
      icon: BookOpen,
      title: 'Full Curriculum',
      description: 'Both Local and Cambridge curricula offered'
    }
  ]

  const schedule = [
    { time: '7:30 AM', activity: 'Arrival & Morning Assembly' },
    { time: '8:00 AM', activity: 'First Period' },
    { time: '10:00 AM', activity: 'Morning Break' },
    { time: '10:30 AM', activity: 'Second Period' },
    { time: '12:30 PM', activity: 'Lunch Break' },
    { time: '1:30 PM', activity: 'Afternoon Sessions' },
    { time: '3:00 PM', activity: 'Dismissal' }
  ]

  return (
    <main className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/programs"
          className="inline-flex items-center gap-2 text-[#003087] hover:text-[var(--campus-gold)] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Programs
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl overflow-hidden mb-16"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--campus-gold)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 p-12 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-6 h-6 text-[var(--campus-gold)]" />
              <span className="text-sm font-semibold uppercase tracking-wider">On-Campus Learning</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Learn at Our Campus
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8">
              Experience quality education in our state-of-the-art facilities with direct access to all learning resources
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/book-appointment"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Schedule a Tour
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <Icon className="w-10 h-10 text-[var(--campus-gold)] mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Daily Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#003087] mb-6">
              Daily Schedule
            </h2>
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <Clock className="w-5 h-5 text-[var(--campus-gold)] shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{item.time}</p>
                    <p className="text-sm text-gray-500">{item.activity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#003087] mb-4">What's Included</h2>
            <ul className="space-y-3">
              {[
                'Full access to science labs and library',
                'All learning materials and resources',
                'Extracurricular activities',
                'Morning and afternoon supervision',
                'Regular progress reports',
                'Parent-teacher meetings',
                'School events and activities'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 text-center"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] mb-4">
            Ready to Join Our Campus Community?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards quality education for your child. Limited spaces available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              Apply for Admission
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors"
            >
              Contact Admissions
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}