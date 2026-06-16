import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;
  const { id } = await params;

  const notif = await prisma.notification.findFirst({ where: { id, userId: sub } });
  if (!notif) return err('Not found', 404);

  const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;
  const { id } = await params;

  await prisma.notification.deleteMany({ where: { id, userId: sub } });
  return ok({ success: true });
}
