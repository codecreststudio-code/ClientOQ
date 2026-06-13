import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(private prisma: PrismaService) {}

  @Get('invoices')
  async getInvoices(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.invoice.findMany({
      where: { organizationId: orgId },
      include: { client: true, items: true, payments: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post('invoices')
  async createInvoice(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { clientId, invoiceNumber, subtotal, taxAmount, totalAmount, dueDate, items } = body;

    // Verify client belongs to org
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, organizationId: orgId }
    });
    if (!client) {
      throw new ForbiddenException('Invalid client ID');
    }

    const invoice = await this.prisma.invoice.create({
      data: {
        organizationId: orgId,
        clientId,
        invoiceNumber,
        subtotal: parseFloat(subtotal) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        totalAmount: parseFloat(totalAmount) || 0,
        dueDate: new Date(dueDate),
        status: 'Sent'
      }
    });

    if (items && Array.isArray(items)) {
      for (const item of items) {
        await this.prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            description: item.description,
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) || 0
          }
        });
      }
    }

    return this.prisma.invoice.findUnique({
      where: { id: invoice.id },
      include: { client: true, items: true }
    });
  }

  @Get('expenses')
  async getExpenses(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.expense.findMany({
      where: { organizationId: orgId },
      orderBy: { expenseDate: 'desc' }
    });
  }

  @Post('expenses')
  async createExpense(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { category, description, amount, receiptUrl, expenseDate } = body;

    return this.prisma.expense.create({
      data: {
        organizationId: orgId,
        category,
        description,
        amount: parseFloat(amount) || 0,
        receiptUrl,
        expenseDate: new Date(expenseDate)
      }
    });
  }

  @Post('payments')
  async recordPayment(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { invoiceId, paymentGateway, transactionId, amount, paymentMethod } = body;

    // Check if invoice belongs to this org
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, organizationId: orgId }
    });
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        paymentGateway: paymentGateway || 'Stripe',
        transactionId: transactionId || 'tx_' + Math.random().toString(36).substr(2, 9),
        amount: parseFloat(amount) || invoice.totalAmount,
        paymentMethod: paymentMethod || 'Credit Card',
        status: 'Completed',
        paidAt: new Date()
      }
    });

    // Mark invoice as Paid
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'Paid' }
    });

    // Update DailyMetrics analytics for this organization
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingMetric = await this.prisma.dailyMetrics.findFirst({
      where: {
        organizationId: orgId,
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
          organizationId: orgId,
          metricDate: new Date(),
          revenue: payment.amount,
          expenses: 0,
          activeProjects: await this.prisma.project.count({ where: { organizationId: orgId, status: 'In Progress' } }),
          activeClients: await this.prisma.client.count({ where: { organizationId: orgId } })
        }
      });
    }

    return payment;
  }
}
