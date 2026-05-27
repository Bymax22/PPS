import NextAuth from 'next-auth'
import getAuthOptions from '@/lib/auth'

async function handler(req: Request) {
	const opts = await getAuthOptions()
	const nextHandler = NextAuth(opts)
	return nextHandler(req)
}

export const GET = handler
export const POST = handler
