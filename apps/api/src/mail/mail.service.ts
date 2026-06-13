import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');

  async sendMail(to: string, subject: string, body: string) {
    this.logger.log(`[OUTBOUND MAIL TRACE]`);
    this.logger.log(`To: ${to}`);
    this.logger.log(`Subject: ${subject}`);
    this.logger.log(`Body:\n----------------------------------------\n${body}\n----------------------------------------`);
    return { success: true, messageId: 'msg_' + Math.random().toString(36).substr(2, 9) };
  }

  async sendWelcomeEmail(to: string, name: string, orgName: string) {
    const body = `Hi ${name},\n\nWelcome to Clientoq AI! Your tenant workstation for "${orgName}" has been successfully initialized.\n\nYou can now log in, build CRM boards, broadcast webhook messages, and configure automations.\n\nBest,\nClientoq Onboarding Team`;
    return this.sendMail(to, 'Welcome to Clientoq AI!', body);
  }

  async sendInvoiceEmail(to: string, invoiceNumber: string, amount: number, dueDate: Date) {
    const body = `Hello,\n\nWe have generated invoice ${invoiceNumber} for your account.\n\nTotal Due: ₹${amount.toLocaleString()}\nDue Date: ${dueDate.toLocaleDateString()}\n\nYou can pay this invoice directly using the payment portal link sent via SMS/WhatsApp.\n\nThank you,\nFinance Department`;
    return this.sendMail(to, `New Invoice Issued: ${invoiceNumber}`, body);
  }

  async sendPaymentConfirmationEmail(to: string, invoiceNumber: string, amount: number) {
    const body = `Hello,\n\nWe have successfully received your payment of ₹${amount.toLocaleString()} for invoice ${invoiceNumber}.\n\nYour payment has been reconciled in our ledger.\n\nThank you for your business!`;
    return this.sendMail(to, `Payment Received: Invoice ${invoiceNumber}`, body);
  }
}
