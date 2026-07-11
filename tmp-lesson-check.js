const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const lessonId = 'cmrgrbam10001l104a7kxrk74';
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { class: true, session: true }
    });
    console.log(JSON.stringify({ lessonId, lesson }, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
