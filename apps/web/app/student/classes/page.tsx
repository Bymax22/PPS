'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FaSearch, FaFilter, FaPlay, FaBook } from 'react-icons/fa'

interface Class {
  id: string
  name: string
  subject: string
  teacher: string
  thumbnail: string
  progress: number
  nextSession: string
  totalMaterials: number
  totalAssignments: number
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/student/classes')
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error('Error fetching classes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 mt-1">Manage and access your enrolled classes</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-[#0713FB] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#060EDB] transition-colors">
          Join New Class
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0713FB] focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
          <FaFilter className="text-gray-400" />
          <span>Filter</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Class Thumbnail */}
            <div className="h-32 bg-gradient-to-r from-[#0713FB] to-[#0EF117] relative">
              {cls.thumbnail ? (
                <Image
                  src={cls.thumbnail}
                  alt={cls.name}
                  width={800}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaBook className="text-white text-3xl" />
                </div>
              )}
              <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {cls.subject}
              </div>
            </div>

            {/* Class Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{cls.name}</h3>
              <p className="text-gray-600 text-sm mb-3">By {cls.teacher}</p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{cls.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#0EF117] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${cls.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>{cls.totalMaterials} materials</span>
                <span>{cls.totalAssignments} assignments</span>
              </div>

              {/* Next Session */}
              {cls.nextSession && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <FaPlay className="text-[#0713FB]" />
                  <span>Next: {new Date(cls.nextSession).toLocaleDateString()}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 bg-[#0713FB] text-white py-2 rounded-lg text-sm font-medium hover:bg-[#060EDB] transition-colors">
                  Enter Class
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  ...
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <FaBook className="text-4xl text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No classes found</h3>
          <p className="text-gray-600">Try adjusting your search or join a new class.</p>
        </div>
      )}
    </div>
  )
}