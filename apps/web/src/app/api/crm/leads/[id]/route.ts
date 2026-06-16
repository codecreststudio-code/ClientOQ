import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const lead = await prisma.lead.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!lead) return err('Lead not found', 404);

  const body = await req.json();
  const updated = await prisma.lead.update({
    where: { id },
    data: {
      status: body.status,
      estimatedValue: body.estimatedValue !== undefined ? parseFloat(body.estimatedValue) : undefined,
      notes: body.notes,
      ownerId: body.ownerId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      companyName: body.companyName,
    },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const lead = await prisma.lead.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!lead) return err('Lead not found', 404);

  await prisma.lead.delete({ where: { id } });
  return ok({ success: true });
}
