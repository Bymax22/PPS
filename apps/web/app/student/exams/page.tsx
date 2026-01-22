'use client'

import { useState, useEffect } from 'react'
import { FaClock, FaPlay, FaCheck, FaFileAlt, FaCalendar } from 'react-icons/fa'

interface Exam {
  id: string
  title: string
  class: string
  duration: number
  totalMarks: number
  startDate: string
  endDate: string
  status: 'upcoming' | 'in_progress' | 'completed' | 'missed'
  score?: number
  attempts: number
  maxAttempts: number
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming')

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/student/exams')
        const data = await response.json()
        setExams(data)
      } catch (error) {
        console.error('Error fetching exams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  const filteredExams = exams.filter(exam => 
    activeTab === 'upcoming' 
      ? exam.status === 'upcoming' || exam.status === 'in_progress'
      : exam.status === 'completed'
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'missed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0713FB]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams & Quizzes</h1>
          <p className="text-gray-600 mt-1">Test your knowledge and track your progress</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'border-[#0713FB] text-[#0713FB]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Exams
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completed'
                ? 'border-[#0713FB] text-[#0713FB]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed Exams
          </button>
        </div>

        <div className="p-6">
          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No {activeTab} exams
              </h3>
              <p className="text-gray-600">
                {activeTab === 'upcoming' 
                  ? 'You have no upcoming exams at the moment.' 
                  : 'You haven\'t completed any exams yet.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#0713FB] transition-colors"
                >
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{exam.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                        {exam.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <FaFileAlt className="text-gray-400" />
                        <span>{exam.class}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-gray-400" />
                        <span>{exam.duration} mins</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCheck className="text-gray-400" />
                        <span>{exam.totalMarks} marks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-gray-400" />
                        <span>{new Date(exam.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {exam.status === 'upcoming' && (
                      <div className="flex items-center space-x-2 mt-2 text-sm text-orange-600">
                        <FaClock />
                        <span>Closes in {getTimeRemaining(exam.endDate)}</span>
                      </div>
                    )}

                    {exam.status === 'completed' && exam.score !== undefined && (
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm font-medium text-gray-900">
                          Score: {exam.score}/{exam.totalMarks}
                        </div>
                        <div className="text-sm text-gray-600">
                          Attempts: {exam.attempts}/{exam.maxAttempts}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {exam.status === 'upcoming' && (
                      <button className="bg-[#0713FB] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#060EDB] transition-colors flex items-center space-x-2">
                        <FaPlay className="text-xs" />
                        <span>Start Exam</span>
                      </button>
                    )}
                    {exam.status === 'completed' && (
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}