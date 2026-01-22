import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { JWT } from 'next-auth/jwt'
import type { Session, User } from 'next-auth'

type TokenWithRole = JWT & { role?: string; sub?: string }

// Lightweight NextAuth configuration for the web package.
// We avoid importing Prisma here to prevent requiring `@prisma/client` at build-time.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize() {
        // Credential-based sign-in is handled by the API in the monorepo.
        // Returning null here disables direct credential auth in the web package.
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | null }) {
      const t = token as TokenWithRole
      if (user) t.role = (user as any).role
      return t
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const sUser = session.user as any
      const t = token as TokenWithRole
      if (t.role) sUser.role = t.role
      if (t.sub) sUser.id = t.sub
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
})