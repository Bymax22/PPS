'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaCalculator, 
  FaFlask, 
  FaGraduationCap, 
  FaBook, 
  FaCheck, 
  FaUsers,
  FaChalkboardTeacher,
  FaChartLine,
  FaArrowRight,
  FaUserGraduate,
  FaBrain,
  FaHandsHelping
} from 'react-icons/fa'

const academicPrograms = [
  {
    level: 'Primary School',
    grades: 'Grade 1 - 7',
    age: '6-12 Years',
    icon: FaCalculator,
    color: 'blue',
    description: 'Building strong foundations in core subjects with interactive learning and character development',
    features: [
      'Interactive Learning Games',
      'Phonics & Reading Program',
      'Basic Mathematics Skills',
      'Creative Arts & Music',
      'Physical Education',
      'Social Skills Development'
    ],
    subjects: [
      { name: 'Mathematics', icon: FaCalculator, color: 'bg-blue-50 text-[#0713FB]' },
      { name: 'English', icon: FaBook, color: 'bg-green-50 text-[#0EF117]' },
      { name: 'Science', icon: FaFlask, color: 'bg-blue-50 text-[#0713FB]' },
      { name: 'Social Studies', icon: FaUsers, color: 'bg-green-50 text-[#0EF117]' },
      { name: 'Creative Arts', icon: FaGraduationCap, color: 'bg-blue-50 text-[#0713FB]' },
      { name: 'Physical Education', icon: FaChartLine, color: 'bg-green-50 text-[#0EF117]' }
    ],
    outcomes: [
      'Strong literacy and numeracy foundation',
      'Critical thinking skills',
      'Social and emotional development',
      'Creative expression abilities'
    ],
    stats: {
      students: '2,000+',
      successRate: '99%',
      teacherRatio: '1:15'
    },
    image: '/primary-school.jpg'
  },
  {
    level: 'Junior Secondary',
    grades: 'Grade 8 - 9',
    age: '13-14 Years',
    icon: FaFlask,
    color: 'green',
    description: 'Comprehensive curriculum preparing students for senior secondary with specialized subject exploration',
    features: [
      'Advanced Mathematics',
      'Laboratory Sciences',
      'Language Arts Enhancement',
      'Computer Studies',
      'Business Education',
      'Career Exploration'
    ],
    subjects: [
      { name: 'Mathematics', icon: FaCalculator, color: 'bg-blue-50 text-[#0713FB]' },
      { name: 'Integrated Science', icon: FaFlask, color: 'bg-green-50 text-[#0EF117]' },
      { name: 'English Language', icon: FaBook, color: 'bg-blue-50 text-[#0713FB]' },
      { name: 'Social Studies', icon: FaUsers, color: 'bg-green-50 text-[#0EF117]' },
      { name: 'Business Studies', icon: FaGraduationCap, color: 'bg-blue-50 text-[#0713FB]' },
      { name: 'Computer Studies', icon: FaChartLine, color: 'bg-green-50 text-[#0EF117]' }
    ],
    outcomes: [
      'Subject specialization awareness',
      'Research and project skills',
      'Digital literacy mastery',
      'Career pathway exploration'
    ],
    stats: {
      students: '1,500+',
      successRate: '98%',
      teacherRatio: '1:20'
    },
    image: '/junior-secondary.jpg'
  },
  {
    level: 'Senior Secondary',
    grades: 'Grade 10 - 12',
    age: '15-18 Years',
    icon: FaGraduationCap,
    color: 'blue',
    description: 'Specialized tracks for university preparation and career readiness with advanced academic rigor',
    features: [
      'University Preparation',
      'Career-focused Tracks',
      'Advanced Placement Options',
      'Research Projects',
      'Leadership Development',
      'Community Service'
    ],
    tracks: [
      {
        name: 'Science Track',
        icon: FaFlask,
        subjects: ['Physics', 'Chemistry', 'Biology', 'Advanced Mathematics'],
        color: 'blue'
      },
      {
        name: 'Arts Track',
        icon: FaBook,
        subjects: ['Literature', 'History', 'Geography', 'Arts'],
        color: 'green'
      },
      {
        name: 'Commercial Track',
        icon: FaChartLine,
        subjects: ['Accounts', 'Commerce', 'Economics', 'Business'],
        color: 'blue'
      },
      {
        name: 'Technical Track',
        icon: FaCalculator,
        subjects: ['Technical Drawing', 'Computer Science', 'Design', 'Technology'],
        color: 'green'
      }
    ],
    outcomes: [
      'University readiness',
      'Career specialization',
      'Leadership qualities',
      'Community engagement'
    ],
    stats: {
      students: '1,200+',
      successRate: '97%',
      teacherRatio: '1:18'
    },
    image: '/senior-secondary.jpg'
  }
]

export default function AcademicPrograms() {
  const [activeProgram, setActiveProgram] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const active = academicPrograms[activeProgram]
  const ActiveIcon = active.icon

  const handleProgramChange = (index: number) => {
    if (index === activeProgram) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveProgram(index)
      setIsTransitioning(false)
    }, 200)
  }

  return (
    <section className="w-full py-16 bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-[#0713FB] rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">Academic Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Structured Programs for <span className="text-[#0713FB]">Grade 1-12</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Progressive curriculum designed to nurture intellectual growth and prepare students for success.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {/* Program Navigation - Vertical Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-2">
              {academicPrograms.map((program, index) => {
                const IconComponent = program.icon
                const isActive = activeProgram === index
                
                return (
                  <button
                    key={index}
                    onClick={() => handleProgramChange(index)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-200 mb-2 last:mb-0 ${
                      isActive
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive || program.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                      }`}>
                        <IconComponent className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-1">
                          {program.level}
                        </h3>
                        <div className="text-xs">
                          <div className="text-[#0713FB] font-semibold">
                            {program.grades}
                          </div>
                          <div className="text-gray-500">
                            {program.age}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Quick Stats Sidebar */}
            <div className="mt-6 bg-gradient-to-br from-[#0713FB] to-blue-600 rounded-xl p-5 text-white">
              <h3 className="font-bold text-lg mb-4">Program Highlights</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FaUserGraduate className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{active.stats.students}</div>
                    <div className="text-white/80 text-sm">Active Students</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FaCheck className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{active.stats.successRate}</div>
                    <div className="text-white/80 text-sm">Success Rate</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <FaChalkboardTeacher className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{active.stats.teacherRatio}</div>
                    <div className="text-white/80 text-sm">Teacher Ratio</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header with Image */}
              <div className="relative h-48 sm:h-56 bg-gray-900">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                  style={{ 
                    backgroundImage: `url(${active.image})`,
                    opacity: isTransitioning ? 0.7 : 1
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
                </div>
                <div className="relative z-10 h-full flex items-center p-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        active.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                      }`}>
                        <ActiveIcon className="text-white text-lg" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {active.level}
                        </h3>
                        <div className="text-blue-100 font-medium">
                          {active.grades} • {active.age}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-200 max-w-xl">
                      {active.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Key Features */}
                    <div className={`transition-opacity duration-300 ${
                      isTransitioning ? 'opacity-50' : 'opacity-100'
                    }`}>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          active.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                        }`}></div>
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {active.features.map((feature, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                          >
                            <FaCheck className={`text-xs ${
                              active.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                            }`} />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Core Subjects */}
                    {active.subjects && (
                      <div className={`transition-opacity duration-300 ${
                        isTransitioning ? 'opacity-50' : 'opacity-100'
                      }`}>
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            active.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                          }`}></div>
                          Core Subjects
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {active.subjects.map((subject, index) => {
                            const SubjectIcon = subject.icon
                            return (
                              <div 
                                key={index} 
                                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`w-8 h-8 rounded flex items-center justify-center ${subject.color}`}>
                                    <SubjectIcon className="text-sm" />
                                  </div>
                                  <span className="font-medium text-gray-700 text-sm">{subject.name}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Specialization Tracks (for Senior Secondary) */}
                    {active.tracks && (
                      <div className={`transition-opacity duration-300 ${
                        isTransitioning ? 'opacity-50' : 'opacity-100'
                      }`}>
                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            active.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                          }`}></div>
                          Specialization Tracks
                        </h4>
                        <div className="space-y-3">
                          {active.tracks.map((track, index) => {
                            const TrackIcon = track.icon
                            return (
                              <div
                                key={index}
                                className="p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors group"
                              >
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    track.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                                  } group-hover:scale-110 transition-transform`}>
                                    <TrackIcon className="text-white text-sm" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">
                                      {track.name}
                                    </h5>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {track.subjects.slice(0, 2).map((subject, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                        >
                                          {subject}
                                        </span>
                                      ))}
                                      {track.subjects.length > 2 && (
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                                          +{track.subjects.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    <div className={`transition-opacity duration-300 ${
                      isTransitioning ? 'opacity-50' : 'opacity-100'
                    }`}>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          active.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                        }`}></div>
                        Learning Outcomes
                      </h4>
                      <div className="space-y-2">
                        {active.outcomes.map((outcome, index) => (
                          <div 
                            key={index} 
                            className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <FaBrain className={`text-sm ${
                              active.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                            }`} />
                            <span className="text-gray-700 text-sm">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href={`/programs/${active.level.toLowerCase().replace(' ', '-')}`}
                    className={`flex-1 ${
                      active.color === 'blue' 
                        ? 'bg-[#0713FB] hover:bg-blue-700' 
                        : 'bg-[#0EF117] hover:bg-green-600 text-gray-900'
                    } text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2`}
                  >
                    <span>Explore {active.level}</span>
                    <FaArrowRight className="text-sm" />
                  </Link>
                  <Link
                    href="/schedule-tour"
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FaHandsHelping className="text-sm" />
                    <span>Schedule Tour</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Highlights */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#0713FB] rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Comprehensive Curriculum</h4>
                <p className="text-gray-600 text-sm">Aligned with modern teaching methodologies</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#0EF117] rounded-lg flex items-center justify-center">
                <FaChalkboardTeacher className="text-white text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Expert Faculty</h4>
                <p className="text-gray-600 text-sm">Qualified teachers with advanced training</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-[#0713FB] rounded-lg flex items-center justify-center">
                <FaChartLine className="text-white text-lg" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Proven Results</h4>
                <p className="text-gray-600 text-sm">Consistent 98%+ pass rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}