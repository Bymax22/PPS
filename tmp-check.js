const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    console.log('classCount', await prisma.class.count());
    console.log('teacherClassCount', await prisma.teacherClass.count());
    const teacher = await prisma.user.findFirst({
      where: { role: 'TEACHER' },
      include: { teachingClasses: { include: { class: true } } },
    });
    console.log('teacher', teacher?.email, teacher?.id, teacher?.teachingClasses?.length);
    console.log(JSON.stringify(teacher?.teachingClasses || [], null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
