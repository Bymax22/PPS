// app/(dashboard)/student/page.tsx (updated with notification actions)

import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { 
  AlertCircle
} from 'lucide-react'
import { getAuthOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StudentDashboardClient from '@/components/dashboard/StudentDashboardClient'
import StudentStats from '@/components/dashboard/StudentStats'
import UpcomingSchedule from '@/components/dashboard/UpcomingSchedule'
import RecentProgress from '@/components/dashboard/RecentProgress'
import ActiveClasses from '@/components/dashboard/ActiveClasses'
import RecentExams from '@/components/dashboard/RecentExams'
import ResourcesWidget from '@/components/dashboard/ResourcesWidget'
import NotificationsPanel from '@/components/dashboard/NotificationsPanel'
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus'
import PerformanceChart from '@/components/dashboard/PerformanceChart'

// This is a server component wrapper
export default async function StudentDashboardPage() {
  const session = await getServerSession(await getAuthOptions())

  if (!session?.user?.email) {
    return <UnauthenticatedView />
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      studentProfile: {
        include: {
          parent: {
            select: { firstName: true, lastName: true, email: true, phone: true }
          }
        }
      },
      enrollments: {
        include: {
          class: {
            include: {
              program: true
            }
          }
        }
      },
      subscriptions: {
        where: { status: 'ACTIVE' },
        include: {
          plan: {
            include: { program: true }
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      },
      examAttempts: {
        include: {
          exam: {
            include: { class: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 3
      },
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })

  if (!user?.studentProfile) {
    return <NoProfileView />
  }

  // Fetch upcoming lessons
  const upcomingLessons = user.enrollments.length
    ? await prisma.lesson.findMany({
        where: {
          classId: { in: user.enrollments.map(e => e.classId) },
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED'
        },
        orderBy: { scheduledAt: 'asc' },
        take: 5,
        include: { class: true }
      })
    : []

  // Fetch recent progress
  const recentProgress = await prisma.progress.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    include: {
      lesson: {
        include: { class: true }
      }
    }
  })

  // Fetch available resources
  const recentResources = await prisma.resource.findMany({
    where: {
      classId: { in: user.enrollments.map(e => e.classId) },
      isPublished: true,
      status: 'READY',
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: {
      media: true,
      author: true,
    },
  })

  // Calculate overall stats
  const completedLessons = recentProgress.filter(p => p.percentageWatched === 100).length
  const averageProgress = recentProgress.length 
    ? Math.round(recentProgress.reduce((sum, p) => sum + p.percentageWatched, 0) / recentProgress.length)
    : 0
  const passedExams = user.examAttempts.filter(e => e.isPassed === true).length
  const totalExams = user.examAttempts.length

  // Format notifications for the panel
  const formattedNotifications = user.notifications.map(notification => ({
    ...notification,
    createdAt: new Date(notification.createdAt)
  }))

  return (
    <StudentDashboardClient 
      user={user}
      upcomingLessons={upcomingLessons}
      recentProgress={recentProgress}
      recentResources={recentResources.map((resource) => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        subject: resource.subject ?? undefined,
        author: resource.author ? `${resource.author.firstName ?? ''} ${resource.author.lastName ?? ''}`.trim() : undefined,
        createdAt: resource.createdAt,
        cloudinaryUrl: resource.media?.originalUrl ?? null,
        downloadCount: resource.downloadCount ?? 0,
        status: resource.status,
      }))}
      enrollments={user.enrollments}
      examAttempts={user.examAttempts}
      subscriptions={user.subscriptions}
      payments={user.payments}
      notifications={formattedNotifications}
      stats={{
        activeClasses: user.enrollments.length,
        completedLessons,
        passedExams,
        totalExams,
        averageProgress
      }}
    />
  )
}

function UnauthenticatedView() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#003087' }}>Welcome to Student Portal</h2>
        <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
        <div className="space-y-3">
          <Link 
            href="/portal/student/login"
            className="block w-full py-3 px-4 rounded-lg text-white text-center font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#003087' }}
          >
            Sign In
          </Link>
          <Link 
            href="/portal/student/register"
            className="block w-full py-3 px-4 rounded-lg text-center font-medium border-2 transition-colors"
            style={{ borderColor: '#003087', color: '#003087' }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

function NoProfileView() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#003087' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#003087' }}>Profile Not Found</h2>
        <p className="text-gray-600">No student profile found for your account. Please contact support.</p>
      </div>
    </div>
  )
}