import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

async function markAsRead(req: NextRequest, id: string) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;

  const notif = await prisma.notification.findFirst({ where: { id, userId: sub } });
  if (!notif) return err('Not found', 404);

  const updated = await prisma.notification.update({ where: { id }, data: { isRead: true } });
  return ok(updated);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return markAsRead(req, id);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return markAsRead(req, id);
}
