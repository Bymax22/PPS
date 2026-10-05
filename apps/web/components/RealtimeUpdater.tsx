'use client'

import Ably from 'ably'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function RealtimeUpdater() {
  const { status } = useSession()
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router

  useEffect(() => {
    if (status !== 'authenticated') return

    const realtime = new Ably.Realtime({
      authUrl: '/api/realtime/token',
      authMethod: 'GET',
    })
    const channel = realtime.channels.get('school-updates')
    let refreshTimer: ReturnType<typeof setTimeout> | undefined

    const onDataChange = (message: Ably.Message) => {
      window.dispatchEvent(new CustomEvent('pps:data-changed', { detail: message.data }))
      if (refreshTimer) return
      refreshTimer = setTimeout(() => {
        refreshTimer = undefined
        routerRef.current.refresh()
      }, 200)
    }

    channel.subscribe('data.changed', onDataChange).catch((error: unknown) => {
      console.error('Failed to subscribe to realtime data changes', error)
    })

    realtime.connection.on('failed', (stateChange) => {
      console.error('Realtime connection failed', stateChange.reason)
    })

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer)
      channel.unsubscribe('data.changed', onDataChange)
      realtime.close()
    }
  }, [status])

  return null
}
