'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Heart, Users, FileText, Phone, Mail, AlertTriangle, BookOpen, CheckCircle } from 'lucide-react'

export default function SafeguardingPage() {
  const policies = [
    {
      title: 'Child Protection Policy',
      description: 'Comprehensive guidelines ensuring the safety and wellbeing of all students.',
      icon: Shield
    },
    {
      title: 'Anti-Bullying Policy',
      description: 'Zero-tolerance approach to bullying with clear reporting procedures.',
      icon: Heart
    },
    {
      title: 'Health & Safety Policy',
      description: 'Regular risk assessments and safety protocols across campus.',
      icon: AlertTriangle
    },
    {
      title: 'Staff Code of Conduct',
      description: 'Clear expectations for professional behavior and boundaries.',
      icon: Users
    }
  ]

  const contacts = [
    {
      role: 'Designated Safeguarding Lead',
      name: 'Mrs. Grace Banda',
      email: 'safeguarding@progress.edu.zm',
      phone: '0771 050 501'
    },
    {
      role: 'Deputy Safeguarding Lead',
      name: 'Mr. Peter Chisenga',
      email: 'peter.chisenga@progress.edu.zm',
      phone: '0771 050 502'
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
            Our Commitment
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Safeguarding & Child Protection
          </h1>
          <p className="text-lg text-gray-600">
            The safety and wellbeing of every child is our absolute priority
          </p>
        </motion.div>

        {/* Safeguarding Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-10 text-white mb-12"
        >
          <Shield className="w-12 h-12 text-[var(--campus-gold)] mb-6" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
            Our Safeguarding Commitment
          </h2>
          <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
            At Progress Preparatory School, we are committed to creating and maintaining a safe, 
            secure, and nurturing environment where all children can thrive. We have robust policies, 
            procedures, and trained staff to ensure the highest standards of child protection.
          </p>
        </motion.div>

        {/* Policies Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#003087] mb-8">Our Safeguarding Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {policies.map((policy, index) => {
              const Icon = policy.icon
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--campus-gold)]/10 rounded-lg">
                      <Icon className="w-6 h-6 text-[var(--campus-gold)]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">{policy.title}</h3>
                      <p className="text-sm text-gray-500">{policy.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Safeguarding Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[#003087] mb-8">Safeguarding Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {contacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-1">{contact.role}</h3>
                <p className="text-[var(--campus-gold)] font-semibold mb-3">{contact.name}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[var(--campus-gold)]" />
                    <a href={`mailto:${contact.email}`} className="text-gray-600 hover:text-[#003087]">
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-[var(--campus-gold)]" />
                    <a href={`tel:${contact.phone}`} className="text-gray-600 hover:text-[#003087]">
                      {contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reporting Concerns */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-[#003087] mb-4">Reporting a Concern</h2>
          <p className="text-gray-600 mb-6">
            If you have any concerns about a child's safety or wellbeing, please contact our 
            safeguarding team immediately. All concerns are taken seriously and handled with 
            confidentiality and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/report-concern"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-xl font-semibold hover:bg-[#002066] transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Report a Concern
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              Emergency Contact
            </Link>
          </div>
        </motion.div>

        {/* Training & Awareness */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>All staff undergo annual safeguarding training</span>
          </div>
        </motion.div>
      </div>
    </main>
  )
}