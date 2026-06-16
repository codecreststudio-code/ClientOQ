import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  const conversations = await prisma.whatsAppConversation.findMany({
    where: { organizationId: orgId },
    include: { client: true },
    orderBy: { updatedAt: 'desc' }
  });

  return ok(conversations);
}
