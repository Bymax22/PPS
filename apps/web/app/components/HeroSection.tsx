'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FaRocket, FaUsers, FaTrophy, FaPlay, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const slides = [
  {
    id: 1,
    title: 'Quality Education for All Zambian Students',
    subtitle: 'Zambian & International Curriculum',
    description: 'Enroll your child in our comprehensive education programs designed for Zambian and international students. Learn on our physical campus or virtually - 100% success rate guaranteed.',
    cta: 'Enroll Now',
    link: '/enrollment',
    color: 'blue',
    icon: FaRocket,
    image: '/slide1.jpg'
  },
  {
    id: 2,
    title: 'Learn Your Way',
    subtitle: 'Physical Campus & Virtual Learning',
    description: 'Choose flexible learning options: attend classes on our modern physical campus in Zambia or join our world-class virtual classroom from anywhere in the world.',
    cta: 'Learn More',
    link: '/learning-options',
    color: 'green',
    icon: FaUsers,
    image: '/slide2.jpg'
  },
  {
    id: 3,
    title: 'Parents Stay Connected',
    subtitle: 'Monitor Progress in Real-Time',
    description: 'Our advanced parent portal lets you track your child\'s progress, attendance, grades, and development - all in one easy-to-use dashboard.',
    cta: 'Parent Portal',
    link: '/parent-portal',
    color: 'blue',
    icon: FaTrophy,
    image: '/slide3.jpg'
  }
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [currentSlide, isTransitioning])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, goToSlide])

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const currentColor = slides[currentSlide].color
  const IconComponent = slides[currentSlide].icon

  // Handle touch swiping
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      nextSlide()
    }
    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevSlide()
    }
  }

  return (
    <section 
      className="relative overflow-hidden bg-gray-900"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images - Optimized for mobile */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              zIndex: index === currentSlide ? 1 : 0
            }}
          >
            <div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Mobile-optimized gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/80 lg:to-black/90"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Navigation Arrows */}
      <div className="lg:hidden absolute inset-0 z-20 pointer-events-none">
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center active:scale-95 transition-transform touch-button"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-auto w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center active:scale-95 transition-transform touch-button"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Desktop Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 touch-button"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-110 touch-button"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* MOBILE LAYOUT (Single Column) */}
        <div className="lg:hidden flex flex-col items-center text-center space-y-6 py-8">
          {/* Badge */}
          <div 
            className={`inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transition-all duration-300 ${
              isTransitioning ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            <IconComponent className={`${
              currentColor === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
            } text-base`} />
            <span className="font-medium text-sm">{slides[currentSlide].subtitle}</span>
          </div>

          {/* Title - Mobile Optimized */}
          <h1 
            className={`text-2xl font-bold leading-snug text-white transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {slides[currentSlide].title}
          </h1>

          {/* Description - Mobile Optimized */}
          <p 
            className={`text-base text-gray-200 leading-relaxed transition-all duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {slides[currentSlide].description}
          </p>

          {/* Mobile Platform Preview */}
          <div 
            className={`w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transform transition-all duration-500 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="bg-gray-800/90 rounded-lg p-4 space-y-4">
              <div className="flex flex-wrap gap-2 justify-center">
                {['Student', 'Parent', 'Teacher'].map((portal, index) => (
                  <button
                    key={portal}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all active:scale-95 touch-button ${
                      index === 0 
                        ? 'bg-[#0713FB] text-white shadow-lg' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {portal}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-[#0713FB] to-[#0A1FF5] p-3 rounded-lg">
                  <div className="text-white font-semibold text-sm mb-1">Live Classes</div>
                  <div className="text-blue-100 text-xs">Join Now</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-white font-semibold text-sm mb-1">Assignments</div>
                  <div className="text-gray-300 text-xs">3 Pending</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-white font-semibold text-sm mb-1">Progress</div>
                  <div className="text-[#0EF117] text-xs font-medium">85% Complete</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-white font-semibold text-sm mb-1">Badges</div>
                  <div className="text-yellow-400 text-xs font-medium">12 Earned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons - Stacked on Mobile */}
          <div 
            className={`w-full max-w-md mx-auto space-y-3 transition-all duration-500 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <Link
              href={slides[currentSlide].link}
              className={`group block w-full ${
                currentColor === 'blue' 
                  ? 'bg-[#0713FB] hover:bg-[#060EDB]' 
                  : 'bg-[#0EF117] hover:bg-[#0CD714] text-gray-900'
              } text-white px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-base active:scale-[0.98] touch-button`}
            >
              <span>{slides[currentSlide].cta}</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/demo"
              className="group block w-full border-2 border-white/40 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 text-base active:scale-[0.98] touch-button"
            >
              <FaPlay className="text-sm" />
              <span>Live Demo</span>
            </Link>
          </div>

          {/* Stats - Horizontal on Mobile */}
          <div 
            className={`w-full grid grid-cols-3 gap-3 transition-all duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {[
              { value: '98%', label: 'Pass Rate' },
              { value: '5K+', label: 'Students' },
              { value: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="text-center"
              >
                <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-300 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DESKTOP LAYOUT (Two Columns) - Your original design */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
          {/* Content with Slide Animation */}
          <div className="text-white space-y-6">
            {/* Badge with Fade-in */}
            <div 
              className={`inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 transition-all duration-500 ${
                isTransitioning ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <IconComponent className={`${
                currentColor === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
              } text-lg`} />
              <span className="font-medium text-sm">{slides[currentSlide].subtitle}</span>
            </div>

            {/* Title with Slide-up */}
            <h1 
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight transition-all duration-700 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              {slides[currentSlide].title}
            </h1>

            {/* Description with Fade-in */}
            <p 
              className={`text-lg text-gray-200 leading-relaxed transition-all duration-700 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              {slides[currentSlide].description}
            </p>

            {/* Buttons with Stagger Animation */}
            <div 
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
              style={{ transitionDelay: '450ms' }}
            >
              <Link
                href={slides[currentSlide].link}
                className={`group ${
                  currentColor === 'blue' 
                    ? 'bg-[#0713FB] hover:bg-[#060EDB]' 
                    : 'bg-[#0EF117] hover:bg-[#0CD714] text-gray-900'
                } text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]`}
              >
                <span>{slides[currentSlide].cta}</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/demo"
                className="group border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaPlay className="text-sm" />
                <span>Live Demo</span>
              </Link>
            </div>

            {/* Stats */}
            <div 
              className={`grid grid-cols-3 gap-4 pt-6 transition-all duration-700 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ transitionDelay: '600ms' }}
            >
              {[
                { value: '98%', label: 'Pass Rate' },
                { value: '5K+', label: 'Active Students' },
                { value: '24/7', label: 'Support' }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center transform transition-all duration-500 hover:scale-105 cursor-default"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-xs sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Preview with Scale Animation */}
          <div className="relative">
            <div 
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-2xl transform transition-all duration-700 ${
                isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="bg-gray-800/90 rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Platform Tabs */}
                <div className="flex flex-wrap gap-2">
                  {['Student Portal', 'Parent Portal', 'Teacher Portal'].map((portal, index) => (
                    <button
                      key={portal}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        index === 0 
                          ? 'bg-[#0713FB] text-white shadow-lg' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {portal}
                    </button>
                  ))}
                </div>
                
                {/* Platform Content */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-[#0713FB] to-[#0A1FF5] p-3 sm:p-4 rounded-lg transform transition-all duration-300 hover:scale-105">
                    <div className="text-white font-semibold text-sm sm:text-base mb-1">Live Classes</div>
                    <div className="text-blue-100 text-xs sm:text-sm">Join Now</div>
                  </div>
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                    <div className="text-white font-semibold text-sm sm:text-base mb-1">Assignments</div>
                    <div className="text-gray-300 text-xs sm:text-sm">3 Pending</div>
                  </div>
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                    <div className="text-white font-semibold text-sm sm:text-base mb-1">Progress</div>
                    <div className="text-[#0EF117] text-xs sm:text-sm font-medium">85% Complete</div>
                  </div>
                  <div className="bg-gray-700 p-3 sm:p-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-600">
                    <div className="text-white font-semibold text-sm sm:text-base mb-1">Badges</div>
                    <div className="text-yellow-400 text-xs sm:text-sm font-medium">12 Earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide Indicators - Bottom Center */}
      <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group touch-button"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? currentColor === 'blue' 
                    ? 'bg-[#0713FB] scale-125 ring-2 ring-white/50' 
                    : 'bg-[#0EF117] scale-125 ring-2 ring-white/50'
                  : 'bg-white/40 group-hover:bg-white/60'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Slide Indicators with Progress Bar */}
      <div className="hidden lg:block absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="flex flex-col items-center group touch-button"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="relative w-16 h-1 rounded-full bg-white/30 overflow-hidden mb-2">
                <div 
                  className={`absolute inset-y-0 left-0 ${
                    currentColor === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                  } transition-all duration-500 ease-out`}
                  style={{ 
                    width: index === currentSlide ? '100%' : '0%',
                    transform: index === currentSlide ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left'
                  }}
                />
              </div>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? currentColor === 'blue' 
                    ? 'bg-[#0713FB] scale-125 ring-2 ring-white/30' 
                    : 'bg-[#0EF117] scale-125 ring-2 ring-white/30'
                  : 'bg-white/50 group-hover:bg-white/70'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}