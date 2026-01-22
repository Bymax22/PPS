'use client'

import { useState } from 'react'
import { FaChartBar, FaComments, FaMoneyBill, FaUser, FaCheck, FaBell, FaCalendarAlt, FaFileInvoice, FaMobileAlt, FaDownload, FaPlay, FaArrowRight } from 'react-icons/fa'

const parentFeatures = [
  {
    category: 'Progress Monitoring',
    icon: FaChartBar,
    color: 'green',
    description: 'Track academic performance in real-time with detailed analytics',
    features: [
      {
        name: 'Real-time Grades',
        description: 'Instant access to assignment scores and exam results as they are published',
        update: 'Live Updates',
        highlight: true
      },
      {
        name: 'Attendance Tracking',
        description: 'Monitor class attendance and participation rates daily',
        accuracy: '100% Accurate',
        highlight: false
      },
      {
        name: 'Performance Analytics',
        description: 'Detailed insights into learning patterns and academic progress trends',
        reports: 'Weekly Summaries',
        highlight: false
      },
      {
        name: 'Grade Predictions',
        description: 'AI-powered predictions based on current performance patterns',
        technology: 'AI Analytics',
        highlight: false
      }
    ],
    image: '/parent-progress.jpg'
  },
  {
    category: 'Communication',
    icon: FaComments,
    color: 'blue',
    description: 'Stay connected with teachers and school administration',
    features: [
      {
        name: 'Teacher Messaging',
        description: 'Direct encrypted messaging with subject teachers and tutors',
        response: '< 24 hours',
        highlight: true
      },
      {
        name: 'School Announcements',
        description: 'Important updates, event notifications, and emergency alerts',
        delivery: 'Instant Push',
        highlight: false
      },
      {
        name: 'Meeting Scheduling',
        description: 'Book parent-teacher meetings online with calendar integration',
        convenience: '24/7 Booking',
        highlight: false
      },
      {
        name: 'Group Discussions',
        description: 'Participate in class and school-wide parent discussions',
        engagement: 'Active Community',
        highlight: false
      }
    ],
    image: '/parent-communication.jpg'
  },
  {
    category: 'Financial Management',
    icon: FaMoneyBill,
    color: 'green',
    description: 'Manage school finances securely from one dashboard',
    features: [
      {
        name: 'Fee Payments',
        description: 'Secure online payments with multiple Zambian payment options',
        methods: 'Airtel, MTN, Zanaco, Zoona',
        highlight: true
      },
      {
        name: 'Payment History',
        description: 'Complete transaction records, receipts, and payment schedules',
        records: 'Lifetime History',
        highlight: false
      },
      {
        name: 'Subscription Management',
        description: 'Manage plans, auto-renewal settings, and payment methods',
        control: 'Full Control',
        highlight: false
      },
      {
        name: 'Invoice Generation',
        description: 'Generate and download official invoices and payment receipts',
        documents: 'Official Receipts',
        highlight: false
      }
    ],
    image: '/parent-finance.jpg'
  }
]

export default function ParentFeatures() {
  const [activeCategory, setActiveCategory] = useState<number>(0)
  const [selectedFeature, setSelectedFeature] = useState(0)
  
  const currentCategory = parentFeatures[activeCategory]
  const IconComponent = currentCategory.icon
  const currentFeature = currentCategory.features[selectedFeature]

  return (
    <section className="py-16 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#0713FB] rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">Parent Portal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Stay <span className="text-[#0713FB]">Connected</span> & <span className="text-[#0EF117]">Informed</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools for Zambian parents to monitor progress, communicate with teachers, and manage school activities.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Feature Showcase */}
          <div>
            {/* Category Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {parentFeatures.map((category, index) => (
                <button
                  key={category.category}
                  onClick={() => {
                    setActiveCategory(index)
                    setSelectedFeature(0)
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    activeCategory === index
                      ? category.color === 'blue' 
                        ? 'bg-[#0713FB] text-white shadow-md' 
                        : 'bg-[#0EF117] text-gray-900 shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <category.icon />
                  <span>{category.category}</span>
                </button>
              ))}
            </div>

            {/* Feature Details with Image Background */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentCategory.image})` }}
              >
                <div className={`absolute inset-0 ${
                  currentCategory.color === 'blue' 
                    ? 'bg-gradient-to-r from-[#0713FB]/80 to-blue-600/80' 
                    : 'bg-gradient-to-r from-[#0EF117]/80 to-green-600/80'
                }`}></div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{currentCategory.category}</h3>
                    <p className="text-white/90">{currentCategory.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Selection */}
            <div className="grid grid-cols-2 gap-3">
              {currentCategory.features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFeature(index)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                    selectedFeature === index
                      ? currentCategory.color === 'blue'
                        ? 'border-[#0713FB] bg-blue-50 shadow-sm' 
                        : 'border-[#0EF117] bg-green-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900 text-sm">{feature.name}</h4>
                    {feature.highlight && (
                      <div className={`w-2 h-2 rounded-full ${
                        currentCategory.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                      }`}></div>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mb-2">{feature.description}</p>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                    currentCategory.color === 'blue'
                      ? 'bg-blue-100 text-[#0713FB]' 
                      : 'bg-green-100 text-[#0EF117]'
                  }`}>
                    {feature.update || feature.response || feature.methods}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Image Showcase */}
          <div className="flex items-center justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-[500px]">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url(${currentCategory.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Image Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-end p-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentCategory.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                    }`}>
                      <IconComponent className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{currentCategory.category}</h3>
                      <p className="text-gray-600 text-xs">{currentFeature?.name || 'Select a feature'}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {currentFeature?.description || currentCategory.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}