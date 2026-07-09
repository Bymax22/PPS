import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null
let redisSubscriber: RedisClientType | null = null

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({ url: REDIS_URL })
    redisClient.on('error', (err) => console.error('Redis client error:', err))
    await redisClient.connect()
  }
  return redisClient
}

export async function getRedisSubscriber(): Promise<RedisClientType> {
  if (!redisSubscriber) {
    redisSubscriber = createClient({ url: REDIS_URL })
    redisSubscriber.on('error', (err) => console.error('Redis subscriber error:', err))
    await redisSubscriber.connect()
  }
  return redisSubscriber
}

export async function publishEvent(channel: string, data: any) {
  try {
    const client = await getRedisClient()
    await client.publish(channel, JSON.stringify(data))
  } catch (err) {
    console.error('Redis publish error:', err)
  }
}

export async function subscribeToChannel(
  channel: string,
  callback: (message: string) => void
) {
  try {
    const subscriber = await getRedisSubscriber()
    await subscriber.subscribe(channel, (message) => {
      callback(message)
    })
  } catch (err) {
    console.error('Redis subscribe error:', err)
  }
}

export async function closeRedisConnections() {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
  if (redisSubscriber) {
    await redisSubscriber.quit()
    redisSubscriber = null
  }
}

// Event publishers for different features
export async function publishLessonEvent(lessonId: string, type: string, data: any) {
  await publishEvent(`lesson:${lessonId}`, { type, data, timestamp: Date.now() })
}

export async function publishParticipantEvent(
  lessonId: string,
  participantId: string,
  type: 'joined' | 'left' | 'updated',
  data: any
) {
  await publishEvent(`lesson:${lessonId}:participants`, {
    type,
    participantId,
    data,
    timestamp: Date.now(),
  })
}

export async function publishPollEvent(lessonId: string, pollId: string, type: string, data: any) {
  await publishEvent(`lesson:${lessonId}:polls:${pollId}`, { type, data, timestamp: Date.now() })
}

export async function publishExerciseEvent(
  lessonId: string,
  exerciseId: string,
  type: string,
  data: any
) {
  await publishEvent(`lesson:${lessonId}:exercises:${exerciseId}`, {
    type,
    data,
    timestamp: Date.now(),
  })
}

export async function publishChatEvent(lessonId: string, message: any) {
  await publishEvent(`lesson:${lessonId}:chat`, {
    type: 'message',
    message,
    timestamp: Date.now(),
  })
}
