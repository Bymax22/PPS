'use client'

import { useState, useEffect } from 'react'
import { FaPlay, FaUsers, FaFileAlt, FaRocket, FaPhone, FaCheck, FaCalendarAlt, FaArrowRight, FaStar, FaGraduationCap, FaMapMarkerAlt, FaClock, FaBookOpen, FaChartLine } from 'react-icons/fa'

const enrollmentSteps = [
  {
    step: 1,
    title: 'Schedule Demo',
    description: 'Experience our platform with a personalized tour and see live classes in action',
    icon: FaPlay,
    duration: '30 mins',
    color: 'blue'
  },
  {
    step: 2,
    title: 'Meet Advisor',
    description: 'Discuss academic goals and get customized program recommendations',
    icon: FaUsers,
    duration: '45 mins',
    color: 'green'
  },
  {
    step: 3,
    title: 'Enroll Online',
    description: 'Complete registration and secure payment in our protected portal',
    icon: FaFileAlt,
    duration: '15 mins',
    color: 'blue'
  },
  {
    step: 4,
    title: 'Start Learning',
    description: 'Access your learning dashboard and begin your educational journey',
    icon: FaRocket,
    duration: 'Instant Access',
    color: 'green'
  }
]

export default function CTASection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Auto-rotate steps
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % enrollmentSteps.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isHovering])

  const currentStep = enrollmentSteps[activeStep]

  return (
    <section className="w-full relative py-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/campus-background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/90"></div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full shadow-lg border border-gray-200 mb-6">
            <FaStar className="text-[#0713FB] text-sm" />
            <span className="text-sm font-semibold text-gray-700">Begin Your Academic Journey</span>
            <FaStar className="text-[#0713FB] text-sm" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Transform Education 
            <span className="block text-[#0713FB]">Experience Today</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join 5,000+ successful students with our proven 100% pass rate and flexible learning options.
          </p>
        </div>

        {/* Main Content with Campus Map */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Steps & Map */}
          <div className="space-y-6">
            {/* Interactive Steps */}
            <div 
              className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  4-Step Enrollment Process
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500">Auto-rotate</div>
                  <div className={`w-2 h-2 rounded-full ${isHovering ? 'bg-gray-300' : 'bg-[#0EF117] animate-pulse'}`}></div>
                </div>
              </div>

              {/* Steps Progress */}
              <div className="relative mb-8">
                {/* Progress Line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-full transition-all duration-500"
                    style={{ width: `${((activeStep + 1) / enrollmentSteps.length) * 100}%` }}
                  ></div>
                </div>

                {/* Steps Indicators */}
                <div className="relative flex justify-between">
                  {enrollmentSteps.map((step, index) => {
                    const IconComponent = step.icon
                    const isActive = index === activeStep
                    const isCompleted = index < activeStep
                    
                    return (
                      <button
                        key={step.step}
                        onClick={() => setActiveStep(index)}
                        className="flex flex-col items-center relative z-10 group"
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 mb-2 ${
                          isActive 
                            ? step.color === 'blue' 
                              ? 'bg-[#0713FB] shadow-lg ring-4 ring-[#0713FB]/20 scale-110' 
                              : 'bg-[#0EF117] shadow-lg ring-4 ring-[#0EF117]/20 scale-110'
                            : isCompleted
                              ? 'bg-gradient-to-r from-[#0713FB] to-[#0EF117] shadow-md'
                              : 'bg-gray-100 border-2 border-gray-300 group-hover:border-gray-400'
                        }`}>
                          {isCompleted ? (
                            <FaCheck className="text-white text-base" />
                          ) : (
                            <IconComponent className={`text-base ${
                              isActive ? 'text-white' : 'text-gray-600'
                            }`} />
                          )}
                        </div>
                        <span className={`text-xs font-semibold ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          Step {step.step}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Active Step Details */}
              <div 
                key={activeStep}
                className="transition-all duration-300"
              >
                <div className={`p-5 rounded-xl border ${
                  currentStep.color === 'blue' 
                    ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-white' 
                    : 'border-green-200 bg-gradient-to-r from-green-50 to-white'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-md ${
                      currentStep.color === 'blue' 
                        ? 'bg-[#0713FB]' 
                        : 'bg-[#0EF117]'
                    }`}>
                      <currentStep.icon className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-gray-900">
                          {currentStep.title}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          currentStep.color === 'blue' 
                            ? 'bg-[#0713FB] text-white' 
                            : 'bg-[#0EF117] text-gray-900'
                        }`}>
                          {currentStep.duration}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {currentStep.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Map */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-[#0713FB] rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Campus Location</h3>
                  <p className="text-gray-600 text-sm">Lusaka, Zambia</p>
                </div>
              </div>
              
              {/* Map Visualization */}
              <div className="relative bg-gray-100 rounded-xl p-4 h-48 overflow-hidden">
                {/* Simplified Map */}
                <div className="absolute inset-4 border-2 border-gray-300 rounded-lg">
                  {/* Map Features */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-[#0713FB] rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <div className="absolute top-12 left-12 w-6 h-6 bg-blue-200 rounded"></div>
                  <div className="absolute top-8 right-8 w-6 h-6 bg-green-200 rounded"></div>
                  <div className="absolute bottom-8 left-12 w-6 h-6 bg-yellow-200 rounded"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-[#0EF117] rounded-full flex items-center justify-center">
                    <FaBookOpen className="text-white text-sm" />
                  </div>
                  
                  {/* Path Lines */}
                  <div className="absolute top-8 left-8 w-24 h-0.5 bg-gray-400 rotate-45"></div>
                  <div className="absolute top-12 left-16 w-16 h-0.5 bg-gray-400"></div>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-[#0713FB] rounded-full"></div>
                    <span>Main Entrance</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-3 h-3 bg-[#0EF117] rounded-full"></div>
                    <span>Library</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <button className="inline-flex items-center space-x-2 text-[#0713FB] font-semibold hover:text-blue-700 transition-colors">
                  <span>View Campus Tour</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: CTA & Stats */}
          <div className="space-y-6">
            {/* Main CTA Card */}
            <div className="bg-gradient-to-br from-[#0713FB] to-blue-600 rounded-2xl p-8 text-white overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl mb-4 mx-auto">
                    <FaGraduationCap />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Start Your Free Trial
                  </h3>
                  <p className="text-blue-100">
                    Experience premium education with zero commitment
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: FaBookOpen, text: 'Full curriculum access' },
                    { icon: FaPlay, text: 'Live & recorded classes' },
                    { icon: FaChartLine, text: 'Progress tracking' },
                    { icon: FaClock, text: '24/7 learning access' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                      <feature.icon className="text-[#0EF117]" />
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="group w-full bg-white text-gray-900 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]">
                    <span>Start 14-Day Free Trial</span>
                    <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group w-full border-2 border-white text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                    <FaCalendarAlt className="text-sm" />
                    <span>Schedule Campus Visit</span>
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-white/20 text-center">
                  <p className="text-blue-100 text-sm">
                    Trusted by 5,000+ Zambian families
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Banner */}
        <div className="relative bg-gradient-to-r from-gray-900 to-black rounded-2xl overflow-hidden">
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(/campus-background.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/98 via-gray-900/95 to-gray-900/98"></div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 30px 30px, white 2%, transparent 0%)',
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          <div className="relative z-10 p-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Limited Enrollment Period Open
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Secure your child's future with world-class Zambian education. Spaces fill quickly!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center space-x-2">
                <span>Enroll Now - Limited Spots</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center space-x-2">
                <FaPhone className="text-sm" />
                <span>Call Admissions: +260 973 981 498</span>
              </button>
            </div>
            
            {/* Trust Badge */}
            <div className="mt-8 pt-6 border-t border-gray-800 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <FaCheck className="text-[#0EF117]" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <FaCheck className="text-[#0EF117]" />
                <span>Flexible Payment Options</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-700"></div>
              <div className="flex items-center space-x-2">
                <FaCheck className="text-[#0EF117]" />
                <span>International Accreditation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}