Self-host LiveKit + coturn (minimal)

Overview
- This docker-compose runs LiveKit server and a coturn TURN server.
- Use Vercel serverless endpoints to mint short-lived Access Tokens for clients.

Quick start (on a VPS with Docker installed)

1. Copy the env example and set secure secrets:

   cp .env.example .env
   # edit .env and set LIVEKIT_API_SECRET and TURN_SHARED_SECRET to secure values

2. Run docker-compose:

   docker compose up -d

3. Expose ports:
- LiveKit HTTP API: 7880
- WebRTC UDP: 7883 (mapped by compose)
- TURN: 3478 (UDP/TCP)

Notes
- For production, use a managed domain and TLS (proxy with nginx or use LiveKit's TLS options).
- Configure `LIVEKIT_ICE_SERVERS` to point to your TURN server so clients can connect behind NATs.
- Adjust `MAX_PARTICIPANTS` / `MAX_STREAMS` according to your VM size.

Next steps
- Create a server endpoint to mint LiveKit access tokens (see apps/web/app/api/livekit/token/route.ts)
- Integrate the `LiveRoom` React component in your instructor and student pages.
- Add recording/storage pipeline (S3/Cloudinary) and transcript worker if needed.
