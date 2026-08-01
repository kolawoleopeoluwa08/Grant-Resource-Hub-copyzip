-- Additive migration: add application_id column and migrate under_review → reviewing

-- Add application_id column if it does not already exist
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "application_id" text;
--> statement-breakpoint

-- Add unique constraint if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'applications_application_id_unique'
  ) THEN
    ALTER TABLE "applications" ADD CONSTRAINT "applications_application_id_unique" UNIQUE ("application_id");
  END IF;
END $$;
--> statement-breakpoint

-- Migrate any existing under_review status values to reviewing
UPDATE "applications" SET "status" = 'reviewing' WHERE "status" = 'under_review';
