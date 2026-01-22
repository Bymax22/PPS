'use client'

import { useState, useEffect } from 'react'
import { FaFilter, FaDownload, FaChartLine } from 'react-icons/fa'

interface ProgressData {
  studentId: string
  studentName: string
  grade: string
  overallProgress: number
  subjects: {
    name: string
    grade: number
    trend: 'up' | 'down' | 'stable'
    assignmentsCompleted: number
    totalAssignments: number
  }[]
  weeklyProgress: {
    week: string
    attendance: number
    assignments: number
    participation: number
  }[]
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month')

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await fetch('/api/parent/progress')
        const data = await response.json()
        setProgressData(data)
      } catch (error) {
        console.error('Error fetching progress data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
  }, [])

  const students = progressData.map(student => ({
    id: student.studentId,
    name: student.studentName,
    grade: student.grade
  }))

  const filteredData = selectedStudent === 'all' 
    ? progressData 
    : progressData.filter(student => student.studentId === selectedStudent)

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
        <div className="flex items-center space-x-3">
          <FaChartLine className="text-xl text-gray-700" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-gray-600 mt-1">Monitor academic progress and performance trends</p>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
            <FaDownload className="text-sm" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <span className="text-sm text-gray-700">Filters</span>
          </div>
          {/* Student Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            >
              <option value="all">All Students</option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} (Grade {student.grade})
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'semester')}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Progress</h2>
          <div className="space-y-4">
            {filteredData.map(student => (
              <div key={student.studentId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{student.studentName}</h3>
                  <div className="text-2xl font-bold text-[#0713FB]">
                    {student.overallProgress}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#0713FB] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${student.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Grade</span>
                <span className="font-semibold text-gray-900">
                  {Math.round(filteredData.reduce((acc, student) => {
                    const avg = student.subjects.reduce((sum, subject) => sum + subject.grade, 0) / student.subjects.length
                    return acc + avg
                  }, 0) / filteredData.length)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Assignments Completed</span>
                <span className="font-semibold text-gray-900">
                  {filteredData.reduce((acc, student) => 
                    acc + student.subjects.reduce((sum, subject) => sum + subject.assignmentsCompleted, 0), 0
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subjects</span>
                <span className="font-semibold text-gray-900">
                  {filteredData[0]?.subjects.length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-2">Progress Tips</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Review assignments weekly</li>
              <li>• Monitor attendance regularly</li>
              <li>• Communicate with teachers</li>
              <li>• Celebrate improvements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subject-wise Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Subject Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.flatMap(student =>
              student.subjects.map(subject => (
                <div
                  key={`${student.studentId}-${subject.name}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#0713FB] transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                    <div className={`text-lg font-bold ${
                      subject.grade >= 90 ? 'text-green-600' :
                      subject.grade >= 80 ? 'text-blue-600' :
                      subject.grade >= 70 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {subject.grade}%
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Assignments:</span>
                      <span>{subject.assignmentsCompleted}/{subject.totalAssignments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trend:</span>
                      <span className={`flex items-center space-x-1 ${
                        subject.trend === 'up' ? 'text-green-600' :
                        subject.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {subject.trend === 'up' ? '↗ Improving' :
                         subject.trend === 'down' ? '↘ Needs attention' : '→ Stable'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        subject.grade >= 90 ? 'bg-green-500' :
                        subject.grade >= 80 ? 'bg-blue-500' :
                        subject.grade >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.grade}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}