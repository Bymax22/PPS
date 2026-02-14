'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Shield, 
  Heart, 
  Users,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const pathwayImages = [
  {
    id: 'early-years',
    title: 'Early Years',
    image: '/images/early-years-classroom.jpg',
    description: 'Where curiosity meets nurturing care. Our Early Years program provides a warm, stimulating environment where children aged 2-5 develop foundational skills through play-based learning.',
    stats: '50+ students',
    age: '2-5 years',
    curriculum: 'Play-based Learning',
    highlights: ['Child-centered approach', 'Qualified early childhood educators', 'Safe, stimulating environment'],
    ctaText: 'Enroll Now',
    ctaLink: '/apply',
    color: 'amber'
  },
  {
    id: 'primary',
    title: 'Primary School',
    image: '/images/local-classroom.jpg',
    description: 'Building strong foundations for lifelong learning. Our primary program combines rigorous academics with character development for students aged 6-11.',
    stats: '100+ students',
    age: '6-11 years',
    curriculum: 'Cambridge & Local',
    highlights: ['Literacy & numeracy focus', 'Competence-based curriculum', 'Holistic development'],
    ctaText: 'Apply Now',
    ctaLink: '/apply',
    color: 'blue'
  },
  {
    id: 'cambridge',
    title: 'Cambridge Pathway',
    image: '/images/assignment-dashboard.jpg',
    description: 'Globally recognized curriculum preparing students for international success. Our Cambridge pathway opens doors to universities worldwide.',
    stats: 'Cambridge accredited',
    age: 'Primary & Secondary',
    curriculum: 'International',
    highlights: ['Global perspective', 'Critical thinking focus', 'University preparation'],
    ctaText: 'Learn More',
    ctaLink: '/cambridge',
    color: 'emerald'
  },
  {
    id: 'local',
    title: 'Local Curriculum',
    image: '/images/local-classroom.jpg',
    description: 'Excellence in Zambian education. Our local curriculum program combines academic rigor with cultural values and national pride.',
    stats: 'Grade 1-7',
    age: 'Grade 1-7',
    curriculum: 'Zambian',
    highlights: ['Cultural appreciation', 'National values', 'Community engagement'],
    ctaText: 'Explore Program',
    ctaLink: '/assessment',
    color: 'purple'
  }
]

const pillars = [
  {
    icon: Users,
    title: 'Expert Faculty',
    description: 'Highly qualified teachers using learner-centered methods',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Shield,
    title: 'Safe Environment',
    description: 'Safety and security are our top priority',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Award,
    title: 'Fully Accredited',
    description: 'Highest standards of academic excellence',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    icon: Heart,
    title: 'Holistic Growth',
    description: 'Developing knowledge, critical thinking, and character',
    color: 'from-rose-500 to-pink-600'
  }
]

export default function AcademicExcellence() {
  const [activeTab, setActiveTab] = useState(0)

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % pathwayImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const handleTabClick = (index: number) => {
    setActiveTab(index)
  }

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 py-24 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-40 left-0 w-72 h-72 bg-[#003087]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#003087]/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-[var(--campus-gold)]" />
            <span className="text-xs font-semibold text-[#003087] tracking-wide">
              The Hallmark of Academic Excellence
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Academic
            <span className="text-[#003087]"> Pathways</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From Baby Class to Form 5, we offer a seamless educational journey 
            tailored to every developmental stage.
          </p>
        </motion.div>

        {/* Image Slider with Optimized Sizing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={pathwayImages[activeTab].image}
                  alt={pathwayImages[activeTab].title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Gradient Overlay - More subtle */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/90 via-[#003087]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                
                {/* Content Overlay - Left aligned with proper spacing */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="max-w-xl text-white"
                    >
                      {/* Tags - Smaller and compact */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full bg-${pathwayImages[activeTab].color}-500/20 backdrop-blur-sm text-xs font-medium border border-white/20`}>
                          {pathwayImages[activeTab].stats}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium border border-white/20">
                          {pathwayImages[activeTab].age}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium border border-white/20">
                          {pathwayImages[activeTab].curriculum}
                        </span>
                      </div>
                      
                      {/* Title - Smaller */}
                      <h3 className="text-3xl md:text-4xl font-bold mb-3">
                        {pathwayImages[activeTab].title}
                      </h3>
                      
                      {/* Description - Compact */}
                      <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed max-w-lg">
                        {pathwayImages[activeTab].description}
                      </p>
                      
                      {/* Highlights - Minimal */}
                      <div className="flex flex-wrap gap-3 mb-5">
                        {pathwayImages[activeTab].highlights.slice(0, 2).map((highlight, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <div className="w-1 h-1 rounded-full bg-[var(--campus-gold)]" />
                            <span className="text-xs text-gray-200">{highlight}</span>
                          </div>
                        ))}
                        <span className="text-xs text-gray-300">+ more</span>
                      </div>
                      
                      {/* CTA Buttons - Smaller and compact */}
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={pathwayImages[activeTab].ctaLink}
                          className="group flex items-center gap-1.5 px-5 py-2.5 bg-[var(--campus-gold)] text-gray-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all"
                        >
                          {pathwayImages[activeTab].ctaText}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          href={`/${pathwayImages[activeTab].id}`}
                          className="group flex items-center gap-1.5 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold text-sm hover:bg-white/20 transition-all border border-white/20"
                        >
                          <BookOpen className="w-4 h-4" />
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tab Navigation - Better positioned */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 w-full max-w-3xl mx-auto justify-center">
              {pathwayImages.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(index)}
                  className={`group relative transition-all duration-300 
                    md:px-4 md:py-2 px-2.5 py-1.5 rounded-lg backdrop-blur-md
                    ${activeTab === index
                      ? 'bg-white text-[#003087] shadow-md'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                    }`}
                >
                  <span className="relative z-10 font-medium text-xs md:text-sm whitespace-nowrap">
                    {item.title}
                  </span>
                  {activeTab === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Progress Indicator - Smaller */}
            <div className="absolute top-4 left-4 flex gap-1">
              {pathwayImages.map((_, index) => (
                <motion.div
                  key={index}
                  className="h-0.5 rounded-full bg-white/30 overflow-hidden"
                  style={{ width: index === activeTab ? '30px' : '15px' }}
                >
                  {index === activeTab && (
                    <motion.div
                      className="h-full bg-[var(--campus-gold)]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      key={activeTab}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Why Choose Us - More Compact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#003087] to-[#002066] rounded-2xl p-8 md:p-10 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Why Choose Us</h3>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto">
              We provide an exceptional educational experience that prepares students for future success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 h-full border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-base font-bold mb-1">{pillar.title}</h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Tuition Section - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 pt-8 border-t border-white/20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--campus-gold)] rounded-lg">
                  <GraduationCap className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Flexible Tuition Programs</h4>
                  <p className="text-gray-300 text-xs">
                    One-on-one sessions at our campus, your home, or online
                  </p>
                </div>
              </div>
              <Link 
                href="/tuition"
                className="group flex items-center gap-1.5 px-5 py-2.5 bg-[var(--campus-gold)] text-gray-900 rounded-lg font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
              >
                Explore Tuition Options
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}