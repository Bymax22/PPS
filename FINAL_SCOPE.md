# Progress Preparatory School - LMS Platform | Final Comprehensive Scope

**Project:** Building a production-grade, fully-featured Learning Management System (LMS) for Progress Preparatory School (PPS) in Lusaka, Zambia.

**Document Version:** 1.0 | Date: February 20, 2026

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview & Positioning](#product-overview--positioning)
3. [User Personas & Roles](#user-personas--roles)
4. [Programs & Enrollment Models](#programs--enrollment-models)
5. [Flexible Subscription & Pricing Tiers](#flexible-subscription--pricing-tiers)
6. [Core Features by Module](#core-features-by-module)
7. [Tech Stack & Architecture](#tech-stack--architecture)
8. [Database Schema (Prisma v2)](#database-schema-prisma-v2)
9. [API Endpoints Overview](#api-endpoints-overview)
10. [Mobile-First UI & Responsive Design](#mobile-first-ui--responsive-design)
11. [Performance & Infrastructure](#performance--infrastructure)
12. [Security & Compliance](#security--compliance)
13. [Integration Points](#integration-points)
14. [Deployment & Scaling](#deployment--scaling)
15. [Timeline & Milestones](#timeline--milestones)
16. [Non-Functional Requirements](#non-functional-requirements)

---

## Executive Summary

**Vision:** Transform Progress Preparatory School into an integrated, digital education platform that seamlessly serves online learners, home tuition students, and on-campus admissions. The platform will offer flexible program enrollment, automated payment processing (card + mobile money), granular course selection (by subject, grade, class), live interactive lessons, recorded content library, assessment & grading, and real-time parent-student engagement.

**Key Pillars:**
- **Flexible Enrollment:** Pick programs (online, home tuition, on-campus), then customize by grade, subject, class.
- **Mobile-First:** Desktop, tablet, mobile-optimized. Fast, responsive, offline-capable.
- **Automated:** Payments, invoices, receipts, notifications, progress sync, attendance.
- **Secure:** OTP, student/parent verification, role-based access, encrypted data, audit logs.
- **Scalable:** Multi-region ready, CDN-backed video, async job workers, caching, monitoring.

---

## Product Overview & Positioning

### Programs Offered

**1. On-Campus Program (Traditional):**
- Enroll via online portal without visiting school initially.
- Full curriculum (all subjects, all grades).
- Option to add online supplementary tuition.
- Physical classroom attendance required after enrollment.
- Report card, attendance tracking, parent-teacher meetings integrated.

**2. Online Full-Time Program:**
- Live classes at scheduled times + recorded library.
- All subjects, all grades.
- Flexible enrollment by grade/subject combinations.
- Asynchronous catch-up via recorded lessons.
- Exams conducted online with proctoring (optional).

**3. Home Tuition Program:**
- 1-on-1 or small group lessons.
- Flexible scheduling (per week, per month).
- Specific subjects only (e.g., Maths, English, Sciences).
- Progress tracked at micro-level.
- Teacher + student agreement signed digitally.

**4. Holiday Tuition Program (Seasonal):**
- Short-term intensive courses during school holidays.
- Subject-specific reinforcement or entrance exam prep.
- Time-limited enrollment (e.g., April holidays, Aug holidays).
- Cohort-based cohort or rolling admission.

**5. Past Papers & Mini Resources Shop:**
- Standalone resource purchase (past papers, model answers, revision guides).
- Can be bundled with programs or sold à la carte.

---

## User Personas & Roles

### 1. **Student**
- Age: 6–18 (Primary to Secondary).
- Enrolls in one or more programs.
- Accesses live lessons, recorded videos, assignments, exams.
- Tracks own progress, views grades, downloads resources.
- Receives notifications about class times, deadlines, exam results.
- **Sub-types:**
  - _On-Campus Student:_ physical attendance + online portal.
  - _Online Student:_ 100% digital + asynchronous option.
  - _Home Tuition Student:_ personalized schedule.

### 2. **Parent**
- Enrolls children, pays subscriptions.
- Accesses child's dashboard: attendance, grades, progress, notifications.
- Receives alerts: low grades, missed classes, exam results, payment reminders.
- Can download progress reports, invoices, receipts.
- 1-on-1 messaging with teachers.
- **Sub-types:**
  - _Primary Payer:_ enters payment info, manages subscriptions.
  - _Co-Parent:_ read-only access or limited edit (e.g., contact info).

### 3. **Teacher**
- Teaches one or more classes/subjects.
- Creates & schedules live lessons, uploads recorded content.
- Grades exams, gives feedback on assignments.
- Tracks attendance, views class progress dashboard.
- Sends bulk notifications, communicates 1-on-1 with students/parents.
- **Sub-types:**
  - _Content Creator:_ uploads pre-recorded lessons.
  - _Live Instructor:_ runs live sessions.
  - _Assessor:_ grades exams & assignments.

### 4. **Admin / School Manager**
- Manages users (students, parents, teachers), roles, permissions.
- Configures programs, subscription plans, pricing.
- Monitors payments, generates reports.
- Publishes announcements, manages system settings.
- Views audit logs, system health.

### 5. **Finance Officer** (optional sub-role)
- Views payments & invoices.
- Generates financial reports.
- Can issue refunds, adjust billing.

---

## Programs & Enrollment Models

### Enrollment Workflow

```
1. User registers → OTP verification + ID/email confirmation
2. Choose primary program (Online Full-Time, Home Tuition, On-Campus, Holiday Tuition)
3. Select grades + subjects (flexible options per program type)
4. Select subscription tier (monthly, termly, yearly, etc.)
5. Add additional subjects/classes (optional, à la carte)
6. Payment checkout (Stripe card + Pesapal mobile money)
7. Invoice & receipt emailed
8. Access granted; student/parent accounts sync
9. Receive welcome email + setup guide
```

### Program-Specific Configurations

#### **On-Campus Program**
- **Structure:**
  - Grade levels: Nursery, Baby Class, Grade 1–7.
  - Subjects: All subjects (English, Maths, Science, Social Studies, etc.).
  - Classes: Grouped by grade (e.g., Grade 3A, Grade 3B).
- **Pricing Model:**
  - Yearly: Full year subscription.
  - Termly: Per term (3 terms/year).
  - Monthly: Month-to-month (rolling).
  - _Optional:_ Unlimited all subjects + 10 hours online tuition/term.
- **Features Enabled:**
  - Physical attendance tracking (QR code or manual check-in on portal).
  - Online portal for parents to see reports.
  - Supplementary online tuition (extra cost).
  - Digital admission form (pre-enrollment).

#### **Online Full-Time Program**
- **Structure:**
  - Grade levels: Grades 1–7 (primary focus).
  - Subjects: All (customizable per student).
  - Class grouping: By grade, then by time zone / cohort (optional).
- **Pricing Model:**
  - Flexible: Bundle subjects (Math + English) vs. full package (all subjects).
  - Tier 1: Single subject (e.g., Maths only) – lower cost.
  - Tier 2: 2–3 subjects (combo packages) – discounted.
  - Tier 3: All subjects (full curriculum) – highest price.
  - Duration: Monthly, termly, yearly.
- **Features Enabled:**
  - Live classes at scheduled times.
  - Recorded library (watch anytime).
  - Catch-up system (auto-recommend missed lessons).
  - Asynchronous assessments (quizzes, assignments).
  - Exam proctor integration (optional).
  - Downloadable resources & worksheets.

#### **Home Tuition Program**
- **Structure:**
  - Subjects: Individually selected (Maths, English, Science, etc.).
  - Frequency: 1–5 sessions/week (customizable).
  - Duration: 30–60 minutes per session.
  - Tutor: Assigned by school or parent-chosen.
- **Pricing Model:**
  - Per session: $10–20 (subject & tutor level dependent).
  - Package pricing: 4 sessions/month at discount.
  - Tier-based: Beginner tutors < Expert tutors.
- **Features Enabled:**
  - Schedule flexibility (Zoom/Jitsi for 1-on-1 video).
  - Micro-progress tracking (per session notes).
  - Homework & follow-up assignments.
  - Direct tutor-student messaging.

#### **Holiday Tuition Program**
- **Structure:**
  - Offered: April, August, December holidays (school-defined).
  - Duration: 2–4 weeks intensive.
  - Subjects: Specific subjects (past papers, entrance prep, skill boost).
  - Cohorts: Groups of 5–20 students.
- **Pricing Model:**
  - Flat rate per student (e.g., $50–100 per 2-week program).
  - Early-bird discount (enroll 2 weeks prior).
  - Sibling discount.
- **Features Enabled:**
  - Pre-recorded mini-courses + live Q&A.
  - Mock exams with instant feedback.
  - Certificate of completion.
  - Time-limited access (revokes after program end).

#### **Past Papers & Resources Shop**
- Standalone PDFs, bundles, video solutions.
- Pricing: per-item or subscription to "Past Papers Library".

---

## Flexible Subscription & Pricing Tiers

### Subscription Structure (Database Model)

Each `Subscription` record ties a student to:
- **Base Plan** (e.g., "Online Grade 3 – All Subjects – Monthly")
- **Add-Ons** (e.g., extra Maths tuition, downloadable past papers)
- **Duration** (month, term, year)
- **Payment Method** (Stripe card, Pesapal mobile money)
- **Expiry Date** (auto-calculated)
- **Status** (active, expired, suspended pending payment)

### Pricing Examples

#### Online Full-Time (Monthly)
| Tier | Subjects | Price (USD) |
|------|----------|------------|
| Single | 1 subject (any) | $15 |
| Dual | 2 subjects | $25 |
| Triple | 3 subjects | $35 |
| Full | All subjects | $50 |

#### Online Full-Time (Yearly - Bulk Discount)
| Tier | Subjects | Price (USD) |
|------|----------|------------|
| Single | 1 subject | $150 (vs. $180 monthly) |
| Dual | 2 subjects | $240 (vs. $300) |
| Triple | 3 subjects | $330 (vs. $420) |
| Full | All subjects | $480 (vs. $600) |

#### Home Tuition (Per Month - 4 Sessions)
| Level | Price (USD) |
|-------|------------|
| Tutor (Standard) | $60/month |
| Senior Tutor | $80/month |
| Expert | $100/month |

#### On-Campus (Termly)
| Tier | Coverage | Price (USD) |
|------|----------|------------|
| Standard | Tuition only | $200 |
| + Online Tuition | 10 hrs/term extra | $280 |
| + Premium Support | Parent calls, priority | $350 |

### Payment Methods

**1. Stripe (Credit/Debit Cards)**
- Visa, Mastercard, international cards.
- Recurring billing (auto-renewal).
- Webhooks for subscription status updates.

**2. Pesapal (Mobile Money)**
- MTN Zambia (airtime, 1886, *170#).
- Airtel Zambia.
- Zamtel.
- One-time payments integrated; recurring via Pesapal Merchant API.
- IPN (Instant Payment Notification) webhooks.

**3. Bank Transfer (Manual)**
- For large corporate enrollments (schools, NGOs).
- Manual verification; recorded in system.

---

## Core Features by Module

### A. Authentication & Authorization

#### Features:
- **Registration & Onboarding:**
  - Email or phone-based signup.
  - OTP verification (SMS via Twilio or African Telecom API).
  - Student ID verification (name, DOB, parent contact).
  - Parent account linking (student can claim parent account or parent adds child).
  - Role-based registration form (student vs. parent vs. teacher).

- **Login & Security:**
  - Email/password + optional 2FA (TOTP, SMS OTP).
  - Session management (NextAuth with JWT).
  - Account lockout after 5 failed attempts.
  - Password reset via email link (1-hour expiry).
  - "Remember me" (30-day cookie).

- **Authorization & Permissions:**
  - Role-based access control (RBAC): Student, Parent, Teacher, Admin.
  - Subscription-driven access: Check expiry before serving lesson.
  - Subject/class-level permissions: Student sees only enrolled subjects.
  - Audit logging: Track login, access, changes.

#### Implementation:
- NextAuth.js v5 with Prisma adapter.
- JWT + refresh tokens.
- Middleware to enforce subscription checks.

---

### B. Enrollment & Subscription Management

#### Features:
- **Subscription Builder (Dynamic UI):**
  - Step-by-step wizard: Choose program → grades → subjects → duration → add-ons.
  - Price calculator: Real-time display of selected items + total.
  - Recommended bundles: "Popular in Grade 3" (AI-suggested or admin-curated).
  - Saved carts: Resume enrollment later.

- **Subscription Management:**
  - View active subscriptions: Start date, expiry, cost.
  - Upgrade/downgrade on the fly (pro-rated billing).
  - Pause subscription (freeze expiry for set period).
  - Renewal reminders: 7 days, 1 day before expiry.
  - Auto-renewal toggle (enabled by default).
  - Cancel anytime (with refund policy display).

- **Flexible Subject/Class Addition:**
  - Mid-subscription add a subject (pro-rated cost).
  - Drop a subject (credit back to account or refund).
  - Form validation: Prevent invalid combos (e.g., Grade 8 Math if student is Grade 3).

#### Implementation:
- Custom React components (wizard, calculator).
- Prisma models: `Subscription`, `SubscriptionItem`, `SubscriptionAddon`.
- Stripe + Pesapal APIs for billing.

---

### C. Payment Processing & Invoicing

#### Features:
- **Checkout Flow:**
  - Cart review (items, prices, discounts).
  - Apply coupon/promo code.
  - Choose payment method (Stripe or Pesapal).
  - Billing address & tax calculation.
  - Terms & conditions checkbox.

- **Stripe Integration:**
  - Stripe Checkout (hosted page) or custom form with Stripe.js.
  - Save card for recurring billing.
  - Webhooks: `payment_intent.succeeded`, `customer.subscription.created/updated`.
  - Handling failed payments & retries.

- **Pesapal Integration:**
  - Pesapal iframe checkout or redirect.
  - Process payment via Pesapal API.
  - Validate IPN callback & record payment.
  - Handle Pesapal merchant fees.

- **Invoices & Receipts:**
  - Auto-generate PDF invoice on payment success.
  - Email invoice + receipt to payer.
  - Store in database + Cloudinary (searchable, downloadable).
  - Include: Payer info, item breakdown, amount paid, payment method, date, invoice #.

- **Refunds & Disputes:**
  - Manual refund process (admin initiates via Stripe/Pesapal).
  - Partial refunds (e.g., dropping a subject mid-term).
  - Dispute resolution workflow.

- **Reporting:**
  - Finance dashboard: Revenue by program, method, date range.
  - Outstanding invoices report.
  - Payment reconciliation tools.

#### Implementation:
- Stripe + Pesapal SDKs.
- PDF generation (Puppeteer or html2pdf).
- Email service (SendGrid, Resend, or Mailgun free tier).
- Cron jobs for retry logic & reminders.

---

### D. Recorded Lessons & Video Library

#### Features:
- **Teacher Upload Flow:**
  - Drag-and-drop video upload (MP4, MOV).
  - Cloudinary signed upload endpoint (direct browser upload).
  - Auto-transcode to HLS / adaptive bitrate.
  - Generate thumbnail (auto-extract or custom upload).
  - Add metadata: Title, description, subject, grade, duration, tags.
  - Preview before publishing.
  - Schedule publish date (e.g., release at term start).

- **Lesson Library (Student View):**
  - Filter by: Subject, grade, topic, date added, duration.
  - Search by keyword.
  - Watch history: Resume incomplete lessons.
  - Progress bar: % watched.
  - Playback speed control, captions, quality selection.
  - Download option (if enabled; file expires in 7 days or streams only).
  - Notes interface: Add timestamps + highlights, save.

- **Content Features:**
  - Playlist/chapter markers (e.g., 0:00–5:00 Intro, 5:00–15:00 Theory).
  - Pop-quiz at end of lesson (auto-assess understanding).
  - Related resources: PDFs, worksheets, past papers.
  - Comments/Q&A (threaded, teacher can pin/answer).
  - Likes/rate lesson (feedback to teacher).

- **Access Control:**
  - Subscription check: Only show if student enrolled in subject/grade.
  - Time-based access: Release date enforcement.
  - Download limits: X downloads per student per term.
  - Expiry: After subscription ends, access revoked (playback 403).

#### Implementation:
- Cloudinary for storage, transcoding, CDN delivery.
- Video.js player (open-source, feature-rich).
- Database: `Lesson` model with cloudinary public ID.
- Middleware to verify enrollment before serving.

---

### E. Exams, Quizzes & Assessments

#### Features:
- **Exam Types:**
  - **Multiple Choice (MCQ):** Auto-marked, instant feedback.
  - **Essay/Short Answer:** Teacher-marked, manual grading + feedback.
  - **Numeric/Calculations:** Exact match or tolerance-based marking (for Math, Sciences).
  - **Matching/Drag-and-Drop:** Auto-marked logic.
  - **Fill-in-the-Blank:** Pattern-based or manual review.

- **Exam Builder (Teacher):**
  - Question bank: Create, organize, search by topic.
  - Question templates: MCQ, essay, numeric, etc.
  - Randomize questions & answer order (anti-cheating).
  - Set difficulty tags (easy, medium, hard).
  - Exam settings: Time limit, passing mark, retake policy, shuffle.
  - Bulk upload questions (CSV import).

- **Exam Attempt (Student):**
  - Timer visible (countdown).
  - Progress bar (question X of Y).
  - Flag for review (mark unclear questions).
  - Force full-screen (prevent tab switching, optional proctoring).
  - Auto-save answers (no submission loss).
  - Submit & finish exam.

- **Grading & Feedback:**
  - Auto-grade MCQ & calculations immediately.
  - Bulk upload essay answers for teacher review.
  - Teacher marks essay, adds comments per question.
  - Grade scale display (A+, B, C, etc., or percentage).
  - Student sees feedback + explanation of correct answers.
  - Parents see grades in dashboard.

- **Reporting:**
  - Class performance: Mean, median, distribution.
  - Per-question analytics: % of students who got it right.
  - Individual student analytics: Trend over time, weak areas.

#### Implementation:
- Prisma models: `Exam`, `Question`, `ExamAttempt`, `Answer`.
- Auto-marking logic (custom validators for different question types).
- Proctoring integration (optional: integrate with Zoom/external service).
- Charts/dashboards with Chart.js or similar.

---

### F. Progress Tracking & Analytics

#### Features:
- **Student Progress Dashboard:**
  - My Classes: Enrolled subjects/grades.
  - Attendance: Live sessions attended (%). Recorded sessions watched (%).
  - Grades: Latest exam scores, trends, weak areas.
  - Assignments: Due, submitted, graded.
  - Catch-Up Queue: Missed lessons ranked by importance.
  - Time-on-task: Hours spent on platform (gamification).
  - XP/Badges: Unlock milestones (first lesson, perfect quiz, etc.).

- **Parent Progress Dashboard:**
  - Child overview: Enrolled programs, subscription status, expiry.
  - Attendance summary: School (if on-campus) + online.
  - Grade summary: Overall performance, subject-wise breakdown.
  - Alerts: Low grades, missed classes, exam scores, payment reminder.
  - Detailed reports: Download PDF progress report.
  - Behavior/comments: Teacher feedback (if enabled).
  - Communication: Messages from teachers, announcements.

- **Teacher Analytics:**
  - Class performance: Mean times, weak students, hot topics.
  - Per-student tracking: Attendance, progress, areas needing help.
  - Lesson effectiveness: How many watched, engagement metrics.
  - Exam analytics: Item analysis, pass rate by cohort.

#### Implementation:
- Database queries (aggregations, rollup tables for performance).
- Real-time updates via WebSocket for live classes.
- Export to PDF/Excel.

---

### G. Live Classes & Real-Time Sessions

#### Features:
- **Lesson Scheduling (Teacher):**
  - Calendar UI: Pick date, time, duration.
  - Recurring lessons (e.g., every Monday 3 PM).
  - Invite students (auto-enrolled students invited).
  - Generate join link & setup test room.
  - Set recording preference (record or not).

- **Student Join Experience:**
  - Calendar shows upcoming live classes.
  - 15-min before: "Class starting soon" notification.
  - Join button: Opens WebRTC/SFU room.
  - Permissions: Mic, camera prompt.
  - Fallback: Audio-only if bandwidth limited.

- **Live Session Features:**
  - Video grid (teacher + students, speaker view, gallery view).
  - Chat (message + emoji reactions).
  - Whiteboard/annotation (teacher draws, students see in real-time).
  - Screen share (teacher shares content, students see 1080p).
  - Raise hand (student requests to speak; teacher unmutes).
  - Mute all, lock room (teacher controls).
  - Attendance auto-tracked (join/leave timestamps).

- **Recording & Playback:**
  - SFU records stream, uploads to Cloudinary post-session.
  - Auto-generate transcript (optional, if budget allows).
  - Available for asynchronous viewing within 24 hrs.

#### Implementation:
- SFU: mediasoup or Jitsi for WebRTC.
- Signaling: Node.js WebSocket server.
- STUN/TURN: coturn deployment.
- Recording worker: ffmpeg-based, uploads to Cloudinary.

---

### H. Resources Center & Downloadable Content

#### Features:
- **Resource Types:**
  - Worksheets (per topic, grade, subject).
  - Past papers (with model answers, organized by year/term).
  - Study guides & notes.
  - Flashcards (digital, portable).
  - Video tutorials (embedded or linked).
  - Solutions manuals.

- **Resource Organization:**
  - Filter: Subject, grade, topic, exam board (e.g., Cambridge).
  - Search.
  - Favorites (bookmark).
  - Collections (bundle resources for a unit).

- **Download Management:**
  - PDF download (Cloudinary direct + CDN).
  - Batch download (ZIP multiple files).
  - Expiry: Download link valid for 7 days or 3 downloads per student per term.
  - Offline access: Download for offline reading (PWA).

- **Shop Integration:**
  - Standalone past papers: Buy à la carte ($2–5 per paper).
  - Bundles: "Grade 6 Maths Past 5 Years" ($20).
  - Subscriptions: "Past Papers Library" monthly ($10).

#### Implementation:
- Cloudinary for storage, CDN delivery.
- Database: `Resource` model with Cloudinary public IDs.
- React components for bulk download, collections.

---

### I. Notifications & Communications

#### Features:
- **Notification Types:**
  - Lesson start (15 min reminder).
  - Grade published (exam score, assignment feedback).
  - Homework due (1 day advance).
  - Payment expiry (7 days, 1 day).
  - Attendance alert (low attendance warning).
  - Announcements (from teacher/admin).
  - Messages (direct 1-on-1).

- **Channels:**
  - In-app (dashboard bell icon, sidebar).
  - Email (daily digest or real-time).
  - SMS (optional; premium feature).
  - Push notifications (PWA).

- **Communication:**
  - Threaded messaging: Student ↔ Teacher, Parent ↔ Teacher.
  - Bulk announcements (teacher to class, admin to all).
  - Attachment support (PDFs, images).
  - Read receipts.
  - Archived/starred messages.

- **Student Verification Notices:**
  - ID verification required (before accessing paid content).
  - OTP re-verification (periodic, annually).
  - Parent account linking (reminder).

#### Implementation:
- Twilio (SMS) or African telecom API (MTN, Airtel).
- SendGrid/Resend/Mailgun (email).
- Firebase Cloud Messaging (push).
- WebSocket for real-time in-app updates.

---

### J. On-Campus Enrollment & Physical Features

#### Features:
- **Online Admission Form:**
  - Student info (name, DOB, ID).
  - Parent/guardian info.
  - Previous school & grades.
  - Subject preferences (if applicable).
  - Upload documents: Birth certificate, previous report card.
  - Parent consent & signature (digital).
  - Submit & receive confirmation email.

- **Enrollment After Admission:**
  - Assign class (Grade 1A, etc.) by school admin.
  - Pay tuition fee (via system).
  - Receive welcome pack (digital + physical schedule).
  - First-day check-in via portal (optional QR code).

- **On-Campus Features:**
  - Attendance tracking (QR code check-in, or manual teacher entry).
  - Report cards (term & annual).
  - Parent-teacher meeting booking (calendar).
  - School calendar published (holidays, exams).
  - Announcements (all-school, grade-level, class-level).
  - Supplementary online tuition (optional add-on, paid extra).

#### Implementation:
- Intake form builder (Formik + custom validation).
- Document upload (Cloudinary).
- QR code generation (via qrcode.react library).
- PDF report card generation (Puppeteer).

---

### K. Mobile-Specific Features

#### Features:
- **Responsive Design:**
  - Mobile-first layout (320px–480px primary).
  - Tablet optimization (600px–900px).
  - Desktop (1200px+).
  - Touch-friendly buttons, forms, navigation.

- **Performance on Mobile:**
  - Lazy loading: Images, videos.
  - Skeleton loaders (no jarring flashes).
  - Minimal size bundles (code splitting by route).
  - Service worker: Offline fallback, asset caching.

- **Mobile Navigation:**
  - Bottom tab bar: Home, Classes, Grades, Notifications, Profile.
  - Hamburger menu (collapse on small screens).
  - Swipe gestures (e.g., swipe left/right to navigate lessons).

- **Mobile-Specific UX:**
  - Simplified video player (buttons, quality selector).
  - One-handed operation (thumb-reachable buttons).
  - Minimal typing (auto-complete, pickers).
  - Batch operations (long-press to select multiple items).

#### Implementation:
- Tailwind CSS + custom responsive utilities.
- Next.js Image optimization.
- React Query for data fetching+caching.
- Service Worker (Workbox).

---

## Tech Stack & Architecture

### Frontend
- **Framework:** Next.js 16 (App Router).
- **Styling:** Tailwind CSS v4 + custom theme (school colors).
- **UI Components:** Shadcn/UI, Radix UI (accessible, unstyled).
- **State Management:** React Query (server state), Zustand (client state).
- **Video Player:** Video.js (HLS, adaptive streaming).
- **Real-time:** WebSocket (custom Node server) for live classes, chat.
- **Forms:** React Hook Form + Zod validation.
- **Charts:** Chart.js or Recharts (lightweight).
- **File Upload:** react-dropzone + direct Cloudinary upload.
- **PWA:** next-pwa for offline & install-able.
- **Responsive Design:** Mobile-first Tailwind + custom breakpoints.

### Backend / API
- **Runtime:** Node.js (same as Next.js).
- **API:** Next.js API routes (serverless) + optional Express.js microservice for SFU signaling.
- **Database:** PostgreSQL (managed: Render, Railway, AWS RDS).
- **ORM:** Prisma (type-safe, migrations, excellent DX).
- **Redis:** Session store, caching, job queue (optional: Render, Upstash).
- **Job Queue:** Bull or Inngest (async tasks: email, PDF generation, transcoding webhooks).
- **Authentication:** NextAuth.js v5 (Prisma adapter).
- **File Storage:** Cloudinary (primary); S3 (optional backup).

### Real-Time & Live Classes
- **SFU (Selective Forwarding Unit):** mediasoup (recommended) or Jitsi Videobridge.
- **Signaling Server:** Node.js with ws (WebSocket library).
- **STUN/TURN:** coturn (self-hosted or managed).
- **Recording:** ffmpeg (server-side) or SFU plugin.

### Payment & External Services
- **Payments:** Stripe (Checkout, Webhooks), Pesapal API.
- **Email:** SendGrid, Resend, or Mailgun (free tier for starters).
- **SMS:** Twilio (OTP) or African telecom API.
- **Video Processing:** Cloudinary (transformations, transcoding).
- **Error Monitoring:** Sentry (free tier).
- **Logging:** Logflare, Papertrail, or self-hosted ELK.

### DevOps & Hosting
- **Hosting:** Vercel (frontend), Railway/Render/Fly.io (backend microservices).
- **Alternative:** Self-hosted on DigitalOcean App Platform or AWS.
- **CDN:** Cloudinary CDN (for videos), Vercel Edge Cache (for API).
- **CI/CD:** GitHub Actions (build, test, deploy).
- **IaC:** Terraform (optional, for self-hosted).

### Analytics & Monitoring
- **Product Analytics:** Mixpanel, Segment, or PostHog (free tier).
- **Uptime Monitoring:** Uptime Kuma (self-hosted) or Pingdom.
- **Performance:** Next.js Analytics, Web Vitals.

---

## Database Schema (Prisma v2)

This is an extension of the earlier schema, incorporating all new features:

```prisma
// ========== Users & Authentication ==========
model User {
  id String @id @default(cuid())
  email String @unique
  password String? // bcrypt hashed, nullable for SSO
  phone String? @unique
  phoneVerified Boolean @default(false)
  emailVerified DateTime?
  
  firstName String
  lastName String
  dateOfBirth DateTime?
  gender String? // M, F, Other
  profileImage String? // Cloudinary URL
  
  role UserRole // STUDENT, PARENT, TEACHER, ADMIN, FINANCE
  status UserStatus // ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION
  
  // Verification
  nationalId String? @unique
  idVerified Boolean @default(false)
  idVerifiedAt DateTime?
  
  // For parent accounts
  parentLinkedStudents Student[]
  
  // Relations
  studentProfile Student?
  teacherProfile Teacher?
  subscriptions Subscription[]
  payments Payment[]
  enrollments Enrollment[]
  examAttempts ExamAttempt[]
  progress Progress[]
  lessonAttendees SessionAttendee[]
  notifications Notification[]
  sentMessages Communication[] @relation("SentMessages")
  receivedMessages Communication[] @relation("ReceivedMessages")
  teachingClasses TeacherClass[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  STUDENT
  PARENT
  TEACHER
  ADMIN
  FINANCE
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

model Student {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  grade Int // 1-7 for primary
  schoolYear String // e.g., "2024-2025"
  
  // Parent link
  parentId String?
  parent User? @relation(fields: [parentId], references: [id], onDelete: SetNull)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Teacher {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  qualifications String? // JSON: [{ degree, subject, university }]
  yearsOfExperience Int?
  bio String?
  specialties String? // JSON array: ["Maths", "Physics"]
  hourlyRate Float? // for tuition
  
  classes TeacherClass[]
  lessons Lesson[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ========== Programs & Enrollment ==========
model Program {
  id String @id @default(cuid())
  name String @unique // "Online Full-Time", "Home Tuition", "On-Campus", "Holiday Tuition"
  description String?
  type ProgramType
  icon String? // Cloudinary URL
  
  subscriptionPlans SubscriptionPlan[]
  classes Class[]
  createdAt DateTime @default(now())
}

enum ProgramType {
  ONLINE_FULL_TIME
  HOME_TUITION
  ON_CAMPUS
  HOLIDAY_TUITION
  RESOURCES_SHOP
}

// ========== Subscription & Billing ==========
model SubscriptionPlan {
  id String @id @default(cuid())
  programId String
  program Program @relation(fields: [programId], references: [id], onDelete: Cascade)
  
  name String // e.g., "Grade 3 All Subjects Monthly"
  description String?
  priceUsd Float
  currency String @default("USD")
  
  durationDays Int // 30, 90, 365, etc.
  billingCycle String // "monthly", "termly", "yearly"
  
  // Filters/Tags
  subjects String? // JSON: ["Maths", "English"]
  grades Int? // JSON: [3, 4, 5]
  maxStudents Int? // null = unlimited
  accessLevel String // "full", "limited", "basic"
  
  subscriptions Subscription[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Subscription {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  planId String
  plan SubscriptionPlan @relation(fields: [planId], references: [id])
  
  startDate DateTime @default(now())
  expiryDate DateTime
  isActive Boolean @default(true)
  autoRenew Boolean @default(true)
  
  // Add-ons (subjects, classes, features)
  addOns SubscriptionAddon[]
  
  // Stripe & Pesapal
  stripeCustomerId String?
  stripeSubscriptionId String? @unique
  pesapalOrderId String? @unique
  
  payments Payment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, planId])
}

model SubscriptionAddon {
  id String @id @default(cuid())
  subscriptionId String
  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
  
  type AddonType // EXTRA_SUBJECT, TUTORING_HOURS, PAST_PAPERS, etc.
  name String
  priceUsd Float
  quantity Int @default(1)
  
  addedAt DateTime @default(now())
}

enum AddonType {
  EXTRA_SUBJECT
  EXTRA_GRADE
  TUTORING_HOURS
  PAST_PAPERS_BUNDLE
  PREMIUM_SUPPORT
  EXAM_PROCTOR
}

model Payment {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscriptionId String?
  subscription Subscription? @relation(fields: [subscriptionId], references: [id])
  
  amount Float
  currency String @default("USD")
  paymentMethod PaymentMethod // STRIPE, PESAPAL, BANK_TRANSFER
  
  // External IDs
  stripePaymentIntentId String? @unique
  pesapalOrderId String? @unique
  transactionRef String? @unique
  
  status PaymentStatus
  
  // Invoice
  invoiceNumber String @unique
  invoiceUrl String? // Cloudinary PDF
  receiptUrl String? // Cloudinary PDF
  
  failureReason String?
  retryCount Int @default(0)
  nextRetryAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum PaymentMethod {
  STRIPE
  PESAPAL
  BANK_TRANSFER
  MTN_MONEY
  AIRTEL_MONEY
  ZAMTEL_AIRTIME
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  REFUNDED
  DISPUTED
}

// ========== Classes & Curriculum ==========
model Class {
  id String @id @default(cuid())
  programId String
  program Program @relation(fields: [programId], references: [id])
  
  name String // e.g., "Grade 3A", "Grade 5 Maths"
  grade Int?
  subject String? // e.g., "Maths", "English", null if multi-subject
  description String?
  capacity Int @default(30)
  
  teachers TeacherClass[]
  enrollments Enrollment[]
  lessons Lesson[]
  exams Exam[]
  resources Resource[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Enrollment {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  classId String
  class Class @relation(fields: [classId], references: [id])
  
  enrolledAt DateTime @default(now())
  status EnrollmentStatus @default(ACTIVE)
  
  @@unique([userId, classId])
}

enum EnrollmentStatus {
  ACTIVE
  PAUSED
  COMPLETED
  DROPPED
}

model TeacherClass {
  id String @id @default(cuid())
  teacherId String
  teacher User @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  classId String
  class Class @relation(fields: [classId], references: [id], onDelete: Cascade)
  
  assignedAt DateTime @default(now())
  isPrimary Boolean @default(true)
}

// ========== Lessons & Content ==========
model Lesson {
  id String @id @default(cuid())
  classId String
  class Class @relation(fields: [classId], references: [id])
  createdBy String // Teacher ID
  
  title String
  description String?
  type LessonType
  status LessonStatus
  
  // Scheduling (for live lessons)
  scheduledAt DateTime?
  duration Int? // minutes
  roomId String? // SFU room token
  recordingEnabled Boolean @default(true)
  
  // Recorded content
  cloudinaryPublicId String? // Video ID
  cloudinaryUrl String? // CDN URL
  cloudinaryThumbnail String? // Thumbnail URL
  duration Int? // seconds
  
  // Access control
  publishedAt DateTime?
  isPublished Boolean @default(false)
  accessLevel String // "public", "enrolled", "premium"
  
  // Metadata
  subject String?
  tags String? // JSON array
  contentType String? // "notes-heavy", "calculation-heavy", "visual"
  
  attendees SessionAttendee[]
  progress Progress[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum LessonType {
  LIVE
  RECORDED
  HYBRID
}

enum LessonStatus {
  DRAFT
  SCHEDULED
  LIVE
  COMPLETED
  ARCHIVED
}

model SessionAttendee {
  id String @id @default(cuid())
  lessonId String
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  joinedAt DateTime @default(now())
  leftAt DateTime?
  durationSeconds Int @default(0) // calculated as leftAt - joinedAt
  attended Boolean @default(true)
  watchedRecording Boolean @default(false)
  
  createdAt DateTime @default(now())
}

model Progress {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId String
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  watched Boolean @default(false)
  watchedAt DateTime?
  percentageWatched Int @default(0) // 0-100
  lastWatchedAt DateTime?
  
  notes String? // Student notes (markdown)
  bookmarkedAt DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, lessonId])
}

// ========== Exams & Assessments ==========
model Exam {
  id String @id @default(cuid())
  classId String
  class Class @relation(fields: [classId], references: [id])
  
  title String
  description String?
  type ExamType
  
  // Timing
  scheduledAt DateTime?
  duration Int // minutes
  timeLimitStrict Boolean @default(true)
  
  // Grading
  totalMarks Int @default(100)
  passingMarks Int @default(50)
  passingPercentage Int @default(50)
  
  // Settings
  showAnswersAfterSubmit Boolean @default(true)
  allowRetakes Boolean @default(true)
  maxRetakes Int @default(3)
  shuffleQuestions Boolean @default(true)
  randomizeOptions Boolean @default(true)
  
  // AI-assisted grading
  autoGradeEssays Boolean @default(false)
  
  questions Question[]
  attempts ExamAttempt[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ExamType {
  QUIZ
  ASSIGNMENT
  PRACTICE
  MIDTERM
  FINAL
  DIAGNOSTIC
}

model Question {
  id String @id @default(cuid())
  examId String
  exam Exam @relation(fields: [examId], references: [id], onDelete: Cascade)
  
  type QuestionType
  text String // Can include images, LaTeX for math.
  marks Int @default(1)
  orderIndex Int
  difficultyLevel String? // "easy", "medium", "hard"
  
  // MCQ specific
  options String? // JSON: [{ id, text, isCorrect }]
  
  // Numeric (Math/Science)
  correctAnswer Float? // For numeric questions
  tolerance Float? // ±tolerance acceptable
  units String? // "kg", "meters", etc.
  
  // Explanation
  explanation String? // Shown after attempt
  imageUrl String? // Cloudinary URL
  
  answers Answer[]
  
  createdAt DateTime @default(now())
}

enum QuestionType {
  MCQ
  MULTIPLE_SELECT
  ESSAY
  SHORT_ANSWER
  NUMERIC
  MATCHING
  DRAG_DROP
  FILL_BLANK
}

model ExamAttempt {
  id String @id @default(cuid())
  examId String
  exam Exam @relation(fields: [examId], references: [id])
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  startedAt DateTime @default(now())
  submittedAt DateTime?
  score Int?
  percentage Int?
  isPassed Boolean? // true if score >= passingMarks
  
  feedback String? // Teacher feedback (markdown)
  
  // Proctoring (if enabled)
  flaggedForReview Boolean @default(false)
  suspiciousActivity String? // Notes
  
  answers Answer[]
  
  createdAt DateTime @default(now())
  
  @@unique([examId, userId])
}

model Answer {
  id String @id @default(cuid())
  attemptId String
  attempt ExamAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  questionId String
  question Question @relation(fields: [questionId], references: [id])
  
  answerText String? // For essay, short answer
  selectedOption String? // For MCQ
  numericAnswer Float? // For numeric questions
  
  isCorrect Boolean? // null=pending teacher review, true/false=graded
  earnedMarks Int? // Awarded marks (for essay)
  
  submittedAt DateTime @default(now())
}

// ========== Resources ==========
model Resource {
  id String @id @default(cuid())
  classId String
  class Class @relation(fields: [classId], references: [id])
  
  title String
  description String?
  type ResourceType
  subject String?
  
  // Access
  isPublished Boolean @default(true)
  accessLevel String // "free", "enrolled", "premium"
  
  // Storage
  cloudinaryPublicId String
  cloudinaryUrl String
  fileSize Int // bytes
  
  // Metadata
  author String?
  year Int? // For past papers
  examBoard String? // "Cambridge", "IB"
  tags String? // JSON
  
  downloadCount Int @default(0)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ResourceType {
  PDF_NOTE
  WORKSHEET
  PAST_PAPER
  SOLUTION_MANUAL
  FLASHCARD_SET
  VIDEO_TUTORIAL
  STUDY_GUIDE
}

// ========== Notifications & Communications ==========
model Notification {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type NotificationType
  title String
  body String
  link String? // deeplink
  metadata String? // JSON (lessonId, examId, etc.)
  
  read Boolean @default(false)
  readAt DateTime?
  
  // Delivery channels
  sentToEmail Boolean @default(false)
  sentToSms Boolean @default(false)
  sentToPush Boolean @default(false)
  
  createdAt DateTime @default(now())
}

enum NotificationType {
  LESSON_STARTING
  HOMEWORK_DUE
  GRADE_PUBLISHED
  EXAM_SCORE
  ATTENDANCE_LOW
  PAYMENT_EXPIRING
  PAYMENT_expired
  ANNOUNCEMENT
  MESSAGE
  ASSIGNMENT_FEEDBACK
  CATCH_UP_RECOMMENDED
}

model Communication {
  id String @id @default(cuid())
  senderId String
  sender User @relation("SentMessages", fields: [senderId], references: [id])
  receiverId String
  receiver User @relation("ReceivedMessages", fields: [receiverId], references: [id])
  
  type CommunicationType // Direct message, announcement, broadcast
  subject String?
  body String
  attachmentUrl String? // Cloudinary
  
  read Boolean @default(false)
  readAt DateTime?
  
  parent Communication? @relation("ThreadedMessages", fields: [parentId], references: [id], onDelete: Cascade)
  parentId String?
  replies Communication[] @relation("ThreadedMessages")
  
  createdAt DateTime @default(now())
}

enum CommunicationType {
  DIRECT_MESSAGE
  ANNOUNCEMENT
  BROADCAST
}

// ========== On-Campus Specific ==========
model AdmissionForm {
  id String @id @default(cuid())
  
  studentName String
  dateOfBirth DateTime
  nationalId String?
  gender String?
  
  parentName String
  parentEmail String
  parentPhone String
  parentOccupation String?
  
  previousSchool String?
  previousGrade Int?
  
  applyingForGrade Int
  preferredSubjects String? // JSON
  
  documentsUrl String? // Cloudinary folder
  consentSigned Boolean @default(false)
  
  status AdmissionStatus @default(SUBMITTED)
  submittedAt DateTime @default(now())
  reviewedAt DateTime?
  reviewedBy String? // Admin user ID
  notes String?
  
  // Link to enrolled student (once approved)
  enrolledStudentId String?
}

enum AdmissionStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
  ENROLLED
}

model Attendance {
  id String @id @default(cuid())
  userId String
  lessonId String?
  classId String?
  
  date DateTime
  status AttendanceStatus // PRESENT, ABSENT, LATE, EXCUSED
  remarks String?
  
  recordedAt DateTime @default(now())
  recordedBy String? // Teacher ID
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  LATE
  EXCUSED
  ONLINE
}

// ========== Analytics & Reporting ==========
model AuditLog {
  id String @id @default(cuid())
  userId String?
  action String
  entity String // "User", "Subscription", "Exam", etc.
  entityId String?
  oldValue String? // JSON
  newValue String? // JSON
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}

model SystemMetric {
  id String @id @default(cuid())
  metric String // "daily_active_users", "payment_revenue", "lesson_views"
  value Float
  date DateTime
  tags String? // JSON: { program, grade, subject }
  createdAt DateTime @default(now())
}
```

---

## API Endpoints Overview

```
AUTH
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/logout
  POST   /api/auth/otp/send
  POST   /api/auth/otp/verify
  POST   /api/auth/verify-student
  GET    /api/auth/session

SUBSCRIPTIONS & BILLING
  GET    /api/subscriptions
  POST   /api/subscriptions
  PATCH  /api/subscriptions/:id
  DELETE /api/subscriptions/:id
  GET    /api/subscriptions/:id/invoice
  POST   /api/checkout/stripe
  POST   /api/checkout/pesapal
  POST   /api/webhooks/stripe
  POST   /api/webhooks/pesapal

LESSONS
  GET    /api/lessons
  POST   /api/lessons (teacher)
  GET    /api/lessons/:id
  PUT    /api/lessons/:id (teacher)
  POST   /api/lessons/:id/upload (Cloudinary signed URL)
  POST   /api/lessons/:id/record-session-start (SFU room token)
  GET    /api/lessons/:id/attendees

PROGRESS & TRACKING
  GET    /api/progress/:studentId
  PATCH  /api/progress/:lessonId/watch-percentage
  GET    /api/progress/catch-up-queue/:studentId

EXAMS
  GET    /api/exams
  POST   /api/exams (teacher)
  POST   /api/exams/:id/attempt
  GET    /api/exams/:id/attempt/:attemptId
  PATCH  /api/exams/:id/attempt/:attemptId/submit
  GET    /api/exams/:id/results

RESOURCES
  GET    /api/resources
  POST   /api/resources (teacher)
  GET    /api/resources/:id/download
  POST   /api/resources/:id/upload

NOTIFICATIONS
  GET    /api/notifications
  PATCH  /api/notifications/:id/read
  POST   /api/notifications (admin)

COMMUNICATIONS
  GET    /api/messages
  POST   /api/messages
  PATCH  /api/messages/:id/read

REPORTING & ANALYTICS
  GET    /api/reports/student/:studentId
  GET    /api/reports/class/:classId
  GET    /api/reports/revenue
  GET    /api/reports/audit-logs

ADMIN
  GET    /api/admin/users
  POST   /api/admin/users
  PATCH  /api/admin/users/:id
  GET    /api/admin/classes
  POST   /api/admin/classes
  GET    /api/admin/settings
  PATCH  /api/admin/settings

LIVE SESSIONS (WebSocket)
  /api/live/join/:roomId (WebSocket endpoint for SFU signaling)
  /api/live/leave/:roomId
  /api/live/chat/:roomId
```

---

## Mobile-First UI & Responsive Design

### Device Targets
- **Mobile:** 320px–480px (primary), 480px–600px (large mobile).
- **Tablet:** 600px–1024px (portrait & landscape).
- **Desktop:** 1024px–1440px (standard), 1440px+ (ultra-wide).

### Navigation
- **Mobile:** Bottom tab bar (5 items: Home, Classes, Grades, Notifications, Profile).
- **Tablet:** Side nav + main content (split view in landscape).
- **Desktop:** Traditional sidebar + large content pane.

### Key Mobile Optimizations
- Touch-friendly buttons (min 44×44 px).
- Vertical scrolling primary; horizontal only for swipeable galleries.
- Minimal form fields (lazy load secondary inputs).
- Cached assets (Service Worker, IndexedDB for offline).
- Image optimization (WebP, AVIF, responsive srcsets).
- Code splitting (separate bundles per route).
- Lazy loading (images, videos, components).
- Minimal JS (no unnecessary frameworks; use Web Components if needed).

### Responsive Components
```tsx
// Example: Lesson grid responsive
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {lessons.map(lesson => <LessonCard key={lesson.id} {...lesson} />)}
</div>

// Example: Mobile-first table (collapses to cards on mobile)
<div className="hidden md:block">
  {/* Desktop table */}
</div>
<div className="md:hidden">
  {/* Mobile card layout */}
</div>
```

---

## Performance & Infrastructure

### Frontend Performance
- **Bundle Size:** Target <100 KB gzipped (initial JS).
- **First Contentful Paint (FCP):** <2s on 4G.
- **Time to Interactive (TTI):** <3.5s.
- **Cumulative Layout Shift (CLS):** <0.1.
- **Strategies:**
  - Code splitting (per-route bundles).
  - Tree-shaking + minification.
  - Image optimization (AVIF, WebP, responsive srcsets).
  - Lazy loading (React.lazy, next/dynamic).
  - Service Worker for offline / asset caching.
  - CDN for Cloudinary assets.

### Backend Performance
- **Database:** Connection pooling (PgBouncer), indexed queries, prepared statements.
- **Caching:** Redis for sessions, user subscriptions, lesson metadata.
- **Rate Limiting:** 100 req/min per IP for API, stricter for auth endpoints.
- **Async Jobs:** Bull queue for email, PDF generation, transcoding webhooks.
- **Monitoring:** Query logs, slow query analysis, EXPLAIN plans.

### Availability & Scaling
- **Multi-region:** Vercel (global edge), database replicas (standby).
- **SFU:** Horizontal scaling with room-controller + load balancer.
- **Video:** Cloudinary CDN (global, cached close to users).
- **Failover:** Health checks, auto-restart on Render/Railway.

### Network Optimization
- **CDN:** Cloudinary (video), Vercel edges (API).
- **Compression:** gzip, Brotli for text.
- **HTTP/2:** Vercel default.
- **Prefetching:** Next.js link prefetch.

---

## Security & Compliance

### Authentication
- Password hashing: bcrypt (10+ rounds).
- Session management: Secure, HttpOnly cookies (NextAuth).
- OTP (2FA): TOTP or SMS; time-based, 6-digit.
- Account lockout: 5 failed login attempts → 15-min lock.

### Authorization
- RBAC: Middleware checks (user.role).
- Subscription validations: Before lesson/resource access.
- Granular permissions: Student sees own data only, teacher sees class data.

### Data Protection
- **TLS/HTTPS:** All endpoints (Let's Encrypt via Vercel).
- **Database:** Encrypted SSL connections, encrypted at rest (managed DB).
- **File Storage:** Cloudinary private uploads for sensitive content; signed URLs for access.
- **Passwords:** Never logged, never emailed.
- **Payment PCI Compliance:** Stripe/Pesapal handle sensitive data; never store full card details.

### Privacy
- GDPR/CCPA compliance (if applicable):
  - User consent for data collection.
  - Data export feature.
  - Account deletion (cascading).
  - Privacy policy + terms of service.
- Parent consent: For tracking child online (especially live video).

### Monitoring & Logging
- Audit logs: Track user actions (login, payment, grade change).
- Error monitoring: Sentry captures exceptions.
- Rate limiting: Prevent brute-force, DDoS.
- IP whitelisting: (Optional) Restrict admin endpoints.

### Incident Response
- On-call rotation (if deployed).
- Status page (StatusPage.io or self-hosted).
- Backup & restore procedures (tested monthly).

---

## Integration Points

### External Services
1. **Stripe:** Webhook for subscription updates, payment intents.
2. **Pesapal:** IPN callback for mobile money payment confirmation.
3. **Cloudinary:** Upload API, webhooks for transcoding complete.
4. **SendGrid/Resend:** Email API for notifications.
5. **Twilio:** SMS API for OTP.
6. **Sentry:** Error reporting (one-line integration).
7. **Firebase Analytics:** Product analytics (optional).

### Admin Configuration
- Subscription plans (create, edit, enable/disable).
- Pricing by region/currency.
- Notification templates (email, SMS).
- System settings (logo, colors, terms).
- User roles & permissions.

---

## Deployment & Scaling

### Phase 1 (MVP - Single Region, Minimal Ops)
- **Frontend:** Vercel (automated CI/CD).
- **Backend:** Render or Railway (auto-deploy on git push).
- **Database:** Render Postgres (managed, auto-backups).
- **Cache:** Upstash Redis (serverless).
- **Email/SMS:** SendGrid free tier.
- **Storage:** Cloudinary free tier (50 GB).
- **SFU (if included):** Docker container on Render (shared resources).

### Phase 2 (Growth - Multi-Region, High Availability)
- **Frontend:** Vercel with global edge caching.
- **Backend:** Fly.io or AWS ECS (multiple regions).
- **Database:** AWS RDS Multi-AZ (read replicas per region).
- **Cache:** Redis Cloud (cluster mode).
- **Video:** Cloudinary paid (streaming, analytics).
- **SFU:** Kubernetes cluster (horizontal auto-scale).
- **Monitoring:** NewRelic or DataDog.

### CI/CD
```yaml
# .github/workflows/deploy.yml (sketch)
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - name: Deploy to Vercel
        uses: vercel/action@v1
      - name: Deploy to Render (backend)
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## Timeline & Milestones

### Phase 1: Foundation (Weeks 1–8)
- **Weeks 1–2:** Project setup, Prisma schema, NextAuth integration.
- **Weeks 3–4:** Stripe + Pesapal checkout, webhook handlers.
- **Weeks 5–6:** Student/parent registration, subscription validation, basic dashboard.
- **Weeks 7–8:** Cloudinary video upload + playback, test with 10 students.

### Phase 2: Core Features (Weeks 9–20)
- **Weeks 9–12:** Exam engine (MCQ, essay, numeric), grading.
- **Weeks 13–15:** Progress tracking, notifications, communications.
- **Weeks 16–18:** Resources center, downloadables, invoices.
- **Weeks 19–20:** Mobile responsiveness, performance tuning.

### Phase 3: Advanced (Weeks 21–32)
- **Weeks 21–24:** Live lessons (SFU + signaling), TURN setup.
- **Weeks 25–27:** Recording pipeline, transcoding, auto-upload.
- **Weeks 28–30:** Admin dashboards, analytics, reporting.
- **Weeks 31–32:** Security hardening, E2E testing, UAT.

### Phase 4: Launch & Post-Launch (Weeks 33–36)
- **Weeks 33–34:** Beta with 100 users, feedback collection.
- **Weeks 35–36:** Public launch, monitoring, on-call support.

### Post-Launch
- Ongoing: Feature additions, bug fixes, scaling as needed.

---

## Non-Functional Requirements

### Reliability
- **Uptime SLA:** 99.5% (4.5 hrs downtime/month).
- **RTO (Recovery Time Objective):** <30 min.
- **RPO (Recovery Point Objective):** <5 min (database backups).
- **Data Backup:** Daily automated snapshots, 30-day retention.

### Scalability
- **Concurrent Users:** 1,000 students + 100 teachers online simultaneously (initial).
- **Growth Plan:** Scale to 10,000+ users (Phase 2).
- **Video Bandwidth:** 500 Mbps for live streaming (SFU + CDN).
- **Database:** Support 1M+ records (queries <100ms at scale).

### Usability
- **Browser Support:** Chrome, Safari, Firefox, Edge (latest 2 versions).
- **Mobile Support:** iOS 12+, Android 8+.
- **Accessibility:** WCAG 2.1 AA (color contrast, keyboard nav, screen readers).
- **Load Time:** <2s FCP on 4G, <500ms on desktop.

### Maintainability
- **Code Quality:** ESLint + Prettier (enforced via CI).
- **Test Coverage:** >70% (unit + integration).
- **Documentation:** Inline comments, API docs (Swagger/OpenAPI), runbooks.
- **Dependency Management:** Regular updates, automated security patches (Dependabot).

### Cost Efficiency (MVP Phase 1)
| Service | Est. Monthly Cost |
|---------|------------------|
| Vercel (Frontend) | $20 (Hobby) → $50 (Pro) |
| Render (Database) | $15 (PostgreSQL - dev) |
| Render (Backend) | $12 (Web service) |
| Upstash Redis | Free tier |
| Cloudinary | Free tier (50 GB) |
| SendGrid | Free tier (100 emails/day) |
| Stripe | 2.2% + $0.30 per transaction |
| Pesapal | ~5% per transaction |
| **Total** | ~$50–100/month |

---

## Summary of Key Differentiators

1. **Flexible Enrollment:** Granular subject/grade/class selection, not monolithic tiers.
2. **Multiple Programs:** On-campus, online, home tuition, holiday — all in one platform.
3. **Mobile-First:** Optimized for low-bandwidth, touch, offline access.
4. **Payments:** Stripe + Pesapal (mobile money) for Zambian users.
5. **Automated:** Invoices, receipts, notifications, progress sync, verification (OTP + ID).
6. **Production-Grade:** Not a lightweight MVP; includes live classes, recording, analytics, multi-region scaling.
7. **Subject-Specific Features:** Notes-heavy subjects (history, languages) vs. calculation-heavy (math, science).
8. **Real-Time Engagement:** Parent sync, push notifications, in-app messaging.
9. **Catch-Up & Accessibility:** Asynchronous lesson library, offline downloads, mobile-optimized.

---

## Next Steps

1. **Confirm scope & priorities** with stakeholders.
2. **Set up project infrastructure:** GitHub, Vercel, Render, Postgres, Redis.
3. **Finalize database schema** and create Prisma migrations.
4. **Begin Phase 1 development** (Auth → Subscriptions → Lessons).
5. **Weekly sync** for reviews and adjustments.

---

**Document prepared for:** Progress Preparatory School (PPS)  
**Status:** Final Scope (Ready for Development)  
**Last Updated:** February 20, 2026
