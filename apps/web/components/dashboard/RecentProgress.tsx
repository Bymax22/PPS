// components/dashboard/RecentProgress.tsx
import { CheckCircle, Clock, BookOpen, PlayCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import ProgressRing from '@/components/dashboard/ProgressRing'

interface RecentProgressProps {
  progressRecords: any[]
}

export default function RecentProgress({ progressRecords }: RecentProgressProps) {
  if (!progressRecords || progressRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600">No progress records yet</p>
        <p className="text-sm text-slate-400 mt-1">Start watching lessons to track your progress</p>
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

  const avg = Math.round(progressRecords.reduce((s, r) => s + (r.percentageWatched || 0), 0) / progressRecords.length)

  return (
    <div className="flex gap-6 items-start">
      <div className="w-1/3 flex-shrink-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <ProgressRing percentage={avg} size={140} stroke={12} label="Overall Progress" />
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {progressRecords.map((record) => (
          <div key={record.id} className="p-3 rounded-lg bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">{record.lesson?.title}</h4>
                <p className="text-sm text-slate-500">{record.lesson?.class?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{record.percentageWatched}%</p>
                <p className="text-xs text-slate-500">Last: {new Date(record.lastWatchedAt || record.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="h-full rounded-full" style={{ width: `${record.percentageWatched}%`, backgroundColor: record.percentageWatched === 100 ? '#10b981' : '#0b61d6' }} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-3 h-3" />
                <span>Watched {record.percentageWatched}%</span>
              </div>
              <div>
                {record.percentageWatched < 100 ? (
                  <Link href={`/lesson/${record.lessonId}`} className="text-sm font-medium text-[#003087]">Continue →</Link>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}

        <Link 
          href="/student/progress"
          className="block text-center py-3 text-sm font-medium hover:opacity-80 transition-opacity text-[#003087]"
        >
          View All Progress →
        </Link>
      </div>
    </div>
  )
}