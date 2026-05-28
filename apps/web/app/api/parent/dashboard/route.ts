import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getAuthOptions } from '@/lib/auth'

// Mock data for parent dashboard
const mockParentData = {
  id: 'parent-1',
  firstName: 'Mike',
  lastName: 'Doe',
  email: 'mike.doe@example.com',
  phone: '+260974567890',
  profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
  children: [
    {
      id: '1',
      userId: 'user1',
      grade: 10,
      schoolYear: '2024',
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+260974567890',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
      },
      progress: {
        averageScore: 85,
        completedLessons: 24,
        totalLessons: 30,
        passedExams: 8,
        totalExams: 10,
        recentActivity: [
          { 
            id: '1', 
            type: 'exam', 
            title: 'Mathematics Final', 
            date: new Date(), 
            score: 88, 
            status: 'passed' 
          },
          { 
            id: '2', 
            type: 'lesson', 
            title: 'Physics - Chapter 5', 
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
            status: 'completed' 
          },
          { 
            id: '3', 
            type: 'assignment', 
            title: 'Chemistry Lab Report', 
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
            score: 92, 
            status: 'graded' 
          }
        ]
      },
      attendance: {
        present: 28,
        absent: 2,
        late: 1,
        excused: 1,
        percentage: 89
      },
      classes: [
        {
          id: 'c1',
          name: 'Mathematics Grade 10',
          subject: 'Mathematics',
          teacher: 'Mr. Johnson',
          schedule: 'MWF 09:00'
        },
        {
          id: 'c2',
          name: 'Physics Grade 10',
          subject: 'Physics',
          teacher: 'Ms. Williams',
          schedule: 'TTh 11:00'
        }
      ]
    },
    {
      id: '2',
      userId: 'user2',
      grade: 8,
      schoolYear: '2024',
      user: {
        firstName: 'Emma',
        lastName: 'Doe',
        email: 'emma.doe@example.com',
        phone: '+260978901234',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma'
      },
      progress: {
        averageScore: 78,
        completedLessons: 18,
        totalLessons: 25,
        passedExams: 5,
        totalExams: 8,
        recentActivity: [
          { 
            id: '1', 
            type: 'exam', 
            title: 'English Literature', 
            date: new Date(), 
            score: 82, 
            status: 'passed' 
          },
          { 
            id: '2', 
            type: 'lesson', 
            title: 'History - World Wars', 
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
            status: 'completed' 
          }
        ]
      },
      attendance: {
        present: 25,
        absent: 3,
        late: 2,
        excused: 1,
        percentage: 81
      },
      classes: [
        {
          id: 'c3',
          name: 'English Grade 8',
          subject: 'English',
          teacher: 'Mr. Brown',
          schedule: 'MWF 10:00'
        }
      ]
    }
  ],
  notifications: [
    { 
      id: '1', 
      title: 'New Assignment', 
      message: 'John has a new math assignment due tomorrow', 
      date: new Date(), 
      read: false, 
      childId: '1',
      type: 'assignment'
    },
    { 
      id: '2', 
      title: 'Payment Reminder', 
      message: 'School fees payment due in 5 days', 
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
      read: false, 
      childId: null,
      type: 'payment'
    },
    { 
      id: '3', 
      title: 'Exam Results', 
      message: "Emma's science exam results are available", 
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      read: true, 
      childId: '2',
      type: 'exam'
    }
  ],
  messages: [
    { 
      id: '1', 
      from: 'Mr. Smith', 
      fromRole: 'Teacher', 
      message: 'John has been showing great improvement in mathematics.', 
      date: new Date(), 
      read: false, 
      childId: '1' 
    },
    { 
      id: '2', 
      from: 'Ms. Johnson', 
      fromRole: 'Teacher', 
      message: 'Emma needs to complete her pending assignments.', 
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
      read: true, 
      childId: '2' 
    }
  ],
  payments: [
    { 
      id: '1', 
      childId: '1', 
      amount: 1500, 
      status: 'paid' as const, 
      date: new Date(), 
      description: 'Term 1 Fees - Mathematics', 
      method: 'Credit Card',
      currency: 'ZMW'
    },
    { 
      id: '2', 
      childId: '2', 
      amount: 1500, 
      status: 'pending' as const, 
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 
      description: 'Term 1 Fees - English', 
      method: 'mobile_money',
      currency: 'ZMW'
    },
    { 
      id: '3', 
      childId: '1', 
      amount: 500, 
      status: 'pending' as const, 
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), 
      description: 'Activity Fees', 
      method: 'bank_transfer',
      currency: 'ZMW'
    }
  ],
  // Provide payment instructions for offline methods
  paymentInstructions: {
    mobileMoneyProviders: [
      { name: 'MTN Mobile Money', code: 'MTN' },
      { name: 'Airtel Money', code: 'AIRTEL' }
    ],
    bankDetails: {
      accountName: 'PPS School Ltd',
      accountNumber: '1234567890',
      bankName: 'Zambia National Bank',
      swift: null
    }
  },
  savedCards: [
    { id: '1', type: 'visa', last4: '4242', isDefault: true },
    { id: '2', type: 'mastercard', last4: '5555', isDefault: false }
  ],
  totalOutstanding: 2000,
  currency: 'ZMW'
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return mockup data
    return NextResponse.json(mockParentData)
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
