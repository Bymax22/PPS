'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Users, Briefcase, MapPin, Calendar, Mail, Linkedin, Twitter, MessageSquare, ChevronRight, Award } from 'lucide-react'

const alumni = [
  {
    name: 'Chisha Musonda',
    graduation: 'Class of 2020',
    currentRole: 'Engineering Student',
    currentInstitution: 'University of Zambia',
    location: 'Lusaka, Zambia',
    image: '/images/alumni/chisha.jpg',
    quote: 'Progress gave me the confidence to pursue engineering. The lab facilities and support were exceptional.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Natasha Banda',
    graduation: 'Class of 2019',
    currentRole: 'Medical Student',
    currentInstitution: 'Eden University',
    location: 'Lusaka, Zambia',
    image: '/images/alumni/natasha.jpg',
    quote: 'The foundation I received at Progress prepared me well for my medical studies. Grateful for the caring teachers.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Michael Phiri',
    graduation: 'Class of 2018',
    currentRole: 'Software Developer',
    currentInstitution: 'Tech Solutions Ltd',
    location: 'Lusaka, Zambia',
    image: '/images/alumni/michael.jpg',
    quote: 'The ICT classes sparked my interest in technology. Now I build software solutions for businesses.',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Thandiwe Mwamba',
    graduation: 'Class of 2021',
    currentRole: 'A-Level Student',
    currentInstitution: 'Rhodes Park School',
    location: 'Lusaka, Zambia',
    image: '/images/alumni/thandiwe.jpg',
    quote: 'Progress prepared me well for secondary education. I still use the study skills I learned there.',
    linkedin: '#',
    twitter: '#'
  }
]

const stats = [
  { label: 'Alumni Network', value: '500+' },
  { label: 'Universities Attended', value: '20+' },
  { label: 'Countries Represented', value: '8' },
  { label: 'Years of Excellence', value: '15+' }
]

export default function AlumniPage() {
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
            Forever Progress
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#003087] mb-6">
            Alumni Network
          </h1>
          <p className="text-lg text-gray-600">
            Reconnect, network, and stay involved with your alma mater
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#003087]">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Alumni Grid */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-serif font-bold text-[#003087] mb-8"
        >
          Featured Alumni
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {alumni.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
                  <p className="text-sm text-[var(--campus-gold)] font-semibold mb-3">{person.graduation}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-[var(--campus-gold)]" />
                      <span className="text-gray-600">{person.currentRole}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-[var(--campus-gold)]" />
                      <span className="text-gray-600">{person.currentInstitution}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-[var(--campus-gold)]" />
                      <span className="text-gray-600">{person.location}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic mb-4">"{person.quote}"</p>
                  <div className="flex items-center gap-3">
                    <a href={person.linkedin} className="p-2 bg-gray-100 rounded-lg hover:bg-[#003087] hover:text-white transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href={person.twitter} className="p-2 bg-gray-100 rounded-lg hover:bg-[#003087] hover:text-white transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${person.name.toLowerCase()}@example.com`} className="p-2 bg-gray-100 rounded-lg hover:bg-[#003087] hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Alumni Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white mb-16"
        >
          <h2 className="text-2xl font-serif font-bold mb-6">Alumni Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Network Events',
                description: 'Connect with fellow alumni at reunions and networking events'
              },
              {
                title: 'Mentorship Program',
                description: 'Guide current students and recent graduates in their careers'
              },
              {
                title: 'Lifetime Email',
                description: 'Keep your @progress.alumni.zm email address forever'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-200">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stay Connected */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] mb-4">
            Stay Connected
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Update your contact information and stay informed about alumni events and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/alumni/register"
              className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              Register as Alumni
            </Link>
            <Link
              href="/alumni/login"
              className="px-8 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors"
            >
              Alumni Portal Login
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}