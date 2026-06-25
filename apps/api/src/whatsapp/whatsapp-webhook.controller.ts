import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('api/whatsapp/webhooks')
export class WhatsappWebhookController {
  private readonly logger = new Logger('WhatsappWebhookController');

  constructor(private prisma: PrismaService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string
  ) {
    this.logger.log(`Received WhatsApp Webhook Handshake verification query...`);
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    if (!verifyToken) {
      this.logger.warn(`WhatsApp webhook verify token not configured — skipping verification check.`);
      return challenge;
    }
    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log(`WhatsApp Webhook verified successfully.`);
      return challenge;
    }
    
    this.logger.warn(`WhatsApp Webhook verification failed.`);
    throw new ForbiddenException('Verification failed');
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleIncomingMessage(@Body() body: any) {
    this.logger.log(`Received WhatsApp Webhook Message Payload`);

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;
    const message = change?.messages?.[0];
    
    if (message && message.type === 'text') {
      const fromPhone = '+' + message.from;
      const content = message.text.body;
      
      this.logger.log(`WhatsApp message from ${fromPhone}: ${content}`);

      // Try to find an existing conversation matching this phone number
      let conv = await this.prisma.whatsAppConversation.findFirst({
        where: { phone: fromPhone }
      });

      if (!conv) {
        // Find client matching phone or fallback to first client
        let client = await this.prisma.client.findFirst({
          where: { phone: { contains: message.from } }
        });

        if (!client) {
          client = await this.prisma.client.findFirst();
        }

        if (client) {
          conv = await this.prisma.whatsAppConversation.create({
            data: {
              organizationId: client.organizationId,
              clientId: client.id,
              phone: fromPhone,
              lastMessage: content
            }
          });
          this.logger.log(`Created new WhatsAppConversation for Client: ${client.companyName}`);
        }
      }

      if (conv) {
        // 1. Create client message record
        await this.prisma.whatsAppMessage.create({
          data: {
            conversationId: conv.id,
            senderType: 'Client',
            content,
            messageType: 'Text'
          }
        });

        // 2. Update conversation metadata
        await this.prisma.whatsAppConversation.update({
          where: { id: conv.id },
          data: { lastMessage: content, updatedAt: new Date() }
        });
        
        this.logger.log(`Saved WhatsApp Message in Conversation: ${conv.id}`);
      }
    }

    return { success: true };
  }
}
