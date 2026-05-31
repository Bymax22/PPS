// components/dashboard/RecentExams.tsx
import { Award, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface RecentExamsProps {
  examAttempts: any[]
}

export default function RecentExams({ examAttempts }: RecentExamsProps) {
  if (examAttempts.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No exam attempts yet</p>
        <p className="text-sm text-gray-400 mt-1">Check your classes for available exams</p>
      </div>
    )
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return '#0EF117'
    if (percentage >= 50) return '#003087'
    return '#dc2626'
  }

  return (
    <div className="space-y-4">
      {examAttempts.slice(0, 3).map((attempt) => {
        const percentage = attempt.percentage || 0
        return (
          <div key={attempt.id} className="p-4 rounded-xl bg-white shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-slate-900">{attempt.exam.title}</h3>
                <p className="text-sm text-slate-500">{attempt.exam.class?.name}</p>
              </div>
              {attempt.isPassed !== null && (
                <div 
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: attempt.isPassed ? '#10b981' : '#b91c1c' }}
                >
                  {attempt.isPassed ? 'Passed' : 'Failed'}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Score</span>
                <span className="font-semibold" style={{ color: getScoreColor(percentage) }}>
                  {attempt.score}/{attempt.exam.totalMarks} ({percentage}%)
                </span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: getScoreColor(percentage)
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(attempt.submittedAt || attempt.createdAt).toLocaleDateString()}
                </span>
                {attempt.flaggedForReview && (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <AlertCircle className="w-3 h-3" />
                    Flagged for review
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      
      {examAttempts.length > 3 && (
        <Link 
          href="/student/exams"
          className="block text-center py-3 text-sm font-medium hover:opacity-80 transition-opacity"
          style={{ color: '#003087' }}
        >
          View All Exams →
        </Link>
      )}
    </div>
  )
}