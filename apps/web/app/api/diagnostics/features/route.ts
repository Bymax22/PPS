import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { uploadToCloudinary } from '@/lib/cloudinary'

/**
 * Comprehensive feature health check
 * Tests: Uploads, Grades, Subjects, Online Learning enrollment
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    checks: {
      database: false,
      subjects: false,
      resources: false,
      grades: false,
      onlineEnrollment: false,
      cloudinary: false,
    },
    details: {} as Record<string, any>,
    issues: [] as string[],
  }

  try {
    // 1. Check Database Connection
    try {
      const userCount = await prisma.user.count()
      diagnostics.checks.database = true
      diagnostics.details.database = {
        status: 'connected',
        userCount,
      }
    } catch (err) {
      diagnostics.checks.database = false
      diagnostics.details.database = { error: String(err) }
      diagnostics.issues.push('Database connection failed')
    }

    // 2. Check Subjects
    try {
      const subjects = await prisma.subject.findMany()
      diagnostics.checks.subjects = true
      diagnostics.details.subjects = {
        count: subjects.length,
        sample: subjects.slice(0, 3).map(s => ({ id: s.id, name: s.name })),
      }
      if (subjects.length === 0) {
        diagnostics.issues.push('No subjects found in database - admin should add subjects')
      }
    } catch (err) {
      diagnostics.checks.subjects = false
      diagnostics.details.subjects = { error: String(err) }
      diagnostics.issues.push('Subject query failed')
    }

    // 3. Check Resources
    try {
      const resources = await prisma.resource.findMany({
        take: 5,
        include: { class: true },
      })
      diagnostics.checks.resources = resources.length > 0
      diagnostics.details.resources = {
        count: await prisma.resource.count(),
        sample: resources.map(r => ({
          id: r.id,
          title: r.title,
          type: r.type,
          cloudinaryUrl: r.cloudinaryUrl ? '✓' : '✗',
        })),
      }
      if (resources.length === 0) {
        diagnostics.issues.push('No resources uploaded yet - teachers should upload resources')
      }
    } catch (err) {
      diagnostics.checks.resources = false
      diagnostics.details.resources = { error: String(err) }
      diagnostics.issues.push('Resource query failed')
    }

    // 4. Check Grades/Exam Attempts
    try {
      const attempts = await prisma.examAttempt.findMany({
        take: 5,
        include: { exam: true, user: { select: { firstName: true, lastName: true } } },
      })
      diagnostics.checks.grades = attempts.length > 0
      diagnostics.details.grades = {
        totalAttempts: await prisma.examAttempt.count(),
        sample: attempts.map(a => ({
          id: a.id,
          score: a.score,
          percentage: a.percentage,
          isPassed: a.isPassed,
          submittedAt: a.submittedAt,
        })),
      }
      if (attempts.length === 0) {
        diagnostics.issues.push('No exam attempts recorded - students should take exams')
      }
    } catch (err) {
      diagnostics.checks.grades = false
      diagnostics.details.grades = { error: String(err) }
      diagnostics.issues.push('Exam attempt query failed')
    }

    // 5. Check Online Enrollment (ONLINE_FULL_TIME program)
    try {
      const onlineProgram = await prisma.program.findFirst({
        where: { type: 'ONLINE_FULL_TIME' },
      })

      if (onlineProgram) {
        const enrollments = await prisma.enrollment.findMany({
          where: {
            class: {
              programId: onlineProgram.id,
            },
          },
          take: 5,
          include: { user: { select: { firstName: true, lastName: true } }, class: true },
        })

        const totalOnlineEnrollments = await prisma.enrollment.count({
          where: {
            class: {
              programId: onlineProgram.id,
            },
          },
        })

        diagnostics.checks.onlineEnrollment = true
        diagnostics.details.onlineEnrollment = {
          programId: onlineProgram.id,
          programName: onlineProgram.name,
          totalEnrollments: totalOnlineEnrollments,
          sample: enrollments.map(e => ({
            id: e.id,
            studentName: `${e.user.firstName} ${e.user.lastName}`,
            className: e.class.name,
            status: e.status,
            enrolledAt: e.enrolledAt,
          })),
        }

        if (totalOnlineEnrollments === 0) {
          diagnostics.issues.push(
            `Online program exists but no students enrolled - students should enroll in "${onlineProgram.name}"`
          )
        }
      } else {
        diagnostics.checks.onlineEnrollment = false
        diagnostics.details.onlineEnrollment = {
          error: 'No ONLINE_FULL_TIME program found',
        }
        diagnostics.issues.push('Online program not created - admin should create online program')
      }
    } catch (err) {
      diagnostics.checks.onlineEnrollment = false
      diagnostics.details.onlineEnrollment = { error: String(err) }
      diagnostics.issues.push('Online enrollment query failed')
    }

    // 6. Check Cloudinary Configuration
    try {
      const apiKey = process.env.CLOUDINARY_API_KEY
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      diagnostics.checks.cloudinary = !!apiKey && !!cloudName
      diagnostics.details.cloudinary = {
        apiKeyConfigured: !!apiKey,
        cloudNameConfigured: !!cloudName,
        cloudName,
      }
      if (!apiKey || !cloudName) {
        diagnostics.issues.push('Cloudinary not fully configured')
      }
    } catch (err) {
      diagnostics.checks.cloudinary = false
      diagnostics.details.cloudinary = { error: String(err) }
    }

    return NextResponse.json(diagnostics)
  } catch (error: any) {
    return NextResponse.json(
      {
        ...diagnostics,
        error: error?.message,
      },
      { status: 500 }
    )
  }
}
