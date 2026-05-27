import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const exams = await prisma.exam.findMany({ take: 20 })
  return NextResponse.json(exams)
}

export async function POST(req: Request) {
  const body = await req.json()
  const created = await prisma.exam.create({ data: body })
  return NextResponse.json(created)
}
