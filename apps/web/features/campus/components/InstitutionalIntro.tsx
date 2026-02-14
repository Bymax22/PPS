'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Sparkles, Users, Award, BookOpen } from 'lucide-react'
import { useRef } from 'react'

export default function InstitutionalIntro() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])

  const stats = [
    { icon: Award, value: "50+", label: "Years of Excellence", color: "from-amber-400 to-yellow-500" },
    { icon: Users, value: "100+", label: "Expert Faculty", color: "from-blue-400 to-indigo-500" },
    { icon: BookOpen, value: "500+", label: "Active Students", color: "from-emerald-400 to-teal-500" },
    { icon: Sparkles, value: "95%", label: "Success Rate", color: "from-purple-400 to-pink-500" }
  ]

  return (
    <section ref={containerRef} className="relative w-full bg-gradient-to-b from-white to-gray-50 overflow-hidden py-24 md:py-32">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(0,48,135,0.03)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,215,0,0.03)_0%,transparent_50%)]" />
      </div>

      {/* Animated Gradient Orbs */}
      <motion.div 
        className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-[#003087]/10 to-[#003087]/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-amber-300/20 to-yellow-300/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 bg-[#003087]/10 text-[#003087] rounded-full text-sm font-semibold tracking-wider mb-4">
            Excellence in Education Since 2018
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Where Future Leaders
            <span className="block text-[#003087]">Are Shaped</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over five decades, we've been nurturing minds and building character through innovative education and unwavering commitment to excellence.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-6"
            style={{ y, opacity }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                       style={{ background: `linear-gradient(135deg, ${stat.color})` }} />
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right Side - Featured Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Main Image Card */}
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="/images/campus-students-learning.jpg"
                  alt="Students engaged in collaborative learning"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/90 via-[#003087]/30 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-3xl font-bold mb-3">Discover Excellence</h3>
                    <p className="text-gray-200 mb-6 max-w-md">
                      Experience a learning environment where innovation meets tradition, and every student's potential is nurtured to flourish.
                    </p>
                    
                    {/* Quick Links */}
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        href="/programs" 
                        className="group flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>Our Programs</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        href="/apply" 
                        className="group flex items-center gap-2 px-6 py-3 bg-[var(--campus-gold)] text-gray-900 rounded-xl hover:bg-amber-400 transition-all"
                      >
                        <span>Apply Now</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating Testimonial */}
              <motion.div 
                className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-xl max-w-[200px]"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm text-gray-600 mb-2">"The best decision for our child's future."</p>
                <p className="font-semibold text-[#003087]">- Sarah Johnson</p>
                <p className="text-xs text-gray-500">Parent of Class of '23</p>
              </motion.div>

              {/* Floating Accreditation Badge */}
              <motion.div 
                className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-[var(--campus-gold)]" />
                  <div>
                    <p className="font-semibold text-gray-900">Accredited</p>
                    <p className="text-xs text-gray-500">By Cambridge International</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-[#003087] to-[#002066] rounded-3xl p-8 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Limited Seats Available for 2024</h4>
                <p className="text-gray-300">Join our community of achievers today</p>
              </div>
            </div>
            <Link 
              href="/book-appointment" 
              className="group flex items-center gap-2 px-8 py-4 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all"
            >
              Schedule a Visit
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}