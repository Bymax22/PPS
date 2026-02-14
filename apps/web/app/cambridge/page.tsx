'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Globe, BookOpen, Award, Users, CheckCircle, ChevronRight, Target, Sparkles } from 'lucide-react'

export default function CambridgePage() {
  const benefits = [
    {
      title: 'Global Recognition',
      description: 'Cambridge qualifications are recognized by universities and employers worldwide.',
      icon: Globe
    },
    {
      title: 'Critical Thinking',
      description: 'Curriculum designed to develop analytical and problem-solving skills.',
      icon: Target
    },
    {
      title: 'International Standards',
      description: 'Rigorous academic standards that prepare students for global opportunities.',
      icon: Award
    },
    {
      title: 'Smooth Progression',
      description: 'Clear learning pathways from primary through to advanced levels.',
      icon: BookOpen
    }
  ]

  const subjects = [
    'English',
    'Mathematics',
    'Science',
    'Global Perspectives',
    'ICT',
    'Physical Education'
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
              <Globe className="w-6 h-6 text-[var(--campus-gold)]" />
              <span className="text-sm font-semibold uppercase tracking-wider">Cambridge Assessment International Education</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Cambridge Pathway
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8">
              Internationally recognized curriculum preparing students for success in a globalized world
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                Enroll Now
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Request Information
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Cambridge Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-12 mb-20"
        >
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#003087] mb-4">
              What is Cambridge?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Cambridge Assessment International Education is part of the University of Cambridge. 
              It offers internationally recognized qualifications to students around the world, 
              providing a clear pathway from primary through to pre-university levels.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At Progress Preparatory School, we integrate Cambridge standards into our curriculum 
              from the earliest years, ensuring our students are prepared for global opportunities.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-[#003087] mb-4">Quick Facts</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--campus-gold)]" />
                <span className="text-sm text-gray-600">10,000+ schools in 160+ countries</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--campus-gold)]" />
                <span className="text-sm text-gray-600">Recognized by universities worldwide</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--campus-gold)]" />
                <span className="text-sm text-gray-600">Over 160 years of educational excellence</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--campus-gold)]" />
                <span className="text-sm text-gray-600">Part of the University of Cambridge</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#003087] text-center mb-12">
            Why Choose Cambridge?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-[var(--campus-gold)] mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-500">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Subjects Offered */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#003087] mb-4">
                Cambridge Subjects
              </h2>
              <p className="text-gray-600 mb-6">
                We offer a comprehensive range of Cambridge subjects designed to develop well-rounded, 
                globally-minded students.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {subjects.map((subject, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--campus-gold)]" />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden">
              <Image
                src="/images/cambridge-classroom.jpg"
                alt="Cambridge Classroom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Pathway */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] text-center mb-8">
            Cambridge Pathway at Progress
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {['Primary', 'Checkpoint', 'IGCSE', 'AS & A Level'].map((stage, index, array) => (
              <>
                <div key={stage} className="bg-[#003087] text-white px-6 py-4 rounded-xl text-center min-w-[150px]">
                  <p className="font-bold">{stage}</p>
                </div>
                {index < array.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-gray-400 hidden md:block" />
                )}
              </>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            * We currently offer Cambridge integration up to Grade 7, preparing students for secondary Cambridge programs
          </p>
        </motion.div>
      </div>
    </main>
  )
}