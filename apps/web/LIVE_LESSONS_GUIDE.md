# Live Lessons Setup & Deployment Guide

## What's Implemented

✅ **Backend Infrastructure:**
- LiveKit + coturn Docker Compose (self-hosted SFU)
- RBAC-secured token endpoint
- Full lesson lifecycle APIs (start, join, leave, end)
- Real-time chat via LiveKit data channels
- In-class exercises with Q&A
- Live polls with instant results
- Recording metadata tracking
- Attendee roster and activity monitoring

✅ **Frontend UI:**
- Teacher lesson page with real-time controls (exercises, polls, roster)
- Student lesson page with participation (exercises, polls, hand raise)
- LiveRoom component with video grid, chat, roster
- Real-time polling updates (2-second refresh)

✅ **Database:**
- ClassExercise, ClassExerciseQuestion, ClassExerciseResponse
- LivePoll, LivePollResponse
- LessonRecording
- StudentActivity (tracks hand raises, participation)
- Synced to Supabase ✓

---

## Environment Setup

### 1. Install Dependencies

```bash
npm install livekit-client livekit-server-sdk
```

### 2. Configure Environment Variables

Add to `.env.local` (frontend):
```env
NEXT_PUBLIC_LIVEKIT_URL=ws://your-livekit-server:7880
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add to `.env` (backend/Supabase):
```env
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

### 3. Deploy LiveKit Server

#### Option A: Docker Compose (Easiest for MVP)

```bash
cd infra/livekit
cp .env.example .env
# Edit .env and set secure secrets

docker compose up -d
```

This runs LiveKit + coturn on `localhost:7880`.

#### Option B: Production VPS Deployment

1. **Rent a small VPS** (DigitalOcean, Linode, AWS EC2):
   - 4GB RAM, 2vCPU minimum
   - Ubuntu 22.04
   - Public IP with UDP support

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   ```

3. **Deploy:**
   ```bash
   git clone <your-repo>
   cd infra/livekit
   cp .env.example .env
   nano .env  # Set secure API key/secret
   docker compose up -d
   ```

4. **Configure DNS** (optional):
   - Point `livekit.yourdomain.com` to your VPS IP
   - Update `.env` with `LIVEKIT_EXTERNAL_DOMAIN=livekit.yourdomain.com`

5. **Test connectivity:**
   ```bash
   curl http://your-vps-ip:7880/auth
   ```

---

## How It Works

### Teacher Flow
1. Teacher navigates to `/teacher/lessons/[lessonId]`
2. Clicks **"Start Lesson"** → LiveKit session created, students notified
3. **Create Exercise:** Fill form → API POST `/api/lessons/[id]/exercises`
4. **Create Poll:** Question + options → API POST `/api/lessons/[id]/polls`
5. **Monitor Roster:** Real-time list of students, activity metrics
6. **End Lesson:** Clicks **"End Lesson"** → recording saved, session closed

### Student Flow
1. Student navigates to `/student/lessons/[lessonId]`
2. Auto-joins via POST `/api/lessons/[id]/join`
3. Sees teacher's video stream (LiveRoom component)
4. Sees **Roster** (names only, no video thumbnails)
5. **Participate:**
   - Chat in real-time
   - Answer exercises
   - Respond to polls
   - Raise hand (tracked in activity log)
6. **Leave** → POST `/api/lessons/[id]/leave` → redirected to lesson summary

---

## Real-Time Updates

Currently uses **polling** (2-second refresh rate) for MVP speed. For production scale, upgrade to:

### Option 1: Redis + Pub/Sub
```bash
npm install redis
# Use Redis for presence, activity broadcasts
```

### Option 2: Supabase Realtime
```bash
npm install @supabase/supabase-js
# Built-in WebSocket for broadcasts
```

### Option 3: Pusher
```bash
npm install pusher pusher-js
# Managed pub/sub service
```

See `lib/hooks/useRealtimeLesson.ts` for integration points.

---

## Testing Locally

1. **Start LiveKit:**
   ```bash
   cd infra/livekit
   docker compose up -d
   ```

2. **Set env vars:**
   ```bash
   export NEXT_PUBLIC_LIVEKIT_URL=ws://localhost:7880
   export LIVEKIT_API_KEY=pps_demo_key
   export LIVEKIT_API_SECRET=change_me_to_secure_random
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Test:**
   - Teacher: http://localhost:3000/teacher/lessons/test-lesson-id
   - Student: http://localhost:3000/student/lessons/test-lesson-id

---

## Database Migrations

All schema changes are in `prisma/schema.prisma`. To apply:

```bash
npx prisma migrate dev --name "feature_name"
npx prisma db push  # Sync to Supabase
```

---

## Monitoring & Debugging

### LiveKit Metrics:
- `/api/livekit/token` - Token generation (logs auth failures)
- Activity logs - Stored in `StudentActivity` table

### Database Queries:
```sql
SELECT COUNT(*) FROM "SessionAttendee" WHERE "lessonId" = 'lesson-123';
SELECT * FROM "ClassExerciseResponse" WHERE "exerciseId" = 'ex-456';
SELECT * FROM "LivePollResponse" WHERE "pollId" = 'poll-789';
```

---

## Next Steps

- [ ] Deploy LiveKit to VPS with domain/TLS
- [ ] Set up recording pipeline (S3/Cloudinary + transcoding)
- [ ] Implement transcript generation (Whisper API)
- [ ] Add WebSocket pub/sub for real-time updates (upgrade from polling)
- [ ] Setup monitoring/alerting (DataDog, New Relic)
- [ ] Performance load testing (k6, JMeter)
- [ ] Add mobile app support (React Native + livekit-react-native)

---

## Support & Troubleshooting

**Q: Students can't join lesson**
- Check NEXT_PUBLIC_LIVEKIT_URL is accessible
- Verify LIVEKIT_API_KEY/SECRET match between env and LiveKit server
- Check network allows UDP/TCP on 7883, 3478

**Q: Audio/video not working**
- TURN server (coturn) may not be reachable
- Check firewall allows 3478 UDP/TCP
- Verify `LIVEKIT_ICE_SERVERS` in LiveKit config

**Q: Polls/Exercises data not persisting**
- Verify Supabase connection string in DATABASE_URL
- Check `npx prisma db push` succeeded
- Query tables directly to confirm schema exists

---

**Created:** 2026-05-31
**Last Updated:** Ready for deployment
