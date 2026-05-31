export async function fetchLiveKitToken(room: string, isHost?: boolean) {
  const params = new URLSearchParams({ room })
  if (isHost) params.set('host', 'true')

  const res = await fetch(`/api/livekit/token?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch token')
  return res.json()
}

export default fetchLiveKitToken
