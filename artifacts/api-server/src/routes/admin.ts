import { Router, type IRouter } from 'express';
import { db, applicationsTable } from '@workspace/db';
import { eq, count, desc } from 'drizzle-orm';
import { signAdminToken, requireAdmin } from '../middlewares/admin-auth.js';

const router: IRouter = Router();

// POST /admin/login
router.post('/login', async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    res.status(503).json({ error: 'Admin credentials not configured' });
    return;
  }

  if (email !== adminEmail || password !== adminPassword) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signAdminToken({ email, role: 'admin' });
  res.json({ token });
});

// GET /admin/applications — list all applications
router.get('/applications', requireAdmin, async (req, res): Promise<void> => {
  const applications = await db
    .select()
    .from(applicationsTable)
    .orderBy(desc(applicationsTable.submittedAt));

  res.json(
    applications.map((a) => ({
      id: a.id,
      applicationId: a.applicationId,
      firstName: a.firstName,
      lastName: a.lastName,
      email: a.email,
      phone: a.phone,
      address: a.address,
      institution: a.institution,
      yearOfStudy: a.yearOfStudy,
      grantType: a.grantType,
      requestedAmount: Number(a.requestedAmount),
      gpa: a.gpa != null ? Number(a.gpa) : null,
      annualIncome: a.annualIncome != null ? Number(a.annualIncome) : null,
      description: a.description,
      paymentMethod: a.paymentMethod,
      status: a.status,
      submittedAt: a.submittedAt.toISOString(),
    }))
  );
});

// GET /admin/applications/:id — get single application
router.get('/applications/:id', requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params['id']), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const [application] = await db
    .select()
    .from(applicationsTable)
    .where(eq(applicationsTable.id, id));

  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  res.json({
    id: application.id,
    applicationId: application.applicationId,
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    phone: application.phone,
    address: application.address,
    institution: application.institution,
    yearOfStudy: application.yearOfStudy,
    grantType: application.grantType,
    requestedAmount: Number(application.requestedAmount),
    gpa: application.gpa != null ? Number(application.gpa) : null,
    annualIncome: application.annualIncome != null ? Number(application.annualIncome) : null,
    description: application.description,
    paymentMethod: application.paymentMethod,
    status: application.status,
    submittedAt: application.submittedAt.toISOString(),
  });
});

// PATCH /admin/applications/:id/status — update status
router.patch('/applications/:id/status', requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params['id']), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const { status } = req.body as { status?: string };
  const validStatuses = ['pending', 'reviewing', 'approved', 'rejected'] as const;
  if (!status || !validStatuses.includes(status as typeof validStatuses[number])) {
    res.status(400).json({ error: 'Status must be one of: pending, reviewing, approved, rejected' });
    return;
  }

  const [updated] = await db
    .update(applicationsTable)
    .set({ status: status as typeof validStatuses[number] })
    .where(eq(applicationsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  res.json({ id: updated.id, status: updated.status });
});

// GET /admin/stats — status counts
router.get('/stats', requireAdmin, async (_req, res): Promise<void> => {
  const all = await db.select({ status: applicationsTable.status }).from(applicationsTable);

  const stats = { total: 0, pending: 0, reviewing: 0, approved: 0, rejected: 0 };
  for (const row of all) {
    stats.total++;
    if (row.status === 'pending') stats.pending++;
    else if (row.status === 'reviewing') stats.reviewing++;
    else if (row.status === 'approved') stats.approved++;
    else if (row.status === 'rejected') stats.rejected++;
  }

  res.json(stats);
});

export default router;
