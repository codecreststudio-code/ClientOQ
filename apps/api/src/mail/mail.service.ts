import { Injectable, Logger } from '@nestjs/common';

/**
 * MailService — Production email via Resend.com
 *
 * Setup:
 * 1. Sign up at https://resend.com (free tier: 3000 emails/month)
 * 2. Create an API key and set RESEND_API_KEY in your .env
 * 3. Verify your domain and set RESEND_FROM_EMAIL
 *
 * In development (no RESEND_API_KEY set), emails are logged to console only.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  private readonly apiKey = process.env.RESEND_API_KEY;
  private readonly from = process.env.RESEND_FROM_EMAIL || 'AgencyOS <noreply@agencyos.app>';
  private readonly isProduction = !!process.env.RESEND_API_KEY;

  async sendMail(to: string, subject: string, body: string, html?: string) {
    if (!this.isProduction) {
      // Development: log only
      this.logger.log(`[DEV MAIL] To: ${to} | Subject: ${subject}`);
      this.logger.log(`Body:\n${'─'.repeat(50)}\n${body}\n${'─'.repeat(50)}`);
      return { success: true, messageId: 'dev_' + Math.random().toString(36).substr(2, 9) };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.from,
          to: [to],
          subject,
          text: body,
          html: html || this.textToHtml(body),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        this.logger.error(`Resend error: ${JSON.stringify(err)}`);
        return { success: false, error: err };
      }

      const data = await res.json() as { id: string };
      this.logger.log(`Email sent to ${to} | ID: ${data.id}`);
      return { success: true, messageId: data.id };
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}:`, err);
      return { success: false, error: err };
    }
  }

  /** Simple plain-text to HTML conversion */
  private textToHtml(text: string): string {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
  <div style="background: #0f0f23; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
    <h1 style="color: #a78bfa; margin: 0; font-size: 24px;">AgencyOS</h1>
  </div>
  <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
    <pre style="white-space: pre-wrap; font-family: inherit; margin: 0; color: #374151;">${escaped}</pre>
  </div>
  <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; text-align: center;">
    AgencyOS · You received this because you have an account with us.
  </p>
</body>
</html>`;
  }

  async sendWelcomeEmail(to: string, name: string, orgName: string) {
    const subject = `Welcome to AgencyOS, ${name.split(' ')[0]}! 🎉`;
    const body = `Hi ${name},

Welcome to AgencyOS! Your workspace for "${orgName}" is ready.

Here's what you can do:
• Manage your CRM pipeline and leads
• Track projects and tasks
• Create proposals, contracts and invoices
• Collaborate with your team

Log in now to get started.

Best,
The AgencyOS Team`;
    return this.sendMail(to, subject, body);
  }

  async sendInvoiceEmail(to: string, invoiceNumber: string, amount: number, dueDate: Date) {
    const subject = `Invoice ${invoiceNumber} — ₹${amount.toLocaleString()} due ${dueDate.toLocaleDateString()}`;
    const body = `Hello,

Invoice ${invoiceNumber} has been issued to your account.

Total Due: ₹${amount.toLocaleString()}
Due Date: ${dueDate.toLocaleDateString()}

Please log in to your client portal to view and pay this invoice.

Thank you for your business.

AgencyOS Finance Team`;
    return this.sendMail(to, subject, body);
  }

  async sendPaymentConfirmationEmail(to: string, invoiceNumber: string, amount: number) {
    const subject = `Payment Received — Invoice ${invoiceNumber}`;
    const body = `Hello,

We have successfully received your payment of ₹${amount.toLocaleString()} for invoice ${invoiceNumber}.

Your payment has been recorded. Thank you!

AgencyOS Finance Team`;
    return this.sendMail(to, subject, body);
  }

  async sendContractSignedEmail(to: string, contractTitle: string, clientName: string) {
    const subject = `Contract Signed: ${contractTitle}`;
    const body = `Hi,

Great news! The contract "${contractTitle}" has been signed by ${clientName}.

You can view the signed contract in your AgencyOS dashboard under Contracts.

AgencyOS Team`;
    return this.sendMail(to, subject, body);
  }

  async sendProposalAcceptedEmail(to: string, proposalTitle: string, clientName: string) {
    const subject = `Proposal Accepted: ${proposalTitle}`;
    const body = `Hi,

${clientName} has accepted your proposal "${proposalTitle}".

The next step is to generate and send the contract. Log in to proceed.

AgencyOS CRM`;
    return this.sendMail(to, subject, body);
  }
}
