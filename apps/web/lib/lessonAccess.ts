import { prisma } from '@/lib/prisma'

export async function getLessonAccess(userId: string, lessonId: string) {
  const [user, lesson] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    }),
    prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false },
      include: { class: true, session: true },
    }),
  ])

  if (!user || !lesson) return null

  let canTeach = user.role === 'ADMIN'
  if (user.role === 'TEACHER') {
    const assignment = await prisma.teacherClass.findFirst({
      where: { teacherId: user.id, classId: lesson.classId },
      select: { id: true },
    })
    canTeach = Boolean(assignment) || lesson.createdBy === user.id
  }

  const enrollment = user.role === 'STUDENT'
    ? await prisma.enrollment.findFirst({
        where: { userId: user.id, classId: lesson.classId, status: 'ACTIVE' },
        select: { id: true },
      })
    : null

  return {
    user,
    lesson,
    canTeach,
    enrolled: Boolean(enrollment),
    canAccess: canTeach || Boolean(enrollment),
  }
}
