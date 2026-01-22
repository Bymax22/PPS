import React from 'react'

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
      <div className="flex flex-col space-y-2">
        <button className="px-4 py-2 bg-[#0713FB] text-white rounded">Start Quiz</button>
        <button className="px-4 py-2 bg-gray-100 rounded">Join Study Group</button>
        <button className="px-4 py-2 bg-gray-100 rounded">View Assignments</button>
      </div>
    </div>
  )
}

