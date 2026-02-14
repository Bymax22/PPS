'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    image: '/images/placeholder-hero-school.jpg',
    tagline: 'Welcome to Progress',
    title: 'Education for a Better World',
    subtitle: 'Empowering students to shape a more just and peaceful world through academic excellence and service.',
    cta: { text: 'Discover Our School', href: '/about' }
  },
  {
    id: 2,
    image: '/images/placeholder-students.jpg',
    tagline: 'Academic Excellence',
    title: 'Innovative Learning Pathways',
    subtitle: 'We offer both Zambian and Cambridge curricula designed to challenge and inspire young minds.',
    cta: { text: 'Explore Learning', href: '/learning' }
  },
  {
    id: 3,
    image: '/images/placeholder-campus.jpg',
    tagline: 'Join Our Community',
    title: 'Begin Your Journey Today',
    subtitle: 'Admissions are now open for the upcoming academic year. Secure your child\'s future.',
    cta: { text: 'Apply Now', href: '/admissions' }
  }
]

export default function CampusHero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearTimeout(timer)
  }, [currentSlide])

  return (
    <section className="relative min-h-[120vh] sm:h-screen w-full overflow-hidden pt-28 sm:pt-20">

      {/* --- Background Slides with Parallax --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          {/* Layered Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001f5b]/70 via-[#003087]/30 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle at center,rgba(0,0,0,0.2),transparent)] animate-pulse-slow" />
        </motion.div>
      </AnimatePresence>

      {/* --- Floating Side Widgets --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`side-left-${currentSlide}`}
          className="absolute left-0 top-1/3 w-2 h-32 bg-[var(--campus-gold)] rounded-tr-xl rounded-br-xl opacity-70 z-10"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        <motion.div
          key={`side-right-${currentSlide}`}
          className="absolute right-0 top-1/2 w-2 h-40 bg-[var(--campus-gold)] rounded-tl-xl rounded-bl-xl opacity-70 z-10"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 60, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* --- Content Container --- */}
      <div className="relative z-20 min-h-[calc(100vh-7rem)] sm:min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center text-white px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl"
          >

            {/* Micro-Animated Tagline Strip */}
            <motion.div
              className="mb-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full inline-block text-sm font-semibold tracking-wide"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Cambridge & Local Curriculum • Safe & Secure • Student-Centered Learning
            </motion.div>

            {/* Tagline */}
            <motion.span
              className="inline-block px-5 py-1.5 mb-6 border border-[var(--campus-gold)] text-[var(--campus-gold)] text-xs uppercase tracking-[0.25em] font-semibold rounded-full drop-shadow-md"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {slides[currentSlide].tagline}
            </motion.span>

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-7xl font-serif font-bold mb-6 drop-shadow-xl leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={slides[currentSlide].cta.href}
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#FFB915] to-[#FFD85C] text-black font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              >
                {slides[currentSlide].cta.text}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center backdrop-blur-md bg-white/20 border-white text-white font-bold px-10 py-4 rounded-xl hover:bg-white/30 hover:text-[#003087] transition-all"
              >
                Contact Admissions
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* --- Navigation Dots --- */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${index === currentSlide ? 'bg-[var(--campus-gold)] w-8' : 'bg-white/40 hover:bg-white/70'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* --- Upgraded Scroll Indicator --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="flex justify-center items-center"
        >
          <svg
            className="w-6 h-6 text-white animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
