import React from 'react'

export interface Student {
  id: string
  name?: string
  grade?: string | number
  overallGrade?: string | number
}

export default function StudentOverview({ students }: { students?: Student[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Student Overview</h3>
      {students && students.length > 0 ? (
        <ul className="space-y-2">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500">Grade {s.grade}</div>
              </div>
              <div className="text-sm text-gray-600">{s.overallGrade}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No students available</div>
      )}
    </div>
  )
}
