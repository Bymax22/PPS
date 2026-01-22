'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardStats from './DashboardStats'
import StudentOverview from '@/parent/StudentOverview'
import RecentActivities from '@/parent/RecentActivities'
import UpcomingEvents from '@/parent/UpcomingEvents'
import QuickActions from '@/parent/QuickActions'
import type { Student } from '@/parent/StudentOverview'
import type { Activity } from '@/parent/RecentActivities'
import type { EventItem } from '@/parent/UpcomingEvents'

interface DashboardData {
  stats: {
    totalStudents: number
    pendingAssignments: number
    averageGrade: number
    attendanceRate: number
    unreadMessages: number
  }
  students: Student[]
  recentActivities: Activity[]
  upcomingEvents: EventItem[]
}



export default function ParentDashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/parent/dashboard')
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
          Here is an overview of your children&apos;s academic progress
        </p>
      </div>

      {/* Stats Grid */}
      {dashboardData && <DashboardStats stats={dashboardData.stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <StudentOverview students={dashboardData?.students || []} />
          <RecentActivities activities={dashboardData?.recentActivities || []} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <UpcomingEvents events={dashboardData?.upcomingEvents || []} />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}