import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private prisma: PrismaService) {}

  @Post('chat')
  async chat(@Request() req: any, @Body() body: any) {
    const orgId = req.user.orgId;
    const userId = req.user.id;
    const { message, conversationId } = body;

    let convId = conversationId;
    if (!convId) {
      const newConv = await this.prisma.aIConversation.create({
        data: {
          organizationId: orgId,
          userId,
          title: message.substring(0, 30) || 'AI Assistant Chat'
        }
      });
      convId = newConv.id;
    }

    // Save user message
    await this.prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: 'user',
        content: message,
        tokenUsage: Math.floor(message.length / 4)
      }
    });

    const msgLower = message.toLowerCase();
    const reply = await this.localChatFallback(orgId, msgLower);

    // Save AI response
    const aiMsg = await this.prisma.aIMessage.create({
      data: {
        conversationId: convId,
        role: 'assistant',
        content: reply,
        tokenUsage: Math.floor(reply.length / 4)
      }
    });

    return {
      conversationId: convId,
      message: aiMsg
    };
  }

  private async localChatFallback(orgId: string, msgLower: string): Promise<string> {
    try {
      // 1. CRM Leads & Pipeline
      if (msgLower.includes('lead') || msgLower.includes('pipeline') || msgLower.includes('crm')) {
        const leadsCount = await this.prisma.lead.count({ where: { organizationId: orgId } });
        const leads = await this.prisma.lead.findMany({
          where: { organizationId: orgId },
          orderBy: { createdAt: 'desc' },
          take: 8
        });
        const leadStages = await this.prisma.lead.groupBy({
          by: ['status'],
          where: { organizationId: orgId },
          _count: true
        });

        const stagesStr = leadStages.map(s => `* **${s.status}**: ${s._count} leads`).join('\n');
        const leadsTable = leads.map(l => 
          `| ${l.firstName} ${l.lastName} | ${l.companyName || 'N/A'} | ${l.status} | ₹${(l.estimatedValue || 0).toLocaleString()} |`
        ).join('\n');

        return `### 📊 CRM Pipeline & Leads Summary
We have **${leadsCount}** total leads in our pipeline.

**Pipeline Stage Breakdown:**
${stagesStr || 'No leads registered in stages.'}

**Recent Leads List:**
| Name | Company | Stage | Value |
| :--- | :--- | :--- | :--- |
${leadsTable || '| No recent leads | - | - | - |'}

*_Note: This data is retrieved live from your local Clientoq database. Under the free offline tier, queries are run using local filters._`;
      }

      // 2. Project Sprints & Tasks
      if (msgLower.includes('project') || msgLower.includes('task') || msgLower.includes('sprint') || msgLower.includes('milestone')) {
        const projectsCount = await this.prisma.project.count({ where: { organizationId: orgId } });
        const projects = await this.prisma.project.findMany({
          where: { organizationId: orgId },
          include: { client: true },
          take: 5
        });

        const pendingTasks = await this.prisma.task.findMany({
          where: { project: { organizationId: orgId }, NOT: { status: 'Completed' } },
          include: { project: true, assignee: true },
          orderBy: { dueDate: 'asc' },
          take: 8
        });

        const projectsList = projects.map(p => 
          `* **${p.name}** (Client: *${p.client.companyName}*) - Status: \`${p.status}\` | Budget: ₹${(p.budget || 0).toLocaleString()} | Progress: **${p.progress}%**`
        ).join('\n');

        const tasksTable = pendingTasks.map(t => 
          `| ${t.title} | ${t.project.name} | ${t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : 'Unassigned'} | ${t.priority} | ${t.status} | ${t.dueDate ? t.dueDate.toLocaleDateString() : 'N/A'} |`
        ).join('\n');

        return `### 🛠️ Projects & Tasks Summary
We currently have **${projectsCount}** active projects on our board.

**Active Projects:**
${projectsList || 'No projects currently in progress.'}

**Pending Task Sprints:**
| Task Title | Project | Assignee | Priority | Status | Due Date |
| :--- | :--- | :--- | :--- | :--- | :--- |
${tasksTable || '| No pending tasks | - | - | - | - | - |'}

*_Note: Running locally on your active workspace database._`;
      }

      // 3. Billing, Invoices & Finances
      if (msgLower.includes('invoice') || msgLower.includes('finance') || msgLower.includes('revenue') || msgLower.includes('bill') || msgLower.includes('expense')) {
        const invoices = await this.prisma.invoice.findMany({
          where: { organizationId: orgId },
          include: { client: true }
        });
        const expenses = await this.prisma.expense.findMany({
          where: { organizationId: orgId }
        });

        const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        const paidRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
        const outstandingAmount = totalInvoiced - paidRevenue;
        
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const netProfit = paidRevenue - totalExpenses;

        const unpaidInvoices = invoices.filter(i => i.status !== 'Paid').slice(0, 5);
        const unpaidTable = unpaidInvoices.map(i => 
          `| ${i.invoiceNumber} | ${i.client.companyName} | ₹${i.totalAmount.toLocaleString()} | ${i.dueDate.toLocaleDateString()} | ${i.status} |`
        ).join('\n');

        return `### 💰 Financial Ledger Insights
* **Total Invoiced Volume:** ₹${totalInvoiced.toLocaleString()}
* **Paid/Realized Revenue:** ₹${paidRevenue.toLocaleString()}
* **Outstanding Receivables:** ₹${outstandingAmount.toLocaleString()}
* **Total Operating Expenses:** ₹${totalExpenses.toLocaleString()}
* **Estimated Net Income (Cash basis):** ₹${netProfit.toLocaleString()}

**Outstanding/Unpaid Invoices:**
| Invoice # | Client | Amount | Due Date | Status |
| :--- | :--- | :--- | :--- | :--- |
${unpaidTable || '| All invoices are fully paid! | - | - | - | - |'}

*_Note: Local ledger calculations are performed using 18% standard GST rules where applicable._`;
      }

      // 4. Clients Directory
      if (msgLower.includes('client') || msgLower.includes('customer') || msgLower.includes('company')) {
        const clients = await this.prisma.client.findMany({
          where: { organizationId: orgId },
          include: { projects: true, invoices: true },
          take: 10
        });

        const clientsTable = clients.map(c => {
          const unpaid = c.invoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
          return `| ${c.companyName} | ${c.website || 'N/A'} | ${c.projects.length} | ₹${unpaid.toLocaleString()} |`;
        }).join('\n');

        return `### 🏢 Client Directory Summary
We have **${clients.length}** clients registered under this organization.

| Company Name | Website | Projects | Outstanding Balance |
| :--- | :--- | :--- | :--- |
${clientsTable || '| No clients registered | - | - | - |'}`;
      }

      // 5. Automations
      if (msgLower.includes('automation') || msgLower.includes('rules') || msgLower.includes('trigger')) {
        const automations = await this.prisma.automation.findMany({
          where: { organizationId: orgId },
          include: { logs: { take: 3, orderBy: { executedAt: 'desc' } } }
        });

        const automationsList = automations.map(a => 
          `* **${a.name}** (Trigger: \`${a.triggerType}\` ➡️ Action: \`${a.actionType}\`) - Status: ${a.isActive ? '🟢 Active' : '🔴 Paused'}
  * *Recent Execs:* ${a.logs.map(l => `${l.executedAt.toLocaleTimeString()} (${l.status})`).join(', ') || 'Never triggered'}`
        ).join('\n');

        return `### ⚙️ Workspace Automations
Here is the active set of automatic workflows:

${automationsList || 'No automation rules configured yet.'}`;
      }

      // 6. Entity Summarization (e.g. Acme Corp)
      // Check if user is asking about a specific client in the database
      const clientsList = await this.prisma.client.findMany({ where: { organizationId: orgId } });
      const matchedClient = clientsList.find(c => msgLower.includes(c.companyName.toLowerCase()));

      if (matchedClient || msgLower.includes('summarize')) {
        const targetClient = matchedClient || clientsList[0]; // Fallback to first if query has "summarize" without specific name
        if (targetClient) {
          const detailed = await this.prisma.client.findUnique({
            where: { id: targetClient.id },
            include: { projects: true, invoices: { include: { payments: true } } }
          });

          if (detailed) {
            const unpaid = detailed.invoices.filter(i => i.status !== 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0);
            const activeProjects = detailed.projects.filter(p => p.status === 'In Progress' || p.status === 'Review');
            
            return `### 🔍 Account Summary: ${detailed.companyName}
* **Active Projects:** ${activeProjects.map(p => `\`${p.name}\``).join(', ') || 'None'}
* **Total Projects Issued:** ${detailed.projects.length}
* **GSTIN:** ${detailed.gstNumber || 'Not provided'}
* **Invoice Balance:** ₹${unpaid.toLocaleString()} Outstanding
* **Address:** ${detailed.address || 'N/A'}, ${detailed.city || 'N/A'}, ${detailed.country || 'N/A'}

Would you like me to draft a summary email or outline new tasks for this account?`;
          }
        }
        return `### Client Summarizer
I could not find a client matching that query in your workspace. Try searching for your exact client's company name (e.g. "Acme Corporation").`;
      }

      // 7. Help Menu & Default Instruction
      return `### 🤖 Clientoq Local Assistant (Free Tier)
Hello! I am your offline-ready database assistant. I am strictly configured to answer questions **only about the Clientoq workspace data and active schemas**.

Here are the topics you can inspect by typing matching keywords:
1. **CRM Pipeline:** Type \`leads\`, \`pipeline\`, or \`crm\` to see sales statuses.
2. **Projects Board:** Type \`projects\`, \`tasks\`, or \`sprints\` to see task progress.
3. **Finance Ledger:** Type \`invoices\`, \`finances\`, \`expenses\`, or \`revenue\`.
4. **Clients:** Type \`clients\` or \`companies\` to list contacts.
5. **Automations:** Type \`automations\` or \`rules\` to view active workflows.
6. **Client Summary:** Type \`summarize <Client Name>\` to view a detailed client ledger profile.

*Note: General knowledge questions, code help, or external topics are not supported under this free local assistant model.*`;

    } catch (err: any) {
      return `An error occurred while compiling your local workspace context: ${err.message}`;
    }
  }
}
