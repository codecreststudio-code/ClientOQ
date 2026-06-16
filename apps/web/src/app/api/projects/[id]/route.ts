import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, organizationId: orgId || undefined },
    include: {
      client: true,
      milestones: { orderBy: { dueDate: 'asc' } },
      tasks: {
        include: {
          assignee: { select: { firstName: true, lastName: true, avatarUrl: true } },
          comments: { include: { user: { select: { firstName: true, lastName: true } } } },
          checklists: true,
          timeLogs: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!project) return err('Project not found', 404);
  return ok(project);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  const { id } = await params;

  const project = await prisma.project.findFirst({ where: { id, organizationId: orgId || undefined } });
  if (!project) return err('Project not found', 404);

  const body = await req.json();
  const updated = await prisma.project.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      status: body.status,
      priority: body.priority,
      progress: body.progress,
      budget: body.budget ? parseFloat(body.budget) : undefined,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    },
    include: { client: true, milestones: true, tasks: true },
  });
  return ok(updated);
}
