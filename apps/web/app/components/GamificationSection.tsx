'use client'

import { useState, useEffect, useRef } from 'react'
import { FaArrowRight, FaBook, FaUsers, FaGraduationCap, FaTrophy, FaCalendarAlt, FaPlay, FaStar, FaHeart } from 'react-icons/fa'

const bannerSlides = [
  {
    id: 1,
    title: 'World-Class Education',
    subtitle: 'Zambian & International Curriculum Excellence',
    description: 'Experience academic excellence with proven 100% pass rates and comprehensive learning programs.',
    image: '/banner-campus.jpg',
    cta: 'View Programs',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Virtual Learning Platform',
    subtitle: 'Study Anywhere, Anytime',
    description: 'Access interactive lessons, live classes, and recorded sessions from anywhere in the world.',
    image: '/banner-virtual.jpg',
    cta: 'Start Learning',
    color: 'green'
  },
  {
    id: 3,
    title: 'Expert Faculty Team',
    subtitle: 'Qualified & Experienced Teachers',
    description: 'Learn from certified educators with advanced degrees and years of teaching experience.',
    image: '/banner-teachers.jpg',
    cta: 'Meet Our Team',
    color: 'blue'
  },
  {
    id: 4,
    title: 'Parent Partnership',
    subtitle: 'Stay Connected & Informed',
    description: 'Monitor progress, track attendance, and communicate directly with teachers through our parent portal.',
    image: '/banner-parents.jpg',
    cta: 'Explore Portal',
    color: 'green'
  }
]

const glassWidgets = [
  {
    id: 1,
    icon: FaTrophy,
    title: '100% Pass Rate',
    value: '5,000+',
    label: 'Successful Students',
    color: 'blue'
  },
  {
    id: 2,
    icon: FaUsers,
    title: 'Active Community',
    value: '50+',
    label: 'Expert Teachers',
    color: 'green'
  },
  {
    id: 3,
    icon: FaCalendarAlt,
    title: 'Flexible Learning',
    value: '24/7',
    label: 'Access Available',
    color: 'blue'
  },
  {
    id: 4,
    icon: FaGraduationCap,
    title: 'Programs Offered',
    value: 'Grade 1-12',
    label: 'Full Curriculum',
    color: 'green'
  }
]

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHoveringWidgets, setIsHoveringWidgets] = useState(false)
  const slideRef = useRef<HTMLDivElement>(null)

  // Auto-slide banners
  useEffect(() => {
    if (isHoveringWidgets) return

    const interval = setInterval(() => {
      nextSlide()
    }, 6000)

    return () => clearInterval(interval)
  }, [isHoveringWidgets])

  const nextSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToSlide = (index: number) => {
    if (index === currentSlide) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  const currentSlideData = bannerSlides[currentSlide]

  return (
    <section className="relative min-h-[700px] lg:min-h-[800px] bg-gray-900">
      {/* Full-width Banner Slides */}
      <div className="absolute inset-0 overflow-hidden">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              transitionDelay: index === currentSlide ? '200ms' : '0ms',
              zIndex: index === currentSlide ? 1 : 0
            }}
          >
            {/* Background Image with Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Glass Morph Widgets - Positioned on top of banner */}
      <div 
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsHoveringWidgets(true)}
        onMouseLeave={() => setIsHoveringWidgets(false)}
      >
        <div className="pt-6 pb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {glassWidgets.map((widget) => {
              const IconComponent = widget.icon
              return (
                <div
                  key={widget.id}
                  className="group relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:shadow-lg"
                >
                  {/* Glass morph background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg backdrop-blur-sm flex items-center justify-center ${
                        widget.color === 'blue' ? 'bg-[#0713FB]/20' : 'bg-[#0EF117]/20'
                      }`}>
                        <IconComponent className={`text-lg ${
                          widget.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                        }`} />
                      </div>
                      <div>
                        <div className="text-white text-xs font-medium opacity-80">
                          {widget.title}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-white">
                        {widget.value}
                      </div>
                      <div className="text-white/70 text-xs">
                        {widget.label}
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Centered on banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="py-16 lg:py-24">
          <div className={`max-w-xl transition-all duration-500 ${
            isTransitioning ? 'opacity-50 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            {/* Badge */}
            <div className={`inline-flex items-center space-x-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            } transition-opacity duration-300`}>
              <div className={`w-2 h-2 rounded-full ${
                currentSlideData.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
              }`}></div>
              <span className="text-white text-sm font-medium">
                {currentSlideData.subtitle}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {currentSlideData.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
              {currentSlideData.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className={`group inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentSlideData.color === 'blue' 
                  ? 'bg-[#0713FB] hover:bg-blue-700' 
                  : 'bg-[#0EF117] hover:bg-green-600 text-gray-900'
              } text-white hover:shadow-lg hover:scale-105 active:scale-95`}>
                <span>{currentSlideData.cta}</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold border border-white/30 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                <FaPlay className="text-sm" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-2">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group flex flex-col items-center"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="relative w-16 h-0.5 bg-white/30 rounded-full overflow-hidden mb-1">
                <div 
                  className={`absolute inset-y-0 left-0 h-full transition-all duration-300 ${
                    currentSlideData.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                  }`}
                  style={{ 
                    width: index === currentSlide ? '100%' : '0%',
                    transition: index === currentSlide ? 'width 6s linear' : 'none'
                  }}
                />
              </div>
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? currentSlideData.color === 'blue' 
                    ? 'bg-[#0713FB] scale-125 ring-2 ring-white/30' 
                    : 'bg-[#0EF117] scale-125 ring-2 ring-white/30'
                  : 'bg-white/50 group-hover:bg-white/70'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="md:hidden absolute bottom-4 right-4 z-20 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? currentSlideData.color === 'blue' 
                  ? 'bg-[#0713FB] scale-125' 
                  : 'bg-[#0EF117] scale-125'
                : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
    </section>
  )
}