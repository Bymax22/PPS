"use client"
import React, { useState, useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import LiveRoom from '@/components/LiveRoom'
import { useLesson } from '@/lib/hooks/useLesson'

type TabType = 'classroom' | 'exercises' | 'polls' | 'students'

async function readApiErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json()
    if (typeof data?.error === 'string' && data.error.trim()) return data.error
    if (typeof data?.message === 'string' && data.message.trim()) return data.message
  } catch {
    // Ignore JSON parse failures and fall back to the generic message
  }

  return fallback
}

export default function TeacherLessonPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const lessonId = params.id as string

  const [activeTab, setActiveTab] = useState<TabType>('classroom')
  const [lessonStarted, setLessonStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // For creating exercise
  const [exerciseTitle, setExerciseTitle] = useState('')
  const [exerciseQuestions, setExerciseQuestions] = useState<Array<{ text: string; type: string }>>([
    { text: '', type: 'MCQ' },
  ])

  // For creating poll
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState<string[]>(['', ''])

  const { participants, exercises, polls, refetch } = useLesson(lessonId)

  // Start live lesson
  const handleStartLesson = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/lessons/live/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          title: 'Live Lesson',
        }),
      })

      if (!res.ok) {
        const message = await readApiErrorMessage(res, 'Failed to start lesson')
        throw new Error(message)
      }

      const data = await res.json().catch(() => null)
      setLessonStarted(true)
      if (data?.alreadyLive) {
        setError('')
      }
    } catch (err) {
      setError(String(err))
      console.error('Error starting lesson:', err)
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  // End live lesson
  const handleEndLesson = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/lessons/live/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      })

      if (!res.ok) {
        const message = await readApiErrorMessage(res, 'Failed to end lesson')
        throw new Error(message)
      }

      setLessonStarted(false)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [lessonId])

  // Create exercise
  const handleCreateExercise = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/lessons/${lessonId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: exerciseTitle,
          questions: exerciseQuestions,
        }),
      })

      if (!res.ok) throw new Error('Failed to create exercise')
      setExerciseTitle('')
      setExerciseQuestions([{ text: '', type: 'MCQ' }])
      refetch()
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [lessonId, exerciseTitle, exerciseQuestions, refetch])

  // Create poll
  const handleCreatePoll = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/lessons/${lessonId}/polls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: pollQuestion,
          type: 'SINGLE_CHOICE',
          options: pollOptions.filter(o => o.trim()).map((o, i) => ({ id: `opt-${i}`, text: o })),
        }),
      })

      if (!res.ok) throw new Error('Failed to create poll')
      setPollQuestion('')
      setPollOptions(['', ''])
      refetch()
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }, [lessonId, pollQuestion, pollOptions, refetch])

  if (!session) {
    return <div className="p-4 text-center">Not authenticated</div>
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Live Lesson</h1>
          <p className="text-sm text-gray-600">
            {lessonStarted ? '🔴 Live' : '⚪ Not started'}
          </p>
        </div>
        <div className="flex gap-2">
          {!lessonStarted ? (
            <button
              onClick={handleStartLesson}
              disabled={loading}
              className="px-6 py-2 rounded font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              Start Lesson
            </button>
          ) : (
            <button
              onClick={handleEndLesson}
              disabled={loading}
              className="px-6 py-2 rounded font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              End Lesson
            </button>
          )}
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
        {lessonStarted && (
          <div className="flex-1 bg-black">
            <LiveRoom roomName={lessonId} isTeacher={true} />
          </div>
        )}

        {/* Control panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(['classroom', 'exercises', 'polls', 'students'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-medium text-sm ${
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
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'classroom' && (
              <div className="space-y-4">
                <h3 className="font-bold">Classroom Status</h3>
                <div className="bg-blue-50 rounded p-3 text-sm">
                  <p className="font-semibold text-blue-900">Lesson Link</p>
                  <code className="text-xs bg-white rounded px-2 py-1 block mt-1 overflow-x-auto">
                    {typeof window !== 'undefined' ? window.location.origin + `/student/lessons/${lessonId}` : ''}
                  </code>
                </div>
              </div>
            )}

            {activeTab === 'exercises' && (
              <div className="space-y-4">
                <h3 className="font-bold">Create Exercise</h3>

                <div>
                  <label className="block text-sm font-semibold mb-1">Exercise Title</label>
                  <input
                    type="text"
                    value={exerciseTitle}
                    onChange={(e) => setExerciseTitle(e.target.value)}
                    placeholder="e.g., Algebra Quiz"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Questions</label>
                  {exerciseQuestions.map((q, i) => (
                    <div key={i} className="mb-2 space-y-1">
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => {
                          const newQs = [...exerciseQuestions]
                          newQs[i].text = e.target.value
                          setExerciseQuestions(newQs)
                        }}
                        placeholder="Question text"
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => setExerciseQuestions([...exerciseQuestions, { text: '', type: 'MCQ' }])}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-2"
                  >
                    + Add Question
                  </button>
                </div>

                <button
                  onClick={handleCreateExercise}
                  disabled={loading || !exerciseTitle}
                  className="w-full px-4 py-2 rounded font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 text-sm"
                >
                  Publish Exercise
                </button>

                {/* List exercises */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-sm mb-2">Active Exercises</h4>
                  {exercises.map((ex) => (
                    <div key={ex.id} className="bg-gray-100 rounded p-2 mb-2 text-sm">
                      <p className="font-semibold">{ex.title}</p>
                      <p className="text-xs text-gray-600">{ex._count?.responses || 0} responses</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'polls' && (
              <div className="space-y-4">
                <h3 className="font-bold">Create Poll</h3>

                <div>
                  <label className="block text-sm font-semibold mb-1">Question</label>
                  <textarea
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="e.g., What is the capital of France?"
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Options</label>
                  {pollOptions.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions]
                        newOpts[i] = e.target.value
                        setPollOptions(newOpts)
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
                    />
                  ))}
                  <button
                    onClick={() => setPollOptions([...pollOptions, ''])}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    + Add Option
                  </button>
                </div>

                <button
                  onClick={handleCreatePoll}
                  disabled={loading || !pollQuestion}
                  className="w-full px-4 py-2 rounded font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 text-sm"
                >
                  Start Poll
                </button>

                {/* List active polls */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-sm mb-2">Active Polls</h4>
                  {polls.map((p) => (
                    <div key={p.id} className="bg-gray-100 rounded p-2 mb-2 text-sm">
                      <p className="font-semibold truncate">{p.question}</p>
                      <p className="text-xs text-gray-600">{p._count?.responses || 0} responses</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm">Active Students ({participants.length})</h3>
                {participants.length === 0 ? (
                  <p className="text-sm text-gray-500">No students joined yet</p>
                ) : (
                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div key={p.id} className="bg-blue-50 rounded p-2 text-sm">
                        <div className="font-semibold text-blue-900">{p.name}</div>
                        <div className="text-xs text-blue-600 mt-1">✓ Joined · Score {p.participationScore}</div>
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
