import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const leads = await prisma.lead.findMany({
    where: { organizationId: orgId },
    include: { activities: { orderBy: { createdAt: 'desc' }, take: 5 }, owner: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return ok(leads);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId, sub } = auth.user;
  if (!orgId) return err('No organization', 403);

  const body = await req.json();
  const lead = await prisma.lead.create({
    data: {
      organizationId: orgId,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      companyName: body.companyName,
      source: body.source || 'Website',
      status: body.status || 'New',
      estimatedValue: body.estimatedValue ? parseFloat(body.estimatedValue) : 0,
      notes: body.notes,
      ownerId: body.ownerId || sub,
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId: sub,
      title: 'New Lead Added',
      message: `${lead.firstName} ${lead.lastName} from ${lead.companyName || 'Unknown'} added to pipeline`,
      type: 'System',
    },
  }).catch(() => {});

  return ok(lead, 201);
}
