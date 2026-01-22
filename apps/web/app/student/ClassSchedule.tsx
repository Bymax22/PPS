import React from 'react'

export interface ScheduleItem {
  id: string
  class?: string
  time?: string
  type?: string
}

export default function ClassSchedule({ schedule }: { schedule?: ScheduleItem[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold mb-4">Class Schedule</h3>
      {schedule && schedule.length ? (
        <ul className="space-y-2 text-sm text-gray-700">
          {schedule.map((s) => (
            <li key={s.id} className="flex justify-between">
              <div>
                <div className="font-medium">{s.class}</div>
                <div className="text-xs text-gray-500">{s.time}</div>
              </div>
              <div className="text-gray-500 text-xs">{s.type}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No schedule available</div>
      )}
    </div>
  )
}

