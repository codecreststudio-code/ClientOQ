import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

// POST /api/projects/[id]/tasks
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { sub } = auth.user;
  const { id: projectId } = await params;

  const body = await req.json();
  const task = await prisma.task.create({
    data: {
      projectId,
      title: body.title,
      description: body.description,
      priority: body.priority || 'Medium',
      status: body.status || 'To Do',
      assigneeId: body.assigneeId,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      estimatedHours: body.estimatedHours ? parseInt(body.estimatedHours) : 0,
    },
    include: { assignee: { select: { firstName: true, lastName: true } }, checklists: true },
  });

  if (body.assigneeId && body.assigneeId !== sub) {
    await prisma.notification.create({
      data: {
        userId: body.assigneeId,
        title: 'Task Assigned',
        message: `You have been assigned: "${task.title}"`,
        type: 'Project',
      },
    }).catch(() => {});
  }

  return ok(task, 201);
}
