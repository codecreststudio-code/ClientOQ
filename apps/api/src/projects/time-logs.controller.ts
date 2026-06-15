import { Controller, Get, Post, Body, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/projects')
@UseGuards(AuthGuard)
export class TimeLogsController {
  constructor(private prisma: PrismaService) {}

  @Post('tasks/:taskId/time-logs')
  async createTimeLog(
    @Request() req: any,
    @Param('taskId') taskId: string,
    @Body() body: any
  ): Promise<any> {
    const orgId = req.user.orgId;
    const userId = req.user.id;
    const { duration, description } = body;

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: { organizationId: orgId }
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const durationInt = parseInt(duration) || 0;

    const timeLog = await this.prisma.timeLog.create({
      data: {
        taskId,
        userId,
        duration: durationInt,
        description
      }
    });

    const allLogs = await this.prisma.timeLog.findMany({
      where: { taskId }
    });
    const totalMinutes = allLogs.reduce((sum, log) => sum + log.duration, 0);
    const newActualHours = Math.round(totalMinutes / 60);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { actualHours: newActualHours }
    });

    return timeLog;
  }

  @Get('tasks/:taskId/time-logs')
  async getTimeLogs(
    @Request() req: any,
    @Param('taskId') taskId: string
  ): Promise<any> {
    const orgId = req.user.orgId;

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: { organizationId: orgId }
      }
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.timeLog.findMany({
      where: { taskId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Get('time-logs/summary')
  async getTimeLogsSummary(@Request() req: any): Promise<any> {
    const orgId = req.user.orgId;

    const logs = await this.prisma.timeLog.findMany({
      where: {
        task: {
          project: { organizationId: orgId }
        }
      },
      include: {
        task: {
          include: { project: true }
        },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return logs;
  }
}
