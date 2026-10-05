import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const curricula = [
  {
    key: 'zambian',
    name: 'Zambian Curriculum',
    slug: 'zambian-curriculum',
    description: 'Zambia national curriculum from Nursery through Grade 12.',
    stages: [
      { grade: 0, label: 'Nursery', stage: 'EARLY_YEARS' },
      ...Array.from({ length: 12 }, (_, index) => {
        const grade = index + 1
        return {
          grade,
          label: `Grade ${grade}`,
          stage: grade <= 7 ? 'PRIMARY' : 'SECONDARY',
        }
      }),
    ],
  },
  {
    key: 'cambridge',
    name: 'Cambridge Curriculum',
    slug: 'cambridge-curriculum',
    description: 'Cambridge pathway from Nursery through Year 11.',
    stages: [
      { grade: 0, label: 'Nursery', stage: 'EARLY_YEARS' },
      { grade: 1, label: 'Reception', stage: 'EARLY_YEARS' },
      ...Array.from({ length: 11 }, (_, index) => {
        const year = index + 1
        return {
          grade: year + 1,
          label: `Year ${year}`,
          stage: year <= 6 ? 'PRIMARY' : 'SECONDARY',
        }
      }),
    ],
  },
]

const subjects = [
  { code: 'MATHEMATICS', name: 'Mathematics', curricula: ['zambian', 'cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'ENGLISH', name: 'English', curricula: ['zambian', 'cambridge'], stages: ['EARLY_YEARS', 'PRIMARY', 'SECONDARY'] },
  { code: 'SCIENCE', name: 'Science', curricula: ['zambian', 'cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'BIOLOGY', name: 'Biology', curricula: ['zambian', 'cambridge'], stages: ['SECONDARY'] },
  { code: 'CHEMISTRY', name: 'Chemistry', curricula: ['zambian', 'cambridge'], stages: ['SECONDARY'] },
  { code: 'PHYSICS', name: 'Physics', curricula: ['zambian', 'cambridge'], stages: ['SECONDARY'] },
  { code: 'GEOGRAPHY', name: 'Geography', curricula: ['zambian', 'cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'HISTORY', name: 'History', curricula: ['zambian', 'cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'COMPUTING', name: 'Computing and ICT', curricula: ['zambian', 'cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'CREATIVE_TECHNOLOGY', name: 'Creative and Technology Studies', curricula: ['zambian'], stages: ['PRIMARY'] },
  { code: 'SOCIAL_STUDIES', name: 'Social Studies', curricula: ['zambian'], stages: ['PRIMARY'] },
  { code: 'ZAMBIAN_LANGUAGES', name: 'Zambian Languages', curricula: ['zambian'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'RELIGIOUS_EDUCATION', name: 'Religious Education', curricula: ['zambian'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'CIVIC_EDUCATION', name: 'Civic Education', curricula: ['zambian'], stages: ['SECONDARY'] },
  { code: 'AGRICULTURE', name: 'Agriculture', curricula: ['zambian'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'BUSINESS_STUDIES', name: 'Business Studies', curricula: ['zambian', 'cambridge'], stages: ['SECONDARY'] },
  { code: 'GLOBAL_PERSPECTIVES', name: 'Global Perspectives', curricula: ['cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'CAMBRIDGE_ART_DESIGN', name: 'Art and Design', curricula: ['cambridge'], stages: ['PRIMARY', 'SECONDARY'] },
  { code: 'PHYSICAL_EDUCATION', name: 'Physical Education', curricula: ['zambian', 'cambridge'], stages: ['EARLY_YEARS', 'PRIMARY', 'SECONDARY'] },
]

const dryRun = process.argv.includes('--dry-run')
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required to seed curriculum records.')

const databaseHost = new URL(databaseUrl).hostname
const localHosts = new Set(['localhost', '127.0.0.1', '::1'])
if (!dryRun && !localHosts.has(databaseHost) && process.env.SEED_ALLOW_REMOTE !== 'true') {
  throw new Error('Refusing to write to a remote database. Set SEED_ALLOW_REMOTE=true only after confirming the target.')
}

const plannedClassCount = curricula.reduce((sum, curriculum) => sum + curriculum.stages.length, 0)
if (dryRun) {
  console.log(`Seed plan: ${curricula.length} curricula, ${subjects.length} subjects, ${plannedClassCount} grade classes.`)
  console.log('Dry run: no database connection or writes were made.')
  process.exit(0)
}

const prisma = new PrismaClient()

function mergeMetadata(existing, next) {
  return { ...(existing && typeof existing === 'object' ? existing : {}), ...next }
}

function metadataList(metadata, key) {
  const value = metadata && typeof metadata === 'object' ? metadata[key] : null
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
}

try {
  for (const curriculum of curricula) {
    const existingProgram = await prisma.program.findUnique({ where: { slug: curriculum.slug } })
    const metadata = mergeMetadata(existingProgram?.metadata, {
      curriculumKey: curriculum.key,
      levelLabels: curriculum.stages.map(({ grade, label, stage }) => ({ grade, label, stage })),
      seededBy: 'prisma/seed.mjs',
    })
    const program = await prisma.program.upsert({
      where: { slug: curriculum.slug },
      create: {
        name: curriculum.name,
        slug: curriculum.slug,
        description: curriculum.description,
        type: 'ONLINE_FULL_TIME',
        metadata,
      },
      update: {
        name: curriculum.name,
        description: curriculum.description,
        type: 'ONLINE_FULL_TIME',
        metadata,
      },
    })

    for (const { grade, label, stage } of curriculum.stages) {
      const className = `${curriculum.name} - ${label}`
      const existingClass = await prisma.class.findFirst({
        where: { programId: program.id, name: className, grade },
      })
      const classMetadata = mergeMetadata(existingClass?.metadata, {
        curriculumKey: curriculum.key,
        curriculum: curriculum.name,
        gradeLabel: label,
        stage,
        seededBy: 'prisma/seed.mjs',
      })
      if (existingClass) {
        await prisma.class.update({
          where: { id: existingClass.id },
          data: { metadata: classMetadata, isDeleted: false, deletedAt: null },
        })
      } else {
        await prisma.class.create({
          data: { programId: program.id, name: className, grade, capacity: 30, metadata: classMetadata },
        })
      }
    }
  }

  for (const subject of subjects) {
    const existingSubject = await prisma.subject.findFirst({
      where: { OR: [{ code: subject.code }, { name: subject.name }] },
    })
    const metadata = mergeMetadata(existingSubject?.metadata, {
      curricula: [...new Set([...metadataList(existingSubject?.metadata, 'curricula'), ...subject.curricula])],
      stages: [...new Set([...metadataList(existingSubject?.metadata, 'stages'), ...subject.stages])],
      seededBy: 'prisma/seed.mjs',
    })
    if (existingSubject) {
      await prisma.subject.update({
        where: { id: existingSubject.id },
        data: { metadata, isDeleted: false, deletedAt: null },
      })
    } else {
      await prisma.subject.create({
        data: { name: subject.name, code: subject.code, metadata },
      })
    }
  }

  console.log(`Seed complete: ${curricula.length} curricula, ${subjects.length} subjects, ${plannedClassCount} grade classes ensured.`)
  console.log('No user accounts, teachers, enrollments, lessons, resources, or payment plans were fabricated.')
} finally {
  await prisma.$disconnect()
}
