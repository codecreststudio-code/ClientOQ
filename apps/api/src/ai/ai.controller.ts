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

    // Generate response based on text keywords
    const msgLower = message.toLowerCase();
    let reply = '';

    if (msgLower.includes('proposal') || msgLower.includes('scope')) {
      reply = `# Project Proposal: Clientoq Portal Integration
**Client:** Acme Corporation
**Date:** June 12, 2026

## 1. Executive Summary
We propose to implement a fully custom Client Portal and CRM workflow integration to unify Acme Corp's client communications.

## 2. Project Scope & Deliverables
* **Phase 1: Discovery & Wireframing** - Define all portal touchpoints.
* **Phase 2: Database & Core API Setup** - Deploy secure Prisma schema.
* **Phase 3: Client Dashboard Frontend** - Interactive Kanban, invoices, and file upload modules.
* **Phase 4: WhatsApp Notifications Loop** - Bulletproof alerts for overdue payments.

## 3. Financial Proposal
* Total project cost: **₹1,50,000**
* Payment terms: 50% upfront, 50% upon milestone approvals.`;
    } else if (msgLower.includes('invoice') || msgLower.includes('bill')) {
      reply = `### Generated Invoice Preview
**Draft Invoice Number:** INV-2026-099
**Client:** Acme Corporation
**Due Date:** June 30, 2026

| Description | Qty | Unit Price | Total |
| :--- | :---: | :---: | :---: |
| Full-Stack Portal Engineering Milestone | 1 | ₹75,000 | ₹75,000 |
| **Subtotal** | | | **₹75,000** |
| **GST (18%)** | | | **₹13,500** |
| **Total Amount Due** | | | **₹88,500** |

Would you like to save this invoice to the finance module and generate a payment link?`;
    } else if (msgLower.includes('task') || msgLower.includes('todo')) {
      reply = `### Recommended Tasks for "Acme Web App Redesign"
Here is a list of tasks I've drafted for this project:

1. **[High Priority] Complete API integrations for user settings portal**
   * Assignee: Alice Smith
   * Est. Hours: 8 hours
2. **[Medium Priority] Write unit tests for invoice checkout pipelines**
   * Assignee: Bob Johnson
   * Est. Hours: 6 hours
3. **[Low Priority] Visual polish on sidebar navigation (Warp theme compliance)**
   * Assignee: Syed Ali
   * Est. Hours: 3 hours

Click "Create Tasks" to inject these directly into the active project board.`;
    } else if (msgLower.includes('email') || msgLower.includes('write')) {
      reply = `Subject: Quick Update: Acme Web App Redesign Progress

Hi John,

I wanted to share a quick update on the web application rebuild. 

Our team has completed the initial database configurations and wireframes milestones. The first invoice is ready for your review and secure checkout inside the Client Portal.

Please let us know if you have any questions before we begin the API frontend integrations next week.

Best regards,
Syed Ali
CodeCrest Studio`;
    } else if (msgLower.includes('summarize') || msgLower.includes('summary')) {
      reply = `### Client Summary: Acme Corporation
* **Relationship Status:** Active (since May 2026)
* **Open Projects:** Acme Web App Redesign (60% Progress, 1/2 Milestones completed)
* **Financial Health:**
  * Total Invoiced: ₹51,800
  * Paid: ₹11,800 (INV-2026-002)
  * Unpaid: ₹40,000 (INV-2026-001, Overdue in 18 days)
* **Latest Activity:** John Doe sent a WhatsApp message: "Sounds good! Send the invoice when ready."`;
    } else {
      reply = `Hello! I am your Clientoq AI Assistant. 

I can help you streamline business operations. Here are a few things I can do:
1. **"Draft a website development proposal for Acme Corp"**
2. **"Generate an invoice for ₹75,000 to Acme Corp"**
3. **"Summarize Acme Corp's open tasks and payment status"**
4. **"Write a follow-up email to John Doe"**

What would you like me to do?`;
    }

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
}
