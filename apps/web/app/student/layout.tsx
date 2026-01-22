'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import StudentSidebar from './StudentSidebar'
import StudentHeader from './StudentHeader'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0713FB]"></div>
      </div>
    )
  }

  if (!session || session.user.role !== 'STUDENT') {
    redirect('/auth/signin')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}