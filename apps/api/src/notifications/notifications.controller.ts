import { Controller, Get, Put, Delete, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getNotifications(@Request() req: any): Promise<any> {
    const userId = req.user.id;
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  @Put(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string): Promise<any> {
    const userId = req.user.id;

    const notif = await this.prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  @Delete(':id')
  async deleteNotification(@Request() req: any, @Param('id') id: string): Promise<any> {
    const userId = req.user.id;

    const notif = await this.prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notif) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.delete({
      where: { id }
    });
  }
}
