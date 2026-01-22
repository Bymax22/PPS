import React from 'react'

export interface Activity {
  id: string
  title?: string
  time?: string
  class?: string
}

export default function RecentActivity({ activities }: { activities?: Activity[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      {activities && activities.length ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {activities.map((a) => (
            <li key={a.id} className="flex justify-between">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">{a.time}</div>
              </div>
              <div className="text-gray-500 text-xs">{a.class}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No recent activity</div>
      )}
    </div>
  )
}

