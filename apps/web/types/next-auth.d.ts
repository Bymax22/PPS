import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
      /** The user's role. */
      role?: 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN'
    } & DefaultSession['user']
  }

  interface User {
    id: string
    role?: 'STUDENT' | 'PARENT' | 'TEACHER' | 'ADMIN'
  }
}
