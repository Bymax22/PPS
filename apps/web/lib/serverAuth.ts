import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import getAuthOptions from './auth'

export async function requireAuth(req: NextRequest) {
  const opts = await getAuthOptions()
  const session = await getServerSession(undefined, undefined, opts)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session
}
