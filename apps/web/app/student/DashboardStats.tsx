import { FaBook, FaTasks, FaChartLine, FaUserCheck } from 'react-icons/fa'

interface StatsProps {
  stats: {
    totalClasses: number
    pendingAssignments: number
    averageGrade: number
    attendanceRate: number
  }
}

export default function DashboardStats({ stats }: StatsProps) {
  const statCards = [
    {
      label: 'Total Classes',
      value: stats.totalClasses,
      icon: FaBook,
      color: 'bg-blue-500'
    },
    {
      label: 'Pending Assignments',
      value: stats.pendingAssignments,
      icon: FaTasks,
      color: 'bg-orange-500'
    },
    {
      label: 'Average Grade',
      value: `${stats.averageGrade}%`,
      icon: FaChartLine,
      color: 'bg-green-500'
    },
    {
      label: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      icon: FaUserCheck,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <Icon className="text-white text-lg" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}