import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  try {
    const invoices = await prisma.invoice.findMany({
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

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="invoices-statement-${Date.now()}.html"`
      }
    });
  } catch (error: any) {
    return err(error.message || 'Error generating HTML statement', 500);
  }
}
