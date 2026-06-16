import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;

  const notifications = await prisma.notification.findMany({
    where: { userId: sub },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return ok(notifications);
}
