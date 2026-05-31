"use client"
import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LiveRoom from '@/components/LiveRoom'
import { useLesson } from '@/lib/hooks/useLesson'

type TabType = 'lesson' | 'exercises' | 'polls' | 'participants'

export default function StudentLessonPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const lessonId = params.id as string

  const [activeTab, setActiveTab] = useState<TabType>('lesson')
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [handRaised, setHandRaised] = useState(false)

  // For exercise responses
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({})

  // For poll responses
  const [selectedPollOption, setSelectedPollOption] = useState<Record<string, string>>({})

  const { participants, exercises, polls, refetch } = useLesson(lessonId)

  // Join lesson
  useEffect(() => {
    if (!joined && session) {
      handleJoinLesson()
    }
  }, [session, joined, lessonId])

  const handleJoinLesson = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/lessons/${lessonId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceInfo: {} }),
      })

      if (!res.ok) throw new Error('Failed to join lesson')
      setJoined(true)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  // Leave lesson
  const handleLeaveLesson = useCallback(async () => {
    try {
      setLoading(true)
      await fetch(`/api/lessons/${lessonId}/leave`, {
        method: 'POST',
      })
      router.push(`/student/lessons/${lessonId}/summary`)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [lessonId, router])

  // Raise hand
  const handleRaiseHand = useCallback(async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: handRaised ? 'LOWERED_HAND' : 'RAISED_HAND',
          metadata: { timestamp: Date.now() },
        }),
      })

      if (!res.ok) throw new Error('Failed to toggle hand')
      setHandRaised(!handRaised)
    } catch (err) {
      console.error('Error toggling hand:', err)
    }
  }, [lessonId, handRaised])

  // Submit exercise response
  const handleSubmitExercise = useCallback(
    async (exerciseId: string) => {
      try {
        setLoading(true)
        const res = await fetch(`/api/lessons/${lessonId}/exercises/${exerciseId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: exerciseAnswers }),
        })

        if (!res.ok) throw new Error('Failed to submit exercise')
        setSelectedExercise(null)
        setExerciseAnswers({})
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    },
    [lessonId, exerciseAnswers]
  )

  // Submit poll response
  const handleSubmitPollResponse = useCallback(
    async (pollId: string) => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}/polls/${pollId}/respond`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedOption: selectedPollOption[pollId],
          }),
        })

        if (!res.ok) throw new Error('Failed to submit poll response')
      } catch (err) {
        console.error('Error submitting poll response:', err)
      }
    },
    [lessonId, selectedPollOption]
  )

  if (!session) {
    return <div className="p-4 text-center">Not authenticated</div>
  }

  if (!joined) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Joining lesson...</p>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Live Lesson</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRaiseHand}
            className={`px-4 py-2 rounded font-semibold text-sm ${
              handRaised
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            ✋ {handRaised ? 'Lower Hand' : 'Raise Hand'}
          </button>
          <button
            onClick={handleLeaveLesson}
            disabled={loading}
            className="px-4 py-2 rounded font-semibold text-sm bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
          >
            Leave
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
          <p>{error}</p>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video section */}
        <div className="flex-1 bg-black">
          <LiveRoom roomName={lessonId} isTeacher={false} />
        </div>

        {/* Side panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(['lesson', 'exercises', 'polls', 'participants'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 font-medium text-xs ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'lesson' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm">Lesson Info</h3>
                <div className="bg-blue-50 rounded p-2 text-xs">
                  <p className="text-blue-900">
                    You're connected to the live lesson. Follow along with the instructor.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'exercises' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm">Exercises</h3>
                {exercises.length === 0 ? (
                  <p className="text-xs text-gray-500">No exercises yet</p>
                ) : (
                  <div className="space-y-2">
                    {exercises.map((ex) => (
                      <div key={ex.id} className="bg-gray-100 rounded p-2">
                        <div
                          onClick={() => setSelectedExercise(ex.id)}
                          className="cursor-pointer hover:bg-gray-200 rounded p-2"
                        >
                          <p className="font-semibold text-xs">{ex.title}</p>
                          <p className="text-xs text-gray-600">{ex.questions?.length || 0} questions</p>
                        </div>

                        {selectedExercise === ex.id && (
                          <div className="border-t pt-2 mt-2">
                            {ex.questions?.map((q: any) => (
                              <div key={q.id} className="mb-2 text-xs">
                                <p className="font-semibold text-xs mb-1">{q.text}</p>
                                <input
                                  type="text"
                                  placeholder="Your answer"
                                  onChange={(e) =>
                                    setExerciseAnswers({
                                      ...exerciseAnswers,
                                      [q.id]: e.target.value,
                                    })
                                  }
                                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                                />
                              </div>
                            ))}
                            <button
                              onClick={() => handleSubmitExercise(ex.id)}
                              disabled={loading}
                              className="w-full px-2 py-1 rounded font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-xs mt-2"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'polls' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm">Live Polls</h3>
                {polls.length === 0 ? (
                  <p className="text-xs text-gray-500">No active polls</p>
                ) : (
                  <div className="space-y-2">
                    {polls.map((p) => (
                      <div key={p.id} className="bg-gray-100 rounded p-2">
                        <p className="font-semibold text-xs mb-2">{p.question}</p>
                        {p.isActive ? (
                          <div className="space-y-1">
                            {p.options?.map((opt: any) => (
                              <label key={opt.id} className="flex items-center text-xs cursor-pointer">
                                <input
                                  type="radio"
                                  name={`poll-${p.id}`}
                                  value={opt.id}
                                  onChange={(e) =>
                                    setSelectedPollOption({
                                      ...selectedPollOption,
                                      [p.id]: e.target.value,
                                    })
                                  }
                                  className="mr-2"
                                />
                                {opt.text}
                              </label>
                            ))}
                            <button
                              onClick={() => handleSubmitPollResponse(p.id)}
                              className="w-full px-2 py-1 rounded font-semibold bg-green-600 hover:bg-green-700 text-white text-xs mt-2"
                            >
                              Vote
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">Poll closed</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm">Participants ({participants.length + 1})</h3>
                {participants.length === 0 ? (
                  <p className="text-xs text-gray-500">Just you so far</p>
                ) : (
                  <div className="space-y-1">
                    {participants.map((p) => (
                      <div key={p.id} className="bg-green-50 rounded p-2 text-xs border border-green-200">
                        <p className="font-semibold text-green-900">{p.name}</p>
                        <p className="text-xs text-green-600">🟢 Active</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
