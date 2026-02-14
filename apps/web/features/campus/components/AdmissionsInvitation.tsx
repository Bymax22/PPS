'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, CheckCircle, Phone, Mail, MapPin, Clock, Users, Award, Sparkles, MessageSquare } from 'lucide-react'
import { useRef } from 'react'

export default function AdmissionsInvitation() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Enhanced Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#003087] via-[#00256e] to-[#001a4d]" />
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Floating Orbs */}
      <motion.div 
        style={{ y }}
        className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--campus-gold)]/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      <motion.div 
        style={{ opacity }}
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      {/* Decorative Circles */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        viewport={{ once: true }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="absolute w-[800px] h-[800px] border border-white/10 rounded-full" />
        <div className="absolute w-[600px] h-[600px] border border-white/10 rounded-full" />
        <div className="absolute w-[400px] h-[400px] border border-white/10 rounded-full" />
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-[var(--campus-gold)]" />
            <span className="text-sm font-semibold text-white">Limited Seats Available for 2024</span>
          </motion.div>

          {/* Main Heading with Highlight */}
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
          >
            Begin Your 
            <span className="text-[var(--campus-gold)]"> Journey</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Applications for the next academic year are now open. Give your child the gift of quality education in a nurturing environment.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Calendar, label: 'Est.', value: '1970' },
              { icon: Users, label: 'Current Students', value: '500+' },
              { icon: Award, label: 'Success Rate', value: '95%' },
              { icon: Clock, label: 'Early Bird Deadline', value: 'Mar 31' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <Icon className="w-6 h-6 text-[var(--campus-gold)] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-300">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Key Benefits Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {[
              'Cambridge Curriculum',
              'Qualified Teachers',
              'Safe Environment',
              'Small Classes',
              'Flexible Tuition'
            ].map((benefit, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full text-sm text-gray-200 border border-white/10"
              >
                {benefit}
              </span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/admissions"
              className="group px-10 py-4 bg-[var(--campus-gold)] text-black font-bold rounded-xl 
                         hover:bg-yellow-300 transition-all duration-300 
                         inline-flex items-center justify-center shadow-lg hover:shadow-2xl 
                         hover:-translate-y-1 text-lg"
            >
              Apply Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact"
              className="group px-10 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl 
                         hover:bg-white hover:text-[#003087] transition-all duration-300 
                         inline-flex items-center justify-center gap-2 text-lg"
            >
              <Phone className="w-5 h-5" />
              Contact Admissions
            </Link>
          </motion.div>

          {/* Quick Contact Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 pt-8 border-t border-white/20"
          >
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--campus-gold)]" />
                <span>0771 050500</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--campus-gold)]" />
                <span>progresspreparatoryschool@gmail.com</span>
              </div>
              <div className="hidden md:block w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--campus-gold)]" />
                <span>Hellen Kaunda Road, Lusaka</span>
              </div>
            </div>
          </motion.div>

          {/* WhatsApp Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <Link
              href="https://wa.me/260775455565"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 backdrop-blur-sm 
                         rounded-full text-sm text-white hover:bg-green-500/30 transition-all border border-green-500/30"
            >
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span>Chat with us on WhatsApp: 0775 455565</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}