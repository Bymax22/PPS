'use client'

import { useState } from 'react'
import { FaFileAlt, FaFlask, FaBook, FaArrowRight, FaCheck, FaChartLine, FaUsers, FaStar, FaPlay } from 'react-icons/fa'
import Image from 'next/image'

const learningTools = [
  {
    id: 1,
    category: 'Assignments & Submissions',
    icon: FaFileAlt,
    color: 'blue',
    features: [
      {
        name: 'Assignment Creation',
        description: 'Teachers create assignments with attachments, due dates, and rubrics',
        stats: '500+ Monthly',
        highlight: true
      },
      {
        name: 'Digital Submissions',
        description: 'Students submit work online with file upload and text editor',
        stats: '98% On-time'
      },
      {
        name: 'Grading & Feedback',
        description: 'Teachers grade with rubrics and provide detailed feedback',
        stats: '24h Avg Response'
      },
      {
        name: 'Plagiarism Check',
        description: 'Built-in plagiarism detection and originality reports',
        stats: '99% Accuracy'
      }
    ],
    image: '/assignment-dashboard.jpg',
    tagline: 'Streamline workflow with digital assignment management'
  },
  {
    id: 2,
    category: 'Exams & Assessments',
    icon: FaFlask,
    color: 'green',
    features: [
      {
        name: 'Exam Builder',
        description: 'Create exams with multiple question types and time limits',
        stats: '50+ Templates',
        highlight: true
      },
      {
        name: 'Auto-Grading',
        description: 'Automatic grading for multiple choice and true/false questions',
        stats: 'Instant Results'
      },
      {
        name: 'Progress Analytics',
        description: 'Detailed performance analysis and improvement suggestions',
        stats: 'Real-time Updates'
      },
      {
        name: 'Secure Testing',
        description: 'Proctored exams with browser lockdown and monitoring',
        stats: '100% Secure'
      }
    ],
    image: '/exam-platform.jpg',
    tagline: 'Comprehensive assessment tools for accurate evaluation'
  },
  {
    id: 3,
    category: 'Learning Materials',
    icon: FaBook,
    color: 'blue',
    features: [
      {
        name: 'Multi-format Content',
        description: 'Videos, PDFs, presentations, and interactive content',
        stats: '10K+ Resources',
        highlight: true
      },
      {
        name: 'Progress Tracking',
        description: 'Track completion and time spent on each material',
        stats: '85% Avg Completion'
      },
      {
        name: 'Download & Offline',
        description: 'Access materials offline with sync capabilities',
        stats: 'Mobile Friendly'
      },
      {
        name: 'Interactive Content',
        description: 'Engaging interactive lessons and simulations',
        stats: '70% Better Retention'
      }
    ],
    image: '/learning-materials.jpg',
    tagline: 'Rich educational content accessible anytime, anywhere'
  }
]

export default function LearningTools() {
  const [activeCategory, setActiveCategory] = useState(0)
  const activeTool = learningTools[activeCategory]
  const ActiveIcon = activeTool.icon

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#0713FB] rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">Advanced Learning Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive <span className="text-[#0713FB]">Assessment Suite</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to enhance teaching effectiveness and student learning outcomes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Category Navigation with Images */}
          <div className="lg:col-span-2">
            {/* Large Featured Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 h-64 lg:h-80">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url(${activeTool.image})` }}
              >
                <div className={`absolute inset-0 ${
                  activeTool.color === 'blue' 
                    ? 'bg-gradient-to-r from-[#0713FB]/70 to-transparent' 
                    : 'bg-gradient-to-r from-[#0EF117]/70 to-transparent'
                }`}></div>
              </div>
              
              {/* Image Overlay Content */}
              <div className="relative z-10 h-full flex items-end p-6">
                <div>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm mb-3 ${
                    activeTool.color === 'blue' 
                      ? 'bg-[#0713FB]/80 text-white' 
                      : 'bg-[#0EF117]/80 text-gray-900'
                  }`}>
                    <ActiveIcon />
                    <span className="font-bold">{activeTool.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{activeTool.tagline}</h3>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {activeTool.features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`group bg-white rounded-xl p-5 border transition-all duration-300 hover:shadow-lg ${
                    feature.highlight 
                      ? activeTool.color === 'blue'
                        ? 'border-[#0713FB] shadow-sm' 
                        : 'border-[#0EF117] shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{feature.name}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                    {feature.highlight && (
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        activeTool.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                      }`}></div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className={`text-lg font-bold ${
                      activeTool.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                    }`}>
                      {feature.stats}
                    </div>
                    <button className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                      activeTool.color === 'blue' 
                        ? 'bg-blue-50 text-[#0713FB] hover:bg-blue-100' 
                        : 'bg-green-50 text-[#0EF117] hover:bg-green-100'
                    }`}>
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Selector Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tool Categories</h3>
              <div className="space-y-2">
                {learningTools.map((tool, index) => {
                  const IconComponent = tool.icon
                  const isActive = activeCategory === index
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveCategory(index)}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                        isActive
                          ? tool.color === 'blue'
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-green-50 border border-green-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isActive
                            ? tool.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                            : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`text-sm ${
                            isActive ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-bold ${
                            isActive ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {tool.category}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {tool.features.length} features
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#0713FB] to-blue-600 rounded-xl p-5 text-white">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <FaChartLine className="mr-2" />
                Platform Statistics
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Active Users</span>
                  <span className="font-bold">5,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Assignments Created</span>
                  <span className="font-bold">500+ monthly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Success Rate</span>
                  <span className="font-bold text-[#0EF117]">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Satisfaction</span>
                  <span className="font-bold">4.8/5</span>
                </div>
              </div>
            </div>

            {/* Demo CTA */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FaPlay className="text-[#0713FB] text-lg" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Live Demo</h4>
                  <p className="text-gray-600 text-sm">See it in action</p>
                </div>
              </div>
              <button className="w-full bg-[#0713FB] text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}