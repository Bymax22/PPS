// components/dashboard/ActiveClasses.tsx
import { Users, BookOpen, Calendar, UserCheck } from 'lucide-react'
import Link from 'next/link'

interface ActiveClassesProps {
  enrollments: any[]
}

export default function ActiveClasses({ enrollments }: ActiveClassesProps) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No active classes</p>
        <p className="text-sm text-gray-400 mt-1">Enroll in a program to start learning</p>
        <Link 
          href="/portal/student/register"
          className="inline-block mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#003087' }}
        >
          Browse Programs
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {enrollments.map((enrollment) => (
        <div 
          key={enrollment.id} 
          className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:border-transparent"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">{enrollment.class.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{enrollment.class.program?.name}</p>
            </div>
            <div 
              className="px-2 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: enrollment.status === 'ACTIVE' ? '#0EF117' : '#003087' }}
            >
              {enrollment.status}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            {enrollment.class.grade && (
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-4 h-4" style={{ color: '#003087' }} />
                <span>Grade {enrollment.class.grade}</span>
              </div>
            )}
            {enrollment.class.subject && (
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" style={{ color: '#003087' }} />
                <span>{enrollment.class.subject}</span>
              </div>
            )}
            {enrollment.class.capacity && (
              <div className="flex items-center gap-2 text-gray-600">
                <UserCheck className="w-4 h-4" style={{ color: '#003087' }} />
                <span>Capacity: {enrollment.class.capacity} students</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
              </span>
              <Link 
                href={`/student/class/${enrollment.classId}`}
                className="text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#003087' }}
              >
                View Class →
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {enrollments.length >= 4 && (
        <Link 
          href="/student/classes"
          className="col-span-full text-center py-3 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#003087' }}
        >
          View All Classes →
        </Link>
      )}
    </div>
  )
}