import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const lessons = await prisma.lesson.findMany({ take: 20 })
  return NextResponse.json(lessons)
}

export async function POST(req: Request) {
  const body = await req.json()
  const created = await prisma.lesson.create({ data: body })
  return NextResponse.json(created)
}
