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
      setParticipants(data.activeAttendees || [])
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

  // Poll for updates every 2 seconds
  useEffect(() => {
    fetchParticipants()
    fetchExercises()
    fetchPolls()

    const interval = setInterval(() => {
      fetchParticipants()
      fetchPolls()
    }, 2000)

    return () => clearInterval(interval)
  }, [lessonId, fetchParticipants, fetchPolls])

  return { participants, exercises, polls, loading, refetch: fetchParticipants }
}
