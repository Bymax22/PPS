'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Home, Clock, Calendar, MapPin, Users, CheckCircle, Star, Heart, Award } from 'lucide-react'

export default function HomeTuitionPage() {
  const benefits = [
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Choose times that work best for your family'
    },
    {
      icon: Home,
      title: 'Comfortable Environment',
      description: 'Learn in the familiar setting of your own home'
    },
    {
      icon: Users,
      title: 'One-on-One Attention',
      description: 'Personalized focus on your child\'s specific needs'
    },
    {
      icon: Calendar,
      title: 'Customized Pace',
      description: 'Progress at a speed that suits your child'
    }
  ]

  const subjects = [
    'Mathematics',
    'English',
    'Science',
    'Social Studies',
    'ICT',
    'Cambridge Checkpoint Prep',
    'ECZ Exam Preparation',
    'Reading & Literacy'
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
              <span className="text-sm font-semibold uppercase tracking-wider">Home One-on-One</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Personalized Tutoring at Your Home
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mb-8">
              Quality education brought directly to your doorstep with flexible scheduling and personalized attention
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
                Request a Tutor
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
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
              How It Works
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Request a Tutor',
                  description: 'Contact us with your child\'s needs and preferred schedule'
                },
                {
                  step: '2',
                  title: 'Meet Your Tutor',
                  description: 'We match your child with a qualified teacher and arrange an introductory session'
                },
                {
                  step: '3',
                  title: 'Customized Learning Plan',
                  description: 'Your tutor develops a personalized plan based on your child\'s goals'
                },
                {
                  step: '4',
                  title: 'Begin Sessions',
                  description: 'Start learning in the comfort of your home at agreed times'
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

          {/* Subjects Offered */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-xl font-bold text-[#003087] mb-6">Subjects Offered</h2>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--campus-gold)]" />
                  <span className="text-sm text-gray-600">{subject}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3">Package Options</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Per Session</span>
                  <span className="font-bold text-[#003087]">Contact for pricing</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">10-Session Package</span>
                  <span className="font-bold text-[#003087]">Contact for pricing</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Package</span>
                  <span className="font-bold text-[#003087]">Contact for pricing</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-3xl p-8 text-white mb-16"
        >
          <h2 className="text-2xl font-serif font-bold text-center mb-8">
            What Parents Say
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "The home tutoring has been a game-changer for our daughter. She's gained so much confidence in math.",
                parent: "Mrs. Banda",
                child: "Grade 5 Parent"
              },
              {
                quote: "Flexible scheduling and excellent teachers. Perfect for our busy family schedule.",
                parent: "Mr. Chisenga",
                child: "Grade 3 Parent"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Star className="w-5 h-5 text-[var(--campus-gold)] mb-3" />
                <p className="text-gray-200 text-sm mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.parent}</p>
                  <p className="text-xs text-gray-300">{testimonial.child}</p>
                </div>
              </div>
            ))}
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
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8">
            Contact us today to discuss your child's needs and schedule a tutor.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Request a Tutor
          </Link>
        </motion.div>
      </div>
    </main>
  )
}