'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaGraduationCap, FaUsers, FaChalkboardTeacher, FaCog, FaCheck, FaArrowRight, FaPlay, FaBookOpen, FaCalendarAlt, FaTrophy, FaStar } from 'react-icons/fa'

const portals = [
  {
    id: 'student',
    name: 'Student Portal',
    icon: FaGraduationCap,
    color: 'blue',
    features: [
      'Interactive Virtual Classes',
      'Assignment Submissions',
      'Progress Tracking',
      'Study Groups',
      'Badge Collection',
      'Exam Portal'
    ],
    description: 'Your personalized learning dashboard with all tools in one place',
    image: '/student-portal.jpg',
    studentFeatures: [
      'Game-based Learning',
      'Interactive Quizzes',
      'Peer Collaboration',
      'Achievement Badges'
    ],
    tagline: 'Learn, Play, Succeed!'
  },
  {
    id: 'parent',
    name: 'Parent Portal',
    icon: FaUsers,
    color: 'green',
    features: [
      'Progress Monitoring',
      'Attendance Tracking',
      'Fee Payments',
      'Teacher Communication',
      'Performance Reports',
      'Appointment Scheduling'
    ],
    description: 'Stay connected with your child\'s educational journey',
    image: '/parent-portal.jpg',
    studentFeatures: [
      'Parent-Teacher Meetings',
      'Real-time Updates',
      'Fee Management',
      'Schedule Planner'
    ],
    tagline: 'Stay Connected, Stay Informed'
  },
  {
    id: 'teacher',
    name: 'Teacher Portal',
    icon: FaChalkboardTeacher,
    color: 'blue',
    features: [
      'Class Management',
      'Assignment Creation',
      'Grade Submission',
      'Progress Analytics',
      'Parent Communication',
      'Resource Library'
    ],
    description: 'Comprehensive tools for effective virtual teaching',
    image: '/teacher-portal.jpg',
    studentFeatures: [
      'Interactive Lessons',
      'Student Analytics',
      'Feedback Tools',
      'Resource Sharing'
    ],
    tagline: 'Empower, Educate, Elevate'
  },
  {
    id: 'admin',
    name: 'Admin Portal',
    icon: FaCog,
    color: 'green',
    features: [
      'User Management',
      'Academic Planning',
      'Financial Tracking',
      'System Analytics',
      'Notification Management',
      'Report Generation'
    ],
    description: 'Complete school management and oversight system',
    image: '/admin-portal.jpg',
    studentFeatures: [
      'System Access',
      'Report Generation',
      'Analytics Dashboard',
      'Management Tools'
    ],
    tagline: 'Manage, Monitor, Motivate'
  }
]

const studyTips = [
  {
    id: 1,
    tip: "Take short breaks every 25 minutes for better retention.",
    tag: "#PomodoroMethod",
    number: "1/6",
    image: "/study-tip1.jpg"
  },
  {
    id: 2,
    tip: "Teach what you've learned to someone else to reinforce knowledge.",
    tag: "#TeachToLearn",
    number: "2/6",
    image: "/study-tip2.jpg"
  },
  {
    id: 3,
    tip: "Create mind maps to visualize complex topics and connections.",
    tag: "#VisualLearning",
    number: "3/6",
    image: "/study-tip3.jpg"
  },
  {
    id: 4,
    tip: "Study with friends to stay motivated and learn from each other.",
    tag: "#GroupStudy",
    number: "4/6",
    image: "/study-tip4.jpg"
  },
  {
    id: 5,
    tip: "Review material within 24 hours to boost long-term memory.",
    tag: "#SpacedRepetition",
    number: "5/6",
    image: "/study-tip5.jpg"
  },
  {
    id: 6,
    tip: "Get enough sleep - it's crucial for memory consolidation.",
    tag: "#SleepToLearn",
    number: "6/6",
    image: "/study-tip6.jpg"
  }
]

const widgetSlides = [
  {
    id: 1,
    type: 'event',
    title: 'Science Fair 2024',
    description: 'Join our annual science fair on December 15th! Showcase your projects and win exciting prizes.',
    date: 'Dec 15, 2024',
    location: 'School Campus',
    buttonText: 'RSVP Now',
    image: '/event-science.jpg'
  },
  {
    id: 2,
    type: 'event',
    title: 'Math Olympiad',
    description: 'Test your mathematical skills in our school-wide competition. Open to all grades.',
    date: 'Jan 20, 2025',
    location: 'Virtual & Campus',
    buttonText: 'Register',
    image: '/event-math.jpg'
  },
  {
    id: 3,
    type: 'spotlight',
    title: 'Student of the Week',
    student: 'John Chanda - Grade 12',
    achievement: 'Achieved 100% in Mathematics and actively leads the coding club!',
    buttonText: 'View Achievement',
    image: '/student-spotlight.jpg'
  },
  {
    id: 4,
    type: 'spotlight',
    title: 'Teacher Spotlight',
    teacher: 'Mrs. Banda - Physics',
    achievement: 'Innovative teaching methods increased class performance by 40%',
    buttonText: 'Learn More',
    image: '/teacher-spotlight.jpg'
  }
]

export default function PlatformShowcase() {
  const [activePortal, setActivePortal] = useState(portals[0])
  const [activeTipIndex, setActiveTipIndex] = useState(0)
  const [activeWidgetSlide, setActiveWidgetSlide] = useState(0)
  const [isHoveringWidget, setIsHoveringWidget] = useState(false)

  // Auto-rotate study tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % studyTips.length)
    }, 5000)

    return () => clearInterval(tipInterval)
  }, [])

  // Auto-rotate widget slides
  useEffect(() => {
    if (isHoveringWidget) return // Pause on hover

    const widgetInterval = setInterval(() => {
      setActiveWidgetSlide((prev) => (prev + 1) % widgetSlides.length)
    }, 6000)

    return () => clearInterval(widgetInterval)
  }, [isHoveringWidget])

  const currentTip = studyTips[activeTipIndex]
  const currentWidgetSlide = widgetSlides[activeWidgetSlide]
  const isEventSlide = currentWidgetSlide.type === 'event'
  const isFirstSlide = activeWidgetSlide === 0

  return (
    <section className="w-full py-16 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
            <FaStar className="text-[#0713FB] text-sm" />
            <span className="text-gray-700 text-sm font-medium">Student-Friendly Platform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Complete Educational <span className="text-[#0713FB]">Solutions</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Powerful portals designed for students, parents, teachers, and administrators.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-4">
              {portals.map((portal) => {
                const IconComponent = portal.icon
                const isActive = activePortal.id === portal.id
                
                return (
                  <button
                    key={portal.id}
                    onClick={() => setActivePortal(portal)}
                    className={`p-4 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-white shadow border-2 border-blue-200'
                        : 'bg-white hover:shadow border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        portal.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                      }`}>
                        <IconComponent className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {portal.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {portal.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active Portal Details */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activePortal.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                }`}>
                  <activePortal.icon className="text-white text-xl" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {activePortal.name}
                  </h3>
                  <p className="text-gray-600 text-xs">{activePortal.tagline}</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">Key Features</h4>
                  <div className="space-y-1">
                    {activePortal.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1 p-0">
                        <FaCheck className={`text-xs flex-shrink-0 ${
                          activePortal.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                        }`} />
                        <span className="text-gray-700 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-800 mb-2 text-sm">Student Benefits</h4>
                  <div className="space-y-1">
                    {activePortal.studentFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1 p-0">
                        <FaStar className="text-yellow-500 text-xs flex-shrink-0" />
                        <span className="text-gray-700 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/portals/${activePortal.id}`}
                  className={`flex-1 ${
                    activePortal.color === 'blue' 
                      ? 'bg-[#0713FB] hover:bg-blue-700' 
                      : 'bg-[#0EF117] hover:bg-green-600 text-gray-900'
                  } text-white py-2 rounded-lg text-center font-semibold transition-colors flex items-center justify-center space-x-1 text-sm`}
                >
                  <span>Get Started</span>
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  href="/demo"
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-center font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1 text-sm"
                >
                  <FaPlay className="text-xs" />
                  <span>Live Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Widgets */}
          <div className="space-y-6">
            {/* Animated Study Tips with Image Display */}
            <div 
              className="relative rounded-lg overflow-hidden bg-white border border-gray-200"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 transition-opacity duration-1000"
                style={{
                  backgroundImage: `url('${currentTip.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  opacity: 0.15
                }}
              />
              
              {/* Glass morph effect overlay */}
              <div className="relative backdrop-blur-sm bg-white/80 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center backdrop-blur-sm">
                    <FaBookOpen className="text-[#0713FB] text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Study Tip</h3>
                    <p className="text-gray-600 text-sm">Daily learning advice</p>
                  </div>
                </div>

                {/* Animated tip content */}
                <div 
                  key={currentTip.id}
                  className="bg-blue-50/50 backdrop-blur-sm rounded-lg p-4 mb-4 transition-all duration-700"
                  style={{
                    animation: 'fadeIn 0.7s ease-out'
                  }}
                >
                  <p className="text-gray-800 font-medium">
                    "{currentTip.tip}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#0713FB] font-medium text-sm">{currentTip.tag}</span>
                  <span className="text-gray-500 text-sm">{currentTip.number}</span>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center space-x-1 mt-4">
                  {studyTips.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        index === activeTipIndex 
                          ? 'bg-[#0713FB] w-4' 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>

            {/* Animated Widget Slideshow with Hover Control */}
            <div 
              className="relative rounded-lg overflow-hidden"
              onMouseEnter={() => {
                setIsHoveringWidget(true)
                if (!isFirstSlide) {
                  // Go back to first slide on hover if not already there
                  setActiveWidgetSlide(0)
                }
              }}
              onMouseLeave={() => setIsHoveringWidget(false)}
            >
              {/* Background Image with Crossfade */}
              <div className="absolute inset-0">
                {widgetSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="absolute inset-0 transition-opacity duration-1000"
                    style={{
                      backgroundImage: `url('${slide.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      opacity: index === activeWidgetSlide ? 0.45 : 0,
                      transitionDelay: '200ms'
                    }}
                  />
                ))}
                {/* Overlay for better clarity */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-white/30"></div>
              </div>

              {/* Glass morph effect overlay */}
              <div className={`relative p-6 text-white min-h-64 ${activeWidgetSlide === 0 ? 'bg-[#0EF117]' : 'bg-transparent'}`}>
                {/* Only show content for first slide */}
                {activeWidgetSlide === 0 && (
                  <div 
                    className="transition-all duration-700"
                    style={{
                      animation: 'slideIn 0.7s ease-out'
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                        <FaCalendarAlt className="text-gray-900 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Upcoming Event</h3>
                        <p className="text-gray-800">{currentWidgetSlide.title}</p>
                      </div>
                    </div>

                    <p className="text-gray-800 mb-3 font-medium">
                      {currentWidgetSlide.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-gray-800">
                        <span className="text-sm">📅 {currentWidgetSlide.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-800">
                        <span className="text-sm">📍 {currentWidgetSlide.location}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      {currentWidgetSlide.buttonText}
                    </button>
                  </div>
                )}

                {/* Slide progress indicator */}
                <div className="flex justify-center space-x-2 mt-6">
                  {widgetSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveWidgetSlide(index)}
                      className={`transition-all duration-300 ${
                        index === activeWidgetSlide 
                          ? 'bg-white w-6' 
                          : 'bg-white/40 w-1.5'
                      } h-1.5 rounded-full`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Hover indicator */}
                {!isFirstSlide && isHoveringWidget && (
                  <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                    Back to events
                  </div>
                )}
              </div>

              <style jsx>{`
                @keyframes slideIn {
                  from {
                    opacity: 0;
                    transform: translateX(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateX(0);
                  }
                }
              `}</style>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <div className="relative bg-gradient-to-r from-[#0713FB] to-blue-600 rounded-lg p-8 overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(/learning-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0713FB]/95 via-[#0713FB]/90 to-blue-600/95"></div>
            </div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Learning?</h3>
              <p className="text-blue-100 mb-6">Join thousands of students already enjoying their educational journey.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/signup"
                  className="bg-white text-[#0713FB] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign Up Free
                </Link>
                <Link
                  href="/tour"
                  className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Take a Tour
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}