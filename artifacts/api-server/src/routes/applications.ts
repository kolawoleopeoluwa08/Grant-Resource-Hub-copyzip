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

const BASE_APPLICATIONS = 2480;

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
      grantType: data.grantType,
      requestedAmount: String(data.requestedAmount),
      institution: data.institution,
      yearOfStudy: data.yearOfStudy,
      description: data.description,
      gpa: data.gpa != null ? String(data.gpa) : null,
      annualIncome: data.annualIncome != null ? String(data.annualIncome) : null,
      status: "pending",
    })
    .returning();

  res.status(201).json(
    SubmitApplicationResponse.parse({
      ...application,
      requestedAmount: Number(application.requestedAmount),
      gpa: application.gpa != null ? Number(application.gpa) : null,
      annualIncome: application.annualIncome != null ? Number(application.annualIncome) : null,
      submittedAt: application.submittedAt.toISOString(),
    })
  );
});

// GET /testimonials
router.get("/testimonials", async (_req, res): Promise<void> => {
  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .where(eq(testimonialsTable.approved, "true"))
    .orderBy(testimonialsTable.createdAt);

  res.json(
    ListTestimonialsResponse.parse(
      testimonials.map((t) => ({
        id: t.id,
        name: t.name,
        location: t.location,
        grantType: t.aidType,
        message: t.message,
        rating: t.rating,
        avatarInitials: t.avatarInitials,
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
  const [dbCountRow] = await db.select({ count: count() }).from(applicationsTable);
  const dbCount = dbCountRow?.count ?? 0;

  const totalApplications = BASE_APPLICATIONS + dbCount;
  const approvedApplications = Math.floor(totalApplications * 0.75);

  const [disbursedRow] = await db
    .select({ total: sum(applicationsTable.requestedAmount) })
    .from(applicationsTable)
    .where(eq(applicationsTable.status, "approved"));

  // Base disbursed amount proportional to base approved grants (avg $4,200 per grant)
  const baseDisbursed = Math.floor(BASE_APPLICATIONS * 0.75) * 4200;
  const totalDisbursed = baseDisbursed + Number(disbursedRow?.total ?? 0);

  res.json(
    GetStatsResponse.parse({
      totalApplications,
      approvedApplications,
      livesImpacted: approvedApplications,
      totalDisbursed,
    })
  );
});

export default router;
