import { NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(auth) as Session | null

  if (!session || session.user.role !== 'PARENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Mock dashboard data
    const dashboardData = {
      stats: {
        totalStudents: 2,
        pendingAssignments: 5,
        averageGrade: 85,
        attendanceRate: 94,
        unreadMessages: 3
      },
      students: [
        {
          id: '1',
          name: 'Sarah Mwamba',
          grade: '10',
          overallGrade: 88,
          attendanceRate: 96,
          pendingAssignments: 2,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: '2',
          name: 'John Mwamba',
          grade: '8',
          overallGrade: 82,
          attendanceRate: 92,
          pendingAssignments: 3,
          lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      ],
      recentActivities: [
        {
          id: '1',
          type: 'grade_posted',
          title: 'Mathematics Assignment Graded',
          student: 'Sarah Mwamba',
          time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: 'Scored 45/50 (90%)'
        },
        {
          id: '2',
          type: 'attendance_marked',
          title: 'Attendance Updated',
          student: 'John Mwamba',
          time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          details: 'Present in Science class'
        }
      ],
      upcomingEvents: [
        {
          id: '1',
          title: 'Parent-Teacher Meeting',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'meeting',
          participants: ['Mr. Banda (Math)', 'Mrs. Phiri (Science)']
        },
        {
          id: '2',
          title: 'Science Fair',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'event',
          participants: ['All Students']
        }
      ]
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Parent dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}