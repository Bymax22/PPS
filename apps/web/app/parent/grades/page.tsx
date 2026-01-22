'use client'

import { useState, useEffect } from 'react'
import { FaFilter, FaDownload, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'

interface Grade {
  id: string
  studentName: string
  subject: string
  assignment: string
  grade: number
  maxGrade: number
  weight: number
  gradedAt: string
  comments?: string
  trend: 'up' | 'down' | 'stable'
}

interface GradeSummary {
  studentName: string
  subject: string
  averageGrade: number
  trend: 'up' | 'down' | 'stable'
  totalAssignments: number
  gradedAssignments: number
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [summaries, setSummaries] = useState<GradeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    student: 'all',
    subject: 'all',
    timeRange: 'month'
  })

  useEffect(() => {
    const fetchGradesData = async () => {
      try {
        const [gradesResponse, summariesResponse] = await Promise.all([
          fetch('/api/parent/grades'),
          fetch('/api/parent/grade-summaries')
        ])
        
        const gradesData = await gradesResponse.json()
        const summariesData = await summariesResponse.json()
        
        setGrades(gradesData)
        setSummaries(summariesData)
      } catch (error) {
        console.error('Error fetching grades data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGradesData()
  }, [])

  const students = [...new Set(grades.map(grade => grade.studentName))]
  const subjects = [...new Set(grades.map(grade => grade.subject))]

  const filteredGrades = grades.filter(grade => {
    if (filters.student !== 'all' && grade.studentName !== filters.student) return false
    if (filters.subject !== 'all' && grade.subject !== filters.subject) return false
    return true
  })

  const filteredSummaries = summaries.filter(summary => {
    if (filters.student !== 'all' && summary.studentName !== filters.student) return false
    if (filters.subject !== 'all' && summary.subject !== filters.subject) return false
    return true
  })

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200'
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grade Monitoring</h1>
          <p className="text-gray-600 mt-1">Track and analyze academic performance</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
          <FaDownload className="text-sm" />
          <span>Export Grades</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <FaFilter className="mr-2 text-gray-500" />
            Filters
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student
            </label>
            <select
              value={filters.student}
              onChange={(e) => setFilters(prev => ({ ...prev, student: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            >
              <option value="all">All Students</option>
              {students.map(student => (
                <option key={student} value={student}>{student}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grade Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSummaries.map((summary, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-sm">{summary.subject}</h3>
              <span className={`text-sm ${getTrendColor(summary.trend)}`}>
                {getTrendIcon(summary.trend)}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {summary.averageGrade}%
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{summary.studentName}</span>
              <span>{summary.gradedAssignments}/{summary.totalAssignments} graded</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Grades */}
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
              <p>No grades found matching your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGrades.map(grade => (
                <div
                  key={grade.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${getGradeColor(grade.grade, grade.maxGrade)}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{grade.assignment}</h3>
                      <span className={`text-sm ${getTrendColor(grade.trend)}`}>
                        {getTrendIcon(grade.trend)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{grade.studentName}</span>
                      <span>•</span>
                      <span>{grade.subject}</span>
                      <span>•</span>
                      <span>Weight: {grade.weight}%</span>
                      <span>•</span>
                      <span>{new Date(grade.gradedAt).toLocaleDateString()}</span>
                    </div>
                    {grade.comments && (
                      <p className="text-sm text-gray-600 mt-2">{grade.comments}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
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

      {/* Low Grades Alert */}
      {filteredGrades.some(grade => (grade.grade / grade.maxGrade) * 100 < 70) && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <FaExclamationTriangle className="text-orange-500 text-xl" />
            <div>
              <h3 className="font-semibold text-orange-800">Attention Needed</h3>
              <p className="text-orange-700 text-sm">
                Some grades are below 70%. Consider reviewing these with your child.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}