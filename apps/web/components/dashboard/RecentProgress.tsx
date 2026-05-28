// components/dashboard/RecentProgress.tsx
import { CheckCircle, Clock, BookOpen, PlayCircle } from 'lucide-react'
import Link from 'next/link'

interface RecentProgressProps {
  progressRecords: any[]
}

export default function RecentProgress({ progressRecords }: RecentProgressProps) {
  if (progressRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No progress records yet</p>
        <p className="text-sm text-gray-400 mt-1">Start watching lessons to track your progress</p>
        <Link 
          href="/student/classes"
          className="inline-block mt-4 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#003087' }}
        >
          Browse Classes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {progressRecords.map((record) => (
        <div key={record.id} className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900">{record.lesson?.title}</h3>
              <p className="text-sm text-gray-600">{record.lesson?.class?.name}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: '#003087' }}>
              {record.percentageWatched}%
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${record.percentageWatched}%`,
                  backgroundColor: record.percentageWatched === 100 ? '#0EF117' : '#003087'
                }}
              />
            </div>
            {record.bookmarkedAt && (
              <div className="absolute -top-2 right-0">
                <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  Bookmarked
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last watched: {new Date(record.lastWatchedAt || record.updatedAt).toLocaleDateString()}
            </span>
            {record.percentageWatched < 100 && (
              <button className="flex items-center gap-1 hover:opacity-80" style={{ color: '#003087' }}>
                <PlayCircle className="w-3 h-3" />
                Continue
              </button>
            )}
            {record.percentageWatched === 100 && (
              <span className="flex items-center gap-1" style={{ color: '#0EF117' }}>
                <CheckCircle className="w-3 h-3" />
                Completed
              </span>
            )}
          </div>
        </div>
      ))}
      
      <Link 
        href="/student/progress"
        className="block text-center py-3 text-sm font-medium hover:opacity-80 transition-opacity"
        style={{ color: '#003087' }}
      >
        View All Progress →
      </Link>
    </div>
  )
}