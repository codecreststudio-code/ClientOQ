// In production on Vercel, API routes are hosted on the same Next.js origin.
// In development, we also use Next.js backend API routes to avoid a separate NestJS process.
const API_URL = '';

// In-memory fallback database for frontend-only demo mode
let localLeads = [
  { id: 'lead-1', firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah@apexcorp.com', phone: '+15550199', companyName: 'Apex Corp', source: 'Google Search', status: 'Qualified', estimatedValue: 120000, notes: 'Interested in a complete mobile app and marketing package.', activities: [{ id: 'a-1', activityType: 'Call', note: 'Initial discovery call. Client wants to launch in Q3.', createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() },
  { id: 'lead-2', firstName: 'David', lastName: 'Miller', email: 'david@millermedia.com', phone: '+15550188', companyName: 'Miller Media', source: 'Referral', status: 'Proposal Sent', estimatedValue: 75000, notes: 'Proposal sent on June 10. Waiting for review.', activities: [{ id: 'a-2', activityType: 'Proposal Sent', note: 'Sent contract draft and detailed project proposal.', createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() }
];

let localClients = [
  { id: 'client-1', companyName: 'Acme Corporation', website: 'https://acme.com', email: 'billing@acme.com', phone: '+15551234', address: '123 Industrial Way', city: 'Metropolis', state: 'NY', country: 'USA', gstNumber: 'US123456789A', notes: 'Long-term client. Prefers Net-30 payment terms.', timezone: 'America/New_York', contacts: [{ id: 'c-1', name: 'John Doe', designation: 'VP of Product', email: 'john@acme.com', phone: '+15551235' }] }
];

let localProjects = [
  {
    id: 'project-1',
    name: 'Acme Web App Redesign',
    description: 'Rebuilding Acme\'s main web app with React 19, NextJS and custom admin portal.',
    status: 'In Progress',
    priority: 'High',
    budget: 80000,
    startDate: '2026-05-01',
    endDate: '2026-08-31',
    progress: 60,
    client: { companyName: 'Acme Corporation' },
    milestones: [
      { id: 'm-1', title: 'UIUX Design Wireframes', dueDate: '2026-05-30', status: 'Completed' },
      { id: 'm-2', title: 'Frontend Components Build', dueDate: '2026-07-15', status: 'Pending' }
    ],
    tasks: [
      { id: 't-1', title: 'Design Figma mockups for Admin Panel', description: 'Create high-fidelity designs for settings page.', priority: 'Medium', status: 'Completed', dueDate: '2026-05-25', estimatedHours: 20, actualHours: 18, assignee: { firstName: 'Bob', lastName: 'Johnson' }, checklists: [], comments: [] },
      { id: 't-2', title: 'Integrate Prisma schema and seed database', description: 'Write the prisma.schema file and add initial seed data.', priority: 'High', status: 'In Progress', dueDate: '2026-06-20', estimatedHours: 10, actualHours: 4, assignee: { firstName: 'Bob', lastName: 'Johnson' }, checklists: [{ id: 'tc-1', title: 'Write Prisma models', completed: true }, { id: 'tc-2', title: 'Create seed data script', completed: false }], comments: [{ id: 'comm-1', comment: 'Database setup is complete, working on seed script now.', user: { firstName: 'Bob', lastName: 'Johnson' }, createdAt: new Date().toISOString() }] },
      { id: 't-3', title: 'Setup NestJS backend boilerplate', description: 'Configure NestJS with modules, guards, and validation.', priority: 'High', status: 'To Do', dueDate: '2026-06-25', estimatedHours: 8, actualHours: 0, assignee: { firstName: 'Alice', lastName: 'Smith' }, checklists: [], comments: [] }
    ]
  }
];

let localInvoices = [
  { id: 'inv-1', invoiceNumber: 'INV-2026-001', subtotal: 40000, taxAmount: 7200, totalAmount: 47200, dueDate: '2026-06-30', status: 'Sent', client: { companyName: 'Acme Corporation' }, items: [{ id: 'ii-1', description: 'Web Development milestone payment #1 - 50% completion', quantity: 1, price: 40000 }], payments: [] },
  { id: 'inv-2', invoiceNumber: 'INV-2026-002', subtotal: 10000, taxAmount: 1800, totalAmount: 11800, dueDate: '2026-05-15', status: 'Paid', client: { companyName: 'Acme Corporation' }, items: [{ id: 'ii-2', description: 'Discovery & wireframes stage deliverables approval', quantity: 1, price: 10000 }], payments: [{ id: 'p-1', paymentGateway: 'Stripe', transactionId: 'ch_123', amount: 11800, paymentMethod: 'Credit Card', status: 'Completed', paidAt: '2026-05-12' }] }
];

let localExpenses = [
  { id: 'exp-1', category: 'Software Subscription', description: 'Vercel Enterprise and Slack Pro licenses.', amount: 4500, expenseDate: '2026-05-01' },
  { id: 'exp-2', category: 'Marketing', description: 'Google Ads campaign.', amount: 12000, expenseDate: '2026-05-20' }
];

let localWhatsApp = [
  {
    id: 'wa-1',
    phone: '+15551234',
    lastMessage: 'Sounds good! Send the invoice when ready.',
    client: { companyName: 'Acme Corporation' },
    messages: [
      { id: 'wm-1', senderType: 'Client', content: 'Hello! Did we complete the wireframes check?', createdAt: new Date(Date.now() - 100000).toISOString() },
      { id: 'wm-2', senderType: 'Agent', content: 'Hi John, yes we did. They are uploaded to your client portal now.', createdAt: new Date(Date.now() - 50000).toISOString() },
      { id: 'wm-3', senderType: 'Client', content: 'Sounds good! Send the invoice when ready.', createdAt: new Date().toISOString() }
    ]
  }
];

let localAutomations = [
  { id: 'auto-1', name: 'New Lead Welcome Notification', triggerType: 'Lead Created', actionType: 'Send WhatsApp', isActive: true, logs: [{ id: 'l-1', status: 'Success', executedAt: new Date().toISOString() }] },
  { id: 'auto-2', name: 'Invoice Due Reminder', triggerType: 'Invoice Due', actionType: 'Send WhatsApp', isActive: true, logs: [] }
];

let localAIChats = [
  {
    id: 'ai-chat-1',
    title: 'AI Assistant Chat',
    messages: [
      { id: 'aim-1', role: 'assistant', content: 'Hello! I am your Clientoq AI Assistant. I can help you write proposals, create invoices, list project tasks, or outline a client summary. Try typing "Summarize Acme Corp" or "Create a project proposal".' }
    ]
  }
];

let localProposals = [
  { id: 'prop-1', leadId: 'lead-1', title: 'Apex Corporate Web Portal', content: 'Design, development, and hosting contract.', amount: 120000, status: 'Draft', createdAt: new Date().toISOString(), contract: null }
];

let localContracts = [
  { id: 'contract-1', clientId: 'client-1', proposalId: 'prop-1', title: 'Contract for: Apex Corporate Web Portal', fileUrl: null, signed: false, signedAt: null }
];

let localNotifications = [
  { id: 'notif-1', title: 'Invoice Paid', message: 'Invoice INV-2026-002 was paid by Acme Corporation.', type: 'Payment', isRead: false, createdAt: new Date().toISOString() },
  { id: 'notif-2', title: 'Task Assigned', message: 'You have been assigned to design Figma mockups.', type: 'Project', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
];

async function apiFetch(path: string, options: RequestInit = {}) {
  const isServer = typeof window === 'undefined';
  const token = !isServer ? localStorage.getItem('clientoq_jwt') : null;

  const headers: Record<string, string> = {};
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  } else if (!options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, val]) => {
      headers[key] = val as string;
    });
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isServer) {
    const impersonateOrg = localStorage.getItem('clientoq_impersonate_org');
    if (impersonateOrg) {
      headers['x-impersonate-org'] = impersonateOrg;
    }
  }

  const mergedOptions = {
    credentials: 'include' as const,
    ...options,
    headers
  };

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, mergedOptions);
  } catch (error: any) {
    console.warn(`[API Connection Failed] Path: ${path}. falling back to local mock storage. Details:`, error.message);
    // Process mock fallback logic locally
    return handleMockFallback(path, options);
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: 'API error occurred' }));
    if (res.status === 401 && (errBody.message === 'Token verification failed' || errBody.message === 'Missing or invalid auth token')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('clientoq_jwt');
        localStorage.removeItem('clientoq_user');
      }
    }
    throw new Error(errBody.message || `HTTP error! status: ${res.status}`);
  }
  return await res.json();
}

// Simulated local business rules handling mock requests
function handleMockFallback(path: string, options: RequestInit) {
  const method = options.method || 'GET';
  let body: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      body = JSON.parse(options.body);
    } catch (e) {}
  }

  // Auth Module
  if (path === '/api/auth/login') {
    if (body.email && body.password) {
      const mockUser = {
        id: 'usr-syed',
        firstName: 'Syed',
        lastName: 'Ali',
        email: body.email,
        role: 'Owner',
        organizationId: 'org-codecrest',
        organizationName: 'CodeCrest Studio',
        isEmailVerified: true
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('clientoq_jwt', 'mock-jwt-token-for-dev-session');
        localStorage.setItem('clientoq_user', JSON.stringify(mockUser));
      }
      return { token: 'mock-jwt-token-for-dev-session', user: mockUser };
    }
    throw new Error('Invalid credentials');
  }

  if (path === '/api/auth/google') {
    // Mock Google login — in production this verifies the real Google ID token
    const isSuperAdmin = body.credential && body.credential.includes('SUPER');
    const mockUser = {
      id: isSuperAdmin ? 'usr-superadmin' : 'usr-google',
      firstName: 'Google',
      lastName: 'User',
      email: isSuperAdmin ? 'codecreststudio@gmail.com' : 'google.user@gmail.com',
      role: isSuperAdmin ? 'SuperAdmin' : 'Owner',
      organizationId: isSuperAdmin ? null : 'org-google',
      organizationName: isSuperAdmin ? null : 'Google Agency',
      isEmailVerified: true
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientoq_jwt', 'mock-jwt-token-for-dev-session');
      localStorage.setItem('clientoq_user', JSON.stringify(mockUser));
    }
    return { token: 'mock-jwt-token-for-dev-session', user: mockUser };
  }

  if (path === '/api/auth/register') {
    const mockUser = {
      id: 'usr-new',
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      role: 'Owner',
      organizationId: 'org-new',
      organizationName: body.orgName,
      isEmailVerified: true
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientoq_jwt', 'mock-jwt-token-for-dev-session');
      localStorage.setItem('clientoq_user', JSON.stringify(mockUser));
    }
    return { token: 'mock-jwt-token-for-dev-session', user: mockUser };
  }

  if (path === '/api/auth/me') {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('clientoq_user');
      if (u) return { user: JSON.parse(u) };
    }
    return { user: { id: 'usr-syed', firstName: 'Syed', lastName: 'Ali', email: 'syed@codecrest.com', role: 'Owner', isEmailVerified: true } };
  }

  if (path === '/api/auth/invites/create' && method === 'POST') {
    const newInvite = {
      id: 'invite-' + Math.random().toString(36).substr(2, 9),
      email: body.email,
      role: body.role,
      token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      status: 'Pending',
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
    };
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    console.log(`[MOCK INVITE] Link: ${origin}/?auth=register&inviteToken=${newInvite.token}`);
    return { invite: { ...newInvite, inviteLink: `${origin}/?auth=register&inviteToken=${newInvite.token}` } };
  }

  if (path === '/api/auth/invites/list') {
    return [];
  }

  if (path.startsWith('/api/auth/invites/validate/')) {
    return { email: 'invited@test.com', role: 'Employee', organizationName: 'Mock Organization' };
  }

  if (path === '/api/auth/invites/accept' && method === 'POST') {
    const mockUser = {
      id: 'usr-invited',
      firstName: body.firstName,
      lastName: body.lastName,
      email: 'invited@test.com',
      role: 'Employee',
      organizationId: 'org-mock',
      organizationName: 'Mock Organization'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientoq_jwt', 'mock-jwt-token-for-dev-session');
      localStorage.setItem('clientoq_user', JSON.stringify(mockUser));
    }
    return { token: 'mock-jwt-token-for-dev-session', user: mockUser };
  }

  if (path === '/api/auth/users') {
    return [
      { id: 'usr-syed', firstName: 'Syed', lastName: 'Ali', email: 'syed@codecrest.com', role: 'Owner', status: 'Active' }
    ];
  }

  if (path === '/api/auth/profile' && method === 'PUT') {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('clientoq_user') : null;
    const current = saved ? JSON.parse(saved) : { id: 'usr-syed', firstName: 'Syed', lastName: 'Ali', email: 'syed@codecrest.com', role: 'Owner' };
    const updated = {
      ...current,
      phone: body.phone,
      bio: body.bio,
      timezone: body.timezone,
      notificationPreferences: body.notificationPreferences
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientoq_user', JSON.stringify(updated));
    }
    return updated;
  }

  // Analytics
  if (path === '/api/analytics/dashboard') {
    const revenueSum = localInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);
    const outstandingSum = localInvoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((sum, i) => sum + i.totalAmount, 0);
    const expensesSum = localExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      kpis: {
        revenue: revenueSum,
        expenses: expensesSum,
        outstanding: outstandingSum,
        profit: revenueSum - expensesSum,
        activeProjects: localProjects.filter(p => p.status === 'In Progress').length,
        activeClients: localClients.length,
        activeLeads: localLeads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length
      },
      charts: {
        monthlyRevenue: [
          { month: 'Jan', revenue: 5000, expenses: 2000 },
          { month: 'Feb', revenue: 8000, expenses: 3500 },
          { month: 'Mar', revenue: 15000, expenses: 6000 },
          { month: 'Apr', revenue: 12000, expenses: 5000 },
          { month: 'May', revenue: 11800, expenses: 4500 },
          { month: 'Jun', revenue: revenueSum - 11800, expenses: expensesSum - 4500 }
        ]
      },
      recentActivities: [
        { id: 'act-1', type: 'CRM', title: 'New lead qualified', detail: 'Sarah Jenkins interested in Mobile App Development.', date: new Date().toISOString() },
        { id: 'act-2', type: 'Finance', title: 'Invoice INV-2026-002 Paid', detail: 'Received payment of ₹11,800 via Stripe.', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'act-3', type: 'Project', title: 'Milestone Completed', detail: 'UIUX Design wireframes for Acme Redesign.', date: new Date(Date.now() - 172800000).toISOString() }
      ]
    };
  }

  // CRM Leads
  if (path === '/api/crm/leads') {
    if (method === 'POST') {
      const newLead = {
        id: 'lead-' + Math.random().toString(36).substr(2, 9),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        companyName: body.companyName,
        source: body.source || 'Manual',
        status: 'New',
        estimatedValue: parseFloat(body.estimatedValue) || 0,
        notes: body.notes,
        activities: [{ id: 'a-' + Math.random(), activityType: 'Follow-Up', note: 'Lead created in pipeline.', createdAt: new Date().toISOString() }],
        updatedAt: new Date().toISOString()
      };
      localLeads.push(newLead);
      return newLead;
    }
    return localLeads;
  }

  if (path.startsWith('/api/crm/leads/')) {
    const id = path.split('/')[4];
    const leadIndex = localLeads.findIndex(l => l.id === id);
    if (leadIndex === -1) throw new Error('Lead not found');

    if (path.endsWith('/activities') && method === 'POST') {
      const newAct = {
        id: 'act-' + Math.random(),
        activityType: body.activityType,
        note: body.note,
        createdAt: new Date().toISOString()
      };
      localLeads[leadIndex].activities.push(newAct);
      localLeads[leadIndex].updatedAt = new Date().toISOString();
      return newAct;
    }

    if (method === 'PUT') {
      const lead = localLeads[leadIndex];
      const updated = {
        ...lead,
        ...body,
        updatedAt: new Date().toISOString()
      };
      localLeads[leadIndex] = updated;
      
      if (body.status && body.status !== lead.status) {
        updated.activities.push({
          id: 'act-' + Math.random(),
          activityType: 'Follow-Up',
          note: `Lead stage changed from ${lead.status} to ${body.status}.`,
          createdAt: new Date().toISOString()
        });
      }
      return updated;
    }
  }

  // Clients
  if (path === '/api/clients') {
    if (method === 'POST') {
      const newClient = {
        id: 'client-' + Math.random().toString(36).substr(2, 9),
        companyName: body.companyName,
        website: body.website,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        gstNumber: body.gstNumber,
        notes: body.notes,
        timezone: body.timezone || 'UTC',
        contacts: body.contacts || []
      };
      localClients.push(newClient);
      return newClient;
    }
    return localClients;
  }

  if (path.startsWith('/api/clients/')) {
    const id = path.split('/')[3];
    const client = localClients.find(c => c.id === id);
    if (!client) throw new Error('Client not found');

    const clientProjects = localProjects.filter(p => p.id === 'project-1'); // Mock related
    const clientInvoices = localInvoices.filter(i => i.client.companyName === client.companyName);
    const clientWhatsApp = localWhatsApp.filter(w => w.client.companyName === client.companyName);

    return {
      ...client,
      projects: clientProjects,
      invoices: clientInvoices,
      whatsappConversations: clientWhatsApp
    };
  }

  // Projects
  if (path === '/api/projects') {
    if (method === 'POST') {
      const client = localClients.find(c => c.id === body.clientId) || { companyName: 'Acme Corporation' };
      const newProj = {
        id: 'project-' + Math.random().toString(36).substr(2, 9),
        name: body.name,
        description: body.description,
        status: 'Planning',
        priority: body.priority || 'Medium',
        budget: parseFloat(body.budget) || 0,
        startDate: body.startDate || new Date().toISOString().split('T')[0],
        endDate: body.endDate,
        progress: 0,
        client: { companyName: client.companyName },
        milestones: [],
        tasks: []
      };
      localProjects.push(newProj);
      return newProj;
    }
    return localProjects;
  }

  if (path.startsWith('/api/projects/') && !path.startsWith('/api/projects/tasks/') && !path.startsWith('/api/projects/milestones/')) {
    const parts = path.split('/');
    const id = parts[3];
    const projectIndex = localProjects.findIndex(p => p.id === id);
    if (projectIndex === -1) throw new Error('Project not found');

    const project = localProjects[projectIndex];

    if (parts.length === 5 && parts[4] === 'milestones' && method === 'POST') {
      const newMil = {
        id: 'm-' + Math.random().toString(36).substr(2, 9),
        title: body.title,
        dueDate: body.dueDate,
        status: 'Pending'
      };
      project.milestones.push(newMil);
      return newMil;
    }

    if (parts.length === 5 && parts[4] === 'tasks' && method === 'POST') {
      const newTask = {
        id: 't-' + Math.random().toString(36).substr(2, 9),
        title: body.title,
        description: body.description,
        priority: body.priority || 'Medium',
        status: 'To Do',
        dueDate: body.dueDate,
        estimatedHours: parseInt(body.estimatedHours) || 0,
        actualHours: 0,
        assignee: { firstName: 'Alice', lastName: 'Smith' },
        checklists: [],
        comments: []
      };
      project.tasks.push(newTask);
      return newTask;
    }

    return project;
  }

  if (path.startsWith('/api/projects/tasks/')) {
    const parts = path.split('/');
    const taskId = parts[4];
    
    // Find task across all local projects
    let projectOwner = null;
    let taskIndex = -1;
    for (const proj of localProjects) {
      const idx = proj.tasks.findIndex(t => t.id === taskId);
      if (idx !== -1) {
        taskIndex = idx;
        projectOwner = proj;
        break;
      }
    }

    if (!projectOwner || taskIndex === -1) throw new Error('Task not found');
    const task = projectOwner.tasks[taskIndex];

    if (parts.length === 6 && parts[5] === 'comments' && method === 'POST') {
      const newComm = {
        id: 'comm-' + Math.random(),
        comment: body.comment,
        user: { firstName: 'Syed', lastName: 'Ali' },
        createdAt: new Date().toISOString()
      };
      task.comments.push(newComm);
      return newComm;
    }

    if (parts.length === 6 && parts[5] === 'checklists' && method === 'POST') {
      const newCheck = {
        id: 'check-' + Math.random().toString(36).substr(2, 9),
        title: body.title,
        completed: false
      };
      task.checklists.push(newCheck);
      return newCheck;
    }

    if (method === 'PUT') {
      const updated = {
        ...task,
        ...body
      };
      projectOwner.tasks[taskIndex] = updated;

      // Recalculate project progress
      const completed = projectOwner.tasks.filter(t => t.status === 'Completed').length;
      projectOwner.progress = projectOwner.tasks.length > 0 ? Math.round((completed / projectOwner.tasks.length) * 100) : 0;

      return updated;
    }
  }

  if (path.startsWith('/api/projects/tasks/checklists/')) {
    const checklistId = path.split('/')[5];
    for (const proj of localProjects) {
      for (const t of proj.tasks) {
        const checkIdx = t.checklists.findIndex(c => c.id === checklistId);
        if (checkIdx !== -1) {
          t.checklists[checkIdx].completed = body.completed;
          return t.checklists[checkIdx];
        }
      }
    }
    throw new Error('Checklist item not found');
  }

  if (path.startsWith('/api/projects/milestones/')) {
    const milestoneId = path.split('/')[4];
    for (const proj of localProjects) {
      const milIdx = proj.milestones.findIndex(m => m.id === milestoneId);
      if (milIdx !== -1) {
        proj.milestones[milIdx].status = body.status;
        return proj.milestones[milIdx];
      }
    }
    throw new Error('Milestone not found');
  }

  // Finance Module
  if (path === '/api/finance/invoices') {
    if (method === 'POST') {
      const client = localClients.find(c => c.id === body.clientId) || { companyName: 'Acme Corporation' };
      const newInv = {
        id: 'inv-' + Math.random().toString(36).substr(2, 9),
        invoiceNumber: body.invoiceNumber,
        subtotal: parseFloat(body.subtotal) || 0,
        taxAmount: parseFloat(body.taxAmount) || 0,
        totalAmount: parseFloat(body.totalAmount) || 0,
        dueDate: body.dueDate,
        status: 'Sent',
        client: { companyName: client.companyName },
        items: body.items || [],
        payments: []
      };
      localInvoices.push(newInv);
      return newInv;
    }
    return localInvoices;
  }

  if (path === '/api/finance/expenses') {
    if (method === 'POST') {
      const newExp = {
        id: 'exp-' + Math.random().toString(36).substr(2, 9),
        category: body.category,
        description: body.description,
        amount: parseFloat(body.amount) || 0,
        expenseDate: body.expenseDate || new Date().toISOString().split('T')[0]
      };
      localExpenses.push(newExp);
      return newExp;
    }
    return localExpenses;
  }

  if (path === '/api/finance/payments' && method === 'POST') {
    const invIdx = localInvoices.findIndex(i => i.id === body.invoiceId);
    if (invIdx === -1) throw new Error('Invoice not found');
    
    const invoice = localInvoices[invIdx];
    const newPayment = {
      id: 'p-' + Math.random().toString(36).substr(2, 9),
      paymentGateway: body.paymentGateway || 'Stripe',
      transactionId: body.transactionId || 'tx_mock' + Math.random().toString(36).substr(2, 5),
      amount: parseFloat(body.amount) || invoice.totalAmount,
      paymentMethod: body.paymentMethod || 'Credit Card',
      status: 'Completed',
      paidAt: new Date().toISOString()
    };
    
    invoice.payments.push(newPayment);
    invoice.status = 'Paid';
    return newPayment;
  }

  // WhatsApp
  if (path === '/api/whatsapp/conversations') {
    return localWhatsApp;
  }

  if (path.startsWith('/api/whatsapp/conversations/') && path.endsWith('/messages')) {
    const convId = path.split('/')[4];
    const conv = localWhatsApp.find(c => c.id === convId);
    if (!conv) throw new Error('Conversation not found');
    return conv.messages;
  }

  if (path === '/api/whatsapp/messages' && method === 'POST') {
    const convIndex = localWhatsApp.findIndex(c => c.id === body.conversationId);
    if (convIndex === -1) throw new Error('Conversation not found');
    
    const conv = localWhatsApp[convIndex];
    const newMsg = {
      id: 'wm-' + Math.random(),
      senderType: 'Agent',
      content: body.content,
      createdAt: new Date().toISOString()
    };
    conv.messages.push(newMsg);
    conv.lastMessage = body.content;

    // Simulate reply
    setTimeout(() => {
      const replyMsg = {
        id: 'wm-' + Math.random(),
        senderType: 'Client',
        content: `Got it! Sending update shortly from ${conv.client.companyName}.`,
        createdAt: new Date().toISOString()
      };
      conv.messages.push(replyMsg);
      conv.lastMessage = replyMsg.content;
    }, 2000);

    return newMsg;
  }

  // Automations
  if (path === '/api/automations') {
    return localAutomations;
  }

  if (path === '/api/automations/trigger' && method === 'POST') {
    const rules = localAutomations.filter(r => r.triggerType === body.triggerType && r.isActive);
    const executions = rules.map(rule => {
      const log = { id: 'l-' + Math.random(), status: 'Success', executedAt: new Date().toISOString() };
      rule.logs.unshift(log);
      return { ruleName: rule.name, status: 'Success', details: `Executed trigger ${body.triggerType} for ${rule.name}` };
    });
    return { triggeredCount: rules.length, executions };
  }

  // AI Assistant Chat
  if (path === '/api/ai/chat' && method === 'POST') {
    const chat = localAIChats[0];
    const msg = body.message.toLowerCase();
    
    // Add user message
    chat.messages.push({
      id: 'aim-' + Math.random(),
      role: 'user',
      content: body.message
    });

    let reply = '';
    if (msg.includes('proposal') || msg.includes('scope')) {
      reply = `### Mock Proposal Generated: Portal Build
**Client:** Acme Corp
**Est. Cost:** ₹1,50,000
**Timeline:** 4-6 Weeks

Key Deliverables:
1. CRM dashboard pipeline stage filters.
2. Invoicing auto GST calculator.
3. Node.js backend modules integrations.

Would you like to export this draft proposal to the client?`;
    } else if (msg.includes('invoice') || msg.includes('bill')) {
      reply = `### Generated Invoice Preview
**Draft Invoice Number:** INV-2026-099
**Client:** Acme Corporation
**Due Date:** June 30, 2026
**Total:** ₹88,500 (₹75,000 + 18% GST)

Click "Create Invoices" inside the Finance tab to submit this payment request to the client.`;
    } else if (msg.includes('task') || msg.includes('todo')) {
      reply = `Here is a set of tasks I recommend creating for the Acme Web App Redesign:
1. **[High] Setup NestJS backend boilerplate**
2. **[Medium] Build UIUX Figma Mockups**
3. **[Low] Style layout with Warp theme rules**

Would you like me to inject these into the active project boards now?`;
    } else if (msg.includes('summarize') || msg.includes('summary')) {
      reply = `### Client Summary: Acme Corporation
* **Projects:** Acme Web App Redesign (60% Progress, In Development)
* **Finances:** ₹11,800 paid, ₹47,200 unpaid (INV-2026-001 is pending review).
* **Communications:** Active. Last WhatsApp update: "Sounds good! Send the invoice when ready."`;
    } else if (msg.includes('email') || msg.includes('write')) {
      reply = `Subject: Quick Update: Acme Web App Redesign Progress

Hi John,

Just wanted to give you a quick update. Our team has finalized the database schema and layout wireframes milestones. The first stage invoice (INV-2026-001) is uploaded to your Client Portal.

Please let us know if you have any questions.

Best,
Syed Ali
CodeCrest Studio`;
    } else {
      reply = `Hello! I am your Clientoq AI Assistant. I can write proposals, generate invoice previews, list recommended tasks, or summarize your client projects. Try typing "Summarize Acme Corp".`;
    }

    const aiMsg = {
      id: 'aim-' + Math.random(),
      role: 'assistant',
      content: reply
    };
    chat.messages.push(aiMsg);

    return {
      conversationId: chat.id,
      message: aiMsg
    };
  }

  if (path.startsWith('/api/search')) {
    const params = new URLSearchParams(path.split('?')[1] || '');
    const q = (params.get('q') || '').toLowerCase();
    
    if (!q) {
      return { leads: [], clients: [], projects: [], tasks: [], invoices: [], expenses: [] };
    }

    const filteredLeads = localLeads.filter(l => 
      l.firstName.toLowerCase().includes(q) || 
      l.lastName.toLowerCase().includes(q) || 
      (l.companyName && l.companyName.toLowerCase().includes(q))
    );

    const filteredClients = localClients.filter(c => 
      c.companyName.toLowerCase().includes(q)
    );

    const filteredProjects = localProjects.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q))
    );

    const filteredTasks: any[] = [];
    localProjects.forEach(p => {
      p.tasks.forEach(t => {
        if (t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))) {
          filteredTasks.push({ ...t, project: { name: p.name } });
        }
      });
    });

    const filteredInvoices = localInvoices.filter(i => 
      i.invoiceNumber.toLowerCase().includes(q)
    );

    const filteredExpenses = localExpenses.filter(e => 
      e.category.toLowerCase().includes(q) || 
      (e.description && e.description.toLowerCase().includes(q))
    );

    return {
      leads: filteredLeads,
      clients: filteredClients,
      projects: filteredProjects,
      tasks: filteredTasks,
      invoices: filteredInvoices,
      expenses: filteredExpenses
    };
  }

    if (path.startsWith('/api/projects/tasks/') && path.endsWith('/time-logs')) {
      const parts = path.split('/');
      const taskId = parts[4];
      
      localProjects.forEach(p => {
        const task = p.tasks.find(t => t.id === taskId);
        if (task) {
          const durationHours = Math.round(body.duration / 60) || 1;
          task.actualHours = (task.actualHours || 0) + durationHours;
        }
      });

      return { id: 'tl-' + Math.random(), taskId, duration: body.duration, description: body.description, createdAt: new Date().toISOString() };
    }

    if (path === '/api/notifications') {
      return localNotifications;
    }

    if (path.startsWith('/api/notifications/') && path.endsWith('/read')) {
      const parts = path.split('/');
      const notifId = parts[3];
      const notif = localNotifications.find(n => n.id === notifId);
      if (notif) notif.isRead = true;
      return notif || { success: true };
    }

    if (path.startsWith('/api/notifications/') && method === 'DELETE') {
      const parts = path.split('/');
      const notifId = parts[3];
      localNotifications = localNotifications.filter(n => n.id !== notifId);
      return { success: true };
    }

    if (path.startsWith('/api/crm/leads/') && path.endsWith('/proposals')) {
      const parts = path.split('/');
      const leadId = parts[4];
      const props = localProposals.filter(p => p.leadId === leadId);
      props.forEach(p => {
        const c = localContracts.find(con => con.proposalId === p.id);
        if (c) (p as any).contract = c;
      });
      return props;
    }

    if (path === '/api/crm/proposals' && method === 'POST') {
      const newProp = {
        id: 'prop-' + Math.random(),
        leadId: body.leadId,
        title: body.title,
        content: body.content,
        amount: parseFloat(body.amount) || 0,
        status: 'Draft',
        createdAt: new Date().toISOString(),
        contract: null
      };
      localProposals.push(newProp);
      return newProp;
    }

    if (path.startsWith('/api/crm/proposals/') && path.endsWith('/contract')) {
      const parts = path.split('/');
      const proposalId = parts[4];
      const prop = localProposals.find(p => p.id === proposalId);
      if (prop) {
        prop.status = 'Accepted';
      }
      const newContract = {
        id: 'contract-' + Math.random(),
        clientId: body.clientId,
        proposalId,
        title: `Contract for: ${prop ? prop.title : 'Proposal'}`,
        fileUrl: null,
        signed: false,
        signedAt: null
      };
      localContracts.push(newContract);
      if (prop) {
        (prop as any).contract = newContract;
      }
      return newContract;
    }

    if (path.startsWith('/api/crm/clients/') && path.endsWith('/contracts')) {
      const parts = path.split('/');
      const clientId = parts[4];
      return localContracts.filter(c => c.clientId === clientId);
    }

    if (path === '/api/crm/leads/import-csv' && method === 'POST') {
      const mockLead = {
        id: 'lead-csv-' + Math.random(),
        firstName: 'Alice',
        lastName: 'Cooper',
        email: 'alice@cooper.com',
        phone: '+15550299',
        companyName: 'Cooper Inc',
        source: 'CSV Import',
        status: 'New',
        estimatedValue: 90000,
        notes: 'Imported from client spreadsheet log',
        activities: [{ id: 'a-csv-' + Math.random(), activityType: 'Follow-Up', note: 'Lead imported via CSV file upload.', createdAt: new Date().toISOString() }],
        updatedAt: new Date().toISOString()
      };
      localLeads.push(mockLead);
      return { success: true, importedCount: 1, message: 'Successfully imported 1 leads.' };
    }

    if (path.startsWith('/api/projects/') && path.endsWith('/files')) {
      const parts = path.split('/');
      const projectId = parts[3];
      if (method === 'POST') {
        const mockFile = {
          id: 'file-' + Math.random(),
          fileName: 'uploaded_attachment.pdf',
          fileType: 'application/pdf',
          fileSize: 102400,
          createdAt: new Date().toISOString()
        };
        // Save in global mock list if necessary
        return mockFile;
      }
      return [];
    }

    if (path.startsWith('/api/crm/contracts/') && path.endsWith('/sign')) {
      const parts = path.split('/');
      const contractId = parts[4];
      const contract = localContracts.find(c => c.id === contractId);
      if (contract) {
        contract.signed = true;
        contract.signedAt = new Date().toISOString() as any;
        contract.fileUrl = body.signatureData || 'Signed via consent checkbox';
      }
      return contract || { success: true };
    }

    if (path === '/api/superadmin/settings') {
      if (method === 'PATCH') {
        const mockSettings = { ...body, id: 'default', updatedAt: new Date().toISOString() };
        if (typeof window !== 'undefined') {
          localStorage.setItem('clientoq_mock_settings', JSON.stringify(mockSettings));
        }
        return { success: true, settings: mockSettings };
      }
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('clientoq_mock_settings');
        if (saved) return JSON.parse(saved);
      }
      return {
        id: 'default',
        systemName: 'Clientoq',
        supportEmail: 'support@clientoq.com',
        allowRegistration: true,
        maintenanceMode: false,
        smtpPort: 587
      };
    }

    throw new Error(`Fallback handler not implemented for ${method} ${path}`);
  }

export const api = {
  // Auth
  auth: {
    login: (body: any) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: any) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    me: () => apiFetch('/api/auth/me'),
    getUsers: () => apiFetch('/api/auth/users'),
    updateProfile: (body: any) => apiFetch('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
    logout: async () => {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.warn('Server logout failed or API offline:', err);
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('clientoq_jwt');
        localStorage.removeItem('clientoq_user');
      }
    },
    invites: {
      create: (body: { email: string; role: string }) => apiFetch('/api/auth/invites/create', { method: 'POST', body: JSON.stringify(body) }),
      list: () => apiFetch('/api/auth/invites/list'),
      validate: (token: string) => apiFetch(`/api/auth/invites/validate/${token}`),
      accept: (body: any) => apiFetch('/api/auth/invites/accept', { method: 'POST', body: JSON.stringify(body) })
    },
    googleLogin: (credential: string) => apiFetch('/api/auth/google', { method: 'POST', body: JSON.stringify({ credential }) })
  },

  // Analytics
  analytics: {
    getDashboardData: () => apiFetch('/api/analytics/dashboard')
  },

  // CRM
  crm: {
    getLeads: () => apiFetch('/api/crm/leads'),
    createLead: (body: any) => apiFetch('/api/crm/leads', { method: 'POST', body: JSON.stringify(body) }),
    updateLead: (id: string, body: any) => apiFetch(`/api/crm/leads/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    addActivity: (leadId: string, body: any) => apiFetch(`/api/crm/leads/${leadId}/activities`, { method: 'POST', body: JSON.stringify(body) }),
    importLeadsCsv: (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return apiFetch('/api/crm/leads/import-csv', { method: 'POST', body: fd });
    },
    proposals: {
      list: (leadId: string) => apiFetch(`/api/crm/leads/${leadId}/proposals`),
      create: (body: any) => apiFetch('/api/crm/proposals', { method: 'POST', body: JSON.stringify(body) }),
      createContract: (id: string, body: any) => apiFetch(`/api/crm/proposals/${id}/contract`, { method: 'POST', body: JSON.stringify(body) })
    },
    contracts: {
      list: (clientId: string) => apiFetch(`/api/crm/clients/${clientId}/contracts`),
      sign: (id: string, body: any) => apiFetch(`/api/crm/contracts/${id}/sign`, { method: 'PUT', body: JSON.stringify(body) })
    }
  },

  // Clients
  clients: {
    getClients: () => apiFetch('/api/clients'),
    createClient: (body: any) => apiFetch('/api/clients', { method: 'POST', body: JSON.stringify(body) }),
    getClientDetail: (id: string) => apiFetch(`/api/clients/${id}`)
  },

  // Projects
  projects: {
    getProjects: () => apiFetch('/api/projects'),
    createProject: (body: any) => apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
    getProjectDetail: (id: string) => apiFetch(`/api/projects/${id}`),
    addMilestone: (id: string, body: any) => apiFetch(`/api/projects/${id}/milestones`, { method: 'POST', body: JSON.stringify(body) }),
    updateMilestone: (milestoneId: string, status: string) => apiFetch(`/api/projects/milestones/${milestoneId}`, { method: 'PUT', body: JSON.stringify({ status }) }),
    createTask: (id: string, body: any) => apiFetch(`/api/projects/${id}/tasks`, { method: 'POST', body: JSON.stringify(body) }),
    updateTask: (taskId: string, body: any) => apiFetch(`/api/projects/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(body) }),
    addTaskComment: (taskId: string, comment: string) => apiFetch(`/api/projects/tasks/${taskId}/comments`, { method: 'POST', body: JSON.stringify({ comment }) }),
    addTaskChecklist: (taskId: string, title: string) => apiFetch(`/api/projects/tasks/${taskId}/checklists`, { method: 'POST', body: JSON.stringify({ title }) }),
    toggleTaskChecklist: (checklistId: string, completed: boolean) => apiFetch(`/api/projects/tasks/checklists/${checklistId}`, { method: 'PUT', body: JSON.stringify({ completed }) }),
    addTimeLog: (taskId: string, body: any) => apiFetch(`/api/projects/tasks/${taskId}/time-logs`, { method: 'POST', body: JSON.stringify(body) }),
    uploadProjectFile: (projectId: string, file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      return apiFetch(`/api/projects/${projectId}/files`, { method: 'POST', body: fd });
    },
    getProjectFiles: (projectId: string) => apiFetch(`/api/projects/${projectId}/files`)
  },

  // Finance
  finance: {
    getInvoices: () => apiFetch('/api/finance/invoices'),
    createInvoice: (body: any) => apiFetch('/api/finance/invoices', { method: 'POST', body: JSON.stringify(body) }),
    getExpenses: () => apiFetch('/api/finance/expenses'),
    createExpense: (body: any) => apiFetch('/api/finance/expenses', { method: 'POST', body: JSON.stringify(body) }),
    recordPayment: (body: any) => apiFetch('/api/finance/payments', { method: 'POST', body: JSON.stringify(body) })
  },

  // WhatsApp
  whatsapp: {
    getConversations: () => apiFetch('/api/whatsapp/conversations'),
    getMessages: (convId: string) => apiFetch(`/api/whatsapp/conversations/${convId}/messages`),
    sendMessage: (body: any) => apiFetch('/api/whatsapp/messages', { method: 'POST', body: JSON.stringify(body) })
  },

  // Automations
  automations: {
    getAutomations: () => apiFetch('/api/automations'),
    trigger: (body: any) => apiFetch('/api/automations/trigger', { method: 'POST', body: JSON.stringify(body) })
  },

  // AI assistant
  ai: {
    chat: (body: any) => apiFetch('/api/ai/chat', { method: 'POST', body: JSON.stringify(body) })
  },

  // Search
  search: {
    query: (q: string) => apiFetch(`/api/search?q=${encodeURIComponent(q)}`)
  },

  // Notifications
  notifications: {
    list: () => apiFetch('/api/notifications'),
    read: (id: string) => apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' }),
    delete: (id: string) => apiFetch(`/api/notifications/${id}`, { method: 'DELETE' })
  },

  // SuperAdmin Platform Management
  superadmin: {
    getPlatformData: () => apiFetch('/api/superadmin/organizations'),
    updateOrganization: (body: { id: string; plan?: string; status?: string }) => apiFetch('/api/superadmin/organizations', { method: 'PATCH', body: JSON.stringify(body) }),
    getSettings: () => apiFetch('/api/superadmin/settings'),
    updateSettings: (body: any) => apiFetch('/api/superadmin/settings', { method: 'PATCH', body: JSON.stringify(body) })
  }
};
