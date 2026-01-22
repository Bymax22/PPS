import { NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(auth) as Session | null

  if (!session || session.user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Mock XP data
    const xpData = {
      currentXP: 1250,
      totalXP: 2800,
      level: 8,
      nextLevelXP: 1500,
      progress: 83.3, // (1250/1500)*100
      rank: 'Advanced Learner',
      dailyStreak: 7
    }

    return NextResponse.json(xpData)
  } catch (error) {
    console.error('XP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}