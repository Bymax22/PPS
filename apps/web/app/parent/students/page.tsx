'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaUserPlus, FaEnvelope, FaPhone, FaGraduationCap, FaChartLine } from 'react-icons/fa'

interface Student {
  id: string
  name: string
  grade: string
  avatar?: string
  overallGrade: number
  attendanceRate: number
  pendingAssignments: number
  lastActivity: string
  isActive: boolean
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showLinkModal, setShowLinkModal] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/parent/students')
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 90) return 'text-blue-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
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
          <h1 className="text-2xl font-bold text-gray-900">
            <FaChartLine className="inline-block mr-2 text-[#0713FB]" />
            My Students
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor your children&apos;s academic progress</p>
        </div>
        <button
          onClick={() => setShowLinkModal(true)}
          className="mt-4 sm:mt-0 bg-[#0713FB] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#060EDB] transition-colors flex items-center space-x-2"
        >
          <FaUserPlus className="text-sm" />
          <span>Link New Student</span>
        </button>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Student Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0713FB] to-[#0EF117] rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xl">
                {student.avatar ? (
                  <Image src={student.avatar} alt={student.name} width={64} height={64} className="object-cover" />
                ) : (
                  student.name.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaGraduationCap className="text-gray-400" />
                  <span>Grade {student.grade}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getGradeColor(student.overallGrade)}`}>
                  {student.overallGrade}%
                </div>
                <div className="text-xs text-gray-600">Overall Grade</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getAttendanceColor(student.attendanceRate)}`}>
                  {student.attendanceRate}%
                </div>
                <div className="text-xs text-gray-600">Attendance</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Pending Assignments:</span>
                <span className="font-medium">{student.pendingAssignments}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Activity:</span>
                <span className="font-medium">{new Date(student.lastActivity).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-[#0713FB] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#060EDB] transition-colors">
                View Details
              </button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <FaEnvelope className="text-sm" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <FaPhone className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FaUserPlus className="text-4xl text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No students linked yet</h3>
          <p className="text-gray-600 mb-4">Link your child&apos;s account to start monitoring their progress</p>
          <button
            onClick={() => setShowLinkModal(true)}
            className="bg-[#0713FB] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#060EDB] transition-colors"
          >
            Link First Student
          </button>
        </div>
      )}

      {/* Link Student Modal */}
      {showLinkModal && <LinkStudentModal onClose={() => setShowLinkModal(false)} />}
    </div>
  )
}

// Link Student Modal Component
function LinkStudentModal({ onClose }: { onClose: () => void }) {
  const [linkCode, setLinkCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Linking student with code:', linkCode)
      onClose()
    } catch (error) {
      console.error('Error linking student:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Link Student Account</h2>
        <p className="text-gray-600 mb-6">
          Enter the student linking code provided by your child or school
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="linkCode" className="block text-sm font-medium text-gray-700 mb-2">
              Student Linking Code
            </label>
            <input
              type="text"
              id="linkCode"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
              required
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">How to get the linking code:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ask your child to check their student portal</li>
              <li>• Contact the school administration</li>
              <li>• Check your email for invitation</li>
            </ul>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0713FB] text-white px-4 py-3 rounded-xl font-medium hover:bg-[#060EDB] transition-colors disabled:opacity-50"
            >
              {loading ? 'Linking...' : 'Link Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}