LiveKit integration (summary)

What I added
- infra/livekit/docker-compose.yml: LiveKit + coturn compose
- infra/livekit/.env.example
- apps/web/app/api/livekit/token/route.ts: Vercel-friendly token endpoint using `livekit-server-sdk`
- apps/web/lib/livekit.ts: helper to fetch tokens from the frontend
- apps/web/components/LiveRoom.tsx: sample LiveRoom React component (client-side)

Install steps (frontend)

1. Install required dependencies in `apps/web`:

   npm install livekit-client livekit-server-sdk

2. Set env variables for Vercel and local dev:

   LIVEKIT_API_KEY and LIVEKIT_API_SECRET for token endpoint
   NEXT_PUBLIC_LIVEKIT_URL set to your LiveKit ws/http URL (e.g. ws://your.host:7880)
   NEXT_PUBLIC_APP_URL used by `fetchLiveKitToken` when running serverless

3. Run the infra on a single VPS for testing:

   docker compose up -d

Notes & next steps
- The `LiveRoom` component included is minimal; full UI needs per-track attachment, audio/video toggles, screen share, recording controls, and moderation tools.
- For presence/roster and cross-node coordination, add Redis or use LiveKit data channels to broadcast presence events.
- Add server-side checks to ensure only teachers can create sessions and mint host tokens.

If you want, I can now:
- Expand the `LiveRoom` UI to attach and render tracks, roster, and basic chat via LiveKit data channels.
- Add server-side RBAC so only teachers/admins can create rooms and mint elevated tokens.
- Generate a migration to add any missing DB fields for rooms/recordings.

Tell me which of the above I should implement next.