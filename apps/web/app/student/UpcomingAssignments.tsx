import Link from 'next/link'
import { FaClock, FaArrowRight } from 'react-icons/fa'

export interface Assignment {
  id: string
  title: string
  dueDate: string
  class: string
  points: number
  status: 'pending' | 'submitted' | 'graded'
}

interface UpcomingAssignmentsProps {
  assignments: Assignment[]
}

export default function UpcomingAssignments({ assignments }: UpcomingAssignmentsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
        <Link 
          href="/student/assignments"
          className="text-[#0713FB] hover:text-[#060EDB] text-sm font-medium flex items-center space-x-1"
        >
          <span>View All</span>
          <FaArrowRight className="text-xs" />
        </Link>
      </div>

      <div className="space-y-3">
        {assignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaClock className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No upcoming assignments</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#0713FB] transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{assignment.class}</span>
                  <span>•</span>
                  <span>{assignment.points} points</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <FaClock className="text-xs" />
                    <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                assignment.status === 'pending' 
                  ? 'bg-orange-100 text-orange-800'
                  : assignment.status === 'submitted'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}