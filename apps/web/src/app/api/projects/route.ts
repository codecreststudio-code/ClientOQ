import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const projects = await prisma.project.findMany({
    where: { organizationId: orgId },
    include: {
      client: { select: { companyName: true } },
      milestones: true,
      tasks: {
        include: { assignee: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return ok(projects);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId, sub } = auth.user;
  if (!orgId) return err('No organization', 403);

  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      organizationId: orgId,
      clientId: body.clientId,
      name: body.name,
      description: body.description,
      status: body.status || 'Planning',
      priority: body.priority || 'Medium',
      budget: body.budget ? parseFloat(body.budget) : 0,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    },
    include: { client: { select: { companyName: true } }, milestones: true, tasks: true },
  });

  await prisma.notification.create({
    data: {
      userId: sub,
      title: 'Project Created',
      message: `Project "${project.name}" has been created and is now in Planning`,
      type: 'Project',
    },
  }).catch(() => {});

  return ok(project, 201);
}
