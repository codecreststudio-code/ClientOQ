import { Controller, Get, UseGuards, Request, Res } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';

@Controller('api/reports')
@UseGuards(AuthGuard)
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @Get('invoices/csv')
  async getInvoicesCsv(@Request() req: any, @Res() res: Response) {
    const orgId = req.user.orgId;

    const invoices = await this.prisma.invoice.findMany({
      where: { organizationId: orgId },
      include: { client: true }
    });

    let csvContent = 'Invoice Number,Client,Due Date,Subtotal,Tax,Total,Status\n';
    invoices.forEach(inv => {
      csvContent += `"${inv.invoiceNumber}","${inv.client.companyName}","${inv.dueDate.toISOString().split('T')[0]}",${inv.subtotal},${inv.taxAmount},${inv.totalAmount},"${inv.status}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`invoices-ledger-${Date.now()}.csv`);
    return res.send(csvContent);
  }

  @Get('invoices/pdf')
  async getInvoicesPdf(@Request() req: any, @Res() res: Response) {
    const orgId = req.user.orgId;

    const invoices = await this.prisma.invoice.findMany({
      where: { organizationId: orgId },
      include: { client: true }
    });

    let htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: monospace; padding: 40px; background-color: #f7f5f0; color: #2b2622; }
            h1 { font-size: 20px; border-bottom: 2px solid #2b2622; padding-bottom: 10px; text-transform: uppercase; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #2b2622; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #2b2622; color: #f7f5f0; }
            .total { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Financial Invoices Statement Ledger</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Due Date</th>
                <th>Subtotal</th>
                <th>Tax (18%)</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
    `;

    invoices.forEach(inv => {
      htmlContent += `
        <tr>
          <td>${inv.invoiceNumber}</td>
          <td>${inv.client.companyName}</td>
          <td>${inv.dueDate.toISOString().split('T')[0]}</td>
          <td>₹${inv.subtotal.toLocaleString()}</td>
          <td>₹${inv.taxAmount.toLocaleString()}</td>
          <td>₹${inv.totalAmount.toLocaleString()}</td>
          <td>${inv.status}</td>
        </tr>
      `;
    });

    htmlContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    res.header('Content-Type', 'text/html');
    res.attachment(`invoices-statement-${Date.now()}.html`);
    return res.send(htmlContent);
  }
}
