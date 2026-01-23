'use client'

import { useState } from 'react'
import { 
  FaBook, 
  FaUsers, 
  FaChartBar, 
  FaTrophy, 
  FaComments, 
  FaCog,
  FaVideo,
  FaFileAlt,
  FaClipboardCheck,
  FaLaptop,
  FaUserFriends,
  FaComments as FaForum,
  FaChartLine,
  FaCheckCircle,
  FaFile,
  FaShieldAlt,
  FaStar,
  FaMedal,
  FaComment,
  FaBell,
  FaCalendarAlt,
  FaUser,
  FaMoneyBill,
  FaCalendar
} from 'react-icons/fa'

const features = [
  {
    category: 'Learning Management',
    icon: FaBook,
    color: 'blue',
    items: [
      {
        name: 'Interactive Materials',
        description: 'Videos, documents, quizzes with progress tracking',
        schemaRef: 'LearningMaterial, MaterialProgress',
        icon: FaVideo
      },
      {
        name: 'Assignment System',
        description: 'Create, submit, and grade assignments with feedback',
        schemaRef: 'Assignment, Submission',
        icon: FaFileAlt
      },
      {
        name: 'Exam Portal',
        description: 'Timed exams with multiple question types and auto-grading',
        schemaRef: 'Exam, ExamAttempt, ExamQuestion',
        icon: FaClipboardCheck
      }
    ]
  },
  {
    category: 'Collaboration Tools',
    icon: FaUsers,
    color: 'green',
    items: [
      {
        name: 'Virtual Classrooms',
        description: 'Live sessions with interactive whiteboards and breakout rooms',
        schemaRef: 'ClassSchedule, ChatRoom',
        icon: FaLaptop
      },
      {
        name: 'Study Groups',
        description: 'Collaborative learning with peer discussions',
        schemaRef: 'StudyGroup, StudyGroupMeeting',
        icon: FaUserFriends
      },
      {
        name: 'Discussion Forums',
        description: 'Subject-specific forums with Q&A capabilities',
        schemaRef: 'Forum, ForumPost, ForumReply',
        icon: FaForum
      }
    ]
  },
  {
    category: 'Progress & Analytics',
    icon: FaChartBar,
    color: 'blue',
    items: [
      {
        name: 'Real-time Progress',
        description: 'Track completion rates and performance metrics',
        schemaRef: 'StudentProgress, Grade',
        icon: FaChartLine
      },
      {
        name: 'Attendance System',
        description: 'Automated attendance tracking for live sessions',
        schemaRef: 'Attendance',
        icon: FaCheckCircle
      },
      {
        name: 'Performance Reports',
        description: 'Detailed analytics and insights for students and parents',
        schemaRef: 'Grade, StudentProgress',
        icon: FaFile
      }
    ]
  },
  {
    category: 'Gamification & Rewards',
    icon: FaTrophy,
    color: 'green',
    items: [
      {
        name: 'Badge System',
        description: 'Earn badges for achievements and milestones',
        schemaRef: 'Badge, StudentBadge',
        icon: FaShieldAlt
      },
      {
        name: 'XP & Leveling',
        description: 'Gain experience points and level up your learning',
        schemaRef: 'StudentXP, XPTransaction',
        icon: FaStar
      },
      {
        name: 'Leaderboards',
        description: 'Compete with peers in healthy academic challenges',
        schemaRef: 'StudentXP, Badge',
        icon: FaMedal
      }
    ]
  },
  {
    category: 'Communication',
    icon: FaComments,
    color: 'blue',
    items: [
      {
        name: 'Chat System',
        description: 'Real-time messaging between students and teachers',
        schemaRef: 'ChatRoom, ChatMessage',
        icon: FaComment
      },
      {
        name: 'Notification Center',
        description: 'Personalized alerts for assignments, grades, and announcements',
        schemaRef: 'Notification, UserNotification',
        icon: FaBell
      },
      {
        name: 'Parent-Teacher Meetings',
        description: 'Schedule and conduct virtual meetings',
        schemaRef: 'OfficeHour, OfficeHourAppointment',
        icon: FaCalendarAlt
      }
    ]
  },
  {
    category: 'Administrative',
    icon: FaCog,
    color: 'green',
    items: [
      {
        name: 'User Management',
        description: 'Comprehensive user profiles and role-based access',
        schemaRef: 'User, Profile, Student, Teacher, Parent, Admin',
        icon: FaUser
      },
      {
        name: 'Financial System',
        description: 'Fee management with multiple payment options',
        schemaRef: 'Subscription, Payment, Invoice',
        icon: FaMoneyBill
      },
      {
        name: 'Academic Planning',
        description: 'Curriculum management and class scheduling',
        schemaRef: 'Class, Enrollment, TeacherSchedule',
        icon: FaCalendar
      }
    ]
  }
]

export default function PortalFeatures() {
  const [activeCategory, setActiveCategory] = useState(features[0])

  return (
    <section className="w-full relative py-16 bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(/classroom-features.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/85 to-gray-900/80"></div>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-4">
            <span className="w-2 h-2 bg-[#0EF117] rounded-full"></span>
            <span className="text-sm font-semibold text-white">Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything Your Child Needs
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Comprehensive features built on a robust database schema designed for modern education.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Category Navigation */}
          <div className="lg:col-span-1 space-y-3">
            {features.map((category) => {
              const IconComponent = category.icon
              const isActive = activeCategory.category === category.category
              
              return (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-white shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`text-lg ${
                      isActive 
                        ? category.color === 'blue' ? 'text-[#0713FB]' : 'text-[#0EF117]'
                        : 'text-white'
                    }`} />
                    <span className={`font-semibold text-sm ${
                      isActive ? 'text-gray-900' : 'text-white'
                    }`}>
                      {category.category}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  activeCategory.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                }`}>
                  <activeCategory.icon className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeCategory.category}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Comprehensive tools for effective learning management
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategory.items.map((item, index) => {
                  const ItemIcon = item.icon
                  
                  return (
                    <div
                      key={index}
                      className="group p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activeCategory.color === 'blue' ? 'bg-[#0713FB]' : 'bg-[#0EF117]'
                        }`}>
                          <ItemIcon className="text-white text-sm" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {item.name}
                          </h4>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {item.schemaRef}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Schema Integration Note */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-2xl mx-auto">
            <div className="text-2xl text-[#0EF117]">💡</div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm">
                Built on Robust Database Architecture
              </div>
              <div className="text-gray-300 text-xs">
                All features are powered by our Bymax Zambia with real-time data synchronization
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}