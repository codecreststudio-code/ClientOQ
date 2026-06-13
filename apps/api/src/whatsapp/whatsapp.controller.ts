import { Controller, Get, Post, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/whatsapp')
@UseGuards(AuthGuard)
export class WhatsappController {
  constructor(private prisma: PrismaService) {}

  @Get('conversations')
  async getConversations(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.whatsAppConversation.findMany({
      where: { organizationId: orgId },
      include: { client: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  @Get('conversations/:id/messages')
  async getMessages(@Request() req: any, @Param('id') id: string) {
    const orgId = req.user.orgId;

    const conv = await this.prisma.whatsAppConversation.findFirst({
      where: { id, organizationId: orgId }
    });
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    return this.prisma.whatsAppMessage.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' }
    });
  }

  @Post('messages')
  async sendMessage(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { conversationId, content } = body;

    const conv = await this.prisma.whatsAppConversation.findFirst({
      where: { id: conversationId, organizationId: orgId }
    });
    if (!conv) {
      throw new NotFoundException('Conversation not found');
    }

    // 1. Create agent message
    const agentMsg = await this.prisma.whatsAppMessage.create({
      data: {
        conversationId,
        senderType: 'Agent',
        content,
        messageType: 'Text'
      }
    });

    // 2. Update conversation last message
    await this.prisma.whatsAppConversation.update({
      where: { id: conversationId },
      data: { lastMessage: content }
    });

    // 3. Setup a mock client automated reply after 2 seconds to make it interactive!
    setTimeout(async () => {
      try {
        const clientReplyContent = `Thanks for your message! This is an automated response from Acme Corp.`;
        await this.prisma.whatsAppMessage.create({
          data: {
            conversationId,
            senderType: 'Client',
            content: clientReplyContent,
            messageType: 'Text'
          }
        });
        await this.prisma.whatsAppConversation.update({
          where: { id: conversationId },
          data: { lastMessage: clientReplyContent }
        });
      } catch (err) {
        console.error('Failed to trigger mock client WhatsApp reply:', err);
      }
    }, 2000);

    return agentMsg;
  }
}
