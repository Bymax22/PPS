import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'

// Mock data for teacher dashboard
const mockTeacherData = {
  id: 'teacher-1',
  name: 'Mr. Johnson',
  email: 'johnson@school.com',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johnson',
  classes: [
    {
      id: '1',
      name: 'Mathematics Grade 10',
      grade: 10,
      subject: 'Mathematics',
      program: { name: 'Online Full Time', type: 'ONLINE_FULL_TIME' },
      studentCount: 25,
      schedule: [
        { id: '1', day: 'Monday', time: '09:00', duration: 60 },
        { id: '2', day: 'Wednesday', time: '09:00', duration: 60 },
        { id: '3', day: 'Friday', time: '09:00', duration: 60 }
      ],
      students: [
        {
          id: '1',
          userId: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          grade: 10,
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
          attendance: [
            { id: 'a1', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'PRESENT', remarks: '' },
            { id: 'a2', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'PRESENT', remarks: '' },
            { id: 'a3', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), status: 'LATE', remarks: 'Minor delay' }
          ],
          progress: [
            { id: 'p1', lessonId: '1', lessonTitle: 'Algebra Basics', percentageWatched: 100, completedAt: new Date(), score: 88 },
            { id: 'p2', lessonId: '2', lessonTitle: 'Quadratic Equations', percentageWatched: 75, completedAt: null, score: null }
          ],
          parent: {
            firstName: 'Mike',
            lastName: 'Doe',
            email: 'mike.doe@example.com',
            phone: '+260974567890'
          }
        },
        {
          id: '2',
          userId: 'user2',
          firstName: 'Emma',
          lastName: 'Smith',
          email: 'emma.smith@example.com',
          grade: 10,
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
          attendance: [
            { id: 'a4', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'PRESENT', remarks: '' },
            { id: 'a5', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'ABSENT', remarks: 'Illness' }
          ],
          progress: [
            { id: 'p3', lessonId: '1', lessonTitle: 'Algebra Basics', percentageWatched: 100, completedAt: new Date(), score: 92 }
          ],
          parent: {
            firstName: 'Sarah',
            lastName: 'Smith',
            email: 'sarah.smith@example.com',
            phone: '+260978901234'
          }
        }
      ]
    },
    {
      id: '2',
      name: 'Physics Grade 11',
      grade: 11,
      subject: 'Physics',
      program: { name: 'Online Full Time', type: 'ONLINE_FULL_TIME' },
      studentCount: 18,
      schedule: [
        { id: '1', day: 'Tuesday', time: '11:00', duration: 60 },
        { id: '2', day: 'Thursday', time: '11:00', duration: 60 }
      ],
      students: []
    }
  ],
  lessons: [
    {
      id: '1',
      title: 'Introduction to Algebra',
      description: 'Basic algebraic concepts and equations',
      type: 'RECORDED' as const,
      status: 'COMPLETED' as const,
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: 45,
      classId: '1',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Quadratic Equations',
      description: 'Solving quadratic equations using various methods',
      type: 'LIVE' as const,
      status: 'SCHEDULED' as const,
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 60,
      classId: '1',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ],
  exams: [
    {
      id: '1',
      title: 'Algebra Midterm',
      description: 'Covers all algebra topics from chapters 1-5',
      type: 'MIDTERM' as const,
      scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      duration: 90,
      totalMarks: 100,
      passingMarks: 50,
      classId: '1',
      submissions: [
        {
          id: '1',
          studentId: '1',
          studentName: 'John Doe',
          score: 85,
          percentage: 85,
          submittedAt: new Date(),
          status: 'GRADED' as const
        },
        {
          id: '2',
          studentId: '2',
          studentName: 'Emma Smith',
          score: null,
          percentage: null,
          submittedAt: null,
          status: 'PENDING' as const
        }
      ]
    }
  ],
  resources: [
    {
      id: '1',
      title: 'Algebra Formula Sheet',
      description: 'Comprehensive formula reference',
      type: 'PDF_NOTE',
      fileUrl: '/resources/formula-sheet.pdf',
      fileSize: 1024 * 1024,
      downloadCount: 45,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  ],
  messages: [
    {
      id: '1',
      from: 'Parent - Mike Doe',
      fromRole: 'parent',
      to: 'teacher',
      message: 'My son is struggling with algebra. Can you provide additional resources?',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      childId: '1'
    }
  ],
  notifications: [
    {
      id: '1',
      title: 'New Student Enrollment',
      message: 'A new student has been enrolled in your Physics class',
      date: new Date(),
      read: false,
      type: 'enrollment'
    },
    {
      id: '2',
      title: 'Assignment Submission',
      message: 'John Doe has submitted their assignment',
      date: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
      type: 'submission'
    }
  ]
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return mockup data
    return NextResponse.json(mockTeacherData)
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
