'use client'

import { useState, useEffect } from 'react'
import type { Assignment } from './UpcomingAssignments'
import type { Activity } from './RecentActivity'
import type { ScheduleItem } from './ClassSchedule'
import { useSession } from 'next-auth/react'
import DashboardStats from './DashboardStats'
import UpcomingAssignments from './UpcomingAssignments'
import RecentActivity from '@/student/RecentActivity'
import ClassSchedule from '@/student/ClassSchedule'
import QuickActions from '@/student/QuickActions'

interface DashboardData {
  stats: {
    totalClasses: number
    pendingAssignments: number
    averageGrade: number
    attendanceRate: number
  }
  upcomingAssignments: Assignment[]
  recentActivity: Activity[]
  schedule: ScheduleItem[]
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/student/dashboard')
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0713FB]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome back, {session?.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here is your learning overview for today
        </p>
      </div>

      {/* Stats Grid */}
      {dashboardData && <DashboardStats stats={dashboardData.stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingAssignments assignments={dashboardData?.upcomingAssignments || []} />
          <RecentActivity activities={dashboardData?.recentActivity || []} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ClassSchedule schedule={dashboardData?.schedule || []} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}