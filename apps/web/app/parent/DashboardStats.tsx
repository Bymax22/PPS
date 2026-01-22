import React from 'react'

type Stats = {
  totalStudents: number
  pendingAssignments: number
  averageGrade: number
  attendanceRate: number
  unreadMessages: number
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
        <div className="text-lg font-bold">{stats.totalStudents}</div>
        <div className="text-sm text-gray-500">Students</div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
        <div className="text-lg font-bold">{stats.pendingAssignments}</div>
        <div className="text-sm text-gray-500">Pending Assignments</div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
        <div className="text-lg font-bold">{stats.averageGrade}%</div>
        <div className="text-sm text-gray-500">Average Grade</div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
        <div className="text-lg font-bold">{stats.attendanceRate}%</div>
        <div className="text-sm text-gray-500">Attendance Rate</div>
      </div>
    </div>
  )
}

