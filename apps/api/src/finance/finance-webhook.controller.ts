import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Controller('api/finance/webhooks')
export class FinanceWebhookController {
  private readonly logger = new Logger('FinanceWebhookController');

  constructor(
    private prisma: PrismaService,
    private mailService: MailService
  ) {}

  @Post('razorpay')
  @HttpCode(HttpStatus.OK)
  async handleRazorpayWebhook(@Body() body: any) {
    this.logger.log(`Received Razorpay Webhook Event: ${body.event}`);

    const event = body.event;
    if (event === 'payment.captured') {
      const paymentPayload = body.payload?.payment?.entity;
      if (!paymentPayload) {
        return { success: false, error: 'Malformed payload' };
      }

      // Razorpay uses paise, convert to Rupees
      const amount = paymentPayload.amount / 100;
      
      // Look up invoice. First try notes.invoiceId, then notes.invoice_id, then description
      const invoiceId = paymentPayload.notes?.invoiceId || 
                        paymentPayload.notes?.invoice_id || 
                        paymentPayload.description;

      if (!invoiceId) {
        this.logger.warn(`No invoice ID found in Razorpay payment notes/description: ${paymentPayload.id}`);
        return { success: false, error: 'Invoice ID missing' };
      }

      // Find the invoice in the database
      const invoice = await this.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { client: true }
      });

      if (!invoice) {
        this.logger.warn(`Invoice not found for ID: ${invoiceId}`);
        return { success: false, error: 'Invoice not found' };
      }

      if (invoice.status === 'Paid') {
        this.logger.log(`Invoice ${invoice.invoiceNumber} is already paid. Skipping.`);
        return { success: true, message: 'Already processed' };
      }

      // 1. Create Payment Log
      const payment = await this.prisma.payment.create({
        data: {
          invoiceId,
          paymentGateway: 'Razorpay',
          transactionId: paymentPayload.id,
          amount,
          paymentMethod: paymentPayload.method || 'Credit Card',
          status: 'Completed',
          paidAt: new Date()
        }
      });

      // 2. Mark Invoice as Paid
      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'Paid' }
      });

      // 3. Update DailyMetrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingMetric = await this.prisma.dailyMetrics.findFirst({
        where: {
          organizationId: invoice.organizationId,
          metricDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      });

      if (existingMetric) {
        await this.prisma.dailyMetrics.update({
          where: { id: existingMetric.id },
          data: { revenue: existingMetric.revenue + payment.amount }
        });
      } else {
        await this.prisma.dailyMetrics.create({
          data: {
            organizationId: invoice.organizationId,
            metricDate: new Date(),
            revenue: payment.amount,
            expenses: 0,
            activeProjects: await this.prisma.project.count({ where: { organizationId: invoice.organizationId, status: 'In Progress' } }),
            activeClients: await this.prisma.client.count({ where: { organizationId: invoice.organizationId } })
          }
        });
      }

      // 4. Send Confirmation Email
      if (invoice.client && invoice.client.email) {
        this.mailService.sendPaymentConfirmationEmail(
          invoice.client.email,
          invoice.invoiceNumber,
          amount
        ).catch(err => {
          this.logger.error(`Failed to send payment confirmation email:`, err);
        });
      }

      this.logger.log(`Successfully processed payment for Invoice ${invoice.invoiceNumber} - Amount: ₹${amount}`);
      return { success: true, invoiceNumber: invoice.invoiceNumber };
    }

    return { success: true, message: 'Unhandled event' };
  }
}
