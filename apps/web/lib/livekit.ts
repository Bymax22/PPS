export async function fetchLiveKitToken(room: string, identity?: string) {
  const url = new URL(`/api/livekit/token`, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  url.searchParams.set('room', room)
  if (identity) url.searchParams.set('identity', identity)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch token')
  return res.json()
}

export default fetchLiveKitToken
