// apps/web/lib/hooks/useRealtimeLesson.ts
import { useEffect, useState, useCallback, useRef } from 'react'

type MessageType = 'participant_joined' | 'participant_left' | 'poll_created' | 'exercise_created' | 'poll_closed'

export type RealtimeMessage = {
  type: MessageType
  data: any
  timestamp: number
}

export function useRealtimeLesson(lessonId: string) {
  const [messages, setMessages] = useState<RealtimeMessage[]>([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // For now, use polling as a fallback. In production, integrate with a pub/sub service
    // like Redis, Pusher, or Supabase Realtime.
    
    // Example: Connect to a WebSocket server or use Server-Sent Events
    // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // const ws = new WebSocket(`${protocol}//your-backend/ws/lessons/${lessonId}`)
    
    // For MVP, polling is sufficient
    setConnected(true)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [lessonId])

  const publishMessage = useCallback(
    (type: MessageType, data: any) => {
      const message: RealtimeMessage = {
        type,
        data,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, message])
    },
    []
  )

  return { messages, connected, publishMessage }
}
