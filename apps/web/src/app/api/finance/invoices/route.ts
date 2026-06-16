import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: orgId },
    include: {
      client: { select: { companyName: true, email: true } },
      items: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return ok(invoices);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId, sub } = auth.user;
  if (!orgId) return err('No organization', 403);

  const body = await req.json();
  const subtotal = body.items.reduce((s: number, i: any) => s + i.quantity * i.price, 0);
  const taxAmount = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + taxAmount;

  // Generate invoice number
  const count = await prisma.invoice.count({ where: { organizationId: orgId } });
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: orgId,
      clientId: body.clientId,
      invoiceNumber,
      subtotal,
      taxAmount,
      totalAmount,
      dueDate: new Date(body.dueDate),
      status: body.status || 'Draft',
      items: {
        create: body.items.map((item: any) => ({
          description: item.description,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price),
        })),
      },
    },
    include: { client: { select: { companyName: true, email: true } }, items: true, payments: true },
  });

  await prisma.notification.create({
    data: {
      userId: sub,
      title: 'Invoice Created',
      message: `Invoice ${invoiceNumber} for ₹${totalAmount.toLocaleString('en-IN')} created`,
      type: 'Payment',
    },
  }).catch(() => {});

  return ok(invoice, 201);
}
