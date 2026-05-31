// apps/web/lib/services/poll.ts
import { prisma } from '@/lib/prisma'

export async function createLivePoll(
  lessonId: string,
  createdBy: string,
  data: {
    question: string
    type?: string
    options?: Array<{ id: string; text: string }>
  }
) {
  return prisma.livePoll.create({
    data: {
      lessonId,
      createdBy,
      question: data.question,
      type: data.type || 'SINGLE_CHOICE',
      options: data.options,
      isActive: true,
      startedAt: new Date(),
    },
  })
}

export async function submitPollResponse(
  pollId: string,
  userId: string,
  selectedOption: any
) {
  return prisma.livePollResponse.upsert({
    where: { pollId_userId: { pollId, userId } },
    create: {
      pollId,
      userId,
      selectedOption,
    },
    update: {
      selectedOption,
      respondedAt: new Date(),
    },
  })
}

export async function closeLivePoll(pollId: string) {
  return prisma.livePoll.update({
    where: { id: pollId },
    data: {
      isActive: false,
      endedAt: new Date(),
    },
  })
}

export async function getPollResults(pollId: string) {
  const responses = await prisma.livePollResponse.findMany({
    where: { pollId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  })

  const poll = await prisma.livePoll.findUnique({
    where: { id: pollId },
  })

  // Aggregate by option
  const results: Record<string, number> = {}
  responses.forEach((r) => {
    const optionKey = JSON.stringify(r.selectedOption)
    results[optionKey] = (results[optionKey] || 0) + 1
  })

  return {
    poll,
    totalResponses: responses.length,
    responses,
    aggregated: results,
  }
}

export async function getLessonPolls(lessonId: string) {
  return prisma.livePoll.findMany({
    where: { lessonId },
    include: {
      _count: {
        select: { responses: true },
      },
    },
    orderBy: { startedAt: 'desc' },
  })
}
