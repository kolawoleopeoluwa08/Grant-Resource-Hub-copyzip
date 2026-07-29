import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER || '';
const FROM = `"Hope Foundation" <${process.env.GMAIL_USER}>`;

export async function sendApplicationEmail(data: {
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
  id: number;
  submittedAt: string;
}) {
  const grantLabels: Record<string, string> = {
    tuition_fees: 'Tuition & Enrollment Fees',
    books_supplies: 'Textbooks & Academic Supplies',
    housing_meals: 'Campus Housing & Meal Plans',
    technology_equipment: 'Technology & Equipment',
    research_fees: 'Research & Laboratory Fees',
    study_abroad: 'Study Abroad Program',
    general_education: 'General Educational Support',
  };

  const paymentLabels: Record<string, string> = {
    check: 'Check (mailed)',
    wire_transfer: 'Wire Transfer',
    moneygram: 'MoneyGram',
  };

  const html = `
    <div style="font-family: Georgia, serif; max-width: 680px; margin: 0 auto; background: #f8f7f4; padding: 32px;">
      <div style="background: #1a3a5c; color: white; padding: 28px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Hope Foundation</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px;">
          Student Aid Resource Program — New Application
        </p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="background: #f1f5f9;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Application #${data.id} — ${new Date(data.submittedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
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
          ${data.gpa != null ? `<tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">GPA</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.gpa.toFixed(2)} / 4.0</td></tr>` : ''}
          <tr style="background: #f8fafc;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Grant Request</th>
          </tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Grant Category</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${grantLabels[data.grantType] || data.grantType}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Requested Amount</td>
              <td style="padding: 10px 14px; color: #1e293b; font-weight: bold; border-bottom: 1px solid #f1f5f9;">$${Number(data.requestedAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          ${data.annualIncome != null ? `<tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Annual Income</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">$${Number(data.annualIncome).toLocaleString('en-US')}</td></tr>` : ''}
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Payment Method</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.paymentMethod ? (paymentLabels[data.paymentMethod] || data.paymentMethod) : 'Not specified'}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px 20px; background: #f1f5f9; border-left: 4px solid #1a3a5c; border-radius: 4px;">
          <div style="font-weight: bold; color: #334155; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Statement of Need</div>
          <div style="color: #475569; line-height: 1.7; white-space: pre-wrap;">${data.description}</div>
        </div>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
          Hope Foundation — Student Aid Resource Program &nbsp;|&nbsp; grants@hopefoundation.org
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: FROM,
    to: NOTIFY_EMAIL,
    subject: `📋 New Grant Application #${data.id} — ${data.firstName} ${data.lastName} | $${Number(data.requestedAmount).toLocaleString()}`,
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
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Hope Foundation</h1>
        <p style="margin: 4px 0 0; font-size: 13px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px;">
          New Contact Form Submission
        </p>
      </div>
      <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="background: #f1f5f9;">
            <th colspan="2" style="padding: 10px 14px; text-align: left; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
              Message #${data.id} — ${new Date(data.createdAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
            </th>
          </tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; width: 40%; border-bottom: 1px solid #f1f5f9;">Name</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.name}</td></tr>
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Email</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${data.email}" style="color: #1a3a5c;">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Phone</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.phone}</td></tr>` : ''}
          <tr><td style="padding: 10px 14px; font-weight: bold; color: #334155; border-bottom: 1px solid #f1f5f9;">Subject</td>
              <td style="padding: 10px 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9;">${data.subject}</td></tr>
        </table>

        <div style="margin-top: 24px; padding: 16px 20px; background: #f1f5f9; border-left: 4px solid #c9a84c; border-radius: 4px;">
          <div style="font-weight: bold; color: #334155; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message</div>
          <div style="color: #475569; line-height: 1.7; white-space: pre-wrap;">${data.message}</div>
        </div>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
          Hope Foundation — Student Aid Resource Program &nbsp;|&nbsp; grants@hopefoundation.org
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: FROM,
    to: NOTIFY_EMAIL,
    subject: `✉️ Contact Form: "${data.subject}" from ${data.name}`,
    html,
  });
}
