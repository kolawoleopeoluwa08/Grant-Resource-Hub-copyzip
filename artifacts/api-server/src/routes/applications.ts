import { Router, type IRouter } from "express";
import {
  db,
  applicationsTable,
  testimonialsTable,
  contactMessagesTable,
} from "@workspace/db";
import {
  SubmitApplicationBody,
  SubmitApplicationResponse,
  SubmitContactBody,
  SubmitContactResponse,
  ListTestimonialsResponse,
  GetStatsResponse,
} from "@workspace/api-zod";
import { eq, count, sum } from "drizzle-orm";
import {
  sendApplicationEmail,
  sendApplicantConfirmationEmail,
  sendContactEmail,
} from "../lib/mailer.js";

const BASE_APPLICATIONS = 2480;

const router: IRouter = Router();

function generateApplicationId(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GRH-${date}-${rand}`;
}

// POST /applications
router.post("/applications", async (req, res): Promise<void> => {
  const parsed = SubmitApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const applicationId = generateApplicationId();

  const [application] = await db
    .insert(applicationsTable)
    .values({
      applicationId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      age: data.age,
      gender: data.gender,
      grantType: data.grantType,
      requestedAmount: String(data.requestedAmount),
      institution: data.institution,
      yearOfStudy: data.yearOfStudy,
      studentId: data.studentId,
      courseOfStudy: data.courseOfStudy,
      description: data.description,
      gpa: data.gpa != null ? String(data.gpa) : null,
      annualIncome:
        data.annualIncome != null ? String(data.annualIncome) : null,
      paymentMethod: data.paymentMethod ?? null,
      idFrontImage: data.idFrontImage,
      idBackImage: data.idBackImage,
      status: "pending",
    })
    .returning();

  const response = SubmitApplicationResponse.parse({
    ...application,
    requestedAmount: Number(application.requestedAmount),
    gpa: application.gpa != null ? Number(application.gpa) : null,
    annualIncome:
      application.annualIncome != null
        ? Number(application.annualIncome)
        : null,
    submittedAt: application.submittedAt.toISOString(),
  });

  res.status(201).json(response);

  // Send emails (non-blocking)
  const submittedAt = application.submittedAt.toISOString();

  sendApplicationEmail({
    applicationId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    age: data.age,
    gender: data.gender,
    institution: data.institution,
    yearOfStudy: data.yearOfStudy,
    studentId: data.studentId,
    courseOfStudy: data.courseOfStudy,
    grantType: data.grantType,
    requestedAmount: data.requestedAmount,
    gpa: data.gpa ?? null,
    annualIncome: data.annualIncome ?? null,
    description: data.description,
    paymentMethod: data.paymentMethod ?? null,
    submittedAt,
  })
    .then(() =>
      console.log(`[mailer] admin notification sent for ${applicationId}`),
    )
    .catch((err) => console.error("[mailer] admin notification failed:", err));

  sendApplicantConfirmationEmail({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    applicationId,
    submittedAt,
  })
    .then(() =>
      console.log(
        `[mailer] applicant confirmation sent to ${data.email} for ${applicationId}`,
      ),
    )
    .catch((err) =>
      console.error("[mailer] applicant confirmation failed:", err),
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
      })),
    ),
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

  const response = SubmitContactResponse.parse({
    ...message,
    createdAt: message.createdAt.toISOString(),
  });

  res.status(201).json(response);

  sendContactEmail({
    id: message.id,
    name: data.name,
    email: data.email,
    phone: data.phone ?? null,
    subject: data.subject,
    message: data.message,
    createdAt: message.createdAt.toISOString(),
  }).catch((err) => console.error("[mailer] contact email failed:", err));
});

// GET /stats
router.get("/stats", async (_req, res): Promise<void> => {
  const [dbCountRow] = await db
    .select({ count: count() })
    .from(applicationsTable);
  const dbCount = dbCountRow?.count ?? 0;

  const totalApplications = BASE_APPLICATIONS + dbCount;
  const approvedApplications = Math.floor(totalApplications * 0.75);

  const [disbursedRow] = await db
    .select({ total: sum(applicationsTable.requestedAmount) })
    .from(applicationsTable)
    .where(eq(applicationsTable.status, "approved"));

  const baseDisbursed = Math.floor(BASE_APPLICATIONS * 0.75) * 4200;
  const totalDisbursed = baseDisbursed + Number(disbursedRow?.total ?? 0);

  res.json(
    GetStatsResponse.parse({
      totalApplications,
      approvedApplications,
      livesImpacted: approvedApplications,
      totalDisbursed,
    }),
  );
});

export default router;
