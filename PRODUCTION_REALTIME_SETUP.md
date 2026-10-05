# Production Real-Time Infrastructure Setup

The Vercel deployment uses Ably Channels for cross-instance realtime invalidation.
The app publishes metadata-only change events after persisted writes; authenticated
clients receive these events and refresh their authorized API/RSC data. Live audio
and video continue to use LiveKit.

## 1. Ably Setup

1. Create an Ably app and an API key with publish and subscribe capabilities.
2. Configure `ABLY_API_KEY` in local environment and in Vercel Project Settings.
   Keep the key server-only; do not prefix it with `NEXT_PUBLIC_`.
3. Configure `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `DATABASE_URL` in the same
   deployment environment. For local dev, the app runs on port `2000`.
4. Deploy the app. Authenticated clients obtain restricted subscribe-only tokens
   through `/api/realtime/token`; server-side database writes publish to
   `school-updates`.
5. Confirm the authenticated browser console has no connection errors, then
   create or update a class/subject and confirm open management screens refresh.

If `ABLY_API_KEY` is absent or Ably is temporarily unavailable, data writes remain
available and the dashboard polling fallback continues to refresh periodically.
The realtime health check is available at `/api/realtime/token` (requires an
authenticated session; a `503` indicates missing provider configuration).

Realtime authorization is limited to the single `school-updates` channel. Events
contain only model/action/timestamp metadata—never record contents. All displayed
data continues to be fetched through the app's role-authorized APIs.

## 3. Video Transcoding Setup

### Option A: Mux (Recommended)
Best for: Professional video streaming with automatic multi-bitrate transcoding

#### Setup
1. Create Mux account: https://dashboard.mux.com/
2. Generate API tokens: Settings → Access Tokens
3. Store credentials

```env
MUX_ACCESS_TOKEN=your_token_id
MUX_SECRET_TOKEN=your_secret_token
```

#### Configuration
- Bitrate profiles automatically created by Mux
- HLS and DASH streaming included
- Webhook support for transcoding completion

#### Webhook Configuration
1. Mux Dashboard → Settings → Webhooks
2. Add webhook: `https://yourdomain.com/api/webhooks/video-transcoding`
3. Events: `video.asset.ready`, `video.asset.errored`

### Option B: Cloudinary (Simple Alternative)
Best for: Existing Cloudinary setup with basic video transformation

Uses built-in Cloudinary video transformation (already configured):
```typescript
import { getCloudinaryVideoUrl } from '@/lib/videoTranscoding'

const videoUrl = getCloudinaryVideoUrl(publicId, 'web')
```

### Option C: AWS Elemental MediaConvert
Best for: High-volume transcoding with full control

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_MEDIACONVERT_ROLE=arn:aws:iam::account:role/service-role/MediaConvertRole
AWS_MEDIACONVERT_ENDPOINT=https://account.mediaconvert.region.amazonaws.com
```

## 4. Database Schema Update

Add `MediaAsset` model to `prisma/schema.prisma`:

```prisma
model MediaAsset {
  id        String   @id @default(cuid())
  name      String
  description String?
  mimeType  String
  bucket    String   // 'mux', 'cloudinary', 'aws'
  path      String   // mux asset id, cloudinary public id, s3 key
  fileSize  Int      @default(0)
  uploaderId String
  metadata  Json?    // Stores transcoding status, playback id, etc
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  resources Resource[]

  @@index([bucket])
  @@index([uploaderId])
}

model Resource {
  id          String   @id @default(cuid())
  classId     String
  title       String
  description String?
  resourceType String  // 'PDF_NOTE', 'VIDEO_TUTORIAL', etc
  cloudinaryUrl String?
  mediaId     String?
  
  media       MediaAsset? @relation(fields: [mediaId], references: [id])
  class       Class     @relation(fields: [classId], references: [id])
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([classId])
  @@index([mediaId])
}
```

Run migration:
```bash
npx prisma migrate dev --name add_media_asset_model
```

## 5. Update Upload Endpoints

### Modify `/api/resources/upload` to initiate transcoding

```typescript
import { initializeVideoTranscoding } from '@/lib/videoTranscoding'

export async function POST(req: NextRequest) {
  // ... existing upload code ...
  
  if (fileType.startsWith('video/')) {
    const transcoding = await initializeVideoTranscoding(cloudinaryUrl, {
      title: filename,
      lessonId,
      resourceId: resource.id,
    })
    
    return NextResponse.json({
      success: true,
      resourceId: resource.id,
      transcoding: {
        videoId: transcoding.videoId,
        status: transcoding.status,
        message: transcoding.message,
      },
    })
  }
}
```

## 6. Update Components for Real-Time Features

### Replace polling with WebSocket

**Before (polling):**
```typescript
const { participants } = useLesson(lessonId)
```

**After (WebSocket):**
```typescript
const { participants, connected } = useRealtimeLesson({
  lessonId,
  userId,
  userName,
  userRole,
})
```

### Video Player with Transcoding

```typescript
import { useState, useEffect } from 'react'
import { getHlsStreamUrl } from '@/lib/videoTranscoding'

export function VideoPlayer({ videoId }) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStream = async () => {
      const url = await getHlsStreamUrl(videoId)
      setStreamUrl(url)
      setLoading(false)
    }
    fetchStream()
  }, [videoId])

  if (loading) return <div>Loading video...</div>
  if (!streamUrl) return <div>Video not ready</div>

  return (
    <video
      controls
      width="100%"
      src={streamUrl}
      style={{ maxWidth: '100%' }}
    />
  )
}
```

## 7. Performance Checklist

- [ ] Redis server running and accessible
- [ ] WebSocket server running (or integrated in Next.js)
- [ ] Video transcoding service configured (Mux/AWS/Cloudinary)
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Socket.io client installed
- [ ] Real-time hooks updated in components
- [ ] Webhook endpoint configured for transcoding
- [ ] CORS configured for WebSocket connections
- [ ] Load balancing configured for WebSocket (sticky sessions)

## 8. Scaling to 1000+ Concurrent Users

### WebSocket Scalability
```bash
# Use Redis adapter for Socket.io to scale across multiple servers
npm install @socket.io/redis-adapter
```

```typescript
import { createAdapter } from '@socket.io/redis-adapter'

const pubClient = await getRedisClient()
const subClient = pubClient.duplicate()

io.adapter(createAdapter(pubClient, subClient))
```

### Load Balancing
- Use AWS ALB or Nginx with sticky sessions
- Route WebSocket connections to same server (by default)
- With Redis adapter, connections can be load-balanced freely

### Redis Pub/Sub Scaling
- No changes needed - Redis pub/sub naturally scales
- Use Redis Cluster for high throughput
- Monitor with `redis-cli MONITOR`

### Monitoring
```bash
# Monitor WebSocket connections
redis-cli PUBSUB CHANNELS

# Monitor active subscriptions
redis-cli PUBSUB NUMSUB lesson:*
```

## 9. Production Deployment Checklist

- [ ] Redis hosted (ElastiCache, Redis Cloud, or self-managed)
- [ ] WebSocket server load balanced (sticky sessions)
- [ ] Video transcoding service API keys secured
- [ ] HTTPS/WSS enabled for all connections
- [ ] CORS properly configured
- [ ] Error monitoring (Sentry/Datadog)
- [ ] Rate limiting configured
- [ ] Database backups configured
- [ ] CDN enabled for video delivery
- [ ] SSL certificates valid
- [ ] Environment variables securely stored

## 10. Testing

### Load Test WebSocket Connections
```bash
npm install artillery

# Create artillery.yml
config:
  target: "http://localhost:3001"
  phases:
    - duration: 60
      arrivalRate: 100  # 100 connections/sec
  ws:
    path: "/socket.io/?EIO=4&transport=websocket"

scenarios:
  - name: "1000 concurrent users"
    flow:
      - connect: "ws"
      - think: 10
      - disconnect: "ws"

# Run test
artillery run artillery.yml
```

### Monitor Redis Performance
```bash
redis-cli --latency-history
redis-cli --bigkeys
redis-cli MONITOR
```

## Support & Troubleshooting

- **Redis connection failed**: Check REDIS_URL, ensure Redis server running
- **WebSocket CORS errors**: Verify NEXT_PUBLIC_APP_URL matches client origin
- **Video transcoding slow**: Check Mux dashboard for processing queue
- **High latency**: Monitor Redis latency, check network connectivity
- **Memory issues**: Use Redis memory analyzer, increase server capacity
