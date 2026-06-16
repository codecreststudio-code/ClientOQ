import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;
  const { id } = await params;

  const body = await req.json();
  const activity = await prisma.leadActivity.create({
    data: {
      leadId: id,
      activityType: body.activityType,
      note: body.note,
      createdBy: sub,
    },
  });
  return ok(activity, 201);
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { id } = await params;

  const activities = await prisma.leadActivity.findMany({
    where: { leadId: id },
    orderBy: { createdAt: 'desc' },
  });
  return ok(activities);
}
