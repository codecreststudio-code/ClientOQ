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
    const { triggerType, eventData } = body;

    // Find active automations for this trigger type
    const activeRules = await prisma.automation.findMany({
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
        const log = await prisma.automationLog.create({
          data: {
            automationId: rule.id,
            status: 'Success'
          }
        });
        executionLogs.push({ ruleName: rule.name, status: 'Success', details: note, logId: log.id });
      } catch (err: any) {
        const log = await prisma.automationLog.create({
          data: {
            automationId: rule.id,
            status: 'Failed',
            error: err.message
          }
        });
        executionLogs.push({ ruleName: rule.name, status: 'Failed', error: err.message, logId: log.id });
      }
    }

    return ok({
      triggeredCount: activeRules.length,
      executions: executionLogs
    });
  } catch (error: any) {
    return err(error.message || 'Error triggering automations', 500);
  }
}
