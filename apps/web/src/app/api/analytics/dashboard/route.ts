import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, ok, err } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if ('error' in auth) return auth.error;
  const { orgId } = auth.user;
  if (!orgId) return err('No organization', 403);

  try {
    // 1. Financial KPIs
    const payments = await prisma.payment.findMany({
      where: {
        invoice: { organizationId: orgId },
        status: 'Completed'
      }
    });
    const revenueSum = payments.reduce((sum, p) => sum + p.amount, 0);

    const invoices = await prisma.invoice.findMany({
      where: { organizationId: orgId }
    });
    const unpaidInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue');
    const outstandingSum = unpaidInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

    const expenses = await prisma.expense.findMany({
      where: { organizationId: orgId }
    });
    const expensesSum = expenses.reduce((sum, e) => sum + e.amount, 0);

    // 2. Active Counts
    const activeProjectsCount = await prisma.project.count({
      where: { organizationId: orgId, status: 'In Progress' }
    });
    const activeClientsCount = await prisma.client.count({
      where: { organizationId: orgId }
    });
    const activeLeadsCount = await prisma.lead.count({
      where: { organizationId: orgId, NOT: { status: { in: ['Won', 'Lost'] } } }
    });

    // 3. 6-Month Chart Data
    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthlyPayments = await prisma.payment.findMany({
        where: {
          invoice: { organizationId: orgId },
          status: 'Completed',
          paidAt: { gte: mStart, lte: mEnd }
        }
      });
      const monthlyRevSum = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

      const monthlyExpenses = await prisma.expense.findMany({
        where: {
          organizationId: orgId,
          expenseDate: { gte: mStart, lte: mEnd }
        }
      });
      const monthlyExpSum = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

      monthlyRevenue.push({
        month: mStart.toLocaleString('default', { month: 'short' }),
        revenue: monthlyRevSum,
        expenses: monthlyExpSum,
      });
    }

    // 4. Combined Activities Feed
    const activitiesFeed = [];

    // Lead activities
    const leadActs = await prisma.leadActivity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { lead: { organizationId: orgId } },
      include: { lead: true }
    });
    for (const act of leadActs) {
      activitiesFeed.push({
        id: act.id,
        type: 'CRM',
        title: `Lead Activity: ${act.lead.firstName} ${act.lead.lastName}`,
        detail: `${act.activityType} - ${act.note}`,
        date: act.createdAt.toISOString()
      });
    }

    // Invoice updates
    const recentInvs = await prisma.invoice.findMany({
      take: 5,
      where: { organizationId: orgId },
      orderBy: { updatedAt: 'desc' },
      include: { client: true }
    });
    for (const inv of recentInvs) {
      activitiesFeed.push({
        id: inv.id,
        type: 'Finance',
        title: `Invoice ${inv.invoiceNumber} updated`,
        detail: `Status is now ${inv.status} for ${inv.client.companyName} (Total: ₹${inv.totalAmount.toLocaleString()})`,
        date: inv.updatedAt.toISOString()
      });
    }

    // Projects progress
    const recentProjects = await prisma.project.findMany({
      take: 5,
      where: { organizationId: orgId },
      orderBy: { updatedAt: 'desc' },
      include: { client: true }
    });
    for (const proj of recentProjects) {
      activitiesFeed.push({
        id: proj.id,
        type: 'Project',
        title: `Project: ${proj.name}`,
        detail: `Status is ${proj.status} (${proj.progress}% completed) for ${proj.client.companyName}`,
        date: proj.updatedAt.toISOString()
      });
    }

    // Sort combined activities feed by date descending
    activitiesFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return ok({
      kpis: {
        revenue: revenueSum,
        expenses: expensesSum,
        outstanding: outstandingSum,
        profit: revenueSum - expensesSum,
        activeProjects: activeProjectsCount,
        activeClients: activeClientsCount,
        activeLeads: activeLeadsCount
      },
      charts: {
        monthlyRevenue
      },
      recentActivities: activitiesFeed.slice(0, 8)
    });
  } catch (error: any) {
    return err(error.message || 'Error compiling analytics dashboard', 500);
  }
}
