'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import RealtimeUpdater from '@/components/RealtimeUpdater'

export default function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <RealtimeUpdater />
      {children}
    </SessionProvider>
  )
}
