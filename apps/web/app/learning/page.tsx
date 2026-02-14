'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, GraduationCap, Users, Globe, Calendar, Award, ChevronRight } from 'lucide-react'

const levels = [
  {
    name: 'Baby Class - Reception',
    age: '2-5 years',
    description: 'Early childhood education focusing on play-based learning and foundational skills.',
    image: '/images/early-years.jpg',
    features: ['Play-based curriculum', 'Social development', 'Early literacy', 'Motor skills'],
    href: '/learning/early-years'
  },
  {
    name: 'Grade 1 - 4',
    age: '6-9 years',
    description: 'Building strong foundations in literacy, numeracy, and critical thinking.',
    image: '/images/lower-primary.jpg',
    features: ['Local curriculum', 'Cambridge English', 'Mathematics', 'Science'],
    href: '/learning/lower-primary'
  },
  {
    name: 'Grade 5 - 7',
    age: '10-12 years',
    description: 'Preparing for ECZ examinations with Cambridge integration.',
    image: '/images/upper-primary.jpg',
    features: ['Exam preparation', 'Cambridge Checkpoint', 'Study skills', 'Subject specialization'],
    href: '/learning/upper-primary'
  }
]

const curricula = [
  {
    name: 'Zambian Local Curriculum',
    icon: BookOpen,
    description: 'Ministry of Education approved curriculum with a focus on national values and culture.'
  },
  {
    name: 'Cambridge Pathway',
    icon: Globe,
    description: 'International curriculum developing confident, responsible, and innovative learners.'
  }
]

export default function LearningPage() {
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
            Academic Excellence
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Learning at Progress
          </h1>
          <p className="text-lg text-gray-600">
            From Baby Class to Grade 7, we offer a seamless educational journey combining local and international curricula
          </p>
        </motion.div>

        {/* Curricula Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          {curricula.map((curr, index) => {
            const Icon = curr.icon
            return (
              <div key={index} className="bg-gradient-to-br from-[#003087] to-[#001f5b] text-white rounded-2xl p-8">
                <Icon className="w-10 h-10 text-[var(--campus-gold)] mb-4" />
                <h3 className="text-xl font-bold mb-2">{curr.name}</h3>
                <p className="text-gray-200 text-sm">{curr.description}</p>
              </div>
            )
          })}
        </motion.div>

        {/* Grade Levels */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-serif font-bold text-[#003087] text-center mb-12"
        >
          Our Grade Levels
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {levels.map((level, index) => (
            <motion.div
              key={level.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={level.image}
                  alt={level.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-[var(--campus-gold)]" />
                  <span className="text-sm text-[var(--campus-gold)] font-semibold">{level.age}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{level.description}</p>
                <div className="space-y-2 mb-4">
                  {level.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[var(--campus-gold)] rounded-full" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={level.href}
                  className="inline-flex items-center gap-1 text-[#003087] font-semibold text-sm hover:text-[var(--campus-gold)] transition-colors"
                >
                  Learn more <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Facts */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Student-Teacher Ratio', value: '1:12' },
              { icon: Calendar, label: 'School Year', value: 'Jan - Dec' },
              { icon: Award, label: 'ECZ Pass Rate', value: '98%' },
              { icon: BookOpen, label: 'Subjects Offered', value: '15+' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <Icon className="w-6 h-6 text-[var(--campus-gold)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#003087]">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </main>
  )
}