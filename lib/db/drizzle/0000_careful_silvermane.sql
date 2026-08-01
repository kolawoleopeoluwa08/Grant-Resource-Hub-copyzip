-- Initial schema baseline (safe to run on existing databases)
CREATE TABLE IF NOT EXISTS "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"grant_type" text NOT NULL,
	"requested_amount" numeric(12, 2) NOT NULL,
	"institution" text NOT NULL,
	"year_of_study" text NOT NULL,
	"description" text NOT NULL,
	"gpa" numeric(4, 2),
	"annual_income" numeric(12, 2),
	"payment_method" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "applications_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"aid_type" text NOT NULL,
	"message" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"avatar_initials" text,
	"approved" text DEFAULT 'true' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
