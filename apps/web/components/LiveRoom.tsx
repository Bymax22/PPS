"use client"
import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Room,
  Track,
  Participant,
  RoomEvent,
  ParticipantEvent,
  DataPacket_Kind,
} from 'livekit-client'
import fetchLiveKitToken from '@/lib/livekit'

type LiveRoomProps = {
  roomName: string
  isTeacher?: boolean
  lessonId?: string
  onParticipantCountChange?: (count: number) => void
}

type ChatMessage = {
  from: string
  text: string
  timestamp: number
}

export default function LiveRoom({
  roomName,
  isTeacher = false,
  lessonId,
  onParticipantCountChange,
}: LiveRoomProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [audioEnabled, setAudioEnabled] = useState(isTeacher)
  const [videoEnabled, setVideoEnabled] = useState(isTeacher)
  const [screenShareEnabled, setScreenShareEnabled] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [error, setError] = useState<string>('')

  const videoContainerRef = useRef<HTMLDivElement>(null)
  const roster = useRef<Map<string, Participant>>(new Map())

  // Initialize room connection
  useEffect(() => {
    let mounted = true

    async function initRoom() {
      try {
        const { token, displayName, isHost } = await fetchLiveKitToken(roomName, isTeacher ? 'true' : undefined)

        const r = new Room({
          audioCaptureDefaults: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        })
        await r.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL || 'ws://localhost:7880', token, {
          autoSubscribe: true,
        })

        if (!mounted) {
          r.disconnect()
          return
        }

        setRoom(r)

        // Publish local tracks if teacher
        if (isTeacher) {
          try {
            const tracks = await r.localParticipant.createTracks({
              audio: true,
              video: { facingMode: 'user', resolution: { width: 1280, height: 720 } },
            })
            for (const t of tracks) {
              await r.localParticipant.publishTrack(t)
            }
          } catch (e) {
            console.warn('Local track publish failed:', e)
          }
        }

        // Handle participant connected
        const onParticipantConnected = (p: Participant) => {
          setParticipants((prev) => {
            if (!prev.find((x) => x.identity === p.identity)) {
              return [...prev, p]
            }
            return prev
          })
          roster.current.set(p.identity, p)
          attachTrackSubscriptions(p)
        }

        // Handle participant disconnected
        const onParticipantDisconnected = (p: Participant) => {
          setParticipants((prev) => prev.filter((x) => x.identity !== p.identity))
          roster.current.delete(p.identity)
        }

        r.on(RoomEvent.ParticipantConnected, onParticipantConnected)
        r.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected)

        // Handle data messages (chat)
        r.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: Participant, kind?: any) => {
          try {
            const decoder = new TextDecoder()
            const msg = JSON.parse(decoder.decode(payload))
            if (msg.type === 'chat') {
              setChatMessages((prev) => [
                ...prev,
                { from: msg.from, text: msg.text, timestamp: Date.now() },
              ])
            }
          } catch (e) {
            console.error('Error parsing data message', e)
          }
        })

        // Initial participant list
        r.remoteParticipants.forEach(onParticipantConnected)

        onParticipantCountChange?.(r.numParticipants)
      } catch (err) {
        console.error('LiveRoom init failed', err)
        setError(String(err))
      }
    }

    initRoom()

    return () => {
      mounted = false
      room?.disconnect()
    }
  }, [roomName, isTeacher, onParticipantCountChange])

  // Attach track subscriptions and render
  const attachTrackSubscriptions = (participant: Participant) => {
    const onTrackSubscribed = (track: Track) => {
      const element = track.attach()
      if (videoContainerRef.current) {
        const div = document.createElement('div')
        div.id = `${participant.sid}-${track.sid}`
        div.className = 'video-track'
        div.appendChild(element)
        videoContainerRef.current.appendChild(div)
      }
    }

    const onTrackUnsubscribed = (track: Track) => {
      track.detach()
      const element = document.getElementById(`${participant.sid}-${track.sid}`)
      element?.remove()
    }

    participant.on(ParticipantEvent.TrackSubscribed, (track: Track) => onTrackSubscribed(track))
    participant.on(ParticipantEvent.TrackUnsubscribed, (track: Track) => onTrackUnsubscribed(track))

    participant.getTrackPublications().forEach((pub) => {
      if (pub.isSubscribed && pub.track) {
        onTrackSubscribed(pub.track as Track)
      }
    })
  }

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!room) return
    const enabled = !audioEnabled
    await room.localParticipant.setMicrophoneEnabled(enabled)
    setAudioEnabled(enabled)
  }, [room, audioEnabled])

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!room) return
    const enabled = !videoEnabled
    await room.localParticipant.setCameraEnabled(enabled)
    setVideoEnabled(enabled)
  }, [room, videoEnabled])

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (!room) return
    if (screenShareEnabled) {
      await room.localParticipant.setScreenShareEnabled(false)
      setScreenShareEnabled(false)
    } else {
      try {
        await room.localParticipant.setScreenShareEnabled(true)
        setScreenShareEnabled(true)
      } catch (e) {
        console.error('Screen share failed', e)
      }
    }
  }, [room, screenShareEnabled])

  // Send chat message
  const sendChatMessage = useCallback(async () => {
    if (!room || !chatInput.trim()) return

    const message = {
      type: 'chat',
      from: room.localParticipant.name || room.localParticipant.identity,
      text: chatInput,
      timestamp: Date.now(),
    }

    try {
      await room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(message)))
      setChatMessages((prev) => [...prev, { from: message.from, text: message.text, timestamp: message.timestamp }])
      setChatInput('')
    } catch (e) {
      console.error('Chat send failed', e)
    }
  }, [room, chatInput])

  return (
    <div className="live-room-container flex flex-col h-screen bg-gray-900 text-white">
      {/* Error banner */}
      {error && (
        <div className="bg-red-600 p-4 text-center">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Main video area */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden">
          <div
            ref={videoContainerRef}
            className="w-full h-full grid grid-cols-2 gap-2 p-2 auto-rows-fr"
            style={{ gridAutoFlow: 'dense' }}
          >
            {/* Videos will be rendered here */}
          </div>
        </div>

        {/* Sidebar: Roster and Chat */}
        <div className="w-80 flex flex-col gap-4">
          {/* Roster */}
          <div className="bg-gray-800 rounded-lg p-4 flex-1 overflow-y-auto">
            <h3 className="font-bold mb-3">Participants ({participants.length + 1})</h3>
            <div className="space-y-2">
              {/* Local participant */}
              <div className="bg-gray-700 rounded p-2 text-sm">
                <div className="font-semibold">You</div>
                <div className="text-xs text-gray-400">{isTeacher ? 'Instructor' : 'Student'}</div>
              </div>

              {/* Remote participants */}
                  {participants.map((p) => (
                <div key={p.identity} className="bg-gray-700 rounded p-2 text-sm">
                  <div className="font-semibold truncate">{p.name || p.identity}</div>
                  <div className="text-xs text-gray-400">
                    {p.getTrackPublications().length > 0 ? '🔴 Active' : '⚪ Listening'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-80">
            <h3 className="font-bold mb-3">Chat</h3>
            <div className="flex-1 overflow-y-auto mb-3 space-y-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className="text-sm">
                  <div className="font-semibold text-blue-300">{msg.from}</div>
                  <div className="text-gray-300">{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type message..."
                className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500"
              />
              <button
                onClick={sendChatMessage}
                className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-sm font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`px-6 py-2 rounded font-semibold ${
            audioEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          🎤 {audioEnabled ? 'Mute' : 'Unmute'}
        </button>

        <button
          onClick={toggleVideo}
          className={`px-6 py-2 rounded font-semibold ${
            videoEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          📹 {videoEnabled ? 'Stop Camera' : 'Start Camera'}
        </button>

        {isTeacher && (
          <button
            onClick={toggleScreenShare}
            className={`px-6 py-2 rounded font-semibold ${
              screenShareEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            🖥️ {screenShareEnabled ? 'Stop Share' : 'Share Screen'}
          </button>
        )}

        <button className="px-6 py-2 rounded font-semibold bg-red-700 hover:bg-red-800 ml-auto">
          📞 Leave
        </button>
      </div>
    </div>
  )
}
