-- Additive migration: add age, gender, student ID, course of study, and ID upload fields

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "age" integer;
--> statement-breakpoint

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "gender" text;
--> statement-breakpoint

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "student_id" text;
--> statement-breakpoint

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "course_of_study" text;
--> statement-breakpoint

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "id_front_image" text;
--> statement-breakpoint

ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "id_back_image" text;
