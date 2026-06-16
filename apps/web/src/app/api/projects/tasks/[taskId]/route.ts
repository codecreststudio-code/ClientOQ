import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { taskId } = await params;
  const body = await req.json();

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      assigneeId: body.assigneeId,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      estimatedHours: body.estimatedHours !== undefined ? parseInt(body.estimatedHours) : undefined,
      actualHours: body.actualHours !== undefined ? parseInt(body.actualHours) : undefined,
    },
    include: { assignee: { select: { firstName: true, lastName: true } }, checklists: true, comments: true },
  });
  return ok(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { taskId } = await params;
  await prisma.task.delete({ where: { id: taskId } });
  return ok({ success: true });
}
