'use client'

import { useState } from 'react'
import { 
  FaGraduationCap, 
  FaLaptop, 
  FaUsers, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock,
  FaCheckCircle,
  FaWifi,
  FaHandsHelping,
  FaBookOpen,
  FaChalkboardTeacher,
  FaArrowRight
} from 'react-icons/fa'

const learningOptions = [
  {
    id: 'physical',
    name: 'Physical Campus',
    icon: FaGraduationCap,
    color: 'blue',
    tagline: 'Traditional Learning Experience',
    description: 'Learn in our modern campus with face-to-face interaction and hands-on activities',
    features: [
      { icon: FaUsers, text: 'In-person teacher guidance', highlight: true },
      { icon: FaMapMarkerAlt, text: 'Modern campus facilities' },
      { icon: FaHandsHelping, text: 'Direct peer collaboration' },
      { icon: FaBookOpen, text: 'Physical library access' },
      { icon: FaChalkboardTeacher, text: 'Lab & practical sessions' },
      { icon: FaCalendarAlt, text: 'Structured daily schedule' }
    ],
    benefits: [
      'Immediate teacher feedback',
      'Social interaction skills',
      'Hands-on learning activities',
      'Campus events & clubs'
    ],
    stats: {
      capacity: '1,000 Students',
      classes: '25+ Classrooms',
      labs: '8 Science Labs',
      ratio: '1:15 Teacher Ratio'
    },
    image: '/campus-view.jpg'
  },
  {
    id: 'virtual',
    name: 'Virtual Learning',
    icon: FaLaptop,
    color: 'green',
    tagline: 'Flexible Online Education',
    description: 'Access quality education from anywhere with our interactive virtual platform',
    features: [
      { icon: FaWifi, text: 'Live interactive classes', highlight: true },
      { icon: FaClock, text: 'Flexible learning hours' },
      { icon: FaLaptop, text: 'Recorded lesson access' },
      { icon: FaBookOpen, text: 'Digital library resources' },
      { icon: FaUsers, text: 'Virtual study groups' },
      { icon: FaCalendarAlt, text: 'Self-paced learning' }
    ],
    benefits: [
      'Learn from anywhere',
      'Save commute time',
      'Access global resources',
      'Personalized pace'
    ],
    stats: {
      capacity: 'Unlimited Access',
      classes: '24/7 Availability',
      labs: 'Virtual Labs',
      ratio: '1:1 Support Available'
    },
    image: '/virtual-class.jpg'
  }
]

export default function LearningOptions() {
  const [activeOption, setActiveOption] = useState('physical')
  const currentOption = learningOptions.find(opt => opt.id === activeOption) || learningOptions[0]
  const IconComponent = currentOption.icon

  return (
    <section className="w-full py-16 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#0713FB] rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">Choose Your Path</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Physical Campus or <span className="text-[#0713FB]">Virtual Learning</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the learning method that best fits your lifestyle and educational needs
          </p>
        </div>

        {/* Option Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            {learningOptions.map((option) => {
              const OptionIcon = option.icon
              const isActive = activeOption === option.id
              
              return (
                <button
                  key={option.id}
                  onClick={() => setActiveOption(option.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? option.color === 'blue' 
                        ? 'bg-[#0713FB] text-white shadow-md' 
                        : 'bg-[#0EF117] text-gray-900 shadow-md'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <OptionIcon className="text-lg" />
                  <span className="font-semibold">{option.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Image & Stats */}
          <div>
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden mb-6 h-64">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentOption.image})` }}
              >
                <div className={`absolute inset-0 ${
                  currentOption.color === 'blue' 
                    ? 'bg-gradient-to-t from-[#0713FB]/50 to-transparent' 
                    : 'bg-gradient-to-t from-[#0EF117]/50 to-transparent'
                }`}></div>
                <div className="absolute bottom-4 left-4">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                    currentOption.color === 'blue' 
                      ? 'bg-[#0713FB]/80 text-white' 
                      : 'bg-[#0EF117]/80 text-gray-900'
                  }`}>
                    <IconComponent />
                    <span className="font-bold">{currentOption.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <FaCheckCircle className={`mr-2 ${
                  currentOption.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                }`} />
                Key Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(currentOption.stats).map(([key, value]) => (
                  <div key={key} className="text-center p-3 bg-white rounded-lg border border-gray-200">
                    <div className={`text-lg font-bold ${
                      currentOption.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                    }`}>
                      {value}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Features & Benefits */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentOption.tagline}</h3>
              <p className="text-gray-600">{currentOption.description}</p>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Key Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentOption.features.map((feature, index) => {
                  const FeatureIcon = feature.icon
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        feature.highlight
                          ? currentOption.color === 'blue'
                            ? 'border-[#0713FB] bg-blue-50'
                            : 'border-[#0EF117] bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        feature.highlight
                          ? currentOption.color === 'blue'
                            ? 'bg-[#0713FB] text-white'
                            : 'bg-[#0EF117] text-gray-900'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <FeatureIcon className="text-sm" />
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Student Benefits</h4>
              <div className="space-y-2">
                {currentOption.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      currentOption.color === 'blue' 
                        ? 'bg-blue-100 text-[#0713FB]' 
                        : 'bg-green-100 text-[#0EF117]'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                currentOption.color === 'blue'
                  ? 'bg-[#0713FB] hover:bg-blue-700 text-white'
                  : 'bg-[#0EF117] hover:bg-green-600 text-gray-900'
              } flex items-center justify-center space-x-2`}>
                <span>Learn More About {currentOption.name}</span>
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Compare Learning Options
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 px-4 text-gray-600 font-semibold">Features</th>
                  <th className="text-center py-3 px-4 text-[#0713FB] font-bold">Physical Campus</th>
                  <th className="text-center py-3 px-4 text-[#0EF117] font-bold">Virtual Learning</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Learning Environment</td>
                  <td className="py-3 px-4 text-center">Traditional Classroom</td>
                  <td className="py-3 px-4 text-center">Anywhere with Internet</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Class Schedule</td>
                  <td className="py-3 px-4 text-center">Fixed Timetable</td>
                  <td className="py-3 px-4 text-center">Flexible Hours</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Teacher Interaction</td>
                  <td className="py-3 px-4 text-center">Face-to-face</td>
                  <td className="py-3 px-4 text-center">Virtual Meetings</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Resources Access</td>
                  <td className="py-3 px-4 text-center">Physical & Digital</td>
                  <td className="py-3 px-4 text-center">Digital Only</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium text-gray-700">Peer Collaboration</td>
                  <td className="py-3 px-4 text-center">In-person Groups</td>
                  <td className="py-3 px-4 text-center">Virtual Groups</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-gray-700">Best For</td>
                  <td className="py-3 px-4 text-center">Local Students</td>
                  <td className="py-3 px-4 text-center">Remote Students</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Hybrid Option */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#0713FB] to-[#0EF117] text-white px-6 py-4 rounded-xl">
            <FaCheckCircle className="text-xl" />
            <div className="text-left">
              <h4 className="font-bold text-lg">Hybrid Learning Available</h4>
              <p className="text-white/90 text-sm">Combine both physical and virtual learning for maximum flexibility</p>
            </div>
            <button className="ml-4 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn About Hybrid
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}