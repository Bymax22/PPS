const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  try {
    const classes = await prisma.class.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, grade: true, subject: true },
      orderBy: { name: 'asc' }
    });
    console.log(JSON.stringify(classes, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
