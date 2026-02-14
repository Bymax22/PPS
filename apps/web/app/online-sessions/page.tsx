'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Laptop, Globe, Clock, Monitor, Wifi, Video, Download, MessageSquare, CheckCircle } from 'lucide-react'

export default function OnlineSessionsPage() {
  const features = [
    {
      icon: Video,
      title: 'Live Interactive Sessions',
      description: 'Real-time lessons with two-way interaction'
    },
    {
      icon: Download,
      title: 'Recorded Lessons',
      description: 'Access recordings anytime for review'
    },
    {
      icon: MessageSquare,
      title: 'Instant Messaging',
      description: 'Direct communication with teachers'
    },
    {
      icon: Monitor,
      title: 'Digital Whiteboard',
      description: 'Interactive learning tools and resources'
    }
  ]

  const requirements = [
    'Stable internet connection',
    'Computer, tablet, or smartphone',
    'Webcam and microphone',
    'Zoom or Google Meet (free)',
    'Quiet learning space'
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
              <Laptop className="w-6 h-6 text-[var(--campus-gold)]" />
              <span className="text-sm font-semibold uppercase tracking-wider">Online Sessions</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Learn from Anywhere
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8">
              Interactive virtual learning with our expert teachers from the comfort of your home
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
              >
                Enroll Now
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Try a Demo Class
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

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#003087] mb-6">
              How Online Learning Works
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Enroll & Schedule',
                  description: 'Choose your subjects and preferred schedule'
                },
                {
                  step: '2',
                  title: 'Get Login Details',
                  description: 'Receive access to our virtual classroom platform'
                },
                {
                  step: '3',
                  title: 'Join Live Sessions',
                  description: 'Attend interactive lessons with your teacher'
                },
                {
                  step: '4',
                  title: 'Access Resources',
                  description: 'Download materials and review recorded sessions'
                }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[var(--campus-gold)] rounded-full flex items-center justify-center text-gray-900 font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#003087] mb-6">Technical Requirements</h2>
            <ul className="space-y-3 mb-8">
              {requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[var(--campus-gold)] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">{req}</span>
                </li>
              ))}
            </ul>

            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-xs text-gray-500 mb-3">
                We provide technical support to help you get started.
              </p>
              <Link
                href="/contact"
                className="text-sm text-[#003087] font-semibold hover:text-[var(--campus-gold)] transition-colors"
              >
                Contact Tech Support →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white mb-16"
        >
          <h2 className="text-2xl font-serif font-bold text-center mb-8">
            Why Choose Online Learning?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: 'Learn Anywhere',
                description: 'Access lessons from anywhere with internet'
              },
              {
                icon: Clock,
                title: 'Flexible Schedule',
                description: 'Choose times that work for your family'
              },
              {
                icon: Wifi,
                title: 'No Commute',
                description: 'Save time on travel to and from campus'
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <Icon className="w-8 h-8 text-[var(--campus-gold)] mb-4" />
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-200">{item.description}</p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-serif font-bold text-[#003087] mb-4">
            Ready to Start Online Learning?
          </h2>
          <p className="text-gray-600 mb-8">
            Join our virtual classroom today and experience quality education from home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply"
              className="px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
            >
              Enroll Now
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 border-2 border-[#003087] text-[#003087] rounded-xl font-semibold hover:bg-[#003087] hover:text-white transition-colors"
            >
              Request Demo Class
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}