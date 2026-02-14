'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, DollarSign, Calendar, Home, Laptop, Users, CheckCircle, HelpCircle, FileText, CreditCard } from 'lucide-react'
import { useState } from 'react'

export default function TuitionPage() {
  const [selectedProgram, setSelectedProgram] = useState('campus')

  const programs = [
    {
      id: 'campus',
      name: 'On-Campus Learning',
      icon: Home,
      fees: [
        { item: 'Tuition per term', amount: 'Contact for pricing' },
        { item: 'Registration fee', amount: 'One-time fee' },
        { item: 'Learning materials', amount: 'Included' },
        { item: 'Extracurricular activities', amount: 'Included' }
      ]
    },
    {
      id: 'home',
      name: 'Home One-on-One',
      icon: Home,
      fees: [
        { item: 'Per session', amount: 'Contact for pricing' },
        { item: '10-session package', amount: 'Contact for pricing' },
        { item: 'Monthly package', amount: 'Contact for pricing' },
        { item: 'Travel fee', amount: 'Varies by location' }
      ]
    },
    {
      id: 'online',
      name: 'Online Sessions',
      icon: Laptop,
      fees: [
        { item: 'Per session', amount: 'Contact for pricing' },
        { item: 'Monthly subscription', amount: 'Contact for pricing' },
        { item: 'Term package', amount: 'Contact for pricing' },
        { item: 'Materials access', amount: 'Included' }
      ]
    }
  ]

  const paymentMethods = [
    { icon: CreditCard, name: 'Bank Transfer', description: 'Direct bank deposit' },
    { icon: CreditCard, name: 'Mobile Money', description: 'Airtel Money, MTN Money' },
    { icon: CreditCard, name: 'Cash', description: 'At our campus' },
    { icon: CreditCard, name: 'Online Payment', description: 'Secure online portal' }
  ]

  const discounts = [
    'Sibling discount: 10% off for second child',
    'Early payment discount: 5% off when paying per term',
    'Referral discount: One-time discount for referring new families',
    'Bulk payment discount: Available for annual payments'
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
            Investment in Education
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Tuition & Fees
          </h1>
          <p className="text-lg text-gray-600">
            Quality education at competitive rates with flexible payment options
          </p>
        </motion.div>

        {/* Program Selector */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {programs.map((program) => {
            const Icon = program.icon
            const isSelected = selectedProgram === program.id
            return (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                  ${isSelected 
                    ? 'bg-[var(--campus-gold)] text-gray-900 shadow-lg' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {program.name}
              </button>
            )
          })}
        </motion.div>

        {/* Fee Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">
              {programs.find(p => p.id === selectedProgram)?.name} Fees
            </h2>
            <div className="space-y-4">
              {programs.find(p => p.id === selectedProgram)?.fees.map((fee, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-white/20 last:border-0">
                  <span className="text-gray-200">{fee.item}</span>
                  <span className="font-bold text-[var(--campus-gold)]">{fee.amount}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-300 mt-6">
              * Please contact our admissions office for current pricing and available discounts.
            </p>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#003087] mb-6">
              Payment Methods
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <Icon className="w-6 h-6 text-[var(--campus-gold)] mb-2" />
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{method.name}</h3>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Discounts */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-[#003087] mb-4">
              Available Discounts
            </h2>
            <ul className="space-y-3">
              {discounts.map((discount, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{discount}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-16"
        >
          <h2 className="text-xl font-bold text-[#003087] mb-4">
            What's Included in Tuition
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-2">
              {[
                'All learning materials and resources',
                'Access to school facilities',
                'Extracurricular activities',
                'Progress reports and assessments'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {[
                'Parent-teacher meetings',
                'School events participation',
                'Student support services',
                'Online portal access'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] mb-4">
            Need More Information?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact our admissions office for detailed pricing and payment plans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              Contact Admissions
            </Link>
            <Link
              href="/apply"
              className="px-8 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}