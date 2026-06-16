import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!invoice) return err('Invoice not found', 404);

  const body = await req.json();
  const updated = await prisma.invoice.update({
    where: { id },
    data: { status: body.status, dueDate: body.dueDate ? new Date(body.dueDate) : undefined },
    include: { client: { select: { companyName: true } }, items: true, payments: true },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!invoice) return err('Invoice not found', 404);

  await prisma.invoice.delete({ where: { id } });
  return ok({ success: true });
}
