import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok } from '@/lib/api-middleware';

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;

  await prisma.notification.updateMany({ where: { userId: sub, isRead: false }, data: { isRead: true } });
  return ok({ success: true });
}
