LiveKit integration (summary)

The app uses LiveKit for live lesson rooms and Ably for application-wide update
notifications. Live lesson token issuance is authenticated and limited to the
assigned teacher or an actively enrolled student for that lesson.

Install steps (frontend)

1. Configure `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`, and
   `NEXT_PUBLIC_LIVEKIT_URL` in local and deployment environments. Use a secure
   `wss://` URL for public deployments; keep the API secret server-side.
2. For self-hosted deployments, see `infra/livekit/README.md` and run the included
   LiveKit and coturn infrastructure from `infra/livekit`:

   docker compose up -d

3. Configure `ABLY_API_KEY` separately for authenticated dashboard update
   notifications. LiveKit connectivity, Cloudinary uploads, and Ably delivery
   require their respective service credentials and must be verified in the
   deployment environment.