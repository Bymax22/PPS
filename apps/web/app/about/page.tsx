'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Eye, Target, Award, Users, Shield, BookOpen } from 'lucide-react'

export default function AboutPage() {
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
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Progress Preparatory School
          </h1>
          <p className="text-lg text-gray-600">
            A distinguished pre and primary school committed to delivering an exceptional educational experience from Baby Class to Grade 7.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative h-[400px] rounded-3xl overflow-hidden mb-16"
        >
          <Image
            src="/images/school-hero.jpg"
            alt="Progress Preparatory School"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/50 to-transparent" />
        </motion.div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[var(--campus-gold)]/20 rounded-xl">
                <Eye className="w-6 h-6 text-[var(--campus-gold)]" />
              </div>
              <h2 className="text-2xl font-bold">Our Vision</h2>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed">
              To prepare young people with the knowledge, skills, and characteristics that they need 
              to become successful global citizens and help to build a better world.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[var(--campus-gold)]/20 rounded-xl">
                <Target className="w-6 h-6 text-[var(--campus-gold)]" />
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-200 text-lg leading-relaxed">
              To prepare all students to become lifelong learners and responsible citizens ready 
              to meet the challenges of the future through relevant learning opportunities.
            </p>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-serif font-bold text-[#003087] text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Excellence', desc: 'Striving for the highest standards in everything we do' },
              { icon: Users, title: 'Community', desc: 'Building strong partnerships with families' },
              { icon: Shield, title: 'Integrity', desc: 'Acting with honesty and strong moral principles' },
              { icon: BookOpen, title: 'Lifelong Learning', desc: 'Fostering a love for learning that lasts a lifetime' }
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="text-center p-6">
                  <div className="w-16 h-16 bg-[var(--campus-gold)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[var(--campus-gold)]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-3xl p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Years of Excellence', value: '15+' },
              { label: 'Current Students', value: '500+' },
              { label: 'Expert Teachers', value: '20+' },
              { label: 'Student-Teacher Ratio', value: '1:12' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#003087]">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}