import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const automations = await prisma.automation.findMany({
    where: { organizationId: orgId },
    include: { logs: { orderBy: { executedAt: 'desc' }, take: 10 } },
    orderBy: { name: 'asc' }
  });

  return ok(automations);
}
