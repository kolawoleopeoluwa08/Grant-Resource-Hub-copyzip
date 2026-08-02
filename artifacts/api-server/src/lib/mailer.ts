import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "RESEND_API_KEY environment variable is required but was not provided.",
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "support@hopefoundations.us";
const FROM = `"Hope Foundation Support" <support@hopefoundations.us>`;

async function send(opts: { to: string; subject: string; html: string }) {
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  if (error) {
    // Throw so the existing .catch((err) => console.error(...)) call sites in
    // applications.ts keep working exactly as before.
    throw new Error(`Resend error: ${error.name} - ${error.message}`);
  }

  return data;
}

const grantLabels: Record<string, string> = {
  tuition_fees: "Tuition & Enrollment Fees",
  books_supplies: "Textbooks & Academic Supplies",
  housing_meals: "Campus Housing & Meal Plans",
  technology_equipment: "Technology & Equipment",
  research_fees: "Research & Laboratory Fees",
  study_abroad: "Study Abroad Program",
  general_education: "General Educational Support",
};

const paymentLabels: Record<string, string> = {
  check: "Check (mailed)",
  wire_transfer: "Wire Transfer",
  moneygram: "MoneyGram",
};

export async function sendApplicationEmail(data: {
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  institution: string;
  yearOfStudy: string;
  grantType: string;
  requestedAmount: number;
  gpa?: number | null;
  annualIncome?: number | null;
  description: string;
  paymentMethod?: string | null;
  submittedAt: string;
}) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 680px; margin: 0 auto; background: #f8f7f4; padding: 32px;">
      <div style="background: #1a3a5c; color: white; padding: 28px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Grant Resource Hub</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px;">
          New Grant Application Received
        </p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="background: #f1f5f9;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Application ID: ${data.applicationId} — ${new Date(data.submittedAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
            </th>
          </tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; width: 40%; border-bottom: 1px solid #f1f5f9;">Full Name</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Email</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color: #1a3a5c;">${data.email}</a></td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Phone</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.phone}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Address</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.address}</td></tr>
          <tr style="background: #f8fafc;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Academic Details</th>
          </tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Institution</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.institution}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Year of Study</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.yearOfStudy.charAt(0).toUpperCase() + data.yearOfStudy.slice(1)}</td></tr>
          ${
            data.gpa != null
              ? `<tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">GPA</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.gpa.toFixed(2)} / 4.0</td></tr>`
              : ""
          }
          <tr style="background: #f8fafc;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Grant Request</th>
          </tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Grant Category</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${grantLabels[data.grantType] || data.grantType}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Requested Amount</td>
              <td style="padding: 10px 14px; color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">$${Number(data.requestedAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td></tr>
          ${
            data.annualIncome != null
              ? `<tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Annual Income</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">$${Number(data.annualIncome).toLocaleString("en-US")}</td></tr>`
              : ""
          }
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Payment Method</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.paymentMethod ? paymentLabels[data.paymentMethod] || data.paymentMethod : "Not specified"}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px 20px; background: #f1f5f9; border-left: 4px solid #1a3a5c; border-radius: 4px;">
          <div style="font-weight: bold; color: #334155; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Statement of Need</div>
          <div style="color: #475569; line-height: 1.7; white-space: pre-wrap;">${data.description}</div>
        </div>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
          Grant Resource Hub — Student Aid Resource Program
        </div>
      </div>
    </div>
  `;

  await send({
    to: NOTIFY_EMAIL,
    subject: `New Grant Application Received — ${data.firstName} ${data.lastName} | ${data.applicationId}`,
    html,
  });
}

export async function sendApplicantConfirmationEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  applicationId: string;
  submittedAt: string;
}) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f7f4; padding: 32px;">
      <div style="background: #1a3a5c; color: white; padding: 28px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Grant Resource Hub</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px;">
          Application Confirmation
        </p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="font-size: 16px; color: #1e293b; margin-top: 0;">Hello ${data.firstName} ${data.lastName},</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.7;">
          Your grant application has been successfully received. Our review team will evaluate your submission and contact you with updates.
        </p>

        <div style="margin: 28px 0; padding: 20px 24px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; text-align: center;">
          <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your Application ID</div>
          <div style="font-size: 26px; font-weight: bold; color: #1a3a5c; letter-spacing: 2px; font-family: monospace;">${data.applicationId}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 8px;">Please save this ID for your records</div>
        </div>

        <p style="font-size: 14px; color: #64748b; line-height: 1.7;">
          Submitted on: <strong>${new Date(data.submittedAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</strong>
        </p>

        <p style="font-size: 15px; color: #475569; line-height: 1.7;">
          Thank you for applying to the Grant Resource Hub Student Aid Resource Program. We review applications within <strong>1–2 business days</strong>.
        </p>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
          Grant Resource Hub — Student Aid Resource Program
        </div>
      </div>
    </div>
  `;

  await send({
    to: data.email,
    subject: `Application Received (${data.applicationId})`,
    html,
  });
}

export async function sendContactEmail(data: {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  createdAt: string;
}) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 680px; margin: 0 auto; background: #f8f7f4; padding: 32px;">
      <div style="background: #1a3a5c; color: white; padding: 28px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Grant Resource Hub</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px;">
          New Contact Form Submission
        </p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="background: #f1f5f9;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Message #${data.id} — ${new Date(data.createdAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
            </th>
          </tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; width: 40%; border-bottom: 1px solid #f1f5f9;">Name</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.name}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Email</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color: #1a3a5c;">${data.email}</a></td></tr>
          ${
            data.phone
              ? `<tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Phone</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.phone}</td></tr>`
              : ""
          }
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Subject</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.subject}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px 20px; background: #f1f5f9; border-left: 4px solid #c9a84c; border-radius: 4px;">
          <div style="font-weight: bold; color: #334155; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message</div>
          <div style="color: #475569; line-height: 1.7; white-space: pre-wrap;">${data.message}</div>
        </div>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
          Grant Resource Hub — Student Aid Resource Program
        </div>
      </div>
    </div>
  `;

  await send({
    to: NOTIFY_EMAIL,
    subject: `✉️ Contact Form: "${data.subject}" from ${data.name}`,
    html,
  });
}
