import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);
  
  const { id } = await params;

  const conv = await prisma.whatsAppConversation.findFirst({
    where: { id, organizationId: orgId }
  });
  
  if (!conv) {
    return err('Conversation not found', 404);
  }

  const messages = await prisma.whatsAppMessage.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: 'asc' }
  });

  return ok(messages);
}
