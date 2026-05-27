import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const progress = await prisma.progress.findMany({ take: 50 })
  return NextResponse.json(progress)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  // expect { id, percentage }
  const updated = await prisma.progress.update({ where: { id: body.id }, data: { percentage: body.percentage } })
  return NextResponse.json(updated)
}
