// apps/web/lib/services/exercise.ts
import { prisma } from '@/lib/prisma'

export async function createExercise(
  lessonId: string,
  createdBy: string,
  data: {
    title: string
    description?: string
    type?: string
    timeLimit?: number
    questions: Array<{
      order: number
      type: string
      text: string
      options?: any
      correctAnswer?: any
      explanation?: string
      points?: number
    }>
  }
) {
  return prisma.classExercise.create({
    data: {
      lessonId,
      createdBy,
      title: data.title,
      description: data.description,
      type: data.type || 'ASSIGNMENT',
      timeLimit: data.timeLimit,
      questions: {
        create: data.questions,
      },
    },
    include: { questions: true },
  })
}

export async function publishExerciseToClass(exerciseId: string) {
  return prisma.classExercise.update({
    where: { id: exerciseId },
    data: { isPublished: true },
  })
}

export async function submitExerciseResponse(
  exerciseId: string,
  userId: string,
  answers: Record<string, any>
) {
  const exercise = await prisma.classExercise.findUnique({
    where: { id: exerciseId },
    include: { questions: true },
  })

  if (!exercise) throw new Error('Exercise not found')

  // Calculate score
  let score = 0
  exercise.questions.forEach((q) => {
    const answer = answers[q.id]
    if (q.correctAnswer === answer) {
      score += q.points
    }
  })

  return prisma.classExerciseResponse.upsert({
    where: { exerciseId_userId: { exerciseId, userId } },
    create: {
      exerciseId,
      userId,
      answers,
      score,
      isCorrect: score === exercise.questions.reduce((sum, q) => sum + q.points, 0),
    },
    update: {
      answers,
      score,
      isCorrect: score === exercise.questions.reduce((sum, q) => sum + q.points, 0),
      submittedAt: new Date(),
    },
  })
}

export async function getExerciseResponses(exerciseId: string) {
  return prisma.classExerciseResponse.findMany({
    where: { exerciseId },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  })
}

export async function getStudentExerciseScore(exerciseId: string, userId: string) {
  return prisma.classExerciseResponse.findUnique({
    where: { exerciseId_userId: { exerciseId, userId } },
  })
}
