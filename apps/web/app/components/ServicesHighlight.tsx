'use client'

import Link from 'next/link'
import { FaCheckCircle, FaGraduationCap, FaGlobe, FaUsers, FaTrophy, FaLaptop, FaArrowRight } from 'react-icons/fa'

const services = [
  {
    icon: FaTrophy,
    title: '100% Pass Rate',
    description: 'Our proven curriculum and teaching methods ensure consistent academic excellence.',
    color: 'blue',
    highlight: 'Guaranteed Success'
  },
  {
    icon: FaGlobe,
    title: 'Zambian & International Curriculum',
    description: 'Programs aligned with both Zambian standards and international education frameworks.',
    color: 'green',
    highlight: 'Global Standards'
  },
  {
    icon: FaGraduationCap,
    title: 'Flexible Learning',
    description: 'Choose between campus classes or virtual learning from anywhere in the world.',
    color: 'blue',
    highlight: 'Study Anywhere'
  },
  {
    icon: FaUsers,
    title: 'Easy Learning',
    description: 'Interactive lessons and supportive teachers make learning enjoyable and effective.',
    color: 'green',
    highlight: 'Student-Friendly'
  },
  {
    icon: FaLaptop,
    title: 'Parent Portal',
    description: 'Real-time progress monitoring, attendance tracking, and teacher communication.',
    color: 'blue',
    highlight: 'Stay Connected'
  },
  {
    icon: FaCheckCircle,
    title: 'Easy Enrollment',
    description: 'Simple process for local and international students with multiple program options.',
    color: 'green',
    highlight: 'Easy Start'
  }
]

export default function ServicesHighlight() {
  return (
    <section className="py-12 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#0713FB] rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">Why Choose Us</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            World-Class Education <span className="text-[#0713FB]">Made Simple</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for academic success with proven results.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Background Image with Stats */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden min-h-[400px]">
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/hero/classroom.jpg)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Begin Your Success Story?
                </h3>
                <p className="text-gray-200 mb-8 max-w-md">
                  Join thousands of students who have achieved their academic goals with our proven educational approach.
                </p>
              </div>

              {/* Compact Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-gray-300 text-sm">Pass Rate</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">5000+</div>
                  <div className="text-gray-300 text-sm">Students Enrolled</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-gray-300 text-sm">Student Support</div>
                </div>
                <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-gray-300 text-sm">Programs Offered</div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <Link
                  href="/enrollment"
                  className="inline-flex items-center justify-center w-full bg-[#0713FB] hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors space-x-2"
                >
                  <span>Start Your Journey</span>
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Services Grid */}
          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-lg p-5 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                    service.color === 'blue' 
                      ? 'bg-[#0713FB]' 
                      : 'bg-[#0EF117]'
                  }`}>
                    <IconComponent className="text-white text-base" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {service.description}
                  </p>
                  
                  {/* Highlight badge */}
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    service.color === 'blue' 
                      ? 'bg-blue-50 text-[#0713FB]' 
                      : 'bg-green-50 text-green-700'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span>{service.highlight}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/enrollment"
              className="inline-flex items-center justify-center bg-[#0713FB] hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors space-x-2 text-sm"
            >
              <FaCheckCircle className="text-sm" />
              <span>Enroll Today</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}