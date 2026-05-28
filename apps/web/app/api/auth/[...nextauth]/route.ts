import NextAuth from 'next-auth'
import getAuthOptions from '@/lib/auth'

const options = await getAuthOptions()
const handler = NextAuth(options)

export const GET = handler
export const POST = handler
export const dynamic = 'force-dynamic'
