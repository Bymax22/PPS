import { NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(auth) as Session | null

  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Mock badges data
    const badges = [
      {
        id: '1',
        name: 'Perfect Score',
        description: 'Get 100% on any assignment',
        icon: '🏆',
        color: 'bg-yellow-500',
        category: 'academic',
        earned: true,
        progress: 100,
        threshold: 1,
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Consistent Learner',
        description: 'Complete 10 assignments in a row',
        icon: '📚',
        color: 'bg-blue-500',
        category: 'consistency',
        earned: false,
        progress: 70,
        threshold: 10
      },
      {
        id: '3',
        name: 'Discussion Leader',
        description: 'Post 20 helpful forum replies',
        icon: '💬',
        color: 'bg-green-500',
        category: 'collaboration',
        earned: false,
        progress: 45,
        threshold: 20
      },
      {
        id: '4',
        name: 'Early Bird',
        description: 'Submit 5 assignments before deadline',
        icon: '⏰',
        color: 'bg-purple-500',
        category: 'participation',
        earned: true,
        progress: 100,
        threshold: 5,
        earnedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'Math Master',
        description: 'Complete all math assignments with 90%+',
        icon: '🔢',
        color: 'bg-red-500',
        category: 'mastery',
        earned: false,
        progress: 30,
        threshold: 15
      }
    ]

    return NextResponse.json(badges)
  } catch (error) {
    console.error('Badges error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}