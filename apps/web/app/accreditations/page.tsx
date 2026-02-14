'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Award, CheckCircle, Globe, BookOpen, Shield, Users } from 'lucide-react'

const accreditations = [
  {
    name: 'Ministry of Education Zambia',
    logo: '/images/accreditations/ministry-education.jpg',
    description: 'Fully accredited by the Zambian Ministry of Education, meeting all national standards for curriculum and facilities.',
    year: '2008',
    icon: Award
  },
  {
    name: 'Cambridge Assessment International Education',
    logo: '/images/accreditations/cambridge.jpg',
    description: 'Recognized Cambridge Associate School offering internationally recognized curriculum and qualifications.',
    year: '2015',
    icon: Globe
  },
  {
    name: 'Examinations Council of Zambia',
    logo: '/images/accreditations/ecz.jpg',
    description: 'Registered examination center for ECZ national examinations at Grade 7 level.',
    year: '2008',
    icon: BookOpen
  },
  {
    name: 'Independent Schools Association of Zambia',
    logo: '/images/accreditations/isaz.jpg',
    description: 'Proud member of ISAZ, committed to maintaining high standards in independent education.',
    year: '2010',
    icon: Users
  }
]

const certifications = [
  {
    title: 'ISO 9001:2015 Quality Management',
    description: 'Certified for maintaining international standards in educational quality and management systems.'
  },
  {
    title: 'Child Protection Certification',
    description: 'All staff trained and certified in child protection and safeguarding practices.'
  },
  {
    title: 'Health & Safety Compliance',
    description: 'Regular inspections ensure full compliance with health and safety regulations.'
  }
]

export default function AccreditationsPage() {
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
            Quality Assured
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Accreditations & Certifications
          </h1>
          <p className="text-lg text-gray-600">
            We maintain the highest standards through recognized accreditations and certifications
          </p>
        </motion.div>

        {/* Main Accreditations Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {accreditations.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-[var(--campus-gold)]/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[var(--campus-gold)]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-500">Since {item.year}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  <div className="mt-6 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">Active and verified</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-10 text-white mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8 text-center">
            Additional Certifications
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Award className="w-8 h-8 text-[var(--campus-gold)] mb-4" />
                <h3 className="font-bold mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-200">{cert.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Verification Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h3 className="text-xl font-bold text-[#003087] mb-4">Verify Our Credentials</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            All our accreditations can be verified through the respective issuing bodies. 
            Contact us for official documentation or verification requests.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Request Verification
          </Link>
        </motion.div>
      </div>
    </main>
  )
}