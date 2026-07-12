import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import getAuthOptions from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type PrismaUser = Awaited<ReturnType<typeof prisma.user.findUnique>>
export type AdminContext = {
  admin: NonNullable<PrismaUser>
  session: Awaited<ReturnType<typeof getServerSession>>
}

export async function requireAdmin(): Promise<AdminContext | { error: NextResponse }> {
  const session = await getServerSession(await getAuthOptions())

  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const admin = await prisma.user.findUnique({ where: { email: session.user.email } })

  if (!admin || admin.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { admin, session }
}
