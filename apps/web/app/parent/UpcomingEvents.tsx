
import React from 'react'

export interface EventItem {
  id: string
  title?: string
  date?: string
  type?: string
}

export default function UpcomingEvents({ events }: { events?: EventItem[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
      {events && events.length ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {events.map((e) => (
            <li key={e.id} className="flex justify-between">
              <div>
                <div className="font-medium">{e.title}</div>
                <div className="text-xs text-gray-500">{e.date ? new Date(e.date).toLocaleString() : ''}</div>
              </div>
              <div className="text-gray-500 text-xs">{e.type}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No upcoming events</div>
      )}
    </div>
  )
}

