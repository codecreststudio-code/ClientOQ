import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const client = await prisma.client.findFirst({
    where: { id, organizationId: orgId || undefined },
    include: {
      contacts: true,
      projects: { include: { tasks: { select: { id: true, title: true, status: true } }, milestones: true } },
      invoices: { include: { items: true, payments: true }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!client) return err('Client not found', 404);
  return ok(client);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const client = await prisma.client.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!client) return err('Client not found', 404);

  const body = await req.json();
  const updated = await prisma.client.update({
    where: { id },
    data: {
      companyName: body.companyName,
      website: body.website,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      gstNumber: body.gstNumber,
      notes: body.notes,
    },
    include: { contacts: true },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const client = await prisma.client.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!client) return err('Client not found', 404);

  await prisma.client.delete({ where: { id } });
  return ok({ success: true });
}
