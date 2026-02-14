'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, GraduationCap, Users, Shield, Award, BookOpen, Home, Globe, Phone, Mail, MapPin, MessageSquare, Laptop, Clock, Calendar, Sparkles, CalendarCheck, UserPlus } from 'lucide-react'
import { useState, useEffect } from 'react'

// Facility data with multiple images per widget
const facilities = [
  {
    id: 'learning-environment',
    title: 'Conducive Learning Environment',
    description: 'Clean, comfortable classrooms designed for student focus and engagement.',
    longDescription: 'Our classrooms are thoughtfully designed to create an optimal learning atmosphere with proper lighting, ventilation, and age-appropriate furniture that puts student comfort first.',
    stats: [
      { icon: Users, value: '1:12', label: 'Student-Teacher Ratio' },
      { icon: Shield, value: '24/7', label: 'Security' },
      { icon: Award, value: 'Accredited', label: 'Quality Assured' }
    ],
    images: [
      '/images/senior-secondary.jpg',
      '/images/campus-students-learning.jpg',
      '/images/computer1.jpg'
    ],
    features: ['Climate Controlled', 'Modern Furniture', 'Interactive Boards', 'Safe Environment'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'qualified-staff',
    title: 'Highly Qualified Staff',
    description: 'Expert teachers using learner-centered methods aligned with the Competence-Based Curriculum.',
    longDescription: 'Our teaching staff are highly trained professionals dedicated to nurturing each child\'s potential through innovative teaching methods.',
    stats: [
      { icon: Users, value: '20+', label: 'Expert Teachers' },
      { icon: GraduationCap, value: '100%', label: 'Qualified' },
      { icon: Award, value: 'Years', label: 'Experience' }
    ],
    images: [
      '/images/pupil1.jpg',
      '/images/home1.jpg',
      '/images/physics-lesson.jpg'
    ],
    features: ['Continuous Training', 'Child-Centered', 'Competence-Based', 'Caring Approach'],
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'curriculum',
    title: 'Dual Curriculum',
    description: 'Quality education from Baby Class to Grade 7, covering Local Curriculum and Cambridge.',
    longDescription: 'We offer a seamless educational journey combining the best of Zambian and international curricula to prepare students for global success.',
    stats: [
      { icon: BookOpen, value: '2', label: 'Curricula' },
      { icon: Users, value: 'Baby Class', label: 'to Grade 7' },
      { icon: Globe, value: 'Cambridge', label: 'International' }
    ],
    images: [
      '/images/banner-teachers.jpg',
      '/images/banner-virtual.jpg',
      '/images/virtual-class.jpg'
    ],
    features: ['Local Curriculum', 'Cambridge Pathway', 'Competence-Based', 'Holistic Learning'],
    color: 'from-amber-500 to-orange-500'
  }
]

interface FacilityCardProps {
  facility: typeof facilities[0]
  index: number
  isLarge?: boolean
}

function FacilityCard({ facility, index, isLarge = false }: FacilityCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-advance images
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % facility.images.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [isHovered, facility.images.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer
        ${isLarge ? 'h-80 lg:h-[500px]' : 'h-64 lg:h-[240px]'}`}
    >
      {/* Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={facility.images[currentImageIndex]}
            alt={facility.title}
            fill
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-[#003087] via-[#003087]/70 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Image Counter Dots */}
      <div className="absolute top-4 left-4 flex gap-1.5 z-10">
        {facility.images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentImageIndex(idx)
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentImageIndex 
                ? 'w-6 bg-[var(--campus-gold)]' 
                : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
      </div>

      {/* Content - appears on hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 z-10">
        <h3 className={`text-white font-bold mb-2 ${isLarge ? 'text-3xl' : 'text-xl'}`}>
          {facility.title}
        </h3>
        
        <p className={`text-gray-200 mb-3 ${isLarge ? 'text-base' : 'text-sm'}`}>
          {isLarge ? facility.longDescription : facility.description}
        </p>

        {/* Stats with Icons */}
        <div className={`flex flex-wrap gap-4 mb-4 ${!isLarge && 'hidden group-hover:flex'}`}>
          {facility.stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <Icon className={`${isLarge ? 'w-4 h-4' : 'w-3.5 h-3.5'} text-[var(--campus-gold)]`} />
                <span className="text-xs text-white">
                  <span className="font-semibold">{stat.value}</span>
                  <span className="text-gray-300 ml-1">{stat.label}</span>
                </span>
              </div>
            )
          })}
        </div>

        {/* Features Tags */}
        <div className="flex flex-wrap gap-2">
          {facility.features.map((feature, idx) => (
            <span 
              key={idx}
              className={`px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white 
                ${isLarge ? 'text-xs' : 'text-[10px]'} font-medium`}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* View Details Link */}
        <Link
          href={`/news`}
          className={`absolute bottom-6 right-6 bg-[var(--campus-gold)] p-2 rounded-lg 
            opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110`}
        >
          <ArrowRight className="w-4 h-4 text-gray-900" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function CampusExperience() {
  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header - Styled like other sections */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-4">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--campus-gold)] mb-4"
            >
              The Hallmark of Academic Excellence
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-[#003087]"
            >
              Why Choose Progress
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mt-4"
            >
              Discover what makes our school the premier choice for your child's education in Lusaka.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/contact" 
              className="flex items-center gap-2 text-[#003087] font-semibold hover:text-[var(--campus-gold)] transition-colors group"
            >
              <span>Schedule a Visit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Asymmetric Grid: 1 Large Left + 2 Small Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Large Left Widget - Learning Environment */}
          <div className="lg:col-span-2">
            <FacilityCard facility={facilities[0]} index={0} isLarge={true} />
          </div>

          {/* Right Column - 2 Small Widgets Stacked */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <FacilityCard facility={facilities[1]} index={1} />
            <FacilityCard facility={facilities[2]} index={2} />
          </div>
        </div>

        {/* Online Learning & Tuition Info Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-br from-[#003087] to-[#001f5b] rounded-2xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Online Learning Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--campus-gold)]/20 rounded-xl">
                  <Laptop className="w-6 h-6 text-[var(--campus-gold)]" />
                </div>
                <h3 className="text-2xl font-bold">Online Learning</h3>
              </div>
              
              <p className="text-gray-200 text-sm leading-relaxed">
                Our teachers bring quality education directly to your home. Perfect for:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <GraduationCap className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">Our teachers teaching your child from home</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">After class support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Calendar className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">Weekend sessions</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Globe className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">Holiday programs</span>
                </div>
              </div>
            </div>

            {/* Tuition Programs Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[var(--campus-gold)]/20 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-[var(--campus-gold)]" />
                </div>
                <h3 className="text-2xl font-bold">Flexible Tuition Programs</h3>
              </div>
              
              <p className="text-gray-200 text-sm leading-relaxed">
                Choose the learning format that works best for your family:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Home className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">At our campus</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Home className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">At your home</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Laptop className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">Online sessions</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
                  <Users className="w-4 h-4 text-[var(--campus-gold)] shrink-0" />
                  <span className="text-sm">Extra help</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up & Book Appointment Buttons */}
          <div className="mt-8 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/portal/student/register"
              className="group flex items-center gap-2 px-8 py-4 bg-[var(--campus-gold)] text-gray-900 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/book-appointment"
              className="group flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              <CalendarCheck className="w-5 h-5" />
              Book an Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}