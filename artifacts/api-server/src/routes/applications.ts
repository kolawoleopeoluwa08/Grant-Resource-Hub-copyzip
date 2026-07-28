import { Router, type IRouter } from "express";
import { db, applicationsTable, testimonialsTable, contactMessagesTable } from "@workspace/db";
import {
  SubmitApplicationBody,
  SubmitApplicationResponse,
  SubmitContactBody,
  SubmitContactResponse,
  ListTestimonialsResponse,
  GetStatsResponse,
} from "@workspace/api-zod";
import { eq, count, sum } from "drizzle-orm";

const router: IRouter = Router();

// POST /applications
router.post("/applications", async (req, res): Promise<void> => {
  const parsed = SubmitApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [application] = await db
    .insert(applicationsTable)
    .values({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      aidType: data.aidType,
      requestedAmount: String(data.requestedAmount),
      purpose: data.purpose,
      description: data.description,
      householdSize: data.householdSize ?? null,
      annualIncome: data.annualIncome != null ? String(data.annualIncome) : null,
      status: "pending",
    })
    .returning();

  res.status(201).json(
    SubmitApplicationResponse.parse({
      ...application,
      requestedAmount: Number(application.requestedAmount),
      annualIncome: application.annualIncome != null ? Number(application.annualIncome) : null,
      submittedAt: application.submittedAt.toISOString(),
    })
  );
});

// GET /testimonials
router.get("/testimonials", async (req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.approved, "true"))
    .orderBy(testimonialsTable.createdAt);

  res.json(
    ListTestimonialsResponse.parse(
      testimonials.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
      }))
    )
  );
});

// POST /contact
router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const [message] = await db
    .insert(contactMessagesTable)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.subject,
      message: data.message,
    })
    .returning();

  res.status(201).json(
    SubmitContactResponse.parse({
      ...message,
      createdAt: message.createdAt.toISOString(),
    })
  );
});

// GET /stats
router.get("/stats", async (_req, res): Promise<void> => {
  const [totalAppsRow] = await db.select({ count: count() }).from(applicationsTable);
  const [approvedAppsRow] = await db
    .select({ count: count() })
    .from(applicationsTable)
    .where(eq(applicationsTable.status, "approved"));
  const [disbursedRow] = await db
    .select({ total: sum(applicationsTable.requestedAmount) })
    .from(applicationsTable)
    .where(eq(applicationsTable.status, "approved"));
  const [totalTestimonialsRow] = await db
    .select({ count: count() })
    .from(testimonialsTable)
    .where(eq(testimonialsTable.approved, "true"));

  res.json(
    GetStatsResponse.parse({
      totalApplications: totalAppsRow?.count ?? 0,
      approvedApplications: approvedAppsRow?.count ?? 0,
      totalDisbursed: Number(disbursedRow?.total ?? 0),
      totalTestimonials: totalTestimonialsRow?.count ?? 0,
    })
  );
});

export default router;
