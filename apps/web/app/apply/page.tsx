'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, FileText, Calendar, Users, Home, Laptop, AlertCircle } from 'lucide-react'
import { useState } from 'react'

export default function ApplyPage() {
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')

  const programs = [
    { id: 'campus', name: 'On-Campus Learning', icon: Home },
    { id: 'home', name: 'Home One-on-One', icon: Home },
    { id: 'online', name: 'Online Sessions', icon: Laptop }
  ]

  const grades = [
    'Baby Class',
    'Nursery',
    'Reception',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7'
  ]

  const steps = [
    {
      number: '01',
      title: 'Submit Application',
      description: 'Complete the online application form with student details'
    },
    {
      number: '02',
      title: 'Pay Application Fee',
      description: 'Submit the non-refundable application fee'
    },
    {
      number: '03',
      title: 'Assessment & Interview',
      description: 'Student assessment and parent interview'
    },
    {
      number: '04',
      title: 'Receive Offer',
      description: 'Successful applicants receive an offer letter'
    },
    {
      number: '05',
      title: 'Accept & Enroll',
      description: 'Accept offer and complete enrollment'
    }
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
            Begin Your Journey
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Apply for Admission
          </h1>
          <p className="text-lg text-gray-600">
            Join Progress Preparatory School and give your child the best possible start in life
          </p>
        </motion.div>

        {/* Application Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] text-center mb-12">
            Application Process
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-[#003087] to-[#001f5b] text-white rounded-2xl p-6 text-center">
                  <span className="text-sm font-bold text-[var(--campus-gold)]">{step.number}</span>
                  <h3 className="font-bold mt-2 mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-200">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--campus-gold)] rotate-45" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Program Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-[#003087] mb-6">
            Select Program <span className="text-red-500">*</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {programs.map((program) => {
              const Icon = program.icon
              const isSelected = selectedProgram === program.id
              return (
                <button
                  key={program.id}
                  onClick={() => setSelectedProgram(program.id)}
                  className={`
                    flex items-center gap-3 p-6 rounded-xl border-2 transition-all text-left
                    ${isSelected 
                      ? 'border-[var(--campus-gold)] bg-[var(--campus-gold)]/5' 
                      : 'border-gray-200 hover:border-[#003087]/30'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-[var(--campus-gold)]' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-semibold text-gray-900">{program.name}</p>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[var(--campus-gold)] mt-1" />}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Grade Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-[#003087] mb-6">
            Select Grade <span className="text-red-500">*</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`
                  p-3 rounded-xl border-2 transition-all text-center
                  ${selectedGrade === grade 
                    ? 'border-[var(--campus-gold)] bg-[var(--campus-gold)]/5 text-[#003087] font-semibold' 
                    : 'border-gray-200 text-gray-600 hover:border-[#003087]/30'
                  }
                `}
              >
                {grade}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Application Form Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to Apply?</h3>
              <p className="text-gray-200">Complete our online application form to get started</p>
            </div>
            <Link
              href="/application-form"
              className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors whitespace-nowrap"
            >
              Start Application
            </Link>
          </div>
        </motion.div>

        {/* Documents Required */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-[#003087] mb-4">
            Documents Required
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Child\'s birth certificate',
              'Recent passport photo',
              'Previous school reports (if applicable)',
              'Immunization records',
              'Parent/guardian ID',
              'Proof of residence'
            ].map((doc, index) => (
              <div key={index} className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">{doc}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Documents can be uploaded during the online application or submitted in person at our campus.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}