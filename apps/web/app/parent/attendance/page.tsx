'use client'

import { useState, useEffect } from 'react'
import { FaCalendar, FaCheck, FaTimes, FaClock, FaDownload } from 'react-icons/fa'

interface AttendanceRecord {
  id: string
  studentName: string
  class: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  sessionType: string
  duration: number
  teacher: string
}

interface AttendanceSummary {
  studentName: string
  totalSessions: number
  present: number
  absent: number
  late: number
  excused: number
  attendanceRate: number
  trend: 'improving' | 'declining' | 'stable'
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [summaries, setSummaries] = useState<AttendanceSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    student: 'all',
    timeRange: 'month',
    status: 'all'
  })

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [attendanceResponse, summariesResponse] = await Promise.all([
          fetch('/api/parent/attendance'),
          fetch('/api/parent/attendance-summaries')
        ])
        
        const attendanceData = await attendanceResponse.json()
        const summariesData = await summariesResponse.json()
        
        setAttendance(attendanceData)
        setSummaries(summariesData)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceData()
  }, [])

  const students = [...new Set(attendance.map(record => record.studentName))]

  const filteredAttendance = attendance.filter(record => {
    if (filters.student !== 'all' && record.studentName !== filters.student) return false
    if (filters.status !== 'all' && record.status !== filters.status) return false
    return true
  })

  const filteredSummaries = summaries.filter(summary => {
    if (filters.student !== 'all' && summary.studentName !== filters.student) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-600 bg-green-100 border-green-200'
      case 'ABSENT': return 'text-red-600 bg-red-100 border-red-200'
      case 'LATE': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'EXCUSED': return 'text-blue-600 bg-blue-100 border-blue-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <FaCheck className="text-green-600" />
      case 'ABSENT': return <FaTimes className="text-red-600" />
      case 'LATE': return <FaClock className="text-orange-600" />
      case 'EXCUSED': return <FaCheck className="text-blue-600" />
      default: return <FaCheck className="text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600'
      case 'declining': return 'text-red-600'
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
          <p className="text-gray-600 mt-1">Monitor class attendance and patterns</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
          <FaDownload className="text-sm" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
              <option value="EXCUSED">Excused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Attendance Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSummaries.map((summary, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{summary.studentName}</h3>
              <span className={`text-sm ${getTrendColor(summary.trend)}`}>
                {summary.trend === 'improving' ? '↗' : 
                 summary.trend === 'declining' ? '↘' : '→'}
              </span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {summary.attendanceRate}%
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <FaCheck className="text-green-500" />
                <span>{summary.present}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaTimes className="text-red-500" />
                <span>{summary.absent}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaClock className="text-orange-500" />
                <span>{summary.late}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaCheck className="text-blue-500" />
                <span>{summary.excused}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Calendar View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredAttendance.length} records found
          </p>
        </div>

        <div className="p-6">
          {filteredAttendance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaCalendar className="text-4xl mx-auto mb-2 text-gray-300" />
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttendance.map(record => (
                <div
                  key={record.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${getStatusColor(record.status)}`}
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(record.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{record.class}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{record.studentName}</span>
                        <span>•</span>
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
                      <div className="text-sm text-gray-600 mt-1">
                        Teacher: {record.teacher}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(record.status)}`}>
                      {record.status.toLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attendance Patterns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Pattern */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Weekly Attendance Rate</h3>
            <div className="space-y-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const rate = Math.floor(Math.random() * 30) + 70 // Mock data
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-20">{day}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rate >= 90 ? 'bg-green-500' :
                            rate >= 80 ? 'bg-blue-500' :
                            rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{rate}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Monthly Trend */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Monthly Trend</h3>
            <div className="space-y-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map(month => {
                const rate = Math.floor(Math.random() * 30) + 70 // Mock data
                return (
                  <div key={month} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-8">{month}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rate >= 90 ? 'bg-green-500' :
                            rate >= 80 ? 'bg-blue-500' :
                            rate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{rate}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}