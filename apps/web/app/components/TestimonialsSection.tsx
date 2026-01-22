'use client'

import { useState, useEffect } from 'react'
import { FaStar, FaQuoteLeft, FaQuoteRight, FaPlay, FaPause, FaGraduationCap, FaAward, FaBook } from 'react-icons/fa'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Dr. James Banda',
    role: 'Parent & Medical Doctor',
    position: 'University Teaching Hospital',
    avatar: '/testimonials/doctor.jpg',
    content: 'The parent portal gives me real-time insight into my daughter\'s progress. I can monitor her grades, attendance, and communicate with teachers instantly, even with my busy schedule at the hospital.',
    rating: 5,
    feature: 'Parent Portal',
    stats: '95% Average Grade',
    achievement: 'Daughter excelling in Science',
    quote: "Best decision we made for our child's education"
  },
  {
    id: 2,
    name: 'Sarah Mwamba',
    role: 'Grade 10 Student',
    position: 'Science Stream Leader',
    avatar: '/testimonials/student.jpg',
    content: 'I love earning badges and competing on leaderboards! The gamification makes learning fun, and the virtual study groups help me collaborate with classmates across Zambia.',
    rating: 5,
    feature: 'Gamification',
    stats: '12 Badges Earned',
    achievement: 'Top 5% in Mathematics',
    quote: "Learning has never been this exciting!"
  },
  {
    id: 3,
    name: 'Mr. David Phiri',
    role: 'Mathematics Teacher',
    position: 'Senior Faculty Member',
    avatar: '/testimonials/teacher.jpg',
    content: 'The assignment and grading system saves me hours each week. I can provide detailed feedback, track submissions, and analyze class performance effortlessly.',
    rating: 5,
    feature: 'Assignment System',
    stats: '80% Time Saved',
    achievement: 'Improved class performance by 25%',
    quote: "Teaching has become more efficient and effective"
  },
  {
    id: 4,
    name: 'Mrs. Grace Lungu',
    role: 'School Administrator',
    position: 'Academic Director',
    avatar: '/testimonials/admin.jpg',
    content: 'Managing 500+ students across multiple grades is seamless with the admin portal. The financial tracking and reporting features are incredibly efficient.',
    rating: 5,
    feature: 'Admin Portal',
    stats: '500+ Students Managed',
    achievement: 'Streamlined admissions by 40%',
    quote: "Our school operations have never been smoother"
  },
  {
    id: 5,
    name: 'Brian Mwale',
    role: 'Grade 12 Graduate',
    position: 'University of Zambia Scholarship Recipient',
    avatar: '/testimonials/graduate.jpg',
    content: 'The virtual learning helped me excel in my final exams despite being in a remote area. Access to quality teachers and resources changed my future.',
    rating: 5,
    feature: 'Virtual Learning',
    stats: '6 A\'s in Final Exams',
    achievement: 'Full scholarship secured',
    quote: "Distance is no longer a barrier to quality education"
  }
]

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const active = testimonials[currentTestimonial]

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
        setIsTransitioning(false)
      }, 300)
    }, 6000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevTestimonial = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
      setIsTransitioning(false)
    }, 300)
  }

  const selectTestimonial = (index: number) => {
    if (index === currentTestimonial) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentTestimonial(index)
      setIsTransitioning(false)
    }, 300)
  }

  return (
    <section className="relative py-16 bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url(/classroom-features.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/98 via-gray-900/95 to-gray-900/98"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 mb-6">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="text-sm font-semibold text-white">Real Stories, Real Success</span>
            <FaStar className="text-yellow-400 text-sm" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-[#0EF117]">Zambia's Education Community</span>
          </h2>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Hear from students, parents, teachers, and administrators about their transformative educational journeys.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="relative bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: 'radial-gradient(circle at 40px 40px, #0EF117 1%, transparent 0%)',
                backgroundSize: '80px 80px'
              }}></div>
            </div>

            <div className="relative z-10 p-6 md:p-8">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Left Column: Avatar & Info */}
                <div className="space-y-6">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0713FB] mx-auto bg-gray-700 flex items-center justify-center">
                      <Image
                        src={active.avatar}
                        alt={active.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute bottom-2 right-1/4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                      <FaStar className="text-xs" />
                      <span>{active.rating}.0</span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-1">{active.name}</h3>
                    <div className="text-[#0EF117] font-medium mb-1">{active.role}</div>
                    <div className="text-gray-400 text-sm mb-3">{active.position}</div>
                    
                    {/* Achievement */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="text-white font-bold text-sm">{active.achievement}</div>
                    </div>
                  </div>
                </div>

                {/* Center Column: Testimonial Content */}
                <div className="lg:col-span-2">
                  <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Quote Icon */}
                    <div className="mb-4">
                      <FaQuoteLeft className="text-[#0EF117] text-3xl opacity-30" />
                    </div>

                    {/* Quote */}
                    <blockquote className="text-xl text-white leading-relaxed mb-6 min-h-[120px]">
                      "{active.content}"
                    </blockquote>

                    {/* Featured Quote */}
                    <div className="bg-[#0713FB] rounded-xl p-4 border border-[#0713FB]">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">"{active.quote}"</span>
                        <FaQuoteRight className="text-[#0EF117]" />
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      >
                        {isAutoPlaying ? <FaPause /> : <FaPlay />}
                      </button>
                      <div className="text-gray-400 text-sm">
                        {currentTestimonial + 1} / {testimonials.length}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={prevTestimonial}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextTestimonial}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Thumbnails */}
        <div className="mb-12">
          <div className="flex overflow-x-auto pb-4 space-x-3 snap-x snap-mandatory scrollbar-hide">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => selectTestimonial(index)}
                className={`flex-shrink-0 w-64 snap-center rounded-xl p-4 border transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-[#0713FB] border-white shadow-lg transform scale-105'
                    : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <div className="text-white text-lg">👤</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="font-bold text-white text-sm truncate">{testimonial.name}</div>
                        <div className="text-gray-300 text-xs truncate">{testimonial.role}</div>
                      </div>
                      {index === currentTestimonial && (
                        <div className="w-2 h-2 rounded-full bg-[#0EF117] animate-pulse"></div>
                      )}
                    </div>
                    <div className="text-white/80 text-xs line-clamp-2 mb-2">"{testimonial.content.substring(0, 80)}..."</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#0EF117] text-xs font-bold bg-white/20 px-2 py-1 rounded">
                        {testimonial.feature}
                      </span>
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-xs" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}