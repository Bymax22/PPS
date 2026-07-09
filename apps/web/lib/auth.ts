import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'

// Build Auth options lazily to avoid importing Prisma at module load time
export async function getAuthOptions(): Promise<NextAuthOptions> {
  const { prisma } = await import('./prisma')
  const options: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text' },
          password: { label: 'Password', type: 'password' },
          role: { label: 'Role', type: 'text' },
        },
        async authorize(credentials) {
          if (!credentials || !credentials.email || !credentials.password || !credentials.role) return null
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user || !user.password) return null
          if (!user.emailVerified) {
            throw new Error('Please verify your email before signing in. Check your inbox for a verification link.')
          }
          const isValid = await bcrypt.compare(credentials.password, user.password)
          if (!isValid) return null
          if (user.role !== credentials.role) {
            throw new Error('User does not have access to this role')
          }
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
          }
        },
      }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id as string
          token.role = (user as any).role
          token.email = (user as any).email ?? token.email
          token.name = (user as any).name ?? token.name
        }
        return token
      },
      async session({ session, token }) {
        if (token.sub) {
          session.user.id = token.sub
        }
        if (token.email) {
          session.user.email = token.email
        }
        if (token.name) {
          session.user.name = token.name
        }
        if (token.role) {
          session.user.role = token.role as 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN'
        }
        return session
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }

  return options
}

export default getAuthOptions
