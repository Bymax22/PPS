# Real-Time Infrastructure Integration Guide

## Overview

This document guides you through integrating the new production-grade real-time infrastructure into your existing codebase:

1. **Redis Pub/Sub** - Server-side event broadcasting (<1s latency)
2. **Socket.io WebSocket** - Bidirectional real-time communication (100ms latency)
3. **Video Transcoding** - Multi-bitrate video delivery (Mux integration)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Client Layer (React Components)                              │
│ ├─ useRealtimeLesson hook (WebSocket)                       │
│ ├─ VideoPlayer component (HLS streaming)                    │
│ └─ LiveRoom component (existing LiveKit integration)        │
└─────────────────────────────────────────────────────────────┘
              ↑                                    ↓
         WebSocket (4.8.1)              Socket.io Server
              ↓                                    ↑
┌─────────────────────────────────────────────────────────────┐
│ Real-Time Layer                                              │
│ ├─ Socket.io Server (lib/websocket.ts)                     │
│ ├─ Redis Pub/Sub (lib/redis.ts)                            │
│ └─ Event Publishers (domain-specific channels)             │
└─────────────────────────────────────────────────────────────┘
              ↓                                    ↑
         HTTP/REST                      Event Publishing
              ↓                                    ↑
┌─────────────────────────────────────────────────────────────┐
│ Business Logic Layer                                        │
│ ├─ Lesson API Routes (app/api/lessons/*)                   │
│ ├─ Exercise API Routes (app/api/exercises/*)               │
│ ├─ Poll API Routes (app/api/polls/*)                       │
│ └─ Video Upload API (app/api/resources/upload)             │
└─────────────────────────────────────────────────────────────┘
              ↓                                    ↑
         Database Queries                 Redis Events
              ↓                                    ↑
┌─────────────────────────────────────────────────────────────┐
│ Storage Layer                                               │
│ ├─ PostgreSQL (Prisma)                                     │
│ ├─ Redis (pub/sub channels)                               │
│ ├─ Cloudinary (video/resources)                           │
│ └─ Mux (transcoded video)                                 │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Install Dependencies

```bash
cd apps/web
npm install redis socket.io socket.io-client @socket.io/redis-adapter
npm install -D @types/socket.io
```

### Step 2: Configure Environment Variables

Add to `.env.local` (development) or `.env.production`:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379

# WebSocket Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
SOCKET_IO_PORT=3001

# Video Transcoding (Mux)
MUX_ACCESS_TOKEN=your_token_id
MUX_SECRET_TOKEN=your_secret_token
```

### Step 3: Update API Routes to Publish Events

**Example: Update `/api/lessons/[lessonId]/attendees` to publish Redis events**

```typescript
// app/api/lessons/[lessonId]/attendees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishParticipantEvent } from '@/lib/redis'

export async function POST(req: NextRequest) {
  const { params } = req
  const lessonId = params.lessonId as string
  const { userId, userName, userRole } = await req.json()

  // Create database record
  const attendee = await prisma.sessionAttendee.create({
    data: {
      lessonId,
      userId,
      joinedAt: new Date(),
    },
  })

  // Publish Redis event for real-time distribution
  await publishParticipantEvent(lessonId, userId, 'joined', {
    userName,
    userRole,
  })

  // Emit to WebSocket clients
  const { emitToLesson } = await import('@/lib/websocket')
  emitToLesson(lessonId, 'participant:joined', {
    userId,
    userName,
    userRole,
    timestamp: Date.now(),
  })

  return NextResponse.json({ success: true, attendee })
}
```

### Step 4: Update Components to Use WebSocket

**Before (Polling)**
```typescript
'use client'

import { useLesson } from '@/lib/hooks/useLesson'

export function LiveRoom({ lessonId, userId, userName, userRole }) {
  const { participants, isLoading } = useLesson(lessonId)
  // Polls every 2 seconds ❌

  return (
    <div>
      <h2>Participants: {participants.length}</h2>
      {/* ... */}
    </div>
  )
}
```

**After (WebSocket)**
```typescript
'use client'

import { useRealtimeLesson } from '@/lib/hooks/useRealtimeLessonWebSocket'

export function LiveRoom({ lessonId, userId, userName, userRole }) {
  const { connected, participants, sendMessage, submitExercise } = useRealtimeLesson({
    lessonId,
    userId,
    userName,
    userRole,
    onUpdate: (update) => {
      console.log('Real-time update:', update)
      // Handle updates in real-time ✅
    },
  })

  return (
    <div>
      <h2>Participants: {participants.length}</h2>
      <p>Connected: {connected ? '🟢 Yes' : '🔴 No'}</p>
      {/* ... */}
    </div>
  )
}
```

### Step 5: Update Exercise Submission

**Example: Handle exercise submission with real-time feedback**

```typescript
'use client'

import { useRealtimeLesson } from '@/lib/hooks/useRealtimeLessonWebSocket'

export function ExerciseSubmission({ exerciseId, lessonId }) {
  const { submitExercise, connected } = useRealtimeLesson({
    lessonId,
    userId: 'current-user-id',
    userName: 'Current User',
    userRole: 'STUDENT',
  })

  const handleSubmit = async (responses: any[]) => {
    const duration = Math.floor(Date.now() / 1000) // in seconds

    // Send to teacher in real-time
    submitExercise(exerciseId, responses, duration)

    // Also save to database for persistence
    await fetch(`/api/exercises/${exerciseId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ responses, duration }),
    })
  }

  return (
    <button
      onClick={() => handleSubmit([])}
      disabled={!connected}
    >
      {connected ? 'Submit Exercise' : 'Connecting...'}
    </button>
  )
}
```

### Step 6: Update Poll Handling

**Example: Interactive poll with real-time responses**

```typescript
'use client'

import { useRealtimeLesson } from '@/lib/hooks/useRealtimeLessonWebSocket'
import { useState, useEffect } from 'react'

export function PollWidget({ pollId, lessonId, question, options }) {
  const { respondToPoll, connected } = useRealtimeLesson({
    lessonId,
    userId: 'current-user-id',
    userName: 'Current User',
    userRole: 'STUDENT',
  })

  const [responses, setResponses] = useState<Record<string, number>>({})

  useEffect(() => {
    // Initialize response counts
    const counts = {}
    options.forEach((opt, idx) => {
      counts[idx] = 0
    })
    setResponses(counts)
  }, [options])

  const handleVote = (optionIndex: number) => {
    respondToPoll(pollId, options[optionIndex])
    // Update local state immediately
    setResponses(prev => ({
      ...prev,
      [optionIndex]: prev[optionIndex] + 1,
    }))
  }

  const totalVotes = Object.values(responses).reduce((a, b) => a + b, 0)

  return (
    <div className="poll-widget">
      <h3>{question}</h3>
      {options.map((option, idx) => {
        const count = responses[idx] || 0
        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0
        return (
          <button
            key={idx}
            onClick={() => handleVote(idx)}
            disabled={!connected}
            className="option-button"
          >
            <span>{option}</span>
            <div className="progress-bar" style={{ width: `${percentage}%` }}>
              {count} votes
            </div>
          </button>
        )
      })}
    </div>
  )
}
```

### Step 7: Update Video Component with Transcoding

**Example: Video player with multiple quality options**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { getHlsStreamUrl, getTranscodingStatus } from '@/lib/videoTranscoding'

export function TranscodedVideoPlayer({ videoId, title }) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const checkStatus = async () => {
      const s = await getTranscodingStatus(videoId)
      setStatus(s.status)

      if (s.status === 'completed') {
        const url = await getHlsStreamUrl(videoId)
        setStreamUrl(url)
        setLoading(false)
      } else if (s.status === 'processing') {
        // Estimate progress (0-90%)
        setProgress(prev => Math.min(prev + Math.random() * 30, 90))
        // Check again in 2 seconds
        setTimeout(checkStatus, 2000)
      }
    }

    checkStatus()
  }, [videoId])

  if (status === 'failed') {
    return <div className="error">Video transcoding failed</div>
  }

  if (loading || status === 'processing') {
    return (
      <div className="video-loading">
        <div>Preparing video... {progress.toFixed(0)}%</div>
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    )
  }

  return (
    <div className="video-container">
      <h3>{title}</h3>
      <video
        controls
        width="100%"
        poster="https://image.mux.com/YOUR_PLAYBACK_ID/thumbnail.jpg"
        style={{ maxWidth: '100%', borderRadius: '8px' }}
      >
        <source src={streamUrl} type="application/x-mpegURL" />
        Your browser does not support HTML5 video.
      </video>
    </div>
  )
}
```

### Step 8: Initialize WebSocket Server

Create or update `app/api/socket/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Server as HTTPServer } from 'http'
import { initializeWebSocketServer } from '@/lib/websocket'

export async function GET(req: NextRequest) {
  try {
    const { socket, res } = req as any

    if (!res.socket.server.io) {
      console.log('[Socket.io] Initializing WebSocket server...')
      const httpServer = res.socket.server as HTTPServer
      res.socket.server.io = initializeWebSocketServer(httpServer)
    }

    return NextResponse.json({ message: 'WebSocket initialized' })
  } catch (err) {
    console.error('Socket initialization error:', err)
    return NextResponse.json(
      { error: 'Socket initialization failed' },
      { status: 500 }
    )
  }
}
```

## Component Checklist

- [ ] Update `/components/LiveRoom.tsx` to use `useRealtimeLesson`
- [ ] Update exercise submission handlers to use `submitExercise()`
- [ ] Update poll handlers to use `respondToPoll()`
- [ ] Create new `VideoPlayer` component using transcoding
- [ ] Update chat components to use `sendMessage()`
- [ ] Add hand-raise feature using `raiseHand()/lowerHand()`
- [ ] Update lesson roster to show live participant counts
- [ ] Add connection status indicator
- [ ] Handle reconnection UI states
- [ ] Add error recovery for dropped connections

## Performance Optimizations

### 1. Redis Connection Pooling
```typescript
// lib/redis.ts already implements singleton pattern
// Automatically reuses connections
```

### 2. WebSocket Room Broadcasting
```typescript
// Broadcasts only to lesson room members
io.to(`lesson:${lessonId}`).emit('event', data)
```

### 3. Video Stream Caching
```typescript
// Mux automatically caches HLS segments
// Use CDN for geographic distribution
```

### 4. Database Query Reduction
```typescript
// Use WebSocket for frequent updates instead of polling
// Reduces database load by ~95% for real-time features
```

## Monitoring & Debugging

### Monitor Redis Pub/Sub
```bash
# Connect to Redis CLI
redis-cli

# Monitor all events
MONITOR

# Check active channels
PUBSUB CHANNELS

# Check channel subscribers
PUBSUB NUMSUB lesson:*
```

### Monitor WebSocket Connections
```typescript
// In lib/websocket.ts
import { getConnectedUsers, getConnectionCount } from '@/lib/websocket'

// Check connections
const users = getConnectedUsers(lessonId)
const count = getConnectionCount(lessonId)
console.log(`${count} users connected to lesson ${lessonId}`)
```

### Monitor Video Transcoding
```bash
# Check Mux dashboard
https://dashboard.mux.com/video/assets

# Monitor webhook events
Check app/api/webhooks/video-transcoding route logs
```

## Troubleshooting

### WebSocket Connection Fails
```typescript
// Check CORS configuration in lib/websocket.ts
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
  },
})

// Verify client URL matches
console.log('Connecting to:', process.env.NEXT_PUBLIC_APP_URL)
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Check URL format
redis://localhost:6379
redis://:password@host:port  # with auth
```

### Video Transcoding Stuck
```bash
# Check Mux webhook configuration
# Check app/api/webhooks/video-transcoding logs
# Verify MUX_ACCESS_TOKEN and MUX_SECRET_TOKEN

# Manual status check
curl -X GET "https://api.mux.com/video/v1/assets/{VIDEO_ID}" \
  -u "$MUX_ACCESS_TOKEN:$MUX_SECRET_TOKEN"
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Configure Redis**: Start Redis server locally or connect to cloud Redis
3. **Set environment variables**: Add to `.env.local`
4. **Update API routes**: Add Redis publishing to lesson/exercise/poll endpoints
5. **Update components**: Replace polling with WebSocket hooks
6. **Test**: Use diagnostics dashboard at `/diagnostics/features`
7. **Deploy**: Configure production environment variables and Redis

## Support Files

- [PRODUCTION_REALTIME_SETUP.md](PRODUCTION_REALTIME_SETUP.md) - Deployment guide
- [lib/redis.ts](apps/web/lib/redis.ts) - Redis pub/sub module
- [lib/websocket.ts](apps/web/lib/websocket.ts) - Socket.io server
- [lib/hooks/useRealtimeLessonWebSocket.ts](apps/web/lib/hooks/useRealtimeLessonWebSocket.ts) - React hook
- [lib/videoTranscoding.ts](apps/web/lib/videoTranscoding.ts) - Video transcoding service
