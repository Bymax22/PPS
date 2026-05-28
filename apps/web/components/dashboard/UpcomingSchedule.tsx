// components/dashboard/UpcomingSchedule.tsx
import { Calendar, Clock, Video, MapPin } from 'lucide-react'
import Link from 'next/link'

interface UpcomingScheduleProps {
  lessons: any[]
}

export default function UpcomingSchedule({ lessons }: UpcomingScheduleProps) {
  const getLessonTypeIcon = (type: string) => {
    switch(type) {
      case 'LIVE':
        return <Video className="w-4 h-4" style={{ color: '#0EF117' }} />
      case 'RECORDED':
        return <Clock className="w-4 h-4" style={{ color: '#003087' }} />
      default:
        return <Calendar className="w-4 h-4" style={{ color: '#003087' }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'SCHEDULED':
        return '#003087'
      case 'LIVE':
        return '#0EF117'
      case 'COMPLETED':
        return '#6b7280'
      default:
        return '#003087'
    }
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No upcoming lessons scheduled</p>
        <p className="text-sm text-gray-400 mt-1">Check back later for new classes</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, index) => (
        <div 
          key={lesson.id} 
          className="flex items-start justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
        >
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white font-bold"
              style={{ backgroundColor: index % 2 === 0 ? '#003087' : '#0EF117' }}
            >
              <span className="text-lg">
                {new Date(lesson.scheduledAt).getDate()}
              </span>
              <span className="text-[10px]">
                {new Date(lesson.scheduledAt).toLocaleString('default', { month: 'short' })}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                {lesson.type && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {getLessonTypeIcon(lesson.type)}
                    <span>{lesson.type}</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-1">{lesson.class?.name}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(lesson.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {lesson.duration && (
                  <span>{lesson.duration} minutes</span>
                )}
                {lesson.roomId && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Room: {lesson.roomId}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            className="px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: getStatusColor(lesson.status) }}
          >
            {lesson.status === 'LIVE' ? 'Join Now' : 'View Details'}
          </button>
        </div>
      ))}
      
      {lessons.length >= 3 && (
        <Link 
          href="/student/schedule"
          className="block text-center py-3 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#003087' }}
        >
          View Full Schedule →
        </Link>
      )}
    </div>
  )
}