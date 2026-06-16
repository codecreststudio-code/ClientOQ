import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  try {
    const body = await req.json();
    const { conversationId, content } = body;

    const conv = await prisma.whatsAppConversation.findFirst({
      where: { id: conversationId, organizationId: orgId }
    });
    if (!conv) {
      return err('Conversation not found', 404);
    }

    // 1. Create agent message
    const agentMsg = await prisma.whatsAppMessage.create({
      data: {
        conversationId,
        senderType: 'Agent',
        content,
        messageType: 'Text'
      }
    });

    // 2. Update conversation last message
    await prisma.whatsAppConversation.update({
      where: { id: conversationId },
      data: { lastMessage: content }
    });

    // 3. Setup a mock client automated reply after 1.5 seconds to make it interactive!
    // Since Next.js API routes on local dev support setTimeout, this will fire.
    setTimeout(async () => {
      try {
        const clientReplyContent = `Thanks for your message! This is an automated response from our system.`;
        await prisma.whatsAppMessage.create({
          data: {
            conversationId,
            senderType: 'Client',
            content: clientReplyContent,
            messageType: 'Text'
          }
        });
        await prisma.whatsAppConversation.update({
          where: { id: conversationId },
          data: { lastMessage: clientReplyContent }
        });
      } catch (err) {
        console.error('Failed to trigger mock client WhatsApp reply:', err);
      }
    }, 1500);

    return ok(agentMsg);
  } catch (error: any) {
    return err(error.message || 'Error sending message', 500);
  }
}
