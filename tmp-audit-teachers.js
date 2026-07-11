const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER', isDeleted: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        teachingClasses: { select: { classId: true, class: { select: { id: true, name: true } } } },
      },
      orderBy: { email: 'asc' }
    });

    const classes = await prisma.class.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, _count: { select: { enrollments: true } } },
      orderBy: { name: 'asc' }
    });

    console.log('Teachers with no class link:');
    teachers.filter(t => t.teachingClasses.length === 0).forEach(t => {
      console.log(`- ${t.email} (${t.firstName} ${t.lastName})`);
    });

    console.log('\nClasses and enrollment counts:');
    classes.forEach(c => {
      console.log(`- ${c.name} (${c.id}) => enrollments: ${c._count.enrollments}`);
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
