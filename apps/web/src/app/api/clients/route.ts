import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const clients = await prisma.client.findMany({
    where: { organizationId: orgId },
    include: {
      contacts: true,
      projects: { select: { id: true, name: true, status: true, progress: true } },
      invoices: { select: { id: true, totalAmount: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  return ok(clients);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const body = await req.json();
  const client = await prisma.client.create({
    data: {
      organizationId: orgId,
      companyName: body.companyName,
      website: body.website,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country || 'India',
      gstNumber: body.gstNumber,
      notes: body.notes,
    },
    include: { contacts: true },
  });
  return ok(client, 201);
}
