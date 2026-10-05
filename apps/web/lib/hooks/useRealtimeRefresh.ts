'use client'

import { useEffect, useRef } from 'react'

export function useRealtimeRefresh(refresh: () => void | Promise<void>) {
  const refreshRef = useRef(refresh)
  refreshRef.current = refresh

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined

    const onDataChange = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = undefined
        void refreshRef.current()
      }, 150)
    }

    window.addEventListener('pps:data-changed', onDataChange)
    return () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('pps:data-changed', onDataChange)
    }
  }, [])
}
