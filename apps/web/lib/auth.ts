import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'

function getDashboardPath(role?: string) {
  switch (role) {
    case 'TEACHER':
      return '/teacher'
    case 'PARENT':
      return '/parent'
    case 'ADMIN':
      return '/admin'
    default:
      return '/student'
  }
}

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
          otp: { label: 'OTP', type: 'text' },
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

          const metadata = (user.metadata as Record<string, any> | null) || {}
          const otp = credentials.otp as string | undefined
          const savedOtp = metadata.loginOtp as string | undefined
          const expiresAt = metadata.loginOtpExpiresAt as string | undefined

          if (!otp || !savedOtp || !expiresAt) {
            throw new Error('A verification code is required to sign in.')
          }

          const expiry = new Date(expiresAt)
          if (Number.isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
            throw new Error('Your sign-in code has expired. Please request a new one.')
          }

          if (savedOtp !== otp) {
            throw new Error('The sign-in code is invalid.')
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              metadata: {
                ...metadata,
                loginOtp: null,
                loginOtpExpiresAt: null,
              },
            },
          })

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

        if (!token.email && token.sub) {
          const persistedUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
          })

          if (persistedUser) {
            token.email = persistedUser.email
            token.role = persistedUser.role as any
            token.name = `${persistedUser.firstName ?? ''} ${persistedUser.lastName ?? ''}`.trim()
          }
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
