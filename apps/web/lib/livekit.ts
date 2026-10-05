export async function fetchLiveKitToken(room: string, isHost?: boolean) {
  const params = new URLSearchParams({ room })
  if (isHost) params.set('host', 'true')

  const res = await fetch(`/api/livekit/token?${params.toString()}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || 'Failed to fetch live session token')
  return data
}

export default fetchLiveKitToken
