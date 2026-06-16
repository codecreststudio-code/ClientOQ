import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'clientoq_secret_token_2026';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log(`WhatsApp Webhook verified successfully.`);
    return new Response(challenge, { status: 200 });
  }
  
  console.warn(`WhatsApp Webhook verification failed. Received Token: ${token}`);
  return new Response('Verification failed', { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(`Received WhatsApp Webhook Message Payload`);

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    
    if (message && message.type === 'text') {
      const fromPhone = '+' + message.from;
      const content = message.text.body;
      
      console.log(`WhatsApp message from ${fromPhone}: ${content}`);

      // Try to find an existing conversation matching this phone number
      let conv = await prisma.whatsAppConversation.findFirst({
        where: { phone: fromPhone }
      });

      if (!conv) {
        // Find client matching phone or fallback to first client
        let client = await prisma.client.findFirst({
          where: { phone: { contains: message.from } }
        });

        if (!client) {
          client = await prisma.client.findFirst();
        }

        if (client) {
          conv = await prisma.whatsAppConversation.create({
            data: {
              organizationId: client.organizationId,
              clientId: client.id,
              phone: fromPhone,
              lastMessage: content
            }
          });
          console.log(`Created new WhatsAppConversation for Client: ${client.companyName}`);
        }
      }

      if (conv) {
        // 1. Create client message record
        await prisma.whatsAppMessage.create({
          data: {
            conversationId: conv.id,
            senderType: 'Client',
            content,
            messageType: 'Text'
          }
        });

        // 2. Update conversation metadata
        await prisma.whatsAppConversation.update({
          where: { id: conv.id },
          data: { lastMessage: content, updatedAt: new Date() }
        });
        
        console.log(`Saved WhatsApp Message in Conversation: ${conv.id}`);
      }
    }

    return ok({ success: true });
  } catch (error: any) {
    console.error('Error handling WhatsApp webhook:', error);
    return err(error.message || 'Webhook Error', 500);
  }
}
