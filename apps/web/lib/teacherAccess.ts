import { prisma } from '@/lib/prisma'

export type TeacherClassScope = {
  role: 'ADMIN' | 'TEACHER'
  classIds: string[] | null
}

export async function getTeacherClassScope(userId: string): Promise<TeacherClassScope | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  if (user?.role === 'ADMIN') return { role: 'ADMIN', classIds: null }
  if (user?.role !== 'TEACHER') return null

  const assignments = await prisma.teacherClass.findMany({
    where: { teacherId: userId },
    select: { classId: true },
  })
  return { role: 'TEACHER', classIds: assignments.map((assignment) => assignment.classId) }
}

export function teacherCanAccessClass(scope: TeacherClassScope, classId: string) {
  return scope.role === 'ADMIN' || Boolean(scope.classIds?.includes(classId))
}
