// components/dashboard/StudentStats.tsx
import { BookOpen, CheckCircle, Trophy, TrendingUp, Clock, Award } from 'lucide-react'

interface StudentStatsProps {
  activeClasses: number
  completedLessons: number
  passedExams: number
  totalExams: number
  averageProgress: number
  totalHours?: number
}

export default function StudentStats({ 
  activeClasses, 
  completedLessons, 
  passedExams, 
  totalExams, 
  averageProgress,
  totalHours = 0
}: StudentStatsProps) {
  const stats = [
    {
      icon: BookOpen,
      label: 'Active Classes',
      value: activeClasses,
      color: '#003087'
    },
    {
      icon: CheckCircle,
      label: 'Completed Lessons',
      value: completedLessons,
      color: '#0EF117'
    },
    {
      icon: Trophy,
      label: 'Exams Passed',
      value: `${passedExams}/${totalExams}`,
      color: '#003087'
    },
    {
      icon: TrendingUp,
      label: 'Avg Progress',
      value: `${averageProgress}%`,
      color: '#0EF117'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-6 h-6" style={{ color: stat.color }} />
              <span className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}