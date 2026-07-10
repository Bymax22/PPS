-- Sample manual DB seed data for Programs, Subjects, and Classes
-- This matches the columns defined in apps/web/prisma/schema.prisma.
-- Run this in your PostgreSQL database connected to the PPS app.

INSERT INTO "Program" (
  "id",
  "name",
  "slug",
  "description",
  "type",
  "icon",
  "metadata",
  "isDeleted",
  "deletedAt",
  "createdAt",
  "updatedAt"
)
VALUES
  ('prog_online', 'Online Learning', 'online-learning', 'Virtual classes for online learners', 'ONLINE_FULL_TIME', 'laptop', '{"category":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('prog_tuition', 'Home Tuition', 'home-tuition', 'One-on-one home tuition sessions', 'HOME_TUITION', 'home', '{"category":"tuition"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('prog_campus', 'On Campus', 'on-campus', 'In-person campus classes', 'ON_CAMPUS', 'school', '{"category":"campus"}'::jsonb, FALSE, NULL, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Subject" (
  "id",
  "name",
  "code",
  "metadata",
  "isDeleted",
  "deletedAt",
  "createdAt",
  "updatedAt"
)
VALUES
  ('sub_eng', 'English', 'ENG', '{"category":"core"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('sub_math', 'Mathematics', 'MATH', '{"category":"core"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('sub_science', 'Science', 'SCI', '{"category":"core"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('sub_sst', 'Social Studies', 'SST', '{"category":"core"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('sub_kis', 'Kiswahili', 'KIS', '{"category":"core"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('sub_comp', 'Computer Studies', 'COMP', '{"category":"elective"}'::jsonb, FALSE, NULL, NOW(), NOW())
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Class" (
  "id",
  "programId",
  "name",
  "grade",
  "subject",
  "capacity",
  "metadata",
  "isDeleted",
  "deletedAt",
  "createdAt",
  "updatedAt"
)
VALUES
  ('cls_g1_eng', 'prog_online', 'Grade 1 English', 1, 'English', 25, '{"level":"beginner","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g1_math', 'prog_online', 'Grade 1 Mathematics', 1, 'Mathematics', 25, '{"level":"beginner","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g2_eng', 'prog_online', 'Grade 2 English', 2, 'English', 25, '{"level":"beginner","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g2_math', 'prog_online', 'Grade 2 Mathematics', 2, 'Mathematics', 25, '{"level":"beginner","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g3_science', 'prog_online', 'Grade 3 Science', 3, 'Science', 25, '{"level":"intermediate","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g4_sst', 'prog_online', 'Grade 4 Social Studies', 4, 'Social Studies', 25, '{"level":"intermediate","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g5_math', 'prog_online', 'Grade 5 Mathematics', 5, 'Mathematics', 30, '{"level":"intermediate","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g6_science', 'prog_online', 'Grade 6 Science', 6, 'Science', 30, '{"level":"intermediate","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_g7_comp', 'prog_online', 'Grade 7 Computer Studies', 7, 'Computer Studies', 30, '{"level":"advanced","stream":"online"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_tuition_g1', 'prog_tuition', 'Home Tuition Grade 1', 1, 'English', 8, '{"level":"beginner","stream":"tuition"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_tuition_g3', 'prog_tuition', 'Home Tuition Grade 3', 3, 'Mathematics', 8, '{"level":"intermediate","stream":"tuition"}'::jsonb, FALSE, NULL, NOW(), NOW()),
  ('cls_campus_g6', 'prog_campus', 'Campus Grade 6', 6, 'Science', 35, '{"level":"intermediate","stream":"campus"}'::jsonb, FALSE, NULL, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- Optional: verify what was inserted
SELECT 'Programs' AS table_name, COUNT(*) AS row_count FROM "Program"
UNION ALL
SELECT 'Subjects', COUNT(*) FROM "Subject"
UNION ALL
SELECT 'Classes', COUNT(*) FROM "Class";
