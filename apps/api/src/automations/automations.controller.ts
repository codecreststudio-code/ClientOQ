import { Controller, Get, Post, Body, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/automations')
@UseGuards(AuthGuard)
export class AutomationsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAutomations(@Request() req: any) {
    const orgId = req.user.orgId;
    return this.prisma.automation.findMany({
      where: { organizationId: orgId },
      include: { logs: { orderBy: { executedAt: 'desc' }, take: 10 } },
      orderBy: { name: 'asc' }
    });
  }

  @Post('trigger')
  async triggerAutomation(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const { triggerType, eventData } = body;

    // Find active automations for this trigger type
    const activeRules = await this.prisma.automation.findMany({
      where: { organizationId: orgId, triggerType, isActive: true }
    });

    const executionLogs = [];

    for (const rule of activeRules) {
      try {
        // Run simulated action logic
        let note = `Executed trigger "${triggerType}" for rule "${rule.name}". `;
        if (rule.actionType === 'Send WhatsApp') {
          note += `Sent automated WhatsApp notification to client. Context: ${JSON.stringify(eventData)}`;
        } else if (rule.actionType === 'Create Task') {
          note += `Created automated task in project board.`;
        } else {
          note += `Sent email campaign update.`;
        }

        // Save execution log
        const log = await this.prisma.automationLog.create({
          data: {
            automationId: rule.id,
            status: 'Success'
          }
        });
        executionLogs.push({ ruleName: rule.name, status: 'Success', details: note, logId: log.id });
      } catch (err) {
        const log = await this.prisma.automationLog.create({
          data: {
            automationId: rule.id,
            status: 'Failed',
            error: err.message
          }
        });
        executionLogs.push({ ruleName: rule.name, status: 'Failed', error: err.message, logId: log.id });
      }
    }

    return {
      triggeredCount: activeRules.length,
      executions: executionLogs
    };
  }
}
