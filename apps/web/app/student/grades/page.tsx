'use client'

import { useState, useEffect } from 'react'
import { FaChartLine, FaCalendar, FaCheck, FaTimes, FaClock } from 'react-icons/fa'

interface Grade {
  id: string
  class: string
  assignment: string
  grade: number
  maxGrade: number
  weight: number
  gradedAt: string
  comments?: string
}

interface Attendance {
  id: string
  class: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  sessionType: string
  duration?: number
}

interface ClassSummary {
  class: string
  averageGrade: number
  attendanceRate: number
  totalAssignments: number
  completedAssignments: number
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [classSummaries, setClassSummaries] = useState<ClassSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [activeClass, setActiveClass] = useState<string>('all')

  useEffect(() => {
    const fetchGradesData = async () => {
      try {
        const [gradesResponse, attendanceResponse, summariesResponse] = await Promise.all([
          fetch('/api/student/grades'),
          fetch('/api/student/attendance'),
          fetch('/api/student/class-summaries')
        ])
        
        const gradesData = await gradesResponse.json()
        const attendanceData = await attendanceResponse.json()
        const summariesData = await summariesResponse.json()
        
        setGrades(gradesData)
        setAttendance(attendanceData)
        setClassSummaries(summariesData)
      } catch (error) {
        console.error('Error fetching grades data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGradesData()
  }, [])

  const filteredGrades = activeClass === 'all' 
    ? grades 
    : grades.filter(grade => grade.class === activeClass)

  const filteredAttendance = activeClass === 'all'
    ? attendance
    : attendance.filter(record => record.class === activeClass)

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-600 bg-green-100'
      case 'ABSENT': return 'text-red-600 bg-red-100'
      case 'LATE': return 'text-orange-600 bg-orange-100'
      case 'EXCUSED': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <FaCheck className="text-green-600" />
      case 'ABSENT': return <FaTimes className="text-red-600" />
      case 'LATE': return <FaClock className="text-orange-600" />
      case 'EXCUSED': return <FaCheck className="text-blue-600" />
      default: return <FaCheck className="text-gray-600" />
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades & Attendance</h1>
        <p className="text-gray-600 mt-1">Track your academic performance and attendance</p>
      </div>

      {/* Class Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {classSummaries.map((summary, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:border-[#0713FB] transition-colors"
            onClick={() => setActiveClass(summary.class)}
          >
            <h3 className="font-semibold text-gray-900 mb-2">{summary.class}</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Grade</span>
                <span className={`font-medium ${getGradeColor(summary.averageGrade, 100)}`}>
                  {summary.averageGrade}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Attendance</span>
                <span className="font-medium text-gray-900">{summary.attendanceRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assignments</span>
                <span className="font-medium text-gray-900">
                  {summary.completedAssignments}/{summary.totalAssignments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveClass('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeClass === 'all'
                ? 'bg-[#0713FB] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Classes
          </button>
          {classSummaries.map(summary => (
            <button
              key={summary.class}
              onClick={() => setActiveClass(summary.class)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeClass === summary.class
                  ? 'bg-[#0713FB] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {summary.class}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grades Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Grades</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredGrades.length} graded assignments
            </p>
          </div>

          <div className="p-6">
            {filteredGrades.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaChartLine className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No grades available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGrades.map(grade => (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{grade.assignment}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{grade.class}</span>
                        <span>•</span>
                        <span>Weight: {grade.weight}%</span>
                        <span>•</span>
                        <span>{new Date(grade.gradedAt).toLocaleDateString()}</span>
                      </div>
                      {grade.comments && (
                        <p className="text-sm text-gray-600 mt-1">{grade.comments}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                        {grade.grade}/{grade.maxGrade}
                      </div>
                      <div className="text-sm text-gray-600">
                        {((grade.grade / grade.maxGrade) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Attendance</h2>
            <p className="text-gray-600 text-sm mt-1">
              {filteredAttendance.length} sessions
            </p>
          </div>

          <div className="p-6">
            {filteredAttendance.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaCalendar className="text-4xl mx-auto mb-2 text-gray-300" />
                <p>No attendance records</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAttendance.slice(0, 10).map(record => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getAttendanceIcon(record.status)}
                      <div>
                        <h3 className="font-medium text-gray-900">{record.class}</h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{record.sessionType}</span>
                          {record.duration && (
                            <>
                              <span>•</span>
                              <span>{record.duration} min</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {filteredAttendance.length > 10 && (
              <button className="w-full mt-4 text-[#0713FB] hover:text-[#060EDB] text-sm font-medium">
                View All Attendance Records
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}