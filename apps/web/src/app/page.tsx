'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckSquare, 
  DollarSign, 
  MessageSquare, 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  Clock, 
  CheckCircle, 
  X, 
  Send,
  User,
  LogOut,
  FolderOpen,
  Eye,
  Settings,
  AlertTriangle
} from 'lucide-react';

export default function Home() {
  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('syed@codecrest.com');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<'dashboard' | 'crm' | 'finance'>('dashboard');

  // App Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'clients' | 'projects' | 'finance' | 'whatsapp' | 'automations' | 'portal'>('dashboard');
  
  // Dashboard & Analytics Data
  const [dashboardData, setDashboardData] = useState<any>(null);

  // CRM Module State
  const [leads, setLeads] = useState<any[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', companyName: '', source: 'Google Search', estimatedValue: '', notes: ''
  });
  const [newActivityNote, setNewActivityNote] = useState('');
  const [newActivityType, setNewActivityType] = useState('Follow-Up');

  // Clients Module State
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    companyName: '', website: '', email: '', phone: '', address: '', city: '', state: '', country: '', gstNumber: '', notes: ''
  });

  // Projects Module State
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    clientId: '', name: '', description: '', priority: 'Medium', budget: '', startDate: '', endDate: ''
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '', description: '', priority: 'Medium', assigneeId: '', dueDate: '', estimatedHours: ''
  });
  const [taskComments, setTaskComments] = useState<{ [taskId: string]: string }>({});
  const [checklistInputs, setChecklistInputs] = useState<{ [taskId: string]: string }>({});

  // Finance Module State
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    clientId: '', invoiceNumber: '', subtotal: '', dueDate: '', items: [{ description: '', quantity: '1', price: '' }]
  });
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState('Stripe');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  // Expenses State
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [newExpenseForm, setNewExpenseForm] = useState({
    category: 'Software Subscription', description: '', amount: '', expenseDate: ''
  });

  // WhatsApp State
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [whatsAppInput, setWhatsAppInput] = useState('');

  // Automations State
  const [automations, setAutomations] = useState<any[]>([]);

  // AI Assistant Drawer State
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [aiConversationId, setAiConversationId] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<any[]>([
    { id: 'start', role: 'assistant', content: 'Hello! I am your Clientoq AI Assistant. I can write proposals, generate invoice previews, list project tasks, or outline client summaries. Try typing "Summarize Acme Corp".' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const aiEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Check Auth Session
  useEffect(() => {
    const jwt = localStorage.getItem('agencyos_jwt');
    const savedUser = localStorage.getItem('agencyos_user');
    if (jwt && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Check query params for auth triggers
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const auth = params.get('auth');
      if (auth === 'login') {
        setShowAuthModal(true);
        setAuthMode('login');
        setAuthError('');
      } else if (auth === 'register') {
        setShowAuthModal(true);
        setAuthMode('register');
        setAuthError('');
      }
    }
  }, []);

  // Fetch Data on Tab Switch or Auth
  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user, activeTab]);

  // Scroll to bottom on chats
  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const refreshData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const data = await api.analytics.getDashboardData();
        setDashboardData(data);
      } else if (activeTab === 'crm') {
        const data = await api.crm.getLeads();
        setLeads(data);
      } else if (activeTab === 'clients') {
        const data = await api.clients.getClients();
        setClients(data);
      } else if (activeTab === 'projects') {
        const data = await api.projects.getProjects();
        setProjects(data);
        if (selectedProject) {
          const detailed = await api.projects.getProjectDetail(selectedProject.id);
          setSelectedProject(detailed);
        }
      } else if (activeTab === 'finance') {
        const invs = await api.finance.getInvoices();
        setInvoices(invs);
        const exps = await api.finance.getExpenses();
        setExpenses(exps);
      } else if (activeTab === 'whatsapp') {
        const convs = await api.whatsapp.getConversations();
        setConversations(convs);
        if (selectedConversation) {
          const msgs = await api.whatsapp.getMessages(selectedConversation.id);
          setChatMessages(msgs);
        }
      } else if (activeTab === 'automations') {
        const autos = await api.automations.getAutomations();
        setAutomations(autos);
      } else if (activeTab === 'portal') {
        // Simulating loading client portal statistics
        const invs = await api.finance.getInvoices();
        setInvoices(invs.filter((i: any) => i.client.companyName === 'Acme Corporation'));
        const projs = await api.projects.getProjects();
        setProjects(projs.filter((p: any) => p.client.companyName === 'Acme Corporation'));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.auth.login({ email, password });
      if (res.token) {
        localStorage.setItem('agencyos_jwt', res.token);
        localStorage.setItem('agencyos_user', JSON.stringify(res.user));
      }
      setUser(res.user);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.auth.register({ orgName, firstName, lastName, email, password });
      if (res.token) {
        localStorage.setItem('agencyos_jwt', res.token);
        localStorage.setItem('agencyos_user', JSON.stringify(res.user));
      }
      setUser(res.user);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
  };

  // Lead Actions
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.crm.createLead(newLeadForm);
      setShowAddLeadModal(false);
      setNewLeadForm({ firstName: '', lastName: '', email: '', phone: '', companyName: '', source: 'Google Search', estimatedValue: '', notes: '' });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLeadStage = async (leadId: string, stage: string) => {
    try {
      await api.crm.updateLead(leadId, { status: stage });
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: stage });
      }
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLeadActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newActivityNote.trim()) return;
    try {
      await api.crm.addActivity(selectedLead.id, {
        activityType: newActivityType,
        note: newActivityNote
      });
      setNewActivityNote('');
      // Reload detailed lead activities
      const updatedLeads = await api.crm.getLeads();
      setLeads(updatedLeads);
      const found = updatedLeads.find((l: any) => l.id === selectedLead.id);
      if (found) setSelectedLead(found);
    } catch (err) {
      console.error(err);
    }
  };

  // Project Actions
  const handleSelectProject = async (proj: any) => {
    try {
      const detailed = await api.projects.getProjectDetail(proj.id);
      setSelectedProject(detailed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.projects.createProject(newProjectForm);
      setShowAddProjectModal(false);
      setNewProjectForm({ clientId: '', name: '', description: '', priority: 'Medium', budget: '', startDate: '', endDate: '' });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      await api.projects.createTask(selectedProject.id, newTaskForm);
      setShowAddTaskModal(false);
      setNewTaskForm({ title: '', description: '', priority: 'Medium', assigneeId: '', dueDate: '', estimatedHours: '' });
      handleSelectProject(selectedProject);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    if (!selectedProject) return;
    try {
      await api.projects.updateTask(taskId, { status });
      handleSelectProject(selectedProject);
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTaskComment = async (taskId: string) => {
    const text = taskComments[taskId];
    if (!text || !text.trim()) return;
    try {
      await api.projects.addTaskComment(taskId, text);
      setTaskComments({ ...taskComments, [taskId]: '' });
      if (selectedProject) handleSelectProject(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTaskChecklist = async (taskId: string) => {
    const title = checklistInputs[taskId];
    if (!title || !title.trim()) return;
    try {
      await api.projects.addTaskChecklist(taskId, title);
      setChecklistInputs({ ...checklistInputs, [taskId]: '' });
      if (selectedProject) handleSelectProject(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleChecklist = async (checklistId: string, completed: boolean) => {
    try {
      await api.projects.toggleTaskChecklist(checklistId, completed);
      if (selectedProject) handleSelectProject(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMilestone = async (milestoneId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
      await api.projects.updateMilestone(milestoneId, newStatus);
      if (selectedProject) handleSelectProject(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  // Client Actions
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.clients.createClient(newClientForm);
      setShowAddClientModal(false);
      setNewClientForm({ companyName: '', website: '', email: '', phone: '', address: '', city: '', state: '', country: '', gstNumber: '', notes: '' });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectClient = async (client: any) => {
    try {
      const detailed = await api.clients.getClientDetail(client.id);
      setSelectedClient(detailed);
    } catch (err) {
      console.error(err);
    }
  };

  // Finance Actions
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sub = parseFloat(newInvoiceForm.subtotal) || 0;
      const tax = parseFloat((sub * 0.18).toFixed(2));
      const total = sub + tax;

      await api.finance.createInvoice({
        clientId: newInvoiceForm.clientId,
        invoiceNumber: newInvoiceForm.invoiceNumber,
        subtotal: sub,
        taxAmount: tax,
        totalAmount: total,
        dueDate: newInvoiceForm.dueDate,
        items: newInvoiceForm.items
      });

      setShowAddInvoiceModal(false);
      setNewInvoiceForm({ clientId: '', invoiceNumber: '', subtotal: '', dueDate: '', items: [{ description: '', quantity: '1', price: '' }] });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvoiceItemChange = (index: number, field: string, value: string) => {
    const items = [...newInvoiceForm.items];
    (items[index] as any)[field] = value;

    // Auto-calculate subtotal
    let sub = 0;
    items.forEach((item: any) => {
      const q = parseInt(item.quantity) || 0;
      const p = parseFloat(item.price) || 0;
      sub += q * p;
    });

    setNewInvoiceForm({
      ...newInvoiceForm,
      items,
      subtotal: sub.toString()
    });
  };

  const handleAddInvoiceItemLine = () => {
    setNewInvoiceForm({
      ...newInvoiceForm,
      items: [...newInvoiceForm.items, { description: '', quantity: '1', price: '' }]
    });
  };

  const handlePayInvoice = async () => {
    if (!selectedInvoice) return;
    try {
      await api.finance.recordPayment({
        invoiceId: selectedInvoice.id,
        paymentGateway,
        paymentMethod,
        amount: selectedInvoice.totalAmount
      });
      setShowPayModal(false);
      setSelectedInvoice(null);
      refreshData();
      
      // Trigger invoice paid automation simulator
      await api.automations.trigger({
        triggerType: 'Invoice Paid',
        eventData: { invoiceNumber: selectedInvoice.invoiceNumber, amount: selectedInvoice.totalAmount }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.finance.createExpense(newExpenseForm);
      setShowAddExpenseModal(false);
      setNewExpenseForm({ category: 'Software Subscription', description: '', amount: '', expenseDate: '' });
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // WhatsApp Actions
  const handleSelectConversation = async (conv: any) => {
    try {
      setSelectedConversation(conv);
      const msgs = await api.whatsapp.getMessages(conv.id);
      setChatMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConversation || !whatsAppInput.trim()) return;
    const text = whatsAppInput;
    setWhatsAppInput('');
    try {
      await api.whatsapp.sendMessage({
        conversationId: selectedConversation.id,
        content: text
      });
      // Immediately reload conversation messages
      const msgs = await api.whatsapp.getMessages(selectedConversation.id);
      setChatMessages(msgs);
      
      // Auto refresh chat messages again after 2 seconds to capture simulated replies
      setTimeout(async () => {
        const reloaded = await api.whatsapp.getMessages(selectedConversation.id);
        setChatMessages(reloaded);
      }, 2100);
    } catch (err) {
      console.error(err);
    }
  };

  // AI Assistant Chat Actions
  const handleSendAIQuery = async (e?: React.FormEvent, directText?: string) => {
    if (e) e.preventDefault();
    const query = directText || aiInput;
    if (!query.trim()) return;

    setAiInput('');
    setAiLoading(true);

    // Save user message locally
    setAiMessages(prev => [...prev, { id: 'usr-' + Date.now(), role: 'user', content: query }]);

    try {
      const res = await api.ai.chat({
        message: query,
        conversationId: aiConversationId
      });
      setAiConversationId(res.conversationId);
      setAiMessages(prev => [...prev, res.message]);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      
      {/* 1. AUTHENTICATION SHIELD */}
      {!user ? (
        <div className="w-full min-h-screen bg-canvas text-ink flex flex-col font-sans relative selection:bg-primary selection:text-on-primary overflow-x-hidden">
          
          {/* Landing Page Navigation */}
          <Header onLaunchConsole={() => { setShowAuthModal(true); setAuthMode('login'); setAuthError(''); }} />

          {/* Hero Section */}
          <section className="py-20 px-8 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 z-10 relative">
            <div className="border border-hairline bg-canvas-soft text-mute font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
              [ STATUS: STABLE DEVELOPMENT V2.0 ]
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink leading-tight">
              The Quietly Confident <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-mute to-body-text">
                Business Canvas for Agencies.
              </span>
            </h1>
            <p className="text-body-text text-sm md:text-base max-w-2xl font-serif italic mt-2">
              Run your CRM pipelines, active sprints, automated WhatsApp outreach, and multi-currency billing in a single warm-charcoal workspace. Zero fluff, absolute control.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => { setShowAuthModal(true); setAuthMode('register'); setAuthError(''); }}
                className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest transition-all"
              >
                Start Free Trial
              </button>
              <a
                href="#sandbox"
                className="border border-hairline hover:bg-canvas-soft text-ink text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest transition-all"
              >
                Explore Sandbox
              </a>
            </div>
          </section>

          {/* Sandbox Interactive Demo Section */}
          <section id="sandbox" className="py-16 px-8 max-w-5xl mx-auto w-full z-10 relative scroll-mt-16">
            <div className="text-center mb-10">
              <h2 className="text-xs font-mono uppercase font-bold text-primary tracking-widest">Active Workspace Sandbox</h2>
              <p className="text-mute text-xs mt-1">Interact with our live operational preview tabs directly</p>
            </div>

            <div className="bg-canvas-soft border border-hairline rounded-md overflow-hidden shadow-2xl flex flex-col h-[480px]">
              {/* Terminal Title Bar */}
              <div className="bg-canvas border-b border-hairline px-6 py-3 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-hairline"></div>
                  <span className="text-[10px] text-mute uppercase tracking-wider">clientoq_sandbox_session.sh</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSandboxTab('dashboard')} 
                    className={`pb-1 uppercase tracking-wider text-[10px] font-bold border-b-2 transition-all ${sandboxTab === 'dashboard' ? 'border-primary text-primary' : 'border-transparent text-mute hover:text-ink'}`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setSandboxTab('crm')} 
                    className={`pb-1 uppercase tracking-wider text-[10px] font-bold border-b-2 transition-all ${sandboxTab === 'crm' ? 'border-primary text-primary' : 'border-transparent text-mute hover:text-ink'}`}
                  >
                    CRM Pipeline
                  </button>
                  <button 
                    onClick={() => setSandboxTab('finance')} 
                    className={`pb-1 uppercase tracking-wider text-[10px] font-bold border-b-2 transition-all ${sandboxTab === 'finance' ? 'border-primary text-primary' : 'border-transparent text-mute hover:text-ink'}`}
                  >
                    Invoices Ledger
                  </button>
                </div>
              </div>

              {/* Sandbox Tab Content Viewport */}
              <div className="flex-1 p-6 overflow-y-auto bg-canvas-soft/40 font-mono text-xs">
                
                {sandboxTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border border-hairline p-4 rounded bg-canvas/40">
                        <span className="text-[10px] text-mute uppercase tracking-wider">Total Revenue</span>
                        <div className="text-xl font-bold mt-1 text-ink">₹1,20,000</div>
                        <span className="text-[9px] text-green-400">▲ +12% this month</span>
                      </div>
                      <div className="border border-hairline p-4 rounded bg-canvas/40">
                        <span className="text-[10px] text-mute uppercase tracking-wider">Active Projects</span>
                        <div className="text-xl font-bold mt-1 text-ink">3 Sprints</div>
                        <span className="text-[9px] text-mute">60% Avg Progress</span>
                      </div>
                      <div className="border border-hairline p-4 rounded bg-canvas/40">
                        <span className="text-[10px] text-mute uppercase tracking-wider">Clients Log</span>
                        <div className="text-xl font-bold mt-1 text-ink">8 Active</div>
                        <span className="text-[9px] text-primary">⚡ 2 webhooks online</span>
                      </div>
                    </div>

                    <div className="border border-hairline p-4 rounded bg-canvas/30 space-y-2">
                      <span className="block text-[10px] text-mute uppercase tracking-wider">Workspace Live feed</span>
                      <div className="space-y-1 text-[11px]">
                        <div className="text-mute">[16:40:12] CRM: Qualified Sarah Jenkins at estimated value ₹1,20,000.</div>
                        <div className="text-mute">[15:21:45] FINANCE: Stripe invoice INV-2026-002 settled automatically.</div>
                        <div className="text-mute">[12:05:00] WHATSAPP: Outbound broadcast triggered for new onboarding pack.</div>
                      </div>
                    </div>
                  </div>
                )}

                {sandboxTab === 'crm' && (
                  <div className="grid grid-cols-3 gap-4 h-full">
                    <div className="border border-hairline/60 rounded bg-canvas/20 flex flex-col">
                      <div className="p-3 border-b border-hairline font-bold uppercase tracking-wider text-[10px] text-mute bg-canvas/30">New Leads</div>
                      <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                        <div className="border border-hairline p-3 rounded bg-canvas-soft">
                          <span className="font-bold text-ink">David Miller</span>
                          <p className="text-[9px] text-mute mt-1">Miller Media • Google Search</p>
                          <div className="text-[10px] text-primary mt-2">₹75,000</div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-hairline/60 rounded bg-canvas/20 flex flex-col">
                      <div className="p-3 border-b border-hairline font-bold uppercase tracking-wider text-[10px] text-mute bg-canvas/30">Qualified</div>
                      <div className="p-3 flex-1 space-y-3 overflow-y-auto">
                        <div className="border border-hairline p-3 rounded bg-canvas-soft">
                          <span className="font-bold text-ink">Sarah Jenkins</span>
                          <p className="text-[9px] text-mute mt-1">Apex Corp • Referral</p>
                          <div className="text-[10px] text-primary mt-2">₹1,20,000</div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-hairline/60 rounded bg-canvas/20 flex flex-col">
                      <div className="p-3 border-b border-hairline font-bold uppercase tracking-wider text-[10px] text-mute bg-canvas/30">Proposal Sent</div>
                      <div className="p-3 flex-grow flex items-center justify-center border border-dashed border-hairline/50 m-3 rounded text-[10px] text-mute">
                        Drag leads here to update
                      </div>
                    </div>
                  </div>
                )}

                {sandboxTab === 'finance' && (
                  <div className="space-y-4">
                    <span className="block text-[10px] text-mute uppercase tracking-wider">Billing Ledger Ledger</span>
                    <div className="border border-hairline rounded overflow-hidden">
                      <table className="w-full text-[11px] text-left border-collapse">
                        <thead>
                          <tr className="bg-canvas/40 border-b border-hairline text-mute">
                            <th className="p-3">Invoice Number</th>
                            <th className="p-3">Client</th>
                            <th className="p-3">Total Amount</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline/30 bg-canvas/10">
                          <tr>
                            <td className="p-3 font-semibold">INV-2026-001</td>
                            <td className="p-3 text-mute">Acme Corporation</td>
                            <td className="p-3 font-bold text-primary">₹47,200</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-yellow-950 text-yellow-300 font-bold uppercase text-[9px] rounded-xs">Sent</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold">INV-2026-002</td>
                            <td className="p-3 text-mute">Acme Corporation</td>
                            <td className="p-3 font-bold text-primary">₹11,800</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-green-950 text-green-300 font-bold uppercase text-[9px] rounded-xs">Paid</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
              <div className="border-t border-hairline bg-canvas p-4 text-center">
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('register'); setAuthError(''); }}
                  className="bg-primary hover:opacity-90 text-on-primary text-[10px] font-bold px-6 py-2.5 rounded-sm uppercase tracking-widest font-mono"
                >
                  Create Your Custom Console
                </button>
              </div>
            </div>
          </section>

          {/* Bento Feature Section */}
          <section id="features" className="py-20 px-8 max-w-5xl mx-auto w-full z-10 relative scroll-mt-16">
            <div className="text-center mb-16">
              <h2 className="text-xs font-mono uppercase font-bold text-primary tracking-widest">Built For Acceleration</h2>
              <h3 className="text-2xl font-bold tracking-tight text-ink mt-2">Fully Integrated Modular Architecture</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-canvas-soft border border-hairline p-6 rounded-md md:col-span-2 flex flex-col justify-between hover:border-mute/40 transition-colors">
                <div>
                  <div className="text-2xl mb-4">⚡</div>
                  <h4 className="text-base font-bold text-ink uppercase font-mono">Prospect Pipeline Management</h4>
                  <p className="text-body-text text-xs mt-2 leading-relaxed font-serif italic">
                    Capture customer leads, record follow-up history, and log contact activity logs. Transition qualified deals into operational workspaces.
                  </p>
                </div>
                <div className="h-px bg-hairline my-6"></div>
                <div className="text-[10px] text-mute font-mono uppercase tracking-wider">Includes drag-and-drop stages</div>
              </div>

              {/* Feature 2 */}
              <div className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between hover:border-mute/40 transition-colors">
                <div>
                  <div className="text-2xl mb-4">💬</div>
                  <h4 className="text-base font-bold text-ink uppercase font-mono">Integrated WhatsApp Messaging</h4>
                  <p className="text-body-text text-xs mt-2 leading-relaxed font-serif italic">
                    Dispatch automated template notifications when tax bills are sent, monitor replies, and interact using a shared team inbox node.
                  </p>
                </div>
                <div className="h-px bg-hairline my-6"></div>
                <div className="text-[10px] text-mute font-mono uppercase tracking-wider">Meta API compliant templates</div>
              </div>

              {/* Feature 3 */}
              <div className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between hover:border-mute/40 transition-colors">
                <div>
                  <div className="text-2xl mb-4">💰</div>
                  <h4 className="text-base font-bold text-ink uppercase font-mono">Automated Financial Ledger</h4>
                  <p className="text-body-text text-xs mt-2 leading-relaxed font-serif italic">
                    Establish professional tax-compliant invoices, track billing states, and log agency expenses inside a unified financial register.
                  </p>
                </div>
                <div className="h-px bg-hairline my-6"></div>
                <div className="text-[10px] text-mute font-mono uppercase tracking-wider">Multi-currency supported</div>
              </div>

              {/* Feature 4 */}
              <div className="bg-canvas-soft border border-hairline p-6 rounded-md md:col-span-2 flex flex-col justify-between hover:border-mute/40 transition-colors">
                <div>
                  <div className="text-2xl mb-4">🧠</div>
                  <h4 className="text-base font-bold text-ink uppercase font-mono">Clientoq Core AI Assistant</h4>
                  <p className="text-body-text text-xs mt-2 leading-relaxed font-serif italic">
                    Leverage standard LLM context to draft proposals, map task schedules from descriptions, generate code files, and compute agency margins.
                  </p>
                </div>
                <div className="h-px bg-hairline my-6"></div>
                <div className="text-[10px] text-mute font-mono uppercase tracking-wider">Powered by customized prompts</div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20 px-8 max-w-5xl mx-auto w-full z-10 relative scroll-mt-16">
            <div className="text-center mb-16">
              <h2 className="text-xs font-mono uppercase font-bold text-primary tracking-widest">Transparent Tiers</h2>
              <h3 className="text-2xl font-bold tracking-tight text-ink mt-2">Choose Plan Fitting Your Scale</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan 1 */}
              <div className="bg-canvas-soft border border-hairline p-8 rounded-md flex flex-col justify-between hover:border-mute/40 transition-colors relative">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-mute mb-2">Basic</h4>
                  <div className="text-3xl font-extrabold text-ink font-mono">₹0</div>
                  <span className="text-[9px] text-mute uppercase font-mono">Lifetime Free for Solo Ops</span>
                  <ul className="mt-8 space-y-3 text-xs text-body-text font-serif italic">
                    <li>• Local SQLite file database</li>
                    <li>• 1 active workspace tenant</li>
                    <li>• 10 AI assistant prompts / mo</li>
                    <li>• Basic manual invoices creator</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('register'); setAuthError(''); }}
                  className="w-full mt-8 border border-hairline hover:bg-canvas text-ink text-xs font-bold py-3 rounded-sm font-mono uppercase tracking-widest cursor-pointer"
                >
                  Choose Basic
                </button>
              </div>

              {/* Plan 2 */}
              <div className="bg-canvas-soft border-2 border-primary p-8 rounded-md flex flex-col justify-between relative shadow-2xl">
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-on-primary text-[8px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
                  RECOMMENDED
                </span>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-primary mb-2">Standard</h4>
                  <div className="text-3xl font-extrabold text-ink font-mono">₹699<span className="text-xs text-mute font-normal"> / mo</span></div>
                  <span className="text-[9px] text-primary uppercase font-mono">Complete Operating Stack</span>
                  <ul className="mt-8 space-y-3 text-xs text-body-text font-serif italic">
                    <li>• Full multi-tenancy dashboard</li>
                    <li>• 10 Team Members active seats</li>
                    <li>• Unlimited AI assistant queries</li>
                    <li>• WhatsApp broadcast template APIs</li>
                    <li>• Automated Stripe invoice alerts</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('register'); setAuthError(''); }}
                  className="w-full mt-8 bg-primary hover:opacity-90 text-on-primary text-xs font-bold py-3 rounded-sm font-mono uppercase tracking-widest cursor-pointer"
                >
                  Choose Standard
                </button>
              </div>

              {/* Plan 3 */}
              <div className="bg-canvas-soft border border-hairline p-8 rounded-md flex flex-col justify-between hover:border-mute/40 transition-colors">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-wider text-mute mb-2">Premium</h4>
                  <div className="text-3xl font-extrabold text-ink font-mono">₹1,999<span className="text-xs text-mute font-normal"> / mo</span></div>
                  <span className="text-[9px] text-mute uppercase font-mono">Enterprise Workstation</span>
                  <ul className="mt-8 space-y-3 text-xs text-body-text font-serif italic">
                    <li>• Dedicated server instances</li>
                    <li>• Multi-org child permissions</li>
                    <li>• Custom branding white labeling</li>
                    <li>• 24/7 Priority developer support</li>
                  </ul>
                </div>
                <button
                  onClick={() => { setShowAuthModal(true); setAuthMode('register'); setAuthError(''); }}
                  className="w-full mt-8 border border-hairline hover:bg-canvas text-ink text-xs font-bold py-3 rounded-sm font-mono uppercase tracking-widest cursor-pointer"
                >
                  Choose Premium
                </button>
              </div>
            </div>
          </section>

          {/* Landing Footer */}
          <Footer />

          {/* 1. AUTHENTICATION OVERLAY DIALOG */}
          {showAuthModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in animate-duration-150">
              <div className="w-full max-w-md bg-canvas-soft border border-hairline p-8 rounded-sm shadow-2xl relative">
                
                {/* Close Button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 text-mute hover:text-ink p-1 rounded transition-colors"
                  title="Close Dialog"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col items-center mb-8 select-none">
                  <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white text-xl font-sans shadow-md mb-2">
                    Q
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-ink font-mono">Clientoq</h1>
                  <p className="text-body-text text-sm italic font-serif mt-1">the quietly confident business canvas</p>
                </div>

                {authError && (
                  <div className="bg-red-950/50 border border-red-500/30 text-red-200 p-3 rounded text-sm mb-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                  {authMode === 'register' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">Agency Name</label>
                        <input
                          type="text"
                          className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                          placeholder="e.g. CodeCrest Studio"
                          value={orgName}
                          onChange={e => setOrgName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">First Name</label>
                          <input
                            type="text"
                            className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                            placeholder="John"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">Last Name</label>
                          <input
                            type="text"
                            className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                            placeholder="Doe"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                      placeholder="syed@codecrest.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary hover:opacity-90 text-on-primary text-sm font-medium p-3 rounded-sm transition-all duration-150 uppercase tracking-widest font-mono"
                  >
                    {authMode === 'login' ? 'Enter Console' : 'Initialize Tenant'}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs">
                  <span className="text-body-text">
                    {authMode === 'login' ? "New operation?" : "Have workspace keys?"}
                  </span>{' '}
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-primary underline font-medium hover:opacity-80 transition-opacity"
                  >
                    {authMode === 'login' ? 'Initialize Studio Plan' : 'Login'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        
        /* 2. CORE WORKSPACE */
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar */}
          <aside className="w-72 bg-canvas border-r border-hairline flex flex-col shrink-0">
            {/* Header / Logo */}
            <div className="p-6 border-b border-hairline flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center font-bold text-white text-xs font-sans shadow-sm select-none">
                  Q
                </div>
                <span className="font-bold tracking-tight text-md uppercase font-mono text-ink">Clientoq</span>
                <span className="bg-canvas-soft border border-hairline text-mute text-[8px] px-1 rounded uppercase tracking-widest">PRO</span>
              </div>
              <span className="text-mute text-[10px] italic font-serif mt-1">Agency Operations Workstation</span>
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('crm')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'crm' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} />
                  <span>CRM Pipeline</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'clients' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Users size={16} />
                <span>Clients Log</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'projects' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Briefcase size={16} />
                <span>Projects Board</span>
              </button>

              <button
                onClick={() => setActiveTab('finance')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'finance' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <DollarSign size={16} />
                <span>Finance & Bills</span>
              </button>

              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'whatsapp' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={16} />
                  <span>WhatsApp Hub</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('automations')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'automations' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Cpu size={16} />
                <span>Automations</span>
              </button>

              <div className="h-px bg-hairline my-4"></div>

              <button
                onClick={() => setActiveTab('portal')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'portal' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Eye size={16} />
                <span>Client Portal View</span>
              </button>
            </nav>

            {/* User Details */}
            <div className="p-4 border-t border-hairline bg-canvas-soft/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase">
                  {user.firstName[0]}{user.lastName ? user.lastName[0] : ''}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-ink leading-tight">{user.firstName} {user.lastName || ''}</span>
                  <span className="text-[10px] text-mute leading-none font-mono uppercase tracking-wider">{user.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-mute hover:text-red-400 p-1 rounded transition-colors"
                title="Exit Workstation"
              >
                <LogOut size={16} />
              </button>
            </div>
          </aside>

          {/* Main workspace container */}
          <main className="flex-1 flex flex-col overflow-hidden bg-canvas">
            
            {/* Header */}
            <header className="h-16 border-b border-hairline flex items-center justify-between px-8 bg-canvas select-none">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-ink">
                  {activeTab === 'dashboard' && 'Operations Dashboard'}
                  {activeTab === 'crm' && 'CRM Pipeline Manager'}
                  {activeTab === 'clients' && 'Client Profiles Index'}
                  {activeTab === 'projects' && 'Agile Workspace'}
                  {activeTab === 'finance' && 'Billing Ledger'}
                  {activeTab === 'whatsapp' && 'WhatsApp Communications'}
                  {activeTab === 'automations' && 'Rule Automation Engine'}
                  {activeTab === 'portal' && 'Acme Corp Portal (Client View)'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAIDrawer(!showAIDrawer)}
                  className="bg-canvas border border-hairline text-ink text-xs font-medium px-3.5 py-1.5 rounded-sm hover:bg-canvas-soft flex items-center gap-2 transition-all duration-150 uppercase tracking-widest font-mono"
                >
                  <Sparkles size={14} className="text-primary animate-bounce" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            </header>

            {/* Page content scroll container */}
            <div className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
              
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && dashboardData && (
                <div className="space-y-8">
                  {/* KPI Cards Bento Grid */}
                  <div className="grid grid-cols-4 gap-6">
                    <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                      <div className="flex items-center justify-between text-mute mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold">Total Revenue</span>
                        <DollarSign size={16} />
                      </div>
                      <div className="text-2xl font-bold tracking-tight">₹{dashboardData.kpis.revenue.toLocaleString()}</div>
                      <span className="text-[10px] text-green-400 font-mono mt-1 block">▲ +12% since last month</span>
                    </div>

                    <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                      <div className="flex items-center justify-between text-mute mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold">Expenses Log</span>
                        <TrendingUp size={16} />
                      </div>
                      <div className="text-2xl font-bold tracking-tight">₹{dashboardData.kpis.expenses.toLocaleString()}</div>
                      <span className="text-[10px] text-mute font-mono mt-1 block">Includes Google Ads Q2</span>
                    </div>

                    <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                      <div className="flex items-center justify-between text-mute mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold">Outstanding Invoiced</span>
                        <DollarSign size={16} className="text-yellow-400" />
                      </div>
                      <div className="text-2xl font-bold tracking-tight text-yellow-400">₹{dashboardData.kpis.outstanding.toLocaleString()}</div>
                      <span className="text-[10px] text-yellow-400/80 font-mono mt-1 block">Pending client approvals</span>
                    </div>

                    <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                      <div className="flex items-center justify-between text-mute mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider font-semibold">Active Operations</span>
                        <Briefcase size={16} />
                      </div>
                      <div className="text-2xl font-bold tracking-tight">{dashboardData.kpis.activeProjects} Projects</div>
                      <span className="text-[10px] text-mute font-mono mt-1 block">{dashboardData.kpis.activeClients} client accounts active</span>
                    </div>
                  </div>

                  {/* Revenue Trend Chart & AI Insights */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col">
                      <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-6 text-mute">6-Month Financial Trend</h3>
                      
                      {/* SVG Bar Chart */}
                      <div className="h-64 flex items-end justify-between gap-4 mt-auto">
                        {dashboardData.charts.monthlyRevenue.map((m: any, idx: number) => {
                          const maxVal = Math.max(...dashboardData.charts.monthlyRevenue.map((x: any) => x.revenue));
                          const heightRev = maxVal > 0 ? (m.revenue / maxVal) * 80 : 0;
                          const heightExp = maxVal > 0 ? (m.expenses / maxVal) * 80 : 0;

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div className="w-full flex items-end gap-1.5 h-48 justify-center">
                                {/* Revenue Bar */}
                                <div 
                                  className="w-4 bg-primary rounded-t-sm transition-all duration-500" 
                                  style={{ height: `${heightRev}%` }}
                                  title={`Revenue: ₹${m.revenue}`}
                                ></div>
                                {/* Expenses Bar */}
                                <div 
                                  className="w-4 bg-hairline rounded-t-sm transition-all duration-500" 
                                  style={{ height: `${heightExp}%` }}
                                  title={`Expenses: ₹${m.expenses}`}
                                ></div>
                              </div>
                              <span className="text-xs text-body-text mt-3 font-mono">{m.month}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-6 mt-6 justify-center text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-xs"></div>
                          <span className="text-mute">Revenue Invoiced (Paid)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-hairline rounded-xs"></div>
                          <span className="text-mute">Operating Costs</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Insights Panel */}
                    <div className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-primary mb-4">
                          <Sparkles size={16} />
                          <h3 className="text-xs font-bold font-mono uppercase tracking-wider">AI Operations Insights</h3>
                        </div>
                        <p className="text-sm text-body-strong leading-relaxed font-serif italic mb-6">
                          "Revenue is steady, but ₹47,200 remains outstanding from Acme Corporation for milestone #1. The last WhatsApp conversation suggests John Doe is ready to pay once wireframes are approved."
                        </p>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setShowAIDrawer(true);
                            handleSendAIQuery(undefined, 'Summarize Acme Corp');
                          }}
                          className="w-full bg-canvas border border-hairline hover:bg-canvas/50 text-xs font-mono py-2 rounded-sm text-center tracking-wider"
                        >
                          Summarize Acme Corp
                        </button>
                        <button
                          onClick={() => {
                            setShowAIDrawer(true);
                            handleSendAIQuery(undefined, 'Draft a payment reminder email for Acme Corp');
                          }}
                          className="w-full bg-canvas border border-hairline hover:bg-canvas/50 text-xs font-mono py-2 rounded-sm text-center tracking-wider"
                        >
                          Draft Payment Reminder
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity Feed */}
                  <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-mute">Recent Operational Logs</h3>
                    <div className="space-y-4 font-mono text-xs">
                      {dashboardData.recentActivities.map((act: any) => (
                        <div key={act.id} className="flex items-center justify-between border-b border-hairline/40 pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded-xs font-bold text-[9px] uppercase tracking-wider ${
                              act.type === 'CRM' ? 'bg-blue-900/40 text-blue-300' :
                              act.type === 'Finance' ? 'bg-green-900/40 text-green-300' :
                              'bg-purple-900/40 text-purple-300'
                            }`}>
                              {act.type}
                            </span>
                            <div className="flex flex-col">
                              <span className="text-ink font-medium">{act.title}</span>
                              <span className="text-mute mt-0.5">{act.detail}</span>
                            </div>
                          </div>
                          <span className="text-mute shrink-0 text-[10px]">{new Date(act.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CRM */}
              {activeTab === 'crm' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Leads Pipeline Board</h3>
                    <button
                      onClick={() => setShowAddLeadModal(true)}
                      className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono"
                    >
                      <Plus size={14} />
                      <span>Add Lead</span>
                    </button>
                  </div>

                  {/* Kanban Columns */}
                  <div className="grid grid-cols-6 gap-4 items-start">
                    {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won'].map((stage) => {
                      const stageLeads = leads.filter(l => l.status === stage);
                      return (
                        <div key={stage} className="bg-canvas-soft/60 border border-hairline/60 rounded-md p-3 min-h-[300px]">
                          <div className="flex items-center justify-between border-b border-hairline pb-2 mb-3">
                            <span className="text-xs font-bold font-mono uppercase tracking-wider text-body-text">{stage}</span>
                            <span className="text-[10px] bg-hairline text-ink px-1.5 py-0.2 rounded font-mono font-bold">{stageLeads.length}</span>
                          </div>

                          <div className="space-y-3">
                            {stageLeads.map((lead) => (
                              <div
                                key={lead.id}
                                onClick={() => setSelectedLead(lead)}
                                className="bg-canvas border border-hairline p-3 rounded-md hover:border-primary cursor-pointer transition-all duration-150 flex flex-col justify-between"
                              >
                                <div className="text-xs font-semibold text-ink mb-1 truncate">{lead.firstName} {lead.lastName}</div>
                                <div className="text-[10px] text-mute truncate mb-2">{lead.companyName || 'No Company'}</div>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-hairline/30">
                                  <span className="text-[10px] font-mono text-primary font-bold">₹{lead.estimatedValue.toLocaleString()}</span>
                                  <span className="text-[9px] text-mute flex items-center gap-1">
                                    <Clock size={8} /> {new Date(lead.updatedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Lead Detail Modal / Panel */}
                  {selectedLead && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-2xl p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setSelectedLead(null)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>

                        <div className="flex items-start gap-4 mb-6">
                          <div className="w-12 h-12 bg-primary text-on-primary rounded-md flex items-center justify-center text-xl font-bold font-mono">
                            {selectedLead.firstName[0]}{selectedLead.lastName[0]}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold tracking-tight">{selectedLead.firstName} {selectedLead.lastName}</h2>
                            <p className="text-body-text text-sm">{selectedLead.companyName} ({selectedLead.source})</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                          <div className="bg-canvas border border-hairline p-4 rounded-sm">
                            <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-1">Estimated Value</span>
                            <span className="text-md font-bold text-primary font-mono">₹{selectedLead.estimatedValue.toLocaleString()}</span>
                          </div>

                          <div className="bg-canvas border border-hairline p-4 rounded-sm">
                            <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-1">Current Stage</span>
                            <select
                              value={selectedLead.status}
                              onChange={(e) => handleUpdateLeadStage(selectedLead.id, e.target.value)}
                              className="bg-transparent border-0 font-semibold text-sm focus:outline-none text-ink font-mono uppercase tracking-wider"
                            >
                              {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].map(st => (
                                <option key={st} value={st} className="bg-canvas text-ink">{st}</option>
                              ))}
                            </select>
                          </div>

                          <div className="bg-canvas border border-hairline p-4 rounded-sm">
                            <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-1">Contact Email</span>
                            <span className="text-xs truncate block font-mono text-body-strong mt-0.5">{selectedLead.email || 'None'}</span>
                          </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-8">
                          <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-2">Lead Description & Notes</span>
                          <p className="bg-canvas border border-hairline p-4 rounded-sm text-sm text-body-strong leading-relaxed font-serif italic">
                            {selectedLead.notes || 'No description notes provided.'}
                          </p>
                        </div>

                        {/* Add Activity Log */}
                        <div className="border-t border-hairline pt-6 mb-6">
                          <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-mute">Log Activity</h3>
                          <form onSubmit={handleAddLeadActivity} className="flex gap-4">
                            <select
                              value={newActivityType}
                              onChange={e => setNewActivityType(e.target.value)}
                              className="bg-canvas border border-hairline text-sm p-3 rounded-sm font-mono text-ink"
                            >
                              {['Follow-Up', 'Call', 'Meeting', 'Email', 'Proposal Sent'].map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={newActivityNote}
                              onChange={e => setNewActivityNote(e.target.value)}
                              placeholder="Logged summary description (e.g. Schedule product call)"
                              className="flex-1 bg-canvas border border-hairline text-sm p-3 rounded-sm focus:outline-none focus:border-primary text-ink"
                              required
                            />
                            <button
                              type="submit"
                              className="bg-primary text-on-primary text-xs font-semibold px-6 rounded-sm uppercase tracking-widest font-mono hover:opacity-90"
                            >
                              Log
                            </button>
                          </form>
                        </div>

                        {/* Activities Feed */}
                        <div>
                          <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-mute">Activity Feed</h3>
                          <div className="max-h-40 overflow-y-auto space-y-3 font-mono text-xs pr-2">
                            {selectedLead.activities?.slice().reverse().map((act: any) => (
                              <div key={act.id} className="bg-canvas/50 p-3 rounded border border-hairline/40 flex justify-between">
                                <div>
                                  <span className="text-primary font-bold mr-2 uppercase">[{act.activityType}]</span>
                                  <span className="text-body-strong">{act.note}</span>
                                </div>
                                <span className="text-mute text-[10px] shrink-0">{new Date(act.createdAt).toLocaleDateString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Add Lead Modal */}
                  {showAddLeadModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowAddLeadModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Add New Lead</h2>
                        <form onSubmit={handleAddLead} className="space-y-4 text-xs font-mono">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">First Name</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newLeadForm.firstName}
                                onChange={e => setNewLeadForm({ ...newLeadForm, firstName: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Last Name</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newLeadForm.lastName}
                                onChange={e => setNewLeadForm({ ...newLeadForm, lastName: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Company Name</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              value={newLeadForm.companyName}
                              onChange={e => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Email</label>
                              <input
                                type="email"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newLeadForm.email}
                                onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Phone</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newLeadForm.phone}
                                onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Source</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newLeadForm.source}
                                onChange={e => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Estimated Value (₹)</label>
                              <input
                                type="number"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newLeadForm.estimatedValue}
                                onChange={e => setNewLeadForm({ ...newLeadForm, estimatedValue: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Notes</label>
                            <textarea
                              rows={3}
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                              value={newLeadForm.notes}
                              onChange={e => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95 transition-opacity"
                          >
                            Create Lead Card
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: CLIENTS */}
              {activeTab === 'clients' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Clients Directory</h3>
                    <button
                      onClick={() => setShowAddClientModal(true)}
                      className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono"
                    >
                      <Plus size={14} />
                      <span>Add Client</span>
                    </button>
                  </div>

                  {/* Clients List */}
                  <div className="bg-canvas-soft border border-hairline rounded-md overflow-hidden">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-canvas/50 border-b border-hairline/60 text-mute uppercase tracking-wider">
                          <th className="p-4">Company Name</th>
                          <th className="p-4">Website</th>
                          <th className="p-4">Billing Contact</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline/40">
                        {clients.map((c) => (
                          <tr key={c.id} className="hover:bg-canvas/30 text-ink">
                            <td className="p-4 font-semibold">{c.companyName}</td>
                            <td className="p-4 text-mute">{c.website || 'No Website'}</td>
                            <td className="p-4 text-body-strong">{c.email || 'None'}</td>
                            <td className="p-4 text-mute">{c.phone || 'None'}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleSelectClient(c)}
                                className="bg-canvas border border-hairline text-[10px] px-3 py-1 hover:bg-canvas-soft uppercase tracking-wider text-primary font-bold"
                              >
                                View Folder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Client Profile Modal */}
                  {selectedClient && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-4xl p-8 rounded-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                          onClick={() => setSelectedClient(null)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>

                        <div className="border-b border-hairline pb-4 mb-6">
                          <h2 className="text-xl font-bold tracking-tight">{selectedClient.companyName}</h2>
                          <p className="text-xs text-mute font-mono">{selectedClient.website || 'No website registered'}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                          {/* Info panel */}
                          <div className="bg-canvas border border-hairline p-4 rounded-sm space-y-2 text-xs font-mono text-body-strong">
                            <span className="block text-[10px] uppercase text-mute mb-2 tracking-wider">Account Specifications</span>
                            <div><strong className="text-mute font-normal">Contact:</strong> {selectedClient.email || 'None'}</div>
                            <div><strong className="text-mute font-normal">Phone:</strong> {selectedClient.phone || 'None'}</div>
                            <div><strong className="text-mute font-normal">Address:</strong> {selectedClient.address}, {selectedClient.city}, {selectedClient.state}</div>
                            <div><strong className="text-mute font-normal">GSTIN:</strong> {selectedClient.gstNumber || 'None'}</div>
                          </div>

                          {/* Contacts list */}
                          <div className="bg-canvas border border-hairline p-4 rounded-sm space-y-3 text-xs font-mono col-span-2">
                            <span className="block text-[10px] uppercase text-mute mb-2 tracking-wider">Team Representatives</span>
                            {selectedClient.contacts?.map((contact: any) => (
                              <div key={contact.id} className="border-b border-hairline/30 pb-2 last:border-0 last:pb-0 flex justify-between items-center">
                                <div>
                                  <div className="font-semibold text-ink">{contact.name}</div>
                                  <div className="text-[10px] text-mute">{contact.designation || 'Representative'}</div>
                                </div>
                                <div className="text-[10px] text-body-strong text-right">
                                  <div>{contact.email}</div>
                                  <div className="text-mute">{contact.phone || ''}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Open projects & invoices */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="bg-canvas border border-hairline p-5 rounded-sm">
                            <span className="block text-[10px] uppercase text-mute mb-3 font-mono tracking-wider">Active Workspace Projects</span>
                            <div className="space-y-3">
                              {selectedClient.projects?.map((p: any) => (
                                <div key={p.id} className="flex justify-between items-center text-xs font-mono">
                                  <span className="text-ink font-semibold">{p.name}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-mute">{p.status}</span>
                                    <span className="bg-canvas-soft border border-hairline px-1.5 py-0.2 rounded font-bold text-primary">{p.progress}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-canvas border border-hairline p-5 rounded-sm">
                            <span className="block text-[10px] uppercase text-mute mb-3 font-mono tracking-wider">Financial Invoices Ledger</span>
                            <div className="space-y-3">
                              {selectedClient.invoices?.map((i: any) => (
                                <div key={i.id} className="flex justify-between items-center text-xs font-mono">
                                  <span className="text-ink font-semibold">{i.invoiceNumber}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-primary font-bold">₹{i.totalAmount.toLocaleString()}</span>
                                    <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase ${i.status === 'Paid' ? 'bg-green-950 text-green-300' : 'bg-yellow-950 text-yellow-300'}`}>{i.status}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Simulated WhatsApp chat timeline */}
                        <div className="mt-8 bg-canvas border border-hairline p-5 rounded-sm">
                          <span className="block text-[10px] uppercase text-mute mb-3 font-mono tracking-wider">WhatsApp Communication Stream</span>
                          {selectedClient.whatsappConversations?.map((conv: any) => (
                            <div key={conv.id} className="space-y-3 max-h-40 overflow-y-auto text-xs pr-2">
                              {conv.messages?.map((msg: any) => (
                                <div key={msg.id} className={`flex ${msg.senderType === 'Agent' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`p-2.5 rounded-sm max-w-md ${msg.senderType === 'Agent' ? 'bg-primary text-on-primary font-medium' : 'bg-canvas-soft text-ink border border-hairline'}`}>
                                    {msg.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Add Client Modal */}
                  {showAddClientModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowAddClientModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Add New Client Account</h2>
                        <form onSubmit={handleCreateClient} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Company / Client Name</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Acme Corp"
                              value={newClientForm.companyName}
                              onChange={e => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Website URL</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="https://client.com"
                              value={newClientForm.website}
                              onChange={e => setNewClientForm({ ...newClientForm, website: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Billing Email</label>
                              <input
                                type="email"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                placeholder="billing@client.com"
                                value={newClientForm.email}
                                onChange={e => setNewClientForm({ ...newClientForm, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Phone Number</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newClientForm.phone}
                                onChange={e => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Street Address</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              value={newClientForm.address}
                              onChange={e => setNewClientForm({ ...newClientForm, address: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-mute mb-1">City</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newClientForm.city}
                                onChange={e => setNewClientForm({ ...newClientForm, city: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">State</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newClientForm.state}
                                onChange={e => setNewClientForm({ ...newClientForm, state: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Country</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newClientForm.country}
                                onChange={e => setNewClientForm({ ...newClientForm, country: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">GST/Tax Registration ID</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              value={newClientForm.gstNumber}
                              onChange={e => setNewClientForm({ ...newClientForm, gstNumber: e.target.value })}
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95 transition-opacity"
                          >
                            Register Client
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 4: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Workspace Boards</h3>
                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono"
                    >
                      <Plus size={14} />
                      <span>Create Project</span>
                    </button>
                  </div>

                  {/* Projects List Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => handleSelectProject(proj)}
                        className={`bg-canvas-soft border p-6 rounded-md cursor-pointer transition-all duration-150 flex flex-col justify-between ${selectedProject?.id === proj.id ? 'border-primary' : 'border-hairline hover:border-body-text'}`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-mute text-[10px] font-mono mb-2 uppercase tracking-wider">
                            <span>{proj.client?.companyName || 'No Client'}</span>
                            <span className={`px-2 py-0.5 rounded-xs font-bold ${
                              proj.priority === 'High' ? 'bg-red-950/60 text-red-300' : 'bg-gray-800 text-gray-300'
                            }`}>{proj.priority}</span>
                          </div>
                          <h4 className="text-lg font-bold text-ink mb-2">{proj.name}</h4>
                          <p className="text-xs text-body-text line-clamp-2 mb-4 leading-relaxed">{proj.description || 'No description notes.'}</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs font-mono text-mute mb-2">
                            <span>Milestones stage</span>
                            <span>{proj.progress}%</span>
                          </div>
                          <div className="w-full bg-canvas h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${proj.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Selected Project View */}
                  {selectedProject && (
                    <div className="border-t border-hairline pt-8 space-y-6">
                      <div className="flex justify-between items-center border-b border-hairline/40 pb-4">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-ink">{selectedProject.name}</h3>
                          <p className="text-xs text-mute font-mono mt-1">Status: {selectedProject.status} | Budget: ₹{selectedProject.budget?.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => setShowAddTaskModal(true)}
                          className="bg-canvas border border-hairline text-ink text-xs font-mono font-bold px-4 py-2 rounded-sm hover:bg-canvas-soft uppercase tracking-widest"
                        >
                          <Plus size={12} className="inline mr-1" />
                          <span>Add Board Task</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-6 items-start">
                        {/* Milestones list */}
                        <div className="bg-canvas-soft border border-hairline p-5 rounded-md">
                          <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-3 font-semibold">Project Milestones</span>
                          <div className="space-y-3 font-mono text-xs">
                            {selectedProject.milestones?.map((mil: any) => (
                              <div
                                key={mil.id}
                                onClick={() => handleToggleMilestone(mil.id, mil.status)}
                                className="flex items-center justify-between border-b border-hairline/30 pb-2 last:border-0 last:pb-0 cursor-pointer hover:opacity-80 transition-opacity"
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={mil.status === 'Completed'}
                                    onChange={() => {}} // Swallowed, parent onClick handles it
                                    className="accent-primary"
                                  />
                                  <span className={`text-ink ${mil.status === 'Completed' ? 'line-through text-mute' : ''}`}>{mil.title}</span>
                                </div>
                                <span className="text-[10px] text-mute">{mil.dueDate ? new Date(mil.dueDate).toLocaleDateString() : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Project Tasks board column (Kanban split in detailed view) */}
                        <div className="bg-canvas-soft border border-hairline p-5 rounded-md col-span-2 space-y-4">
                          <span className="block text-[10px] uppercase font-mono tracking-wider text-mute font-semibold">Active Tasks Log</span>
                          
                          <div className="space-y-4">
                            {selectedProject.tasks?.map((task: any) => (
                              <div key={task.id} className="bg-canvas border border-hairline p-4 rounded-md flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="text-sm font-bold text-ink">{task.title}</h5>
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                                    className="bg-canvas-soft border border-hairline text-[10px] p-1 rounded font-mono text-mute uppercase"
                                  >
                                    {['To Do', 'In Progress', 'Review', 'Completed'].map(st => (
                                      <option key={st} value={st}>{st}</option>
                                    ))}
                                  </select>
                                </div>
                                <p className="text-xs text-body-text leading-relaxed font-sans mb-3">{task.description || 'No description notes.'}</p>

                                {/* Checklist sub-section */}
                                {task.checklists && task.checklists.length > 0 && (
                                  <div className="bg-canvas-soft/40 p-3 rounded-sm border border-hairline/40 text-xs font-mono space-y-2 mb-3">
                                    <span className="block text-[9px] uppercase text-mute tracking-wider font-semibold">Subtasks Checklist</span>
                                    {task.checklists.map((check: any) => (
                                      <div key={check.id} className="flex items-center gap-2">
                                        <input
                                          type="checkbox"
                                          checked={check.completed}
                                          onChange={(e) => handleToggleChecklist(check.id, e.target.checked)}
                                          className="accent-primary"
                                        />
                                        <span className={check.completed ? 'line-through text-mute' : 'text-body-strong'}>{check.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Add checklist inline form */}
                                <div className="flex gap-2 items-center mb-3">
                                  <input
                                    type="text"
                                    placeholder="Add subtask..."
                                    value={checklistInputs[task.id] || ''}
                                    onChange={(e) => setChecklistInputs({ ...checklistInputs, [task.id]: e.target.value })}
                                    className="bg-canvas-soft border border-hairline text-[10px] px-2 py-1 rounded-sm w-36 text-ink focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleAddTaskChecklist(task.id)}
                                    className="bg-primary text-on-primary font-bold text-[9px] px-2 py-1 rounded-sm uppercase tracking-wider"
                                  >
                                    Add
                                  </button>
                                </div>

                                {/* Comments list */}
                                {task.comments && task.comments.length > 0 && (
                                  <div className="mt-2 border-t border-hairline/30 pt-3 space-y-2 text-[10px] font-mono">
                                    <span className="block text-[9px] uppercase text-mute tracking-wider font-semibold">Comments feed</span>
                                    {task.comments.map((comm: any) => (
                                      <div key={comm.id} className="text-body-text">
                                        <strong className="text-ink">{comm.user?.firstName}:</strong> {comm.comment}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Add comment input */}
                                <div className="flex gap-2 items-center mt-3 pt-3 border-t border-hairline/20">
                                  <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={taskComments[task.id] || ''}
                                    onChange={(e) => setTaskComments({ ...taskComments, [task.id]: e.target.value })}
                                    className="flex-1 bg-canvas-soft border border-hairline text-xs px-2.5 py-1.5 rounded-sm text-ink focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleAddTaskComment(task.id)}
                                    className="text-mute hover:text-primary p-1 rounded"
                                  >
                                    <Send size={14} />
                                  </button>
                                </div>

                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Create Project Modal */}
                  {showAddProjectModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowAddProjectModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Create New Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Select Client Account</label>
                            <select
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              value={newProjectForm.clientId}
                              onChange={e => setNewProjectForm({ ...newProjectForm, clientId: e.target.value })}
                              required
                            >
                              <option value="">Select account...</option>
                              {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.companyName}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Project Title</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Acme Portal Integration"
                              value={newProjectForm.name}
                              onChange={e => setNewProjectForm({ ...newProjectForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Description</label>
                            <textarea
                              rows={3}
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                              value={newProjectForm.description}
                              onChange={e => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Priority</label>
                              <select
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newProjectForm.priority}
                                onChange={e => setNewProjectForm({ ...newProjectForm, priority: e.target.value })}
                              >
                                {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Budget Allocation (₹)</label>
                              <input
                                type="number"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newProjectForm.budget}
                                onChange={e => setNewProjectForm({ ...newProjectForm, budget: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Start Date</label>
                              <input
                                type="date"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newProjectForm.startDate}
                                onChange={e => setNewProjectForm({ ...newProjectForm, startDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">End Date</label>
                              <input
                                type="date"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newProjectForm.endDate}
                                onChange={e => setNewProjectForm({ ...newProjectForm, endDate: e.target.value })}
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95 transition-opacity"
                          >
                            Deploy Project Board
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Add Task Modal */}
                  {showAddTaskModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowAddTaskModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Create Board Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Task Title</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Setup API endpoints module"
                              value={newTaskForm.title}
                              onChange={e => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Task Details</label>
                            <textarea
                              rows={3}
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                              value={newTaskForm.description}
                              onChange={e => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Priority</label>
                              <select
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newTaskForm.priority}
                                onChange={e => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                              >
                                {['Low', 'Medium', 'High', 'Critical'].map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Estimated Hours</label>
                              <input
                                type="number"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newTaskForm.estimatedHours}
                                onChange={e => setNewTaskForm({ ...newTaskForm, estimatedHours: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Due Date</label>
                              <input
                                type="date"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newTaskForm.dueDate}
                                onChange={e => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Assign User</label>
                              <select
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newTaskForm.assigneeId}
                                onChange={e => setNewTaskForm({ ...newTaskForm, assigneeId: e.target.value })}
                              >
                                <option value="">Assign to...</option>
                                <option value="usr-syed">Syed (Owner)</option>
                                <option value="usr-alice">Alice (Manager)</option>
                                <option value="usr-bob">Bob (Employee)</option>
                              </select>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95 transition-opacity"
                          >
                            Commit Task
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 5: FINANCE */}
              {activeTab === 'finance' && (
                <div className="space-y-8">
                  
                  {/* Ledger Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Financial Invoices Ledger</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowAddExpenseModal(true)}
                        className="bg-canvas border border-hairline text-ink text-xs font-semibold px-4 py-2 rounded-sm hover:bg-canvas-soft uppercase tracking-widest font-mono"
                      >
                        <Plus size={14} className="inline mr-1" />
                        <span>Log Expense</span>
                      </button>
                      <button
                        onClick={() => setShowAddInvoiceModal(true)}
                        className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono"
                      >
                        <Plus size={14} />
                        <span>Generate Invoice</span>
                      </button>
                    </div>
                  </div>

                  {/* Invoices Index Table */}
                  <div className="bg-canvas-soft border border-hairline rounded-md overflow-hidden">
                    <table className="w-full text-left text-xs font-mono border-collapse">
                      <thead>
                        <tr className="bg-canvas/50 border-b border-hairline/60 text-mute uppercase tracking-wider">
                          <th className="p-4">Invoice #</th>
                          <th className="p-4">Client Company</th>
                          <th className="p-4">Due Date</th>
                          <th className="p-4 text-right">Subtotal</th>
                          <th className="p-4 text-right">Tax (18%)</th>
                          <th className="p-4 text-right">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline/40">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-canvas/30 text-ink">
                            <td className="p-4 font-semibold">{inv.invoiceNumber}</td>
                            <td className="p-4 text-body-strong">{inv.client.companyName}</td>
                            <td className="p-4 text-mute">{new Date(inv.dueDate).toLocaleDateString()}</td>
                            <td className="p-4 text-right font-mono">₹{inv.subtotal.toLocaleString()}</td>
                            <td className="p-4 text-right font-mono text-mute">₹{inv.taxAmount.toLocaleString()}</td>
                            <td className="p-4 text-right font-mono font-bold text-primary">₹{inv.totalAmount.toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-xs font-bold text-[9px] uppercase tracking-wider ${
                                inv.status === 'Paid' ? 'bg-green-950/60 text-green-300' :
                                inv.status === 'Sent' ? 'bg-blue-950/60 text-blue-300' :
                                'bg-yellow-950/60 text-yellow-300'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                className="bg-canvas border border-hairline text-[10px] px-3 py-1 hover:bg-canvas-soft uppercase tracking-wider text-primary font-bold"
                              >
                                Review File
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Expenses Ledger */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-mute">Logged Business Costs</h4>
                    <div className="bg-canvas-soft border border-hairline rounded-md overflow-hidden">
                      <table className="w-full text-left text-xs font-mono border-collapse">
                        <thead>
                          <tr className="bg-canvas/50 border-b border-hairline/60 text-mute uppercase tracking-wider">
                            <th className="p-4">Category</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Log Date</th>
                            <th className="p-4 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-hairline/40">
                          {expenses.map((exp) => (
                            <tr key={exp.id} className="hover:bg-canvas/30 text-ink">
                              <td className="p-4 font-semibold text-primary">{exp.category}</td>
                              <td className="p-4 text-body-strong">{exp.description || 'N/A'}</td>
                              <td className="p-4 text-mute">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                              <td className="p-4 text-right font-mono font-bold">₹{exp.amount.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Invoice Review Panel */}
                  {selectedInvoice && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-lg p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setSelectedInvoice(null)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>

                        <div className="border-b border-hairline pb-4 mb-6">
                          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-primary">Invoice Summary: {selectedInvoice.invoiceNumber}</h2>
                          <p className="text-xs text-mute mt-1">Client: {selectedInvoice.client.companyName}</p>
                        </div>

                        {/* Invoice Items details */}
                        <div className="bg-canvas border border-hairline p-4 rounded-sm mb-6">
                          <table className="w-full text-xs font-mono">
                            <thead>
                              <tr className="border-b border-hairline text-mute uppercase tracking-wider">
                                <th className="text-left pb-2">Description</th>
                                <th className="text-center pb-2">Qty</th>
                                <th className="text-right pb-2">Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline/30">
                              {selectedInvoice.items?.map((item: any) => (
                                <tr key={item.id} className="text-ink">
                                  <td className="py-2.5">{item.description}</td>
                                  <td className="py-2.5 text-center">{item.quantity}</td>
                                  <td className="py-2.5 text-right">₹{item.price.toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div className="border-t border-hairline mt-4 pt-4 text-xs font-mono text-right space-y-1">
                            <div><span className="text-mute">Subtotal:</span> ₹{selectedInvoice.subtotal.toLocaleString()}</div>
                            <div><span className="text-mute">GST (18%):</span> ₹{selectedInvoice.taxAmount.toLocaleString()}</div>
                            <div className="text-sm font-bold text-primary"><span className="text-mute">Total:</span> ₹{selectedInvoice.totalAmount.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Invoice Payments Log */}
                        {selectedInvoice.status === 'Paid' ? (
                          <div className="bg-green-950/30 border border-green-500/30 text-green-200 p-4 rounded-sm flex items-center gap-3">
                            <CheckCircle size={18} className="text-green-400 shrink-0" />
                            <div className="text-xs font-mono">
                              <div className="font-semibold">Invoice fully paid</div>
                              <div className="text-green-300/80 mt-0.5">
                                Settled via {selectedInvoice.payments[0]?.paymentGateway} (ID: {selectedInvoice.payments[0]?.transactionId})
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-yellow-950/30 border border-yellow-500/30 text-yellow-200 p-4 rounded-sm text-xs font-mono">
                              This invoice is currently waiting for client authorization. You can trigger a payment checkout simulator to reconcile payment status.
                            </div>
                            <button
                              onClick={() => setShowPayModal(true)}
                              className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs font-mono hover:opacity-95 transition-all"
                            >
                              Open Payment Simulator
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* Payment Checkout Simulator Modal */}
                  {showPayModal && selectedInvoice && (
                    <div className="fixed inset-0 bg-canvas/90 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
                      <div className="bg-canvas border border-hairline w-full max-w-sm p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowPayModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <div className="text-center mb-6">
                          <span className="text-3xl">💳</span>
                          <h2 className="text-lg font-bold font-mono uppercase tracking-wider mt-2 text-ink">Checkout Simulator</h2>
                          <p className="text-xs text-mute mt-1">Reconcile INV: {selectedInvoice.invoiceNumber}</p>
                        </div>

                        <div className="bg-canvas-soft border border-hairline p-4 rounded-sm text-xs font-mono text-center mb-6">
                          <span className="text-mute block uppercase text-[10px] tracking-wider mb-1">Total Bill Settlement</span>
                          <span className="text-xl font-bold text-primary">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Select Payment Gateway</label>
                            <select
                              value={paymentGateway}
                              onChange={e => setPaymentGateway(e.target.value)}
                              className="w-full bg-canvas-soft border border-hairline p-2.5 rounded text-ink"
                            >
                              <option value="Stripe">Stripe (International)</option>
                              <option value="Razorpay">Razorpay (India UPI/Card)</option>
                              <option value="UPI">Direct UPI Transfer</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Select Payment Instrument</label>
                            <select
                              value={paymentMethod}
                              onChange={e => setPaymentMethod(e.target.value)}
                              className="w-full bg-canvas-soft border border-hairline p-2.5 rounded text-ink"
                            >
                              <option value="Credit Card">Credit Card</option>
                              <option value="UPI Mode">UPI QR Scan</option>
                              <option value="Net Banking">Net Banking</option>
                            </select>
                          </div>
                          <button
                            onClick={handlePayInvoice}
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95"
                          >
                            Authorize Mock Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Invoice Modal */}
                  {showAddInvoiceModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-lg p-8 rounded-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                          onClick={() => setShowAddInvoiceModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Generate Client Invoice</h2>
                        
                        <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs font-mono">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Select Client Account</label>
                              <select
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newInvoiceForm.clientId}
                                onChange={e => setNewInvoiceForm({ ...newInvoiceForm, clientId: e.target.value })}
                                required
                              >
                                <option value="">Select client...</option>
                                {clients.map(c => (
                                  <option key={c.id} value={c.id}>{c.companyName}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Invoice Reference Number</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                placeholder="e.g. INV-2026-003"
                                value={newInvoiceForm.invoiceNumber}
                                onChange={e => setNewInvoiceForm({ ...newInvoiceForm, invoiceNumber: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Payment Due Date</label>
                              <input
                                type="date"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newInvoiceForm.dueDate}
                                onChange={e => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Calculated Subtotal (₹)</label>
                              <input
                                type="text"
                                className="w-full bg-canvas/30 border border-hairline p-2.5 rounded text-mute text-sm font-sans cursor-not-allowed"
                                value={newInvoiceForm.subtotal}
                                readOnly
                              />
                            </div>
                          </div>

                          {/* Invoice Items lines mapping */}
                          <div className="border-t border-hairline pt-4 space-y-3">
                            <span className="block text-[10px] uppercase text-mute tracking-wider font-semibold">Invoice Item Breakdown</span>
                            
                            {newInvoiceForm.items.map((item, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Service item description"
                                  className="flex-grow bg-canvas border border-hairline p-2 rounded text-ink text-sm font-sans"
                                  value={item.description}
                                  onChange={e => handleInvoiceItemChange(idx, 'description', e.target.value)}
                                  required
                                />
                                <input
                                  type="number"
                                  placeholder="Qty"
                                  className="w-12 bg-canvas border border-hairline p-2 rounded text-ink text-sm font-sans text-center"
                                  value={item.quantity}
                                  onChange={e => handleInvoiceItemChange(idx, 'quantity', e.target.value)}
                                  required
                                />
                                <input
                                  type="number"
                                  placeholder="Price (₹)"
                                  className="w-24 bg-canvas border border-hairline p-2 rounded text-ink text-sm font-sans text-right"
                                  value={item.price}
                                  onChange={e => handleInvoiceItemChange(idx, 'price', e.target.value)}
                                  required
                                />
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={handleAddInvoiceItemLine}
                              className="text-primary hover:underline text-[10px] font-bold block"
                            >
                              + Add Item Line
                            </button>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-4 hover:opacity-95"
                          >
                            Compile & Submit Invoice
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Add Expense Modal */}
                  {showAddExpenseModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowAddExpenseModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Log Business Cost</h2>
                        
                        <form onSubmit={handleCreateExpense} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Expense Category</label>
                            <select
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              value={newExpenseForm.category}
                              onChange={e => setNewExpenseForm({ ...newExpenseForm, category: e.target.value })}
                            >
                              {['Software Subscription', 'Marketing', 'Consulting Fee', 'Hardware', 'Office Space'].map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Description</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Vercel hosting bill Q2"
                              value={newExpenseForm.description}
                              onChange={e => setNewExpenseForm({ ...newExpenseForm, description: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Amount Allocation (₹)</label>
                              <input
                                type="number"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newExpenseForm.amount}
                                onChange={e => setNewExpenseForm({ ...newExpenseForm, amount: e.target.value })}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Expense Date</label>
                              <input
                                type="date"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newExpenseForm.expenseDate}
                                onChange={e => setNewExpenseForm({ ...newExpenseForm, expenseDate: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95"
                          >
                            Save Expense Item
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 6: WHATSAPP */}
              {activeTab === 'whatsapp' && (
                <div className="bg-canvas-soft border border-hairline rounded-md h-[calc(100vh-12rem)] flex overflow-hidden">
                  
                  {/* Left Side: Conversations list */}
                  <div className="w-80 border-r border-hairline flex flex-col shrink-0">
                    <div className="p-4 border-b border-hairline font-mono text-xs font-bold text-mute uppercase tracking-wider bg-canvas/30">
                      Client Inbox Threads
                    </div>
                    <div className="flex-grow overflow-y-auto divide-y divide-hairline/30">
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`p-4 cursor-pointer transition-all duration-150 flex flex-col justify-between ${selectedConversation?.id === conv.id ? 'bg-canvas' : 'hover:bg-canvas/40'}`}
                        >
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-semibold text-ink">{conv.client.companyName}</span>
                            <span className="text-[9px] text-mute font-mono">{new Date(conv.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <p className="text-[10px] text-body-text truncate">{conv.lastMessage || 'No message thread started'}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Message timeline chat box */}
                  {selectedConversation ? (
                    <div className="flex-grow flex flex-col justify-between bg-canvas/20">
                      {/* Chat Header */}
                      <div className="p-4 border-b border-hairline flex items-center justify-between bg-canvas/40">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-ink">{selectedConversation.client.companyName}</span>
                          <span className="text-mute">({selectedConversation.phone})</span>
                        </div>
                      </div>

                      {/* Timeline Area */}
                      <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.senderType === 'Agent' ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex flex-col max-w-md">
                              <div className={`p-3 rounded ${msg.senderType === 'Agent' ? 'bg-primary text-on-primary font-medium' : 'bg-canvas-soft text-ink border border-hairline'}`}>
                                <p className="text-xs leading-relaxed font-sans">{msg.content}</p>
                              </div>
                              <span className={`text-[8px] text-mute font-mono mt-1 ${msg.senderType === 'Agent' ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Reply Textbox */}
                      <form onSubmit={handleSendWhatsApp} className="p-4 border-t border-hairline bg-canvas/30 flex gap-3">
                        <input
                          type="text"
                          value={whatsAppInput}
                          onChange={e => setWhatsAppInput(e.target.value)}
                          placeholder="Type WhatsApp broadcast reply message..."
                          className="flex-grow bg-canvas border border-hairline p-3 rounded-sm text-xs focus:outline-none focus:border-primary text-ink"
                          required
                        />
                        <button
                          type="submit"
                          className="bg-primary text-on-primary font-bold text-xs px-6 rounded-sm uppercase tracking-widest font-mono hover:opacity-90"
                        >
                          Send
                        </button>
                      </form>

                    </div>
                  ) : (
                    <div className="flex-grow flex items-center justify-center text-xs text-mute font-mono">
                      Select client thread to view communications stream.
                    </div>
                  )}

                </div>
              )}

              {/* TAB 7: AUTOMATIONS */}
              {activeTab === 'automations' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Automation Rule Triggers</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {automations.map((rule) => (
                      <div key={rule.id} className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-ink">{rule.name}</h4>
                            <span className={`px-2 py-0.5 rounded-xs font-mono font-bold text-[9px] uppercase tracking-wider ${rule.isActive ? 'bg-green-950 text-green-300' : 'bg-mute text-canvas'}`}>
                              {rule.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </div>

                          {/* Rule definitions */}
                          <div className="bg-canvas border border-hairline p-4 rounded-sm space-y-2 text-xs font-mono mb-6">
                            <div><strong className="text-mute font-normal">IF:</strong> <span className="text-primary font-bold uppercase">{rule.triggerType}</span></div>
                            <div><strong className="text-mute font-normal">THEN:</strong> <span className="text-ink uppercase">{rule.actionType}</span></div>
                          </div>
                        </div>

                        {/* Logs */}
                        <div className="space-y-2">
                          <span className="block text-[9px] uppercase font-mono tracking-wider text-mute">Execution History</span>
                          <div className="bg-canvas border border-hairline/60 rounded p-3 text-[10px] font-mono max-h-24 overflow-y-auto space-y-1">
                            {rule.logs && rule.logs.length > 0 ? (
                              rule.logs.map((log: any) => (
                                <div key={log.id} className="flex justify-between text-mute">
                                  <span>Reconciled Stage Trigger - {log.status}</span>
                                  <span>{new Date(log.executedAt).toLocaleTimeString()}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-mute/60 italic">No execution trigger logged.</span>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: CLIENT PORTAL */}
              {activeTab === 'portal' && (
                <div className="space-y-8">
                  {/* Banner */}
                  <div className="bg-canvas-soft border border-hairline p-8 rounded-md flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">Acme Corp Portal Gateway</span>
                      <h3 className="text-xl font-bold tracking-tight text-ink mt-1">Hello John Doe 👋</h3>
                      <p className="text-xs text-mute font-mono mt-1">Review mock deliverables status and pay open bills.</p>
                    </div>
                    <div className="text-right font-mono text-xs text-mute">
                      <div>Company: Acme Corporation</div>
                      <div>Partner Account Manager: Syed Ali</div>
                    </div>
                  </div>

                  {/* Project progress view */}
                  <div className="bg-canvas border border-hairline p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4 text-xs font-mono text-mute">
                      <span className="font-semibold text-ink uppercase tracking-wider">Acme Web App Redesign Board</span>
                      <span>60% Completed</span>
                    </div>
                    <div className="w-full bg-canvas-soft h-3 rounded-full overflow-hidden mb-6">
                      <div className="bg-primary h-full" style={{ width: '60%' }}></div>
                    </div>

                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-mute mb-3">Tasks Under Review</h4>
                    <div className="space-y-3 font-mono text-xs">
                      {projects.flatMap(p => p.tasks).filter(t => t.status === 'In Progress' || t.status === 'Review').map(t => (
                        <div key={t.id} className="bg-canvas-soft border border-hairline/60 p-4 rounded flex justify-between items-center">
                          <div>
                            <div className="font-bold text-ink">{t.title}</div>
                            <div className="text-[10px] text-mute mt-1">{t.description}</div>
                          </div>
                          <span className="px-2 py-0.5 bg-yellow-950 text-yellow-300 text-[9px] uppercase font-bold tracking-wider rounded-xs">{t.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unpaid Invoices */}
                  <div className="bg-canvas border border-hairline p-6 rounded-md">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-4 font-semibold">Outstanding Payment Bills</span>
                    <div className="space-y-3">
                      {invoices.filter(i => i.status !== 'Paid').map(inv => (
                        <div key={inv.id} className="bg-canvas-soft border border-hairline/60 p-4 rounded flex justify-between items-center font-mono text-xs">
                          <div>
                            <span className="font-bold text-ink">{inv.invoiceNumber}</span>
                            <div className="text-[10px] text-mute mt-1">Due Date: {new Date(inv.dueDate).toLocaleDateString()}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-primary font-bold">₹{inv.totalAmount.toLocaleString()}</span>
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="bg-primary hover:opacity-90 text-on-primary text-[10px] font-bold px-4 py-2 rounded-xs uppercase tracking-wider"
                            >
                              Check Out
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* 3. FLOATING AI TRIGGER BUTTON */}
          <button
            onClick={() => setShowAIDrawer(!showAIDrawer)}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-on-primary shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-40"
            title="Ask AI Assistant"
          >
            <Sparkles size={20} className="text-on-primary animate-pulse" />
          </button>

          {/* 4. AI DRAWER OVERLAY PANEL */}
          {showAIDrawer && (
            <div className="fixed inset-y-0 right-0 w-96 bg-canvas-soft border-l border-hairline shadow-2xl z-50 flex flex-col justify-between">
              
              {/* Header */}
              <div className="p-4 border-b border-hairline flex justify-between items-center bg-canvas/30 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center font-bold text-white text-[10px] font-sans shadow-sm select-none">
                    Q
                  </div>
                  <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider animate-pulse">Clientoq AI Core</span>
                </div>
                <button
                  onClick={() => setShowAIDrawer(false)}
                  className="text-mute hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded text-xs leading-relaxed max-w-[85%] ${
                      msg.role === 'user' ? 'bg-primary text-on-primary font-medium' : 'bg-canvas text-ink border border-hairline font-serif italic'
                    }`}>
                      {/* Render line breaks or simple markdown lists */}
                      <div className="whitespace-pre-line">{msg.content}</div>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-canvas border border-hairline p-3 rounded text-xs text-mute font-mono">
                      Generating proposal/invoice insights...
                    </div>
                  </div>
                )}
                <div ref={aiEndRef} />
              </div>

              {/* AI Shortcuts templates */}
              <div className="px-4 py-2 bg-canvas/20 border-t border-hairline/60 flex flex-col gap-2">
                <span className="text-[9px] uppercase font-mono tracking-wider text-mute mb-1 font-semibold">Interactive Suggestions</span>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <button
                    onClick={() => handleSendAIQuery(undefined, 'Summarize Acme Corp')}
                    className="bg-canvas border border-hairline hover:bg-canvas-soft px-2.5 py-1 rounded text-mute hover:text-ink transition-colors"
                  >
                    Summarize Acme Corp
                  </button>
                  <button
                    onClick={() => handleSendAIQuery(undefined, 'Create website proposal for Acme Corp')}
                    className="bg-canvas border border-hairline hover:bg-canvas-soft px-2.5 py-1 rounded text-mute hover:text-ink transition-colors"
                  >
                    Draft Web Proposal
                  </button>
                  <button
                    onClick={() => handleSendAIQuery(undefined, 'Generate task checklist for redesign project')}
                    className="bg-canvas border border-hairline hover:bg-canvas-soft px-2.5 py-1 rounded text-mute hover:text-ink transition-colors"
                  >
                    Draft Project Tasks
                  </button>
                </div>
              </div>

              {/* Chat Text Input */}
              <form onSubmit={handleSendAIQuery} className="p-4 border-t border-hairline bg-canvas/30 flex gap-2">
                <input
                  type="text"
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="flex-grow bg-canvas border border-hairline p-3 rounded-sm text-xs focus:outline-none focus:border-primary text-ink"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary font-bold text-xs px-4 rounded-sm uppercase tracking-widest font-mono hover:opacity-90"
                >
                  <Send size={14} />
                </button>
              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
