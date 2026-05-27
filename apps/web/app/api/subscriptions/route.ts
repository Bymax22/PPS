import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const subs = await prisma.subscription.findMany({ take: 20 })
  return NextResponse.json(subs)
}

export async function POST(req: Request) {
  const body = await req.json()
  // create subscription (placeholder)
  const created = await prisma.subscription.create({ data: body })
  return NextResponse.json(created)
}
