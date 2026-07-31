import { pgTable, text, serial, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  applicationId: text("application_id").unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  grantType: text("grant_type").notNull(),
  requestedAmount: numeric("requested_amount", { precision: 12, scale: 2 }).notNull(),
  institution: text("institution").notNull(),
  yearOfStudy: text("year_of_study").notNull(),
  description: text("description").notNull(),
  gpa: numeric("gpa", { precision: 4, scale: 2 }),
  annualIncome: numeric("annual_income", { precision: 12, scale: 2 }),
  paymentMethod: text("payment_method"),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({
  id: true,
  submittedAt: true,
  status: true,
});
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
