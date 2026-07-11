// apps/web/lib/hooks/useLesson.ts
import { useState, useCallback, useEffect } from 'react'

export type LessonParticipant = {
  id: string
  name: string
  role: 'TEACHER' | 'STUDENT'
  isActive: boolean
  participationScore: number
}

export function useLesson(lessonId: string) {
  const [participants, setParticipants] = useState<LessonParticipant[]>([])
  const [exercises, setExercises] = useState<any[]>([])
  const [polls, setPolls] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchParticipants = useCallback(async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/attendees`)
      if (!res.ok) throw new Error('Failed to fetch attendees')
      const data = await res.json()
      const participants = (data.activeAttendees || []).map((attendee: any) => ({
        id: attendee.id,
        name:
          attendee.user?.firstName || attendee.user?.lastName
            ? `${attendee.user?.firstName || ''} ${attendee.user?.lastName || ''}`.trim()
            : attendee.user?.role || attendee.id,
        role: attendee.user?.role || 'STUDENT',
        isActive: attendee.leftAt === null,
        participationScore: attendee.durationSeconds || 0,
      }))
      setParticipants(participants)
    } catch (err) {
      console.error('Error fetching participants:', err)
    }
  }, [lessonId])

  const fetchExercises = useCallback(async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/exercises`)
      if (!res.ok) throw new Error('Failed to fetch exercises')
      const data = await res.json()
      setExercises(data.exercises || [])
    } catch (err) {
      console.error('Error fetching exercises:', err)
    }
  }, [lessonId])

  const fetchPolls = useCallback(async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/polls`)
      if (!res.ok) throw new Error('Failed to fetch polls')
      const data = await res.json()
      setPolls(data.polls || [])
    } catch (err) {
      console.error('Error fetching polls:', err)
    }
  }, [lessonId])

  // Poll for updates less aggressively to avoid exhausting the database pool
  useEffect(() => {
    let active = true

    const refresh = async () => {
      if (!active) return
      await Promise.allSettled([fetchParticipants(), fetchExercises(), fetchPolls()])
    }

    void refresh()

    const interval = window.setInterval(() => {
      void refresh()
    }, 10000)

    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [lessonId, fetchParticipants, fetchExercises, fetchPolls])

  return { participants, exercises, polls, loading, refetch: fetchParticipants }
}
