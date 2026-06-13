const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Pre-calculated bcrypt hash for "password123"
const PASSWORD_HASH = "$2b$10$IiFYMieWaUoK9AgYaWDfhOMA4memklZwd7Uf2mWVwEsNC0uuOQu8a";

async function main() {
  console.log("Seeding database...");

  // Delete existing data
  await prisma.auditLog.deleteMany();
  await prisma.dailyMetrics.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.automationLog.deleteMany();
  await prisma.automation.deleteMany();
  await prisma.whatsAppMessage.deleteMany();
  await prisma.whatsAppConversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.userMeeting.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.projectFile.deleteMany();
  await prisma.file.deleteMany();
  await prisma.taskChecklist.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.clientContact.deleteMany();
  await prisma.client.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "CodeCrest Studio",
      slug: "codecrest",
      website: "https://codecrest.studio",
      industry: "Web Design & Software Development",
      teamSize: 15,
      subscriptionPlan: "Pro",
      subscriptionStatus: "Active",
    }
  });

  console.log(`Created organization: ${org.name}`);

  // 2. Create Users
  const owner = await prisma.user.create({
    data: {
      organizationId: org.id,
      firstName: "Syed",
      lastName: "Ali",
      email: "syed@codecrest.com",
      phone: "+919876543210",
      passwordHash: PASSWORD_HASH,
      role: "Owner",
      status: "Active",
    }
  });

  const manager = await prisma.user.create({
    data: {
      organizationId: org.id,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@codecrest.com",
      phone: "+919876543211",
      passwordHash: PASSWORD_HASH,
      role: "Manager",
      status: "Active",
    }
  });

  const employee = await prisma.user.create({
    data: {
      organizationId: org.id,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@codecrest.com",
      phone: "+919876543212",
      passwordHash: PASSWORD_HASH,
      role: "Employee",
      status: "Active",
    }
  });

  const clientUser = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@acme.com",
      phone: "+919876543213",
      passwordHash: PASSWORD_HASH,
      role: "Client",
      status: "Active",
    }
  });

  console.log("Created users: Syed (Owner), Alice (Manager), Bob (Employee), John (Client)");

  // 3. Create Leads
  const lead1 = await prisma.lead.create({
    data: {
      organizationId: org.id,
      firstName: "Sarah",
      lastName: "Jenkins",
      email: "sarah@apexcorp.com",
      phone: "+15550199",
      companyName: "Apex Corp",
      source: "Google Search",
      status: "Qualified",
      ownerId: manager.id,
      estimatedValue: 120000,
      notes: "Interested in a complete mobile app and marketing package.",
    }
  });

  const lead2 = await prisma.lead.create({
    data: {
      organizationId: org.id,
      firstName: "David",
      lastName: "Miller",
      email: "david@millermedia.com",
      phone: "+15550188",
      companyName: "Miller Media",
      source: "Referral",
      status: "Proposal Sent",
      ownerId: owner.id,
      estimatedValue: 75000,
      notes: "Proposal sent on June 10. Waiting for review.",
    }
  });

  // Lead Activities
  await prisma.leadActivity.create({
    data: {
      leadId: lead1.id,
      activityType: "Call",
      note: "Initial discovery call. Client wants to launch in Q3.",
      createdBy: manager.id,
    }
  });

  await prisma.leadActivity.create({
    data: {
      leadId: lead2.id,
      activityType: "Proposal Sent",
      note: "Sent contract draft and detailed project proposal.",
      createdBy: owner.id,
    }
  });

  console.log("Created leads and lead activities");

  // 4. Create Clients
  const client = await prisma.client.create({
    data: {
      organizationId: org.id,
      companyName: "Acme Corporation",
      website: "https://acme.com",
      email: "billing@acme.com",
      phone: "+15551234",
      address: "123 Industrial Way",
      city: "Metropolis",
      state: "NY",
      country: "USA",
      gstNumber: "US123456789A",
      notes: "Long-term client. Prefers Net-30 payment terms.",
    }
  });

  await prisma.clientContact.create({
    data: {
      clientId: client.id,
      name: "John Doe",
      designation: "VP of Product",
      email: "john@acme.com",
      phone: "+15551235",
    }
  });

  console.log(`Created client: ${client.companyName} and client contacts`);

  // 5. Create Projects
  const project = await prisma.project.create({
    data: {
      organizationId: org.id,
      clientId: client.id,
      name: "Acme Web App Redesign",
      description: "Rebuilding Acme's main web app with React 19, NextJS and custom admin portal.",
      status: "In Progress",
      priority: "High",
      budget: 80000,
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-08-31"),
      progress: 60,
    }
  });

  // Project Milestones
  const milestone1 = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: "UIUX Design Wireframes",
      dueDate: new Date("2026-05-30"),
      status: "Completed",
    }
  });

  const milestone2 = await prisma.milestone.create({
    data: {
      projectId: project.id,
      title: "Frontend Components Build",
      dueDate: new Date("2026-07-15"),
      status: "Pending",
    }
  });

  console.log(`Created project: ${project.name} and milestones`);

  // 6. Create Tasks
  const task1 = await prisma.task.create({
    data: {
      projectId: project.id,
      assigneeId: employee.id,
      title: "Design Figma mockups for Admin Panel",
      description: "Create high-fidelity designs for the database schema editor and settings page.",
      priority: "Medium",
      status: "Completed",
      dueDate: new Date("2026-05-25"),
      estimatedHours: 20,
      actualHours: 18,
    }
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: project.id,
      assigneeId: employee.id,
      title: "Integrate Prisma schema and seed database",
      description: "Write the prisma.schema file, run db push, and add initial seed data.",
      priority: "High",
      status: "In Progress",
      dueDate: new Date("2026-06-20"),
      estimatedHours: 10,
      actualHours: 4,
    }
  });

  const task3 = await prisma.task.create({
    data: {
      projectId: project.id,
      assigneeId: manager.id,
      title: "Setup NestJS backend boilerplate",
      description: "Configure NestJS with modules, guards, filters, and standard validation.",
      priority: "High",
      status: "To Do",
      dueDate: new Date("2026-06-25"),
      estimatedHours: 8,
      actualHours: 0,
    }
  });

  // Task comments and checklists
  await prisma.taskComment.create({
    data: {
      taskId: task2.id,
      userId: employee.id,
      comment: "Database setup is complete, working on seed script now.",
    }
  });

  await prisma.taskChecklist.create({
    data: {
      taskId: task2.id,
      title: "Write Prisma models",
      completed: true,
    }
  });

  await prisma.taskChecklist.create({
    data: {
      taskId: task2.id,
      title: "Create seed data script",
      completed: false,
    }
  });

  console.log("Created tasks, comments, and checklists");

  // 7. Create Proposals
  const proposal = await prisma.proposal.create({
    data: {
      leadId: lead2.id,
      title: "Acme Marketing SEO Campaign",
      content: JSON.stringify({
        deliverables: ["SEO Audit", "On-page Optimization", "15 Blog Posts", "Monthly Analytics Reports"],
        timeline: "6 Months",
      }),
      amount: 75000,
      status: "Sent",
    }
  });

  console.log("Created proposal");

  // 8. Create Invoices and Payments
  const invoice = await prisma.invoice.create({
    data: {
      organizationId: org.id,
      clientId: client.id,
      invoiceNumber: "INV-2026-001",
      subtotal: 40000,
      taxAmount: 7200,
      totalAmount: 47200,
      dueDate: new Date("2026-06-30"),
      status: "Sent",
    }
  });

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice.id,
      description: "Web Development milestone payment #1 - 50% completion",
      quantity: 1,
      price: 40000,
    }
  });

  const invoicePaid = await prisma.invoice.create({
    data: {
      organizationId: org.id,
      clientId: client.id,
      invoiceNumber: "INV-2026-002",
      subtotal: 10000,
      taxAmount: 1800,
      totalAmount: 11800,
      dueDate: new Date("2026-05-15"),
      status: "Paid",
    }
  });

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoicePaid.id,
      description: "Discovery & wireframes stage deliverables approval",
      quantity: 1,
      price: 10000,
    }
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoicePaid.id,
      paymentGateway: "Stripe",
      transactionId: "ch_1234567890abcdef",
      amount: 11800,
      paymentMethod: "Credit Card",
      status: "Completed",
      paidAt: new Date("2026-05-12"),
    }
  });

  console.log("Created invoices and payment logs");

  // 9. Expenses
  await prisma.expense.create({
    data: {
      organizationId: org.id,
      category: "Software Subscription",
      description: "Vercel Enterprise, Github Enterprise, and Slack Pro license renewals.",
      amount: 4500,
      expenseDate: new Date("2026-05-01"),
    }
  });

  await prisma.expense.create({
    data: {
      organizationId: org.id,
      category: "Marketing",
      description: "Google Ads campaign for Q2 leads acquisition.",
      amount: 12000,
      expenseDate: new Date("2026-05-20"),
    }
  });

  console.log("Created expense items");

  // 10. WhatsApp Inbox Seed
  const waConv = await prisma.whatsAppConversation.create({
    data: {
      organizationId: org.id,
      clientId: client.id,
      phone: "+15551234",
      lastMessage: "Sounds good! Send the invoice when ready.",
    }
  });

  await prisma.whatsAppMessage.create({
    data: {
      conversationId: waConv.id,
      senderType: "Client",
      content: "Hello! Did we complete the wireframes check?",
    }
  });

  await prisma.whatsAppMessage.create({
    data: {
      conversationId: waConv.id,
      senderType: "Agent",
      content: "Hi John, yes we did. They are uploaded to your client portal now.",
    }
  });

  await prisma.whatsAppMessage.create({
    data: {
      conversationId: waConv.id,
      senderType: "Client",
      content: "Sounds good! Send the invoice when ready.",
    }
  });

  console.log("Created WhatsApp conversation log");

  // 11. Daily Metrics (Analytics)
  await prisma.dailyMetrics.create({
    data: {
      organizationId: org.id,
      metricDate: new Date("2026-06-11"),
      revenue: 11800,
      expenses: 16500,
      activeProjects: 1,
      activeClients: 1,
    }
  });

  // 12. Automations
  await prisma.automation.create({
    data: {
      organizationId: org.id,
      name: "New Lead Welcome Notification",
      triggerType: "Lead Created",
      actionType: "Send WhatsApp",
      isActive: true,
    }
  });

  await prisma.automation.create({
    data: {
      organizationId: org.id,
      name: "Invoice Due Reminder",
      triggerType: "Invoice Due",
      actionType: "Send WhatsApp",
      isActive: true,
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
