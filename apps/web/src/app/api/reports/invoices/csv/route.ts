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

    let csvContent = 'Invoice Number,Client,Due Date,Subtotal,Tax,Total,Status\n';
    invoices.forEach(inv => {
      csvContent += `"${inv.invoiceNumber}","${inv.client.companyName}","${inv.dueDate.toISOString().split('T')[0]}",${inv.subtotal},${inv.taxAmount},${inv.totalAmount},"${inv.status}"\n`;
    });

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="invoices-ledger-${Date.now()}.csv"`
      }
    });
  } catch (error: any) {
    return err(error.message || 'Error generating CSV', 500);
  }
}
