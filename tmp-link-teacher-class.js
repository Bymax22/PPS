const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const teacherEmail = 'kwibisa12@gmail.com';
    const teacher = await prisma.user.findUnique({
      where: { email: teacherEmail },
      select: { id: true, role: true }
    });

    if (!teacher) {
      console.error('Teacher not found');
      process.exit(1);
    }

    if (teacher.role !== 'TEACHER') {
      console.error('User is not a teacher');
      process.exit(1);
    }

    const classRecord = await prisma.class.findFirst({
      where: { isDeleted: false },
      select: { id: true, name: true }
    });

    if (!classRecord) {
      console.error('No class found');
      process.exit(1);
    }

    const existing = await prisma.teacherClass.findFirst({
      where: { teacherId: teacher.id, classId: classRecord.id }
    });

    if (existing) {
      console.log('TeacherClass link already exists');
      console.log(JSON.stringify(existing, null, 2));
      return;
    }

    const created = await prisma.teacherClass.create({
      data: {
        teacherId: teacher.id,
        classId: classRecord.id,
        isPrimary: true
      }
    });

    console.log('Created TeacherClass link');
    console.log(JSON.stringify(created, null, 2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
