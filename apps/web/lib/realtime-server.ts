import Ably from 'ably'

const CHANNEL_NAME = 'school-updates'
let ably: Ably.Rest | null = null

function getAblyClient() {
  const key = process.env.ABLY_API_KEY
  if (!key) return null
  if (!ably) ably = new Ably.Rest({ key })
  return ably
}

export async function publishDataChange(model: string, operation: string) {
  const client = getAblyClient()
  if (!client) return

  try {
    await client.channels.get(CHANNEL_NAME).publish('data.changed', {
      model,
      operation,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Failed to publish realtime data change', { model, operation, error })
  }
}
