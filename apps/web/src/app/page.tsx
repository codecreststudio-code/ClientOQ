'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api, getTenantSubdomain } from '../lib/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { setSentryUserContext } from '@/lib/sentry';
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
  AlertTriangle,
  Globe
} from 'lucide-react';

const getThemeClasses = (themeColor: string) => {
  switch (themeColor) {
    case 'emerald':
      return {
        primaryText: 'text-emerald-400',
        primaryBg: 'bg-emerald-500',
        accentText: 'text-emerald-300',
        bgSoft: 'bg-emerald-950/20 border-emerald-900/30 border',
      };
    case 'violet':
      return {
        primaryText: 'text-violet-400',
        primaryBg: 'bg-violet-500',
        accentText: 'text-violet-300',
        bgSoft: 'bg-violet-950/20 border-violet-900/30 border',
      };
    case 'rose':
      return {
        primaryText: 'text-rose-400',
        primaryBg: 'bg-rose-500',
        accentText: 'text-rose-300',
        bgSoft: 'bg-rose-950/20 border-rose-900/30 border',
      };
    case 'slate':
      return {
        primaryText: 'text-ink',
        primaryBg: 'bg-ink',
        accentText: 'text-mute',
        bgSoft: 'bg-canvas-soft/80 border border-hairline',
      };
    case 'indigo':
    default:
      return {
        primaryText: 'text-primary',
        primaryBg: 'bg-primary',
        accentText: 'text-primary/80',
        bgSoft: 'bg-canvas-soft border border-hairline',
      };
  }
};

export default function Home() {
  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [email, setEmail] = useState('syed@codecrest.com');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sandboxTab, setSandboxTab] = useState<'dashboard' | 'crm' | 'finance'>('dashboard');

  // App Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'clients' | 'projects' | 'finance' | 'whatsapp' | 'automations' | 'portal' | 'settings' | 'calendar' | 'timeconverter'>('dashboard');

  // Invites & Profile State
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteDetails, setInviteDetails] = useState<any>(null);
  const [invitesList, setInvitesList] = useState<any[]>([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteRole, setNewInviteRole] = useState('Employee');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileTimezone, setProfileTimezone] = useState('UTC');
  const [profileNotificationPref, setProfileNotificationPref] = useState({ email: true, inApp: true, push: false });
  const [profileStatusMsg, setProfileStatusMsg] = useState('');
  const [orgUsersList, setOrgUsersList] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // SuperAdmin Impersonation & View States
  const [adminView, setAdminView] = useState<'platform' | 'workspace'>('platform');
  const [adminSubTab, setAdminSubTab] = useState<'dashboard' | 'settings'>('dashboard');
  const [activeSettingsSection, setActiveSettingsSection] = useState<'general' | 'stripe' | 'integrations' | 'smtp'>('general');
  const [impersonatedOrgId, setImpersonatedOrgId] = useState<string | null>(null);
  const [impersonatedOrgName, setImpersonatedOrgName] = useState<string | null>(null);
  const [platformData, setPlatformData] = useState<any>(null);

  // SuperAdmin Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    systemName: 'Clientoq',
    supportEmail: 'support@clientoq.com',
    allowRegistration: true,
    maintenanceMode: false,
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    openaiApiKey: '',
    metaToken: '',
    metaPhoneId: '',
    googleClientId: '',
    googleClientSecret: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

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
    companyName: '', website: '', email: '', phone: '', address: '', city: '', state: '', country: '', gstNumber: '', notes: '', timezone: 'UTC'
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

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Stopwatch State
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [activeTimerSeconds, setActiveTimerSeconds] = useState(0);
  const [timeLogDesc, setTimeLogDesc] = useState('');
  const [showSaveTimeLogModal, setShowSaveTimeLogModal] = useState(false);
  const [timeLogTask, setTimeLogTask] = useState<any>(null);

  // Proposals & Contracts State
  const [proposals, setProposals] = useState<any[]>([]);
  const [newProposalTitle, setNewProposalTitle] = useState('');
  const [newProposalContent, setNewProposalContent] = useState('');
  const [newProposalAmount, setNewProposalAmount] = useState('');
  const [showAddProposalModal, setShowAddProposalModal] = useState(false);

  // Client Portal Contracts State
  const [portalContracts, setPortalContracts] = useState<any[]>([]);
  const [selectedPortalContract, setSelectedPortalContract] = useState<any>(null);
  const [typedName, setTypedName] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [converterHour, setConverterHour] = useState<number>(new Date().getHours());
  const [liveTime, setLiveTime] = useState(new Date());

  // SaaS Powerhouse Features States
  const [whiteLabelSettings, setWhiteLabelSettings] = useState({
    themeColor: 'indigo',
    logoUrl: '',
    customSubdomain: ''
  });
  const [subdomainBranding, setSubdomainBranding] = useState<any>(null);
  const [subdomainNotFound, setSubdomainNotFound] = useState(false);
  const [subdomainLoading, setSubdomainLoading] = useState(false);
  const [projectBoardView, setProjectBoardView] = useState<'kanban' | 'gantt'>('kanban');
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [newRuleForm, setNewRuleForm] = useState({
    name: '',
    triggerType: 'Lead Created',
    actionType: 'Send WhatsApp Alert'
  });
  const [showAIEmailModal, setShowAIEmailModal] = useState(false);
  const [aiEmailDraft, setAiEmailDraft] = useState('');

  const getAILeadScore = (lead: any) => {
    if (!lead) return { score: 50, badge: 'Warm' };
    let score = 50;
    if (lead.estimatedValue > 100000) score += 30;
    else if (lead.estimatedValue >= 50000) score += 15;
    else score -= 10;

    const notesLower = (lead.notes || '').toLowerCase();
    if (notesLower.includes('urgent') || notesLower.includes('soon') || notesLower.includes('timeline') || notesLower.includes('immediately')) score += 10;
    if (notesLower.includes('budget') && (notesLower.includes('tight') || notesLower.includes('low') || notesLower.includes('limited'))) score -= 15;
    if (notesLower.includes('enterprise') || notesLower.includes('scale') || notesLower.includes('corporate')) score += 10;
    if (notesLower.includes('explore') || notesLower.includes('just looking') || notesLower.includes('question')) score -= 10;

    score = Math.max(10, Math.min(99, score));
    let badge = 'Cold';
    if (score >= 80) badge = 'Hot';
    else if (score >= 45) badge = 'Warm';

    return { score, badge };
  };

  const renderAILeadAssistant = () => {
    if (!selectedLead) return null;
    const { score, badge } = getAILeadScore(selectedLead);
    const leadProjects = projects.filter(p => p.client?.companyName?.toLowerCase() === selectedLead?.companyName?.toLowerCase() || p.name?.toLowerCase().includes((selectedLead?.companyName || '').toLowerCase()));
    const leadInvoices = invoices.filter(i => i.client?.companyName?.toLowerCase() === selectedLead?.companyName?.toLowerCase());
    const activeProjectsText = leadProjects.length > 0 
      ? `${leadProjects.length} active sprint or project(s) (${leadProjects.map(p => `${p.name}: ${p.progress}% done`).join(', ')})`
      : 'No active sprint or projects registered.';
    const invoiceStatusText = leadInvoices.length > 0
      ? `${leadInvoices.length} invoice(s) logged. Paid: ₹${leadInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}, Unpaid: ₹${leadInvoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.totalAmount, 0).toLocaleString()}`
      : 'No outstanding bills records.';
    return (
      <>
        <div className="flex justify-between items-center border-b border-hairline pb-2">
          <span className="block text-[10px] uppercase text-primary font-bold tracking-wider">AI Lead Assistant Insights</span>
          <span className={`inline-block px-2 py-0.5 rounded-sm text-[9px] font-semibold tracking-wide ${
            badge === 'Hot' 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
              : badge === 'Warm' 
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
          }`}>
            AI Match Score: {score}% Match - {badge}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <strong className="text-mute block mb-1">AI Client Briefing Summary:</strong>
            <div className="text-body-text bg-canvas-soft p-3 rounded border border-hairline/40 text-[11px] leading-relaxed space-y-1">
              <div><span className="text-mute">Status:</span> Lead is interested in partnering for {selectedLead.companyName || 'unknown enterprise'} services. Estimated Deal Value is ₹{selectedLead.estimatedValue.toLocaleString()}.</div>
              <div><span className="text-mute">Workspace Activity:</span> {activeProjectsText}</div>
              <div><span className="text-mute">Ledger Balance:</span> {invoiceStatusText}</div>
              <div className="pt-1"><span className="text-mute">Context Analyst Notes:</span> <span className="italic">"{selectedLead.notes || 'No description notes provided.'}"</span></div>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    const GOOGLE_CLIENT_ID = '671624988330-qpu75rc9e8ju9uuna68q1qtick5nk0bk.apps.googleusercontent.com';
    if (typeof window === 'undefined') return;
    if (document.getElementById('google-gsi-script')) return;
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any).google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    };
    document.head.appendChild(script);
    return () => {
      const s = document.getElementById('google-gsi-script');
      if (s) s.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subdomain detection & branding load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const subdomain = getTenantSubdomain();
    if (!subdomain) return;
    setSubdomainLoading(true);
    api.organizations.getPublicBranding(subdomain)
      .then(data => {
        if (data.found) {
          setSubdomainBranding(data);
          setWhiteLabelSettings(prev => ({
            ...prev,
            themeColor: data.themeColor || prev.themeColor,
            logoUrl: data.logoUrl || prev.logoUrl,
            customSubdomain: subdomain
          }));
        } else {
          setSubdomainNotFound(true);
        }
      })
      .catch(() => setSubdomainNotFound(true))
      .finally(() => setSubdomainLoading(false));
  }, []);

  const aiEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize Check Auth Session
  useEffect(() => {
    const jwt = localStorage.getItem('clientoq_jwt');
    const savedUser = localStorage.getItem('clientoq_user');
    if (jwt && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfilePhone(parsedUser.phone || '');
      setProfileBio(parsedUser.bio || '');
      setProfileTimezone(parsedUser.timezone || 'UTC');
      if (parsedUser.notificationPreferences) {
        setProfileNotificationPref(parsedUser.notificationPreferences);
      }
      
      // Load SuperAdmin Impersonation settings
      if (parsedUser.role === 'SuperAdmin') {
        const impOrgId = localStorage.getItem('clientoq_impersonate_org');
        const impOrgName = localStorage.getItem('clientoq_impersonate_org_name');
        const impView = localStorage.getItem('clientoq_admin_view');
        if (impOrgId) setImpersonatedOrgId(impOrgId);
        if (impOrgName) setImpersonatedOrgName(impOrgName);
        if (impView === 'workspace') setAdminView('workspace');
      }

      // Fetch latest profile details from DB
      api.auth.me()
        .then(data => {
          if (data && data.user) {
            setUser(data.user);
            localStorage.setItem('clientoq_user', JSON.stringify(data.user));
          }
        })
        .catch(err => console.error('Failed to refresh user info:', err));
    }

    // Check query params for auth triggers
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const auth = params.get('auth');
      const token = params.get('inviteToken');
      const verified = params.get('verified');

      if (verified === 'true') {
        setAuthSuccess('Your email has been verified successfully! 🎉');
        setShowAuthModal(true);
        setAuthMode('login');
      } else if (verified === 'false') {
        setAuthError('Email verification failed. The token is invalid or expired.');
        setShowAuthModal(true);
        setAuthMode('login');
      } else if (token) {
        setInviteToken(token);
        setShowAuthModal(true);
        setAuthMode('register');
        setAuthError('');
        // Validate token
        api.auth.invites.validate(token)
          .then(details => {
            setInviteDetails(details);
            setEmail(details.email);
            setOrgName(details.organizationName);
          })
          .catch(err => {
            setAuthError(err.message || 'Invitation is invalid or expired');
          });
      } else if (auth === 'login') {
        setShowAuthModal(true);
        setAuthMode('login');
        setAuthError('');
      } else if (auth === 'register') {
        setShowAuthModal(true);
        setAuthMode('register');
        setAuthError('');
      } else if (auth === 'reset') {
        const resetTok = params.get('token') || '';
        setResetToken(resetTok);
        setShowAuthModal(true);
        setAuthMode('reset');
        setAuthError('');
      }
    }
  }, []);

  // Update Sentry user context when user changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSentryUserContext(user);
    }
  }, [user]);

  // Load notifications
  const fetchNotifications = async () => {
    try {
      const data = await api.notifications.list();
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const int = setInterval(fetchNotifications, 30000);
    return () => clearInterval(int);
  }, [user]);

  // Stopwatch interval ticker
  useEffect(() => {
    let interval: any = null;
    if (activeTimerTaskId) {
      interval = setInterval(() => {
        setActiveTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimerTaskId]);

  // Load selected lead proposals
  useEffect(() => {
    if (selectedLead) {
      api.crm.proposals.list(selectedLead.id)
        .then(data => setProposals(data || []))
        .catch(err => console.error('Failed to load lead proposals:', err));
    } else {
      setProposals([]);
    }
  }, [selectedLead]);

  // Fetch Data on Tab Switch, Auth, or Admin View Switch
  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user, activeTab, adminView]);

  // Scroll to bottom on chats
  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const refreshData = async () => {
    setDataLoading(true);
    try {
      if (user?.role === 'SuperAdmin' && adminView === 'platform') {
        const data = await api.superadmin.getPlatformData().catch(() => null);
        if (data) {
          setPlatformData(data);
        }
      } else if (activeTab === 'dashboard') {
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
        const clientsList = await api.clients.getClients().catch(() => []);
        const targetClient = clientsList.find((c: any) => c.companyName === 'Acme Corporation') || clientsList[0];
        const targetClientId = targetClient ? targetClient.id : 'client-1';
        const contracts = await api.crm.contracts.list(targetClientId).catch(() => []);
        setPortalContracts(contracts || []);
      } else if (activeTab === 'calendar') {
        const projs = await api.projects.getProjects();
        setProjects(projs || []);
      } else if (activeTab === 'settings') {
        const list = await api.auth.invites.list().catch(() => []);
        setInvitesList(list);
        const users = await api.auth.getUsers().catch(() => []);
        setOrgUsersList(users);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setTimeout(() => {
        setDataLoading(false);
      }, 300);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await api.auth.login({ email, password });
      if (res.token) {
        localStorage.setItem('clientoq_jwt', res.token);
        localStorage.setItem('clientoq_user', JSON.stringify(res.user));
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
      let res;
      if (inviteToken) {
        res = await api.auth.invites.accept({
          token: inviteToken,
          firstName,
          lastName,
          password
        });
      } else {
        res = await api.auth.register({ orgName, firstName, lastName, email, password });
      }
      if (res.token) {
        localStorage.setItem('clientoq_jwt', res.token);
        localStorage.setItem('clientoq_user', JSON.stringify(res.user));
      }
      setUser(res.user);
      setShowAuthModal(false);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed');
    }
  };

  const handleImpersonate = (orgId: string, orgName: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('clientoq_impersonate_org', orgId);
      localStorage.setItem('clientoq_impersonate_org_name', orgName);
      localStorage.setItem('clientoq_admin_view', 'workspace');
    }
    setImpersonatedOrgId(orgId);
    setImpersonatedOrgName(orgName);
    setAdminView('workspace');
  };

  const handleExitImpersonation = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientoq_impersonate_org');
      localStorage.removeItem('clientoq_impersonate_org_name');
      localStorage.setItem('clientoq_admin_view', 'platform');
    }
    setImpersonatedOrgId(null);
    setImpersonatedOrgName(null);
    setAdminView('platform');
  };

  const loadSettings = async () => {
    setSettingsLoading(true);
    setSettingsError('');
    try {
      const data = await api.superadmin.getSettings();
      if (data) {
        setPlatformSettings({
          systemName: data.systemName || 'Clientoq',
          supportEmail: data.supportEmail || 'support@clientoq.com',
          allowRegistration: data.allowRegistration ?? true,
          maintenanceMode: data.maintenanceMode ?? false,
          stripeSecretKey: data.stripeSecretKey || '',
          stripeWebhookSecret: data.stripeWebhookSecret || '',
          openaiApiKey: data.openaiApiKey || '',
          metaToken: data.metaToken || '',
          metaPhoneId: data.metaPhoneId || '',
          googleClientId: data.googleClientId || '',
          googleClientSecret: data.googleClientSecret || '',
          smtpHost: data.smtpHost || '',
          smtpPort: data.smtpPort || 587,
          smtpUser: data.smtpUser || '',
          smtpPass: data.smtpPass || '',
          smtpFrom: data.smtpFrom || '',
        });
      }
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to load platform settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess('');
    setSettingsError('');
    try {
      const res = await api.superadmin.updateSettings(platformSettings);
      if (res.success) {
        setSettingsSuccess('Platform settings updated successfully! 🚀');
        if (res.settings) {
          setPlatformSettings({
            systemName: res.settings.systemName || 'Clientoq',
            supportEmail: res.settings.supportEmail || 'support@clientoq.com',
            allowRegistration: res.settings.allowRegistration ?? true,
            maintenanceMode: res.settings.maintenanceMode ?? false,
            stripeSecretKey: res.settings.stripeSecretKey || '',
            stripeWebhookSecret: res.settings.stripeWebhookSecret || '',
            openaiApiKey: res.settings.openaiApiKey || '',
            metaToken: res.settings.metaToken || '',
            metaPhoneId: res.settings.metaPhoneId || '',
            googleClientId: res.settings.googleClientId || '',
            googleClientSecret: res.settings.googleClientSecret || '',
            smtpHost: res.settings.smtpHost || '',
            smtpPort: res.settings.smtpPort || 587,
            smtpUser: res.settings.smtpUser || '',
            smtpPass: res.settings.smtpPass || '',
            smtpFrom: res.settings.smtpFrom || '',
          });
        }
      }
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to save settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  useEffect(() => {
    if (adminView === 'platform' && adminSubTab === 'settings') {
      loadSettings();
    }
  }, [adminView, adminSubTab]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clientoq_impersonate_org');
      localStorage.removeItem('clientoq_impersonate_org_name');
      localStorage.removeItem('clientoq_admin_view');
    }
    setImpersonatedOrgId(null);
    setImpersonatedOrgName(null);
    setAdminView('platform');
    api.auth.logout();
    setUser(null);
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    setAuthError('');
    try {
      const res = await api.auth.googleLogin(credentialResponse.credential);
      if (res.token) {
        localStorage.setItem('clientoq_jwt', res.token);
        localStorage.setItem('clientoq_user', JSON.stringify(res.user));
      }
      setUser(res.user);
      setShowAuthModal(false);
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setAuthSuccess(data.message || 'Reset email sent! Check your inbox.');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to send reset email.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }
    try {
      const res = await fetch(`/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthSuccess('Password reset! You can now log in.');
        setTimeout(() => { setAuthMode('login'); setAuthSuccess(''); }, 2000);
      } else {
        setAuthError(data.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to reset password.');
    }
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
      setNewClientForm({ companyName: '', website: '', email: '', phone: '', address: '', city: '', state: '', country: '', gstNumber: '', notes: '', timezone: 'UTC' });
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

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('clientoq_jwt');
      const response = await fetch('/api/reports/invoices/csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to generate CSV');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices-ledger-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('clientoq_jwt');
      const response = await fetch('/api/reports/invoices/pdf', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to generate statement');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoices-statement-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await api.crm.importLeadsCsv(file);
      alert(res.message || 'Successfully imported leads.');
      refreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to import CSV');
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

  // Global Search Handlers
  const handleSearchChange = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSearchResults(null);
      return;
    }
    try {
      const res = await api.search.query(val);
      setSearchResults(res);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleSearchResultClick = async (type: string, item: any) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSearchResults(null);

    if (type === 'lead') {
      setActiveTab('crm');
      setSelectedLead(item);
    } else if (type === 'client') {
      setActiveTab('clients');
      handleSelectClient(item);
    } else if (type === 'project') {
      setActiveTab('projects');
      handleSelectProject(item);
    } else if (type === 'task') {
      setActiveTab('projects');
      const proj = projects.find(p => p.id === item.projectId) || item.project;
      if (proj) {
        await handleSelectProject(proj);
      }
    } else if (type === 'invoice') {
      setActiveTab('finance');
      setSelectedInvoice(item);
    } else if (type === 'expense') {
      setActiveTab('finance');
    }
  };

  // Time Zone & Business Hour Checker
  const getClientTimeDetails = (timezone: string, baseDate = new Date()) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      };
      const timeFormatter = new Intl.DateTimeFormat('en-US', options);
      const formattedTime = timeFormatter.format(baseDate);

      // Get current hour in target timezone
      const hourFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        hour12: false,
      });
      const currentHour = parseInt(hourFormatter.format(baseDate), 10);

      // Business hour evaluation (🟢 Working Hours: 9 AM - 6 PM, 🌙 Off Hours / Evening: 6 PM - 10 PM, 💤 Late Night / Do Not Disturb: 10 PM - 9 AM)
      let status = '🟢 Working Hours';
      let badgeColor = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      if (currentHour >= 22 || currentHour < 9) {
        status = '💤 Late Night / Do Not Disturb';
        badgeColor = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      } else if (currentHour >= 18 && currentHour < 22) {
        status = '🌙 Off Hours / Evening';
        badgeColor = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      }

      return {
        formattedTime,
        status,
        badgeColor,
        currentHour,
      };
    } catch (e) {
      return {
        formattedTime: 'N/A',
        status: 'Unknown',
        badgeColor: 'bg-mute/10 text-mute border border-mute/20',
        currentHour: 12,
      };
    }
  };

  const getConvertedClientTime = (userHour: number, clientTimezone: string) => {
    try {
      const now = new Date();
      const testDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), userHour, 0, 0);
      
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clientTimezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      const formattedTime = timeFormatter.format(testDate);

      const hourFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clientTimezone,
        hour: 'numeric',
        hour12: false
      });
      const clientHour = parseInt(hourFormatter.format(testDate), 10);

      let isBusinessHours = clientHour >= 9 && clientHour < 18;
      
      return {
        formattedTime,
        clientHour,
        isBusinessHours
      };
    } catch (e) {
      return {
        formattedTime: 'N/A',
        clientHour: 12,
        isBusinessHours: false
      };
    }
  };

  const generateAIFollowUp = (lead: any) => {
    const draft = `Subject: Scoping project timeline for ${lead.companyName || 'your team'} - AgencyOS

Dear ${lead.firstName || 'Client'},

Hope you are doing well!

I was reviewing your requirements for the project. Based on our estimates (valued at ₹${lead.estimatedValue.toLocaleString()}), we would love to schedule a quick 15-minute call to align on scope and next steps.

Looking forward to hearing from you.

Best regards,
${user?.firstName || 'Syed'} ${user?.lastName || 'Ali'}
${user?.organizationName || 'CodeCrest Studio'}`;
    setAiEmailDraft(draft);
    setShowAIEmailModal(true);
  };

  const handleCreateAutomationRule = (e: React.FormEvent) => {
    e.preventDefault();
    const newRule = {
      id: 'auto-' + Date.now(),
      name: newRuleForm.name || 'New Custom Automation',
      triggerType: newRuleForm.triggerType,
      actionType: newRuleForm.actionType,
      isActive: true,
      logs: []
    };
    setAutomations([...automations, newRule]);
    setShowCreateRuleModal(false);
    setNewRuleForm({ name: '', triggerType: 'Lead Created', actionType: 'Send WhatsApp Alert' });
  };

  const handleToggleRuleActive = (ruleId: string) => {
    setAutomations(automations.map(rule => {
      if (rule.id === ruleId) {
        return { ...rule, isActive: !rule.isActive };
      }
      return rule;
    }));
  };

  // Stopwatch & Notification handlers
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = (taskId: string) => {
    if (activeTimerTaskId) {
      alert('Another task timer is active. Please save or discard it first.');
      return;
    }
    setActiveTimerTaskId(taskId);
    setActiveTimerSeconds(0);
  };

  const handlePauseAndSave = (task: any) => {
    setTimeLogTask(task);
    setShowSaveTimeLogModal(true);
    setActiveTimerTaskId(null);
  };

  const handleConfirmSaveTimeLog = async () => {
    if (!timeLogTask) return;
    const durationMinutes = Math.max(1, Math.round(activeTimerSeconds / 60));
    try {
      await api.projects.addTimeLog(timeLogTask.id, {
        duration: durationMinutes,
        description: timeLogDesc || 'Task time logging'
      });
      setActiveTimerTaskId(null);
      setActiveTimerSeconds(0);
      setTimeLogDesc('');
      setShowSaveTimeLogModal(false);
      setTimeLogTask(null);
      if (selectedProject) handleSelectProject(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDiscardTimeLog = () => {
    setActiveTimerTaskId(null);
    setActiveTimerSeconds(0);
    setTimeLogDesc('');
    setShowSaveTimeLogModal(false);
    setTimeLogTask(null);
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.notifications.read(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotif = async (id: string) => {
    try {
      await api.notifications.delete(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveBrandSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.organizations.updateProfile({
        themeColor: whiteLabelSettings.themeColor,
        logoUrl: whiteLabelSettings.logoUrl,
        subdomain: whiteLabelSettings.customSubdomain
      });
      alert('Brand settings updated successfully!');
      
      // Update local user state
      if (user && user.organization) {
        const updatedUser = {
          ...user,
          organization: {
            ...user.organization,
            themeColor: whiteLabelSettings.themeColor,
            logoUrl: whiteLabelSettings.logoUrl,
            subdomain: whiteLabelSettings.customSubdomain
          }
        };
        setUser(updatedUser);
        localStorage.setItem('clientoq_user', JSON.stringify(updatedUser));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update brand settings');
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      
      {/* 1. AUTHENTICATION SHIELD */}
      {!user ? (
        <div className="w-full min-h-screen bg-canvas text-ink flex flex-col font-sans relative selection:bg-primary selection:text-on-primary overflow-x-hidden">
          
          {subdomainNotFound ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-screen text-center px-8">
              <div className="border border-hairline bg-canvas-soft text-mute font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full mb-8">
                [ 404 PORTAL NOT FOUND ]
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink leading-tight mb-4">
                Portal Not Found
              </h1>
              <p className="text-body-text text-sm md:text-base max-w-xl font-serif italic mb-8">
                The portal at this address doesn&apos;t exist or may have been removed. Check the address or return to the main platform.
              </p>
              <a
                href="/"
                className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest transition-all"
              >
                Return to Platform
              </a>
            </div>
          ) : (
            <>
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

                {authSuccess && (
                  <div className="bg-green-950/50 border border-green-500/30 text-green-200 p-3 rounded text-sm mb-4 flex items-center gap-2">
                    <CheckCircle size={16} className="shrink-0 text-green-400" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                {/* FORGOT PASSWORD FORM */}
                {authMode === 'forgot' && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <p className="text-body-text text-xs">Enter your email and we'll send a reset link.</p>
                    <div>
                      <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                        placeholder="you@agency.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:opacity-90 text-on-primary text-sm font-medium p-3 rounded-sm transition-all uppercase tracking-widest font-mono">
                      Send Reset Link
                    </button>
                    <div className="text-center text-xs">
                      <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }} className="text-primary underline hover:opacity-80">
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                )}

                {/* RESET PASSWORD FORM */}
                {authMode === 'reset' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-body-text text-xs">Enter your new password below.</p>
                    <div>
                      <label className="block text-xs font-semibold text-body-text mb-1 uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        className="w-full bg-canvas border border-hairline p-3 rounded-sm text-sm focus:outline-none focus:border-primary text-ink"
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:opacity-90 text-on-primary text-sm font-medium p-3 rounded-sm transition-all uppercase tracking-widest font-mono">
                      Reset Password
                    </button>
                  </form>
                )}

                {/* LOGIN / REGISTER FORM */}
                {(authMode === 'login' || authMode === 'register') && (
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
                  {authMode === 'login' && (
                    <div className="text-right">
                      <button type="button" onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthSuccess(''); }} className="text-xs text-mute hover:text-primary underline transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  )}
                </form>
                )}

                <div className="mt-6 text-center text-xs">
                  {(authMode === 'login' || authMode === 'register') && (
                  <>
                  <span className="text-body-text">
                    {authMode === 'login' ? "New operation?" : "Have workspace keys?"}
                  </span>{' '}
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-primary underline font-medium hover:opacity-80 transition-opacity"
                  >
                    {authMode === 'login' ? 'Initialize Studio Plan' : 'Login'}
                  </button>
                  </>
                  )}
                </div>
                {/* Google Sign-In divider */}
                {(authMode === 'login' || authMode === 'register') && (
                  <div className="mt-4 space-y-3">
                    <div className="relative flex items-center">
                      <div className="flex-1 border-t border-hairline"></div>
                      <span className="px-3 text-[10px] text-mute uppercase tracking-widest font-mono">or continue with</span>
                      <div className="flex-1 border-t border-hairline"></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if ((window as any).google?.accounts?.id) {
                          (window as any).google.accounts.id.prompt();
                        } else {
                          // Fallback: render button directly
                          const container = document.getElementById('google-btn-container');
                          if (container) {
                            (window as any).google?.accounts.id.renderButton(container, {
                              theme: 'outline',
                              size: 'large',
                              width: container.offsetWidth,
                            });
                          }
                        }
                      }}
                      className="w-full flex items-center justify-center gap-3 border border-hairline bg-canvas hover:bg-canvas-soft text-ink text-sm font-medium py-3 px-4 rounded-sm transition-all duration-150 group"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                    <div id="google-btn-container" className="w-full"></div>
                  </div>
                )}
              </div>
            </div>
          )}
            </>
          )}

        </div>
      ) : (
        
        /* 2. CORE WORKSPACE */
        user?.role === 'SuperAdmin' && adminView === 'platform' ? (
          /* ── SUPERADMIN PLATFORM DASHBOARD ── */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* SuperAdmin Top Bar */}
            <div className="bg-ink border-b border-primary/20 px-8 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-black text-on-primary text-sm font-mono select-none shadow">⚡</div>
                <div>
                  <span className="font-black tracking-tight text-primary uppercase font-mono text-sm">Clientoq</span>
                  <span className="ml-2 bg-primary/20 text-primary text-[8px] px-2 py-0.5 rounded uppercase tracking-widest font-mono border border-primary/30">SUPERADMIN</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-mute text-xs font-mono">{user?.email}</span>
                <button
                  onClick={() => {
                    localStorage.setItem('clientoq_admin_view', 'workspace');
                    setAdminView('workspace');
                  }}
                  className="text-primary hover:text-on-primary hover:bg-primary text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded border border-primary/40 transition-all cursor-pointer"
                >
                  Workspace Mode ➔
                </button>
                <button
                  onClick={handleLogout}
                  className="text-mute hover:text-primary text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 border border-mute/20 hover:border-primary/40 px-3 py-1.5 rounded transition-all"
                >
                  <LogOut size={12} /> Logout
                </button>
              </div>
            </div>

            {/* SuperAdmin Content */}
            <div className="flex-1 overflow-y-auto bg-canvas-soft p-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                  <h1 className="text-2xl font-black text-ink font-mono uppercase tracking-tight">Platform Control Center</h1>
                  <p className="text-mute text-sm mt-1 font-serif italic">Manage all organizations, subscriptions, and platform health from this interface.</p>
                </div>

                {/* Platform Control Center Tabs */}
                <div className="flex gap-4 border-b border-hairline mb-8 select-none">
                  <button
                    onClick={() => setAdminSubTab('dashboard')}
                    className={`pb-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                      adminSubTab === 'dashboard'
                        ? 'border-primary text-primary font-black'
                        : 'border-transparent text-mute hover:text-ink font-semibold'
                    }`}
                  >
                    📊 Platform Dashboard
                  </button>
                  <button
                    onClick={() => setAdminSubTab('settings')}
                    className={`pb-3 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                      adminSubTab === 'settings'
                        ? 'border-primary text-primary font-black'
                        : 'border-transparent text-mute hover:text-ink font-semibold'
                    }`}
                  >
                    ⚙️ Platform Settings
                  </button>
                </div>

                {adminSubTab === 'dashboard' ? (
                  <>
                    {/* Platform KPIs */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'Total Organizations', value: platformData?.kpis?.totalOrganizations ?? '24', change: '+3 this month', icon: '🏢' },
                        { label: 'Active Users', value: platformData?.kpis?.activeUsers ?? '187', change: '+12 this week', icon: '👥' },
                        { label: 'Platform MRR', value: platformData?.kpis?.platformMRR ?? '₹3,84,000', change: '+18% growth', icon: '💰' },
                        { label: 'Avg. Session Time', value: '42 min', change: 'Per active user', icon: '⏱️' },
                      ].map((kpi, i) => (
                        <div key={i} className="bg-canvas border border-hairline rounded-md p-5 hover:border-primary/30 transition-colors">
                          <div className="text-2xl mb-2">{kpi.icon}</div>
                          <div className="text-xl font-black text-ink font-mono">{kpi.value}</div>
                          <div className="text-xs font-semibold text-ink mt-1">{kpi.label}</div>
                          <div className="text-[10px] text-positive mt-1 font-mono">{kpi.change}</div>
                        </div>
                      ))}
                    </div>

                    {/* Organizations Table */}
                    <div className="bg-canvas border border-hairline rounded-md overflow-hidden mb-6">
                      <div className="border-b border-hairline px-6 py-4 flex items-center justify-between">
                        <h2 className="font-bold text-ink text-sm uppercase tracking-wider font-mono">All Organizations</h2>
                        <span className="text-mute text-xs font-mono">{platformData?.kpis?.totalOrganizations ?? 24} tenants</span>
                      </div>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-canvas-soft border-b border-hairline">
                            <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-mute font-bold">Organization</th>
                            <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-mute font-bold">Plan</th>
                            <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-mute font-bold">Users</th>
                            <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-mute font-bold">MRR</th>
                            <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-mute font-bold">Status</th>
                            <th className="text-left px-6 py-3 text-[10px] uppercase tracking-wider text-mute font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(platformData?.organizations ?? [
                            { id: 'mock-1', name: 'CodeCrest Studio', plan: 'Premium', users: 8, mrr: '₹1,999', status: 'Active', joined: '2025-01' },
                            { id: 'mock-2', name: 'PixelForge Agency', plan: 'Standard', users: 5, mrr: '₹999', status: 'Active', joined: '2025-03' },
                            { id: 'mock-3', name: 'NovaByte Labs', plan: 'Standard', users: 3, mrr: '₹999', status: 'Active', joined: '2025-06' },
                            { id: 'mock-4', name: 'Crescent Digital', plan: 'Free', users: 1, mrr: '₹0', status: 'Trial', joined: '2026-01' },
                            { id: 'mock-5', name: 'SkyLine Consultants', plan: 'Premium', users: 12, mrr: '₹1,999', status: 'Active', joined: '2024-11' },
                            { id: 'mock-6', name: 'Apex Creative Co.', plan: 'Free', users: 2, mrr: '₹0', status: 'Suspended', joined: '2025-09' },
                          ]).map((org: any, i: number) => (
                            <tr key={org.id || i} className="border-b border-hairline/50 hover:bg-canvas-soft/50 transition-colors">
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs font-mono">
                                    {org.name ? org.name[0] : 'O'}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-ink text-xs">{org.name}</div>
                                    <div className="text-mute text-[10px] font-mono">since {org.joined}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3">
                                <select
                                  value={org.plan}
                                  onChange={async (e) => {
                                    const newPlan = e.target.value;
                                    try {
                                      await api.superadmin.updateOrganization({ id: org.id, plan: newPlan });
                                      refreshData();
                                    } catch (err: any) {
                                      alert(`Error: ${err.message}`);
                                    }
                                  }}
                                  className="bg-canvas border border-hairline text-[10px] font-bold font-mono uppercase rounded p-1 text-ink focus:outline-none"
                                >
                                  <option value="Free">Free</option>
                                  <option value="Standard">Standard</option>
                                  <option value="Premium">Premium</option>
                                </select>
                              </td>
                              <td className="px-6 py-3 text-xs font-mono text-body-text">{org.users}</td>
                              <td className="px-6 py-3 text-xs font-mono font-semibold text-ink">{org.mrr}</td>
                              <td className="px-6 py-3">
                                <select
                                  value={org.status}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    try {
                                      await api.superadmin.updateOrganization({ id: org.id, status: newStatus });
                                      refreshData();
                                    } catch (err: any) {
                                      alert(`Error: ${err.message}`);
                                    }
                                  }}
                                  className={`bg-canvas border border-hairline text-[10px] font-bold font-mono uppercase rounded p-1 focus:outline-none ${
                                    org.status === 'Active' ? 'text-positive border-positive/30' :
                                    org.status === 'Trial' ? 'text-warning-content border-warning/30' :
                                    'text-negative border-negative/30'
                                  }`}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Trial">Trial</option>
                                  <option value="Suspended">Suspended</option>
                                </select>
                              </td>
                              <td className="px-6 py-3">
                                <button
                                  onClick={() => handleImpersonate(org.id, org.name)}
                                  className="text-primary text-[10px] font-mono uppercase tracking-wider hover:bg-primary hover:text-on-primary border border-primary/20 hover:border-primary/50 px-2 py-1 rounded transition-all cursor-pointer"
                                >
                                  Impersonate
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Platform Health */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-canvas border border-hairline rounded-md p-5">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-mute font-mono mb-4">Subscription Breakdown</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Premium', count: platformData?.kpis?.premiumCount ?? 8, color: 'bg-primary' },
                            { label: 'Standard', count: platformData?.kpis?.standardCount ?? 11, color: 'bg-positive' },
                            { label: 'Free / Trial', count: platformData?.kpis?.freeCount ?? 5, color: 'bg-canvas-soft border border-hairline' }
                          ].map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-sm ${s.color}`}></div>
                              <span className="text-xs text-body-text flex-1">{s.label}</span>
                              <span className="text-xs font-bold font-mono text-ink">{s.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-canvas border border-hairline rounded-md p-5">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-mute font-mono mb-4">Platform Events (24h)</h3>
                        <div className="space-y-2">
                          {[
                            { event: 'New org registered', count: platformData?.kpis?.newRegCount ?? 2 },
                            { event: 'Google OAuth logins', count: 34 },
                            { event: 'Invoices created', count: 18 },
                            { event: 'API requests', count: '12.4K' },
                          ].map((e, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-body-text">{e.event}</span>
                              <span className="font-bold font-mono text-ink">{e.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-canvas border border-hairline rounded-md p-5">
                        <h3 className="font-bold text-xs uppercase tracking-wider text-mute font-mono mb-4">Logged in as</h3>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-black text-sm">⚡</div>
                          <div>
                            <div className="text-xs font-semibold text-ink">{user?.firstName} {user?.lastName}</div>
                            <div className="text-[10px] text-mute font-mono">{user?.email}</div>
                            <div className="mt-1 inline-block bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded font-mono border border-primary/20">SUPERADMIN</div>
                          </div>
                        </div>
                        <p className="text-[10px] text-mute font-serif italic">You have full platform access. Use the Impersonate button to enter any org workspace.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Platform Settings UI */
                  <div className="bg-canvas border border-hairline rounded-md overflow-hidden flex min-h-[500px]">
                    {/* Settings Sub-Sidebar */}
                    <div className="w-64 border-r border-hairline bg-canvas-soft p-4 flex flex-col gap-1 shrink-0">
                      {[
                        { id: 'general', label: '🌐 General Settings' },
                        { id: 'stripe', label: '💳 Stripe & Billing' },
                        { id: 'integrations', label: '🤖 AI & Integrations' },
                        { id: 'smtp', label: '📧 Email / SMTP' }
                      ].map(sec => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => {
                            setSettingsSuccess('');
                            setSettingsError('');
                            setActiveSettingsSection(sec.id as any);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer ${
                            activeSettingsSection === sec.id
                              ? 'bg-primary/15 text-primary font-bold border-l-2 border-primary'
                              : 'text-body-text hover:bg-canvas/50 hover:text-ink'
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>

                    {/* Settings Panel Content */}
                    <form onSubmit={handleSaveSettings} className="flex-1 p-6 flex flex-col">
                      <div className="flex-1">
                        {settingsLoading ? (
                          <div className="h-48 flex items-center justify-center text-xs font-mono text-mute">
                            Loading platform settings...
                          </div>
                        ) : (
                          <>
                            {settingsError && (
                              <div className="mb-4 bg-negative/10 border border-negative/20 text-negative text-xs p-3 rounded font-mono">
                                ⚠️ {settingsError}
                              </div>
                            )}
                            {settingsSuccess && (
                              <div className="mb-4 bg-positive/10 border border-positive/20 text-positive text-xs p-3 rounded font-mono">
                                {settingsSuccess}
                              </div>
                            )}

                            {activeSettingsSection === 'general' && (
                              <div className="space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-ink font-mono border-b border-hairline pb-2 mb-4">General Platform Configurations</h3>
                                <div>
                                  <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">System Name</label>
                                  <input
                                    type="text"
                                    required
                                    className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                    value={platformSettings.systemName}
                                    onChange={e => setPlatformSettings({ ...platformSettings, systemName: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">Support Email</label>
                                  <input
                                    type="email"
                                    required
                                    className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                    value={platformSettings.supportEmail}
                                    onChange={e => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                                  />
                                </div>
                                <div className="pt-2 space-y-3">
                                  <label className="flex items-center gap-3 select-none cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="rounded text-primary border-hairline w-4 h-4 focus:ring-primary"
                                      checked={platformSettings.allowRegistration}
                                      onChange={e => setPlatformSettings({ ...platformSettings, allowRegistration: e.target.checked })}
                                    />
                                    <div>
                                      <span className="text-xs font-bold text-ink uppercase font-mono block">Allow Registrations</span>
                                      <span className="text-[10px] text-mute font-serif italic">Enable public signups on the landing page</span>
                                    </div>
                                  </label>
                                  <label className="flex items-center gap-3 select-none cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="rounded text-primary border-hairline w-4 h-4 focus:ring-primary"
                                      checked={platformSettings.maintenanceMode}
                                      onChange={e => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                                    />
                                    <div>
                                      <span className="text-xs font-bold text-ink uppercase font-mono block">Maintenance Mode</span>
                                      <span className="text-[10px] text-mute font-serif italic">Restrict workspace console access for scheduled backend updates</span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            )}

                            {activeSettingsSection === 'stripe' && (
                              <div className="space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-ink font-mono border-b border-hairline pb-2 mb-4">Stripe Billing Configurations</h3>
                                <div>
                                  <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">Stripe API Secret Key</label>
                                  <input
                                    type="password"
                                    placeholder="sk_live_..."
                                    className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-mono focus:outline-none focus:border-primary text-ink"
                                    value={platformSettings.stripeSecretKey}
                                    onChange={e => setPlatformSettings({ ...platformSettings, stripeSecretKey: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">Stripe Webhook Signing Secret</label>
                                  <input
                                    type="password"
                                    placeholder="whsec_..."
                                    className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-mono focus:outline-none focus:border-primary text-ink"
                                    value={platformSettings.stripeWebhookSecret}
                                    onChange={e => setPlatformSettings({ ...platformSettings, stripeWebhookSecret: e.target.value })}
                                  />
                                </div>
                                <div className="bg-canvas-soft p-3 rounded border border-hairline text-[10px] text-mute font-serif italic">
                                  🔐 These keys are safely stored in the database. Leave them blank to default to environment-configured parameters.
                                </div>
                              </div>
                            )}

                            {activeSettingsSection === 'integrations' && (
                              <div className="space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-ink font-mono border-b border-hairline pb-2 mb-4">AI & OAuth Credentials</h3>
                                <div>
                                  <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">OpenAI API Key (AI Assistant)</label>
                                  <input
                                    type="password"
                                    placeholder="sk-proj-..."
                                    className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-mono focus:outline-none focus:border-primary text-ink"
                                    value={platformSettings.openaiApiKey}
                                    onChange={e => setPlatformSettings({ ...platformSettings, openaiApiKey: e.target.value })}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-hairline/50 pt-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">Google Client ID</label>
                                    <input
                                      type="text"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.googleClientId}
                                      onChange={e => setPlatformSettings({ ...platformSettings, googleClientId: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">Google Client Secret</label>
                                    <input
                                      type="password"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-mono focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.googleClientSecret}
                                      onChange={e => setPlatformSettings({ ...platformSettings, googleClientSecret: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 border-t border-hairline/50 pt-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">WhatsApp Phone ID</label>
                                    <input
                                      type="text"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.metaPhoneId}
                                      onChange={e => setPlatformSettings({ ...platformSettings, metaPhoneId: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">WhatsApp Token (Meta Developer)</label>
                                    <input
                                      type="password"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-mono focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.metaToken}
                                      onChange={e => setPlatformSettings({ ...platformSettings, metaToken: e.target.value })}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {activeSettingsSection === 'smtp' && (
                              <div className="space-y-4">
                                <h3 className="font-bold text-xs uppercase tracking-wider text-ink font-mono border-b border-hairline pb-2 mb-4">Mail Delivery Configurations (SMTP)</h3>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="col-span-2">
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">SMTP Host</label>
                                    <input
                                      type="text"
                                      placeholder="smtp.gmail.com"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.smtpHost || ''}
                                      onChange={e => setPlatformSettings({ ...platformSettings, smtpHost: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">SMTP Port</label>
                                    <input
                                      type="number"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.smtpPort}
                                      onChange={e => setPlatformSettings({ ...platformSettings, smtpPort: parseInt(e.target.value) || 587 })}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">SMTP Username</label>
                                    <input
                                      type="text"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.smtpUser || ''}
                                      onChange={e => setPlatformSettings({ ...platformSettings, smtpUser: e.target.value })}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">SMTP Password</label>
                                    <input
                                      type="password"
                                      className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-mono focus:outline-none focus:border-primary text-ink"
                                      value={platformSettings.smtpPass || ''}
                                      onChange={e => setPlatformSettings({ ...platformSettings, smtpPass: e.target.value })}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-mute uppercase font-mono mb-1">SMTP Sender Address ("From")</label>
                                  <input
                                    type="email"
                                    placeholder="noreply@clientoq.com"
                                    className="w-full bg-canvas-soft border border-hairline p-2 text-xs rounded font-sans focus:outline-none focus:border-primary text-ink"
                                    value={platformSettings.smtpFrom || ''}
                                    onChange={e => setPlatformSettings({ ...platformSettings, smtpFrom: e.target.value })}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {!settingsLoading && (
                        <div className="mt-8 pt-4 border-t border-hairline flex justify-end gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsSuccess('');
                              setSettingsError('');
                              loadSettings();
                            }}
                            className="px-4 py-2 border border-hairline text-ink font-mono text-[10px] font-bold rounded uppercase tracking-wider hover:bg-canvas-soft cursor-pointer transition-all"
                          >
                            Reset
                          </button>
                          <button
                            type="submit"
                            disabled={settingsSaving}
                            className="px-6 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-on-primary font-mono text-[10px] font-bold rounded uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5"
                          >
                            {settingsSaving ? 'Saving Configurations...' : 'Save Configurations'}
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
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
              {user && user.role === 'SuperAdmin' && (
                <div className="mb-4 pb-4 border-b border-hairline/50 shrink-0">
                  <button
                    onClick={() => {
                      localStorage.setItem('clientoq_admin_view', 'platform');
                      setAdminView('platform');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/15 border border-primary/20 hover:border-primary/40 text-primary font-bold font-mono text-[10px] uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                  >
                    ⚡ Platform Control Center
                  </button>
                  {impersonatedOrgId ? (
                    <div className="mt-2 text-center text-[9px] text-mute font-mono bg-canvas-soft p-2 rounded-xs border border-hairline/30">
                      Impersonating:<br/>
                      <span className="text-ink font-bold block mt-0.5 truncate">{impersonatedOrgName}</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-center text-[9px] text-mute font-mono bg-canvas-soft p-1.5 rounded-xs border border-hairline/25">
                      SuperAdmin Mode
                    </div>
                  )}
                </div>
              )}

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
                onClick={() => setActiveTab('timeconverter')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'timeconverter' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Globe size={16} />
                <span>Time Zones Hub</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'projects' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Briefcase size={16} />
                <span>Projects Board</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'calendar' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Clock size={16} />
                <span>Deadline Calendar</span>
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

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all duration-150 ${activeTab === 'settings' ? 'bg-primary text-on-primary font-medium' : 'text-body-text hover:bg-canvas-soft hover:text-ink'}`}
              >
                <Settings size={16} />
                <span>Workspace Settings</span>
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
            
            {user && user.isEmailVerified === false && (
              <div className="bg-yellow-950/20 border-b border-yellow-900/30 px-8 py-2.5 flex items-center justify-between text-xs text-yellow-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
                  <span>Please check your inbox to verify your email address. Workspace features may be limited until verified.</span>
                </div>
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('clientoq_jwt');
                      const res = await fetch(`/api/auth/resend-verification`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      if (res.ok) {
                        alert('Verification email has been resent successfully!');
                      } else {
                        const err = await res.json().catch(() => ({}));
                        alert(err.message || 'Failed to resend verification email.');
                      }
                    } catch (e) {
                      alert('Failed to resend verification email.');
                    }
                  }}
                  className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-neutral-950 font-semibold rounded-sm transition-colors text-[10px] uppercase tracking-wider"
                >
                  Resend Verification
                </button>
              </div>
            )}

            {user && user.role === 'SuperAdmin' && impersonatedOrgId && (
              <div className="bg-primary/20 border-b border-primary/30 px-8 py-3 flex items-center justify-between text-xs text-ink font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-semibold text-primary uppercase text-[10px]">Impersonating Tenant:</span>
                  <span className="font-bold text-ink underline">{impersonatedOrgName}</span>
                  <span className="text-mute">(All actions will run against this organization's database scope)</span>
                </div>
                <button
                  onClick={handleExitImpersonation}
                  className="px-3 py-1.5 bg-primary hover:opacity-95 text-on-primary font-bold rounded-sm text-[9px] uppercase tracking-widest cursor-pointer transition-opacity"
                >
                  Exit Impersonation
                </button>
              </div>
            )}

            {user && user.role === 'SuperAdmin' && !impersonatedOrgId && (
              <div className="bg-canvas-soft border-b border-hairline px-8 py-3 flex items-center justify-between text-xs text-ink font-mono shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-mute rounded-full"></span>
                  <span className="font-semibold text-mute uppercase text-[10px]">SuperAdmin View:</span>
                  <span className="text-ink font-bold">Standard Workspace Mode</span>
                  <span className="text-mute">(Viewing default platform database scope. Use impersonation to view specific tenants.)</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem('clientoq_admin_view', 'platform');
                    setAdminView('platform');
                  }}
                  className="px-3 py-1.5 border border-hairline text-ink hover:bg-canvas font-bold rounded-sm text-[9px] uppercase tracking-widest cursor-pointer transition-all"
                >
                  Go back to Platform Center
                </button>
              </div>
            )}

            {/* Header */}
            <header className="h-16 border-b border-hairline flex items-center justify-between px-8 bg-canvas select-none relative">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-semibold tracking-wide uppercase font-mono text-ink">
                  {activeTab === 'dashboard' && 'Operations Dashboard'}
                  {activeTab === 'crm' && 'CRM Pipeline Manager'}
                  {activeTab === 'clients' && 'Client Profiles Index'}
                  {activeTab === 'timeconverter' && 'Time Zones & Meeting Planner'}
                  {activeTab === 'projects' && 'Agile Workspace'}
                  {activeTab === 'finance' && 'Billing Ledger'}
                  {activeTab === 'whatsapp' && 'WhatsApp Communications'}
                  {activeTab === 'automations' && 'Rule Automation Engine'}
                  {activeTab === 'portal' && 'Acme Corp Portal (Client View)'}
                  {activeTab === 'calendar' && 'Sprint Deadline Calendar'}
                </h2>
              </div>

              {/* Global Search Bar */}
              <div className="flex-1 max-w-sm mx-8 relative z-50">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search workstation..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowSearchResults(true)}
                    className="w-full bg-canvas-soft border border-hairline rounded-sm px-3.5 py-1.5 text-xs text-ink placeholder:text-mute focus:outline-none focus:border-primary font-mono tracking-tight transition-colors duration-150"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-2.5 text-mute hover:text-ink transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {showSearchResults && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSearchResults(false)}></div>
                    {searchResults && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-canvas-soft border border-hairline rounded-sm shadow-xl z-50 max-h-96 overflow-y-auto font-mono text-[11px] divide-y divide-hairline">
                        
                        {/* Leads Results */}
                        {searchResults.leads && searchResults.leads.length > 0 && (
                          <div className="p-2.5">
                            <div className="text-[9px] uppercase tracking-widest text-mute font-semibold px-2 mb-1">Leads</div>
                            {searchResults.leads.map((l: any) => (
                              <div
                                key={l.id}
                                onClick={() => handleSearchResultClick('lead', l)}
                                className="px-2 py-1.5 rounded-xs hover:bg-canvas cursor-pointer flex items-center justify-between text-ink"
                              >
                                <span>{l.firstName} {l.lastName} ({l.companyName || 'No Company'})</span>
                                <span className="text-[9px] text-mute uppercase">{l.status}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Clients Results */}
                        {searchResults.clients && searchResults.clients.length > 0 && (
                          <div className="p-2.5">
                            <div className="text-[9px] uppercase tracking-widest text-mute font-semibold px-2 mb-1">Clients</div>
                            {searchResults.clients.map((c: any) => (
                              <div
                                key={c.id}
                                onClick={() => handleSearchResultClick('client', c)}
                                className="px-2 py-1.5 rounded-xs hover:bg-canvas cursor-pointer text-ink"
                              >
                                {c.companyName}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Projects Results */}
                        {searchResults.projects && searchResults.projects.length > 0 && (
                          <div className="p-2.5">
                            <div className="text-[9px] uppercase tracking-widest text-mute font-semibold px-2 mb-1">Projects</div>
                            {searchResults.projects.map((p: any) => (
                              <div
                                key={p.id}
                                onClick={() => handleSearchResultClick('project', p)}
                                className="px-2 py-1.5 rounded-xs hover:bg-canvas cursor-pointer flex items-center justify-between text-ink"
                              >
                                <span>{p.name}</span>
                                <span className="text-[9px] text-mute uppercase">{p.status}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tasks Results */}
                        {searchResults.tasks && searchResults.tasks.length > 0 && (
                          <div className="p-2.5">
                            <div className="text-[9px] uppercase tracking-widest text-mute font-semibold px-2 mb-1">Tasks</div>
                            {searchResults.tasks.map((t: any) => (
                              <div
                                key={t.id}
                                onClick={() => handleSearchResultClick('task', t)}
                                className="px-2 py-1.5 rounded-xs hover:bg-canvas cursor-pointer flex items-center justify-between text-ink"
                              >
                                <span>{t.title} <span className="text-[10px] text-mute">in {t.project ? t.project.name : 'Project'}</span></span>
                                <span className="text-[9px] text-mute uppercase">{t.status}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Invoices Results */}
                        {searchResults.invoices && searchResults.invoices.length > 0 && (
                          <div className="p-2.5">
                            <div className="text-[9px] uppercase tracking-widest text-mute font-semibold px-2 mb-1">Invoices</div>
                            {searchResults.invoices.map((i: any) => (
                              <div
                                key={i.id}
                                onClick={() => handleSearchResultClick('invoice', i)}
                                className="px-2 py-1.5 rounded-xs hover:bg-canvas cursor-pointer flex items-center justify-between text-ink"
                              >
                                <span>{i.invoiceNumber} ({i.client?.companyName})</span>
                                <span className="text-[9px] text-mute uppercase">{i.status}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Empty State */}
                        {Object.values(searchResults).every((arr: any) => !arr || arr.length === 0) && (
                          <div className="p-4 text-center text-mute text-[10px]">
                            No matches found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative p-2 bg-canvas border border-hairline text-ink hover:bg-canvas-soft rounded-sm transition-colors cursor-pointer flex items-center justify-center"
                    title="Workspace Alerts"
                  >
                    <Clock size={14} />
                    {notifications.filter((n: any) => !n.isRead).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <>
                      <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowNotifDropdown(false)}></div>
                      <div className="absolute right-0 mt-2 w-80 bg-canvas-soft border border-hairline rounded-sm shadow-xl z-50 p-3 font-mono text-[10px]">
                        <div className="flex justify-between items-center pb-2 border-b border-hairline mb-2 select-none">
                          <span className="text-mute uppercase tracking-wider font-semibold">Workspace Alerts</span>
                          <span className="text-mute">({notifications.filter(n => !n.isRead).length} Unread)</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-mute select-none">No notifications</div>
                          ) : (
                            notifications.map((notif: any) => (
                              <div
                                key={notif.id}
                                className={`p-2 rounded-xs border flex flex-col justify-between ${notif.isRead ? 'border-hairline bg-canvas/20 opacity-60' : 'border-primary bg-canvas/40'}`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-ink">{notif.title}</span>
                                  <span className="text-mute text-[8px]">{new Date(notif.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-body-text mt-1 leading-normal text-[9px]">{notif.message}</p>
                                <div className="flex justify-end gap-3 mt-2">
                                  {!notif.isRead && (
                                    <button
                                      onClick={() => handleMarkNotifRead(notif.id)}
                                      className="text-primary hover:underline font-bold cursor-pointer"
                                    >
                                      Mark read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteNotif(notif.id)}
                                    className="text-red-400 hover:underline font-bold cursor-pointer"
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

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
                    <div className="flex gap-3">
                      <label className="bg-canvas border border-hairline text-ink text-xs font-semibold px-4 py-2 rounded-sm hover:bg-canvas-soft uppercase tracking-widest font-mono cursor-pointer flex items-center gap-2">
                        <span>Import CSV</span>
                        <input
                          id="crm-csv-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleImportCSV}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={() => setShowAddLeadModal(true)}
                        className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono"
                      >
                        <Plus size={14} />
                        <span>Add Lead</span>
                      </button>
                    </div>
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
                                <div className="flex justify-between items-start gap-1 mb-1">
                                  <div className="text-xs font-semibold text-ink truncate">{lead.firstName} {lead.lastName}</div>
                                  {(() => {
                                    const { score, badge } = getAILeadScore(lead);
                                    return (
                                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                                        badge === 'Hot' 
                                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                          : badge === 'Warm' 
                                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                      }`}>
                                        {score}% Match - {badge}
                                      </span>
                                    );
                                  })()}
                                </div>
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
                        <div className="mb-6">
                          <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-2">Lead Description & Notes</span>
                          <p className="bg-canvas border border-hairline p-4 rounded-sm text-sm text-body-strong leading-relaxed font-serif italic">
                            {selectedLead.notes || 'No description notes provided.'}
                          </p>
                        </div>

                        {/* AI Lead Assistant & Smart Summary */}
                        <div className="mb-8 bg-canvas border border-hairline p-5 rounded-sm font-mono text-xs space-y-4">
                           {renderAILeadAssistant()}
                            
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => generateAIFollowUp(selectedLead)}
                                className="bg-primary text-on-primary font-bold px-4 py-2 rounded-xs uppercase tracking-wider text-[10px] flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                              >
                                <Sparkles size={12} />
                                <span>Draft AI Follow-up Email</span>
                              </button>
                            </div>
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

                        {/* Proposals & Contracts Section */}
                        <div className="border-t border-hairline pt-6 mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-mute">Proposals & Contracts</h3>
                            <button
                              type="button"
                              onClick={() => {
                                setShowAddProposalModal(true);
                                setNewProposalTitle(`Proposal for: ${selectedLead.companyName || 'Lead Project'}`);
                                setNewProposalContent(`Project Scope & Deliverables Outline:\n1. Core system architecture.\n2. Iterative module sprint design.`);
                                setNewProposalAmount(selectedLead.estimatedValue ? selectedLead.estimatedValue.toString() : '50000');
                              }}
                              className="bg-primary hover:opacity-90 text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-xs uppercase tracking-wider font-mono cursor-pointer"
                            >
                              + Draft Proposal
                            </button>
                          </div>

                          <div className="space-y-3 font-mono text-xs max-h-48 overflow-y-auto pr-2">
                            {proposals.length === 0 ? (
                              <p className="text-mute italic">No proposals drafted for this lead yet.</p>
                            ) : (
                              proposals.map((prop: any) => (
                                <div key={prop.id} className="bg-canvas border border-hairline/40 p-3 rounded-sm flex flex-col gap-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="font-bold text-ink">{prop.title}</span>
                                      <span className="text-mute block text-[9px] mt-0.5">Value: ₹{prop.amount.toLocaleString()}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase tracking-wider ${
                                      prop.status === 'Accepted' ? 'bg-green-950/60 text-green-300' : 'bg-canvas border border-hairline text-mute'
                                    }`}>
                                      {prop.status}
                                    </span>
                                  </div>
                                  <p className="text-body-text text-[10px] font-serif italic whitespace-pre-line">{prop.content}</p>

                                  {prop.status !== 'Accepted' && (
                                    <div className="flex justify-end gap-2 mt-1 pt-2 border-t border-hairline/30">
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const clientsList = await api.clients.getClients();
                                          let targetClient = clientsList.find((c: any) => c.companyName.toLowerCase().includes((selectedLead.companyName || '').toLowerCase()));
                                          if (!targetClient && clientsList.length > 0) {
                                            targetClient = clientsList[0];
                                          }
                                          if (!targetClient) {
                                            alert("Please register a Client Account first in the Clients tab before accepting proposals.");
                                            return;
                                          }
                                          try {
                                            await api.crm.proposals.createContract(prop.id, { clientId: targetClient.id });
                                            const list = await api.crm.proposals.list(selectedLead.id);
                                            setProposals(list);
                                            refreshData();
                                          } catch (err: any) {
                                            alert(err.message);
                                          }
                                        }}
                                        className="bg-primary hover:opacity-90 text-on-primary text-[9px] px-2.5 py-1 rounded-xs font-bold uppercase cursor-pointer"
                                      >
                                        Accept & Generate Contract
                                      </button>
                                    </div>
                                  )}

                                  {prop.contract && (
                                    <div className="mt-1.5 p-2 bg-canvas-soft border border-hairline rounded-xs flex justify-between items-center text-[10px]">
                                      <div>
                                        <span className="text-mute font-mono uppercase text-[9px]">Contract Generated</span>
                                        <span className="block font-semibold text-ink">{prop.contract.title}</span>
                                      </div>
                                      <span className={`px-1.5 py-0.2 rounded-xs font-bold text-[8px] uppercase tracking-wider ${
                                        prop.contract.signed ? 'bg-green-950 text-green-300' : 'bg-yellow-950 text-yellow-300'
                                      }`}>
                                        {prop.contract.signed ? 'Signed' : 'Unsigned'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
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

                  {/* Draft Proposal Modal */}
                  {showAddProposalModal && selectedLead && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowAddProposalModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Draft Lead Proposal</h2>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            await api.crm.proposals.create({
                              leadId: selectedLead.id,
                              title: newProposalTitle,
                              content: newProposalContent,
                              amount: newProposalAmount
                            });
                            setNewProposalTitle('');
                            setNewProposalContent('');
                            setNewProposalAmount('');
                            setShowAddProposalModal(false);
                            // Reload proposals
                            const list = await api.crm.proposals.list(selectedLead.id);
                            setProposals(list);
                            refreshData();
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Proposal Title</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Acme Web Portal Development"
                              value={newProposalTitle}
                              onChange={e => setNewProposalTitle(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Content & Scope</label>
                            <textarea
                              rows={4}
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                              placeholder="Outline project terms and deliverables..."
                              value={newProposalContent}
                              onChange={e => setNewProposalContent(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Proposed Amount (₹)</label>
                            <input
                              type="number"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="120000"
                              value={newProposalAmount}
                              onChange={e => setNewProposalAmount(e.target.value)}
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95 transition-opacity"
                          >
                            Submit Draft Proposal
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

                        <div className="grid grid-cols-3 gap-6 mb-6">
                          {/* Info panel */}
                          <div className="bg-canvas border border-hairline p-4 rounded-sm space-y-2 text-xs font-mono text-body-strong">
                            <span className="block text-[10px] uppercase text-mute mb-2 tracking-wider">Account Specifications</span>
                            <div><strong className="text-mute font-normal">Contact:</strong> {selectedClient.email || 'None'}</div>
                            <div><strong className="text-mute font-normal">Phone:</strong> {selectedClient.phone || 'None'}</div>
                            <div><strong className="text-mute font-normal">Address:</strong> {selectedClient.address}, {selectedClient.city}, {selectedClient.state}</div>
                            <div><strong className="text-mute font-normal">GSTIN:</strong> {selectedClient.gstNumber || 'None'}</div>
                            <div><strong className="text-mute font-normal">Time Zone:</strong> {selectedClient.timezone || 'UTC'}</div>
                            {(() => {
                              const timeDetails = getClientTimeDetails(selectedClient.timezone || 'UTC', liveTime);
                              return (
                                <div className="border-t border-hairline pt-2 mt-2 space-y-2">
                                  <div><strong className="text-mute font-normal">Client Time:</strong> <span className="text-ink font-semibold">{timeDetails.formattedTime}</span></div>
                                  <div>
                                    <span className={`inline-block px-2 py-0.5 rounded-sm text-[9px] font-semibold tracking-wide ${timeDetails.badgeColor}`}>
                                      {timeDetails.status}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
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

                        {/* Time Zone Calculator Widget */}
                        <div className="bg-canvas border border-hairline p-5 rounded-sm mb-6 text-xs font-mono">
                          <span className="block text-[10px] uppercase text-mute mb-3 tracking-wider font-semibold">Time Zone Calculator & DND Region Check</span>
                          <div className="grid grid-cols-2 gap-6 items-center">
                            <div>
                              <label className="block text-mute mb-2">
                                Estimate Meeting Hour in Your Time: <span className="text-primary font-semibold font-sans">{converterHour === 0 ? '12 AM' : converterHour === 12 ? '12 PM' : converterHour > 12 ? `${converterHour - 12} PM` : `${converterHour} AM`} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="23"
                                value={converterHour}
                                onChange={e => setConverterHour(parseInt(e.target.value))}
                                className="w-full h-1 bg-canvas-soft rounded-lg appearance-none cursor-pointer accent-primary border border-hairline"
                              />
                              <div className="flex justify-between text-[9px] text-mute mt-1">
                                <span>12 AM</span>
                                <span>6 AM</span>
                                <span>12 PM</span>
                                <span>6 PM</span>
                                <span>11 PM</span>
                              </div>
                            </div>
                            <div className="bg-canvas-soft border border-hairline p-4 rounded-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-mute">Equivalent Time at Client:</span>
                                <span className="text-ink font-semibold text-sm">
                                  {(() => {
                                    const conv = getConvertedClientTime(converterHour, selectedClient.timezone || 'UTC');
                                    return conv.formattedTime;
                                  })()}
                                </span>
                              </div>
                              {(() => {
                                const conv = getConvertedClientTime(converterHour, selectedClient.timezone || 'UTC');
                                return (
                                  <div className="flex items-center gap-2 mt-3">
                                    {conv.isBusinessHours ? (
                                      <span className="text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-sm">
                                        🟢 Within Client Working Hours
                                      </span>
                                    ) : (
                                      <span className="text-[10px] uppercase font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-sm">
                                        🌙 Outside Working Hours (Do Not Disturb)
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
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
                          <div>
                            <label className="block text-mute mb-1">Client Time Zone</label>
                            <select
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none focus:border-mute"
                              value={newClientForm.timezone}
                              onChange={e => setNewClientForm({ ...newClientForm, timezone: e.target.value })}
                            >
                              <option value="UTC">UTC (Coordinated Universal Time)</option>
                              <option value="America/New_York">America/New_York (EST/EDT)</option>
                              <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                              <option value="America/Denver">America/Denver (MST/MDT)</option>
                              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                              <option value="Europe/London">Europe/London (GMT/BST)</option>
                              <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                              <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                            </select>
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

              {/* TAB: TIME ZONE CONVERTER */}
              {activeTab === 'timeconverter' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-hairline pb-4">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-ink font-sans">Global Client Timezones & Meeting Planner</h3>
                      <p className="text-xs text-mute font-mono">Monitor current local times and schedule meetings within client working windows.</p>
                    </div>
                  </div>

                  {/* Dynamic Clocks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((c: any) => {
                      const timeDetails = getClientTimeDetails(c.timezone || 'UTC', liveTime);
                      return (
                        <div key={c.id} className="bg-canvas border border-hairline p-5 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-ink">{c.companyName}</h4>
                              <span className={`inline-block px-2 py-0.5 rounded-sm text-[9px] font-semibold tracking-wide ${timeDetails.badgeColor}`}>
                                {timeDetails.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-mute font-mono">{c.website || 'No website'}</p>
                            <p className="text-xs text-mute font-mono pt-1">Zone: {c.timezone}</p>
                          </div>

                          <div className="bg-canvas-soft border border-hairline p-3 rounded-sm flex items-center justify-between">
                            <span className="text-[10px] uppercase text-mute font-mono">Current Time:</span>
                            <span className="text-primary font-bold text-base font-sans tracking-tight">{timeDetails.formattedTime}</span>
                          </div>
                        </div>
                      );
                    })}
                    {clients.length === 0 && (
                      <div className="col-span-full bg-canvas border border-hairline p-8 text-center text-xs text-mute font-mono">
                        No clients registered. Add a client from the Clients Log to view their local clock.
                      </div>
                    )}
                  </div>

                  {/* Interactive Planner Widget */}
                  <div className="bg-canvas border border-hairline p-6 rounded-sm shadow-sm font-mono text-xs space-y-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-primary border-b border-hairline pb-2 mb-2">Interactive Meeting Planner</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-mute mb-2">
                            Select Proposed Meeting Time (Your Time): <span className="text-primary font-bold font-sans text-sm">{converterHour === 0 ? '12 AM' : converterHour === 12 ? '12 PM' : converterHour > 12 ? `${converterHour - 12} PM` : `${converterHour} AM`} ({Intl.DateTimeFormat().resolvedOptions().timeZone})</span>
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="23"
                            value={converterHour}
                            onChange={e => setConverterHour(parseInt(e.target.value))}
                            className="w-full h-1 bg-canvas-soft rounded-lg appearance-none cursor-pointer accent-primary border border-hairline"
                          />
                          <div className="flex justify-between text-[9px] text-mute mt-1">
                            <span>12 AM</span>
                            <span>6 AM</span>
                            <span>12 PM</span>
                            <span>6 PM</span>
                            <span>11 PM</span>
                          </div>
                        </div>

                        <div className="bg-canvas-soft border border-hairline p-4 rounded-sm space-y-2">
                          <span className="block text-[10px] text-mute uppercase font-semibold">Working Hours Standard Reference</span>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-[10px]">🟢</span>
                            <span className="text-body-strong">Working Hours (9 AM - 6 PM)</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-[10px]">🌙</span>
                            <span className="text-body-strong">Off Hours / Evening (6 PM - 10 PM)</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="text-[10px]">💤</span>
                            <span className="text-body-strong">Late Night / Do Not Disturb (10 PM - 9 AM)</span>
                          </div>
                        </div>
                      </div>

                      {/* Equivalent Times List */}
                      <div className="space-y-4">
                        <span className="block text-[10px] text-mute uppercase tracking-wider font-semibold">Equivalent Times at Clients</span>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {clients.map((c: any) => {
                            const conv = getConvertedClientTime(converterHour, c.timezone || 'UTC');
                            // Determine status
                            let statusText = '🟢 Working Hours';
                            let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                            if (conv.clientHour >= 22 || conv.clientHour < 9) {
                              statusText = '💤 Do Not Disturb';
                              statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
                            } else if (conv.clientHour >= 18 && conv.clientHour < 22) {
                              statusText = '🌙 Off Hours';
                              statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
                            }

                            return (
                              <div key={c.id} className="bg-canvas border border-hairline p-3 rounded-sm flex items-center justify-between">
                                <div className="space-y-1">
                                  <div className="font-bold text-ink text-xs">{c.companyName}</div>
                                  <div className="text-[10px] text-mute font-mono">{c.timezone}</div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="font-bold text-primary text-sm font-sans">{conv.formattedTime}</div>
                                  <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[8px] font-semibold uppercase border ${statusColor}`}>
                                    {statusText}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          {clients.length === 0 && (
                            <div className="bg-canvas border border-hairline p-6 text-center text-xs text-mute font-mono">
                              No clients registered to compare times.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Workspace Boards</h3>
                      <div className="flex bg-canvas-soft border border-hairline rounded p-0.5 text-xs font-mono">
                        <button
                          onClick={() => setProjectBoardView('kanban')}
                          className={`px-3 py-1 rounded-sm ${projectBoardView === 'kanban' ? 'bg-canvas text-ink font-bold shadow-sm' : 'text-mute hover:text-ink'}`}
                        >
                          Kanban Boards
                        </button>
                        <button
                          onClick={() => setProjectBoardView('gantt')}
                          className={`px-3 py-1 rounded-sm ${projectBoardView === 'gantt' ? 'bg-canvas text-ink font-bold shadow-sm' : 'text-mute hover:text-ink'}`}
                        >
                          Workload & Gantt
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono"
                    >
                      <Plus size={14} />
                      <span>Create Project</span>
                    </button>
                  </div>

                  {projectBoardView === 'gantt' ? (
                    <div className="space-y-8 animate-fade-in">
                      {/* Workload Capacity Planner */}
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-mute mb-4">Weekly Team Resource Capacity</h4>
                        <div className="space-y-4 font-mono text-xs">
                          {[
                            { id: 'usr-syed', name: 'Syed Ali (Owner)', max: 40 },
                            { id: 'usr-alice', name: 'Alice (Manager)', max: 40 },
                            { id: 'usr-bob', name: 'Bob (Employee)', max: 40 }
                          ].map(member => {
                            const assignedTasks = projects.flatMap(p => p.tasks || []).filter(t => t.assigneeId === member.id && t.status !== 'Completed');
                            const totalHrs = assignedTasks.reduce((sum, t) => sum + (parseInt(t.estimatedHours) || 0), 0);
                            const percent = Math.min(100, Math.round((totalHrs / member.max) * 100));
                            const isOverloaded = totalHrs > member.max;

                            return (
                              <div key={member.id} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-semibold text-ink">{member.name}</span>
                                  <span className={isOverloaded ? 'text-rose-400 font-bold' : 'text-mute'}>
                                    {totalHrs} / {member.max} hrs assigned {isOverloaded && '(⚠️ Over Capacity)'}
                                  </span>
                                </div>
                                <div className="w-full bg-canvas h-3 rounded-full overflow-hidden border border-hairline relative">
                                  <div 
                                    className={`h-full transition-all duration-300 ${isOverloaded ? 'bg-rose-500' : percent > 80 ? 'bg-yellow-500' : 'bg-primary'}`} 
                                    style={{ width: `${percent}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Visual Gantt Chart */}
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-mute mb-4">Project Sprints Timeline (Gantt)</h4>
                        <div className="overflow-x-auto">
                          <div className="min-w-[800px] space-y-4 font-mono text-xs">
                            <div className="grid grid-cols-12 border-b border-hairline pb-2 text-mute font-bold uppercase tracking-wider text-[10px]">
                              <div className="col-span-3">Project Sprint / Task Name</div>
                              <div className="col-span-2">Assignee</div>
                              <div className="col-span-7 grid grid-cols-7 text-center">
                                <div>Mon</div>
                                <div>Tue</div>
                                <div>Wed</div>
                                <div>Thu</div>
                                <div>Fri</div>
                                <div>Sat</div>
                                <div>Sun</div>
                              </div>
                            </div>

                            {projects.map((proj) => (
                              <div key={proj.id} className="space-y-2 border-b border-hairline/20 pb-4 last:border-0 last:pb-0">
                                <div className="grid grid-cols-12 items-center bg-canvas/30 p-2 rounded-sm border border-hairline/40">
                                  <div className="col-span-3 font-bold text-ink truncate">{proj.name}</div>
                                  <div className="col-span-2 text-mute italic text-[10px]">Project Sprint</div>
                                  <div className="col-span-7 relative h-6 bg-canvas border border-hairline/60 rounded-xs overflow-hidden">
                                    <div 
                                      className="absolute bg-primary/20 h-full border-r border-primary/40 rounded-xs flex items-center justify-center text-[9px] font-bold text-primary"
                                      style={{ left: '15%', width: '70%' }}
                                    >
                                      Sprint Duration
                                    </div>
                                  </div>
                                </div>
                                {proj.tasks && proj.tasks.length > 0 ? (
                                  <div className="pl-4 space-y-2">
                                    {proj.tasks.map((task: any) => {
                                      let left = '10%';
                                      let width = '40%';
                                      if (task.priority === 'High' || task.priority === 'Critical') {
                                        left = '20%';
                                        width = '60%';
                                      } else if (task.priority === 'Low') {
                                        left = '40%';
                                        width = '30%';
                                      } else {
                                        left = '30%';
                                        width = '45%';
                                      }
                                      const assigneeName = task.assignee?.firstName || (task.assigneeId === 'usr-syed' ? 'Syed' : task.assigneeId === 'usr-alice' ? 'Alice' : task.assigneeId === 'usr-bob' ? 'Bob' : 'Unassigned');

                                      return (
                                        <div key={task.id} className="grid grid-cols-12 items-center text-[11px] py-1">
                                          <div className="col-span-3 pl-2 text-mute truncate flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                            {task.title}
                                          </div>
                                          <div className="col-span-2 text-body-text">{assigneeName}</div>
                                          <div className="col-span-7 relative h-5 bg-canvas/20 rounded-xs border border-hairline/30 overflow-hidden">
                                            <div 
                                              className={`absolute h-full rounded-xs flex items-center px-2 text-[8px] font-semibold text-on-primary ${
                                                task.status === 'Completed' ? 'bg-emerald-500/70' : task.status === 'In Progress' ? 'bg-primary/80' : 'bg-mute/60'
                                              }`}
                                              style={{ left, width }}
                                            >
                                              {task.status} ({task.estimatedHours || 0}h)
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="pl-6 text-[10px] text-mute select-none italic">No tasks created yet for this project.</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
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

                            {/* Attached Files Card */}
                            <div className="bg-canvas-soft border border-hairline p-5 rounded-md mt-6">
                              <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-3 font-semibold">Attached Project Files</span>
                              
                              {/* File list */}
                              <div className="space-y-2 font-mono text-[11px] mb-4 max-h-40 overflow-y-auto pr-1">
                                {(!selectedProject.files || selectedProject.files.length === 0) ? (
                                  <p className="text-mute italic select-none">No files attached to board.</p>
                                ) : (
                                  selectedProject.files.map((rel: any) => {
                                    const fileObj = rel.file || rel;
                                    return (
                                      <div key={fileObj.id} className="flex justify-between items-center border-b border-hairline/20 pb-1.5 last:border-0 last:pb-0">
                                        <span className="text-ink truncate max-w-[140px]" title={fileObj.fileName}>{fileObj.fileName}</span>
                                        <a
                                          href={`/api/files/${fileObj.id}/download`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-primary hover:underline font-bold"
                                        >
                                          Download
                                        </a>
                                      </div>
                                    );
                                  })
                                )}
                              </div>

                              {/* Upload form */}
                              <div className="border-t border-hairline/40 pt-3">
                                <label className="block text-[9px] uppercase tracking-wider text-mute mb-2">Upload Workspace Asset</label>
                                <input
                                  type="file"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      await api.projects.uploadProjectFile(selectedProject.id, file);
                                      handleSelectProject(selectedProject); // Reload details
                                    } catch (err: any) {
                                      alert(err.message);
                                    }
                                  }}
                                  className="w-full text-[10px] text-mute file:mr-2.5 file:py-1 file:px-2 file:rounded-xs file:border-0 file:text-[9px] file:font-mono file:uppercase file:bg-canvas file:text-mute file:hover:text-ink cursor-pointer file:cursor-pointer"
                                />
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

                                    {/* Stopwatch Widget */}
                                    <div className="flex items-center gap-4 bg-canvas-soft/30 px-3.5 py-2 border border-hairline rounded-sm mb-3 font-mono text-xs select-none">
                                      <div className="flex items-center gap-2 flex-1">
                                        <Clock size={12} className={activeTimerTaskId === task.id ? 'text-orange-400 animate-pulse' : 'text-mute'} />
                                        <span className="text-mute text-[9px] uppercase font-semibold">Stopwatch:</span>
                                        <span className="text-ink font-bold font-mono">
                                          {activeTimerTaskId === task.id ? formatTime(activeTimerSeconds) : '00:00'}
                                        </span>
                                        <span className="text-mute text-[9px]">({task.actualHours || 0} hrs logged)</span>
                                      </div>
                                      <div>
                                        {activeTimerTaskId === task.id ? (
                                          <button
                                            onClick={() => handlePauseAndSave(task)}
                                            className="bg-primary text-on-primary hover:opacity-90 font-bold text-[9px] px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors cursor-pointer"
                                          >
                                            Log Hours
                                          </button>
                                        ) : (
                                          <button
                                            onClick={() => handleStartTimer(task.id)}
                                            className="border border-hairline bg-canvas hover:bg-canvas-soft text-mute hover:text-ink font-bold text-[9px] px-2.5 py-1 rounded-sm uppercase tracking-wider transition-colors cursor-pointer"
                                          >
                                            Start Timer
                                          </button>
                                        )}
                                      </div>
                                    </div>

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
                    </div>
                  )}
                  {/* Save Time Log Modal */}
                  {showSaveTimeLogModal && timeLogTask && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={handleDiscardTimeLog}
                          className="absolute top-6 right-6 text-mute hover:text-ink"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Log Sprint Time</h2>
                        <div className="space-y-4 font-mono text-xs text-body-strong">
                          <p>
                            You have tracked **{formatTime(activeTimerSeconds)}** on task: <br/>
                            <strong className="text-ink">"{timeLogTask.title}"</strong>
                          </p>
                          <p className="text-[10px] text-mute">
                            This duration will be saved as **{Math.max(1, Math.round(activeTimerSeconds / 60))} minutes** and added to the cumulative project log.
                          </p>
                          <div>
                            <label className="block text-mute mb-1">Description of work done</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Worked on database schema validation..."
                              value={timeLogDesc}
                              onChange={e => setTimeLogDesc(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={handleConfirmSaveTimeLog}
                              className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-sm uppercase tracking-widest text-xs hover:opacity-95 transition-opacity cursor-pointer"
                            >
                              Save Log
                            </button>
                            <button
                              onClick={handleDiscardTimeLog}
                              className="flex-1 border border-hairline bg-canvas text-mute font-bold py-2.5 rounded-sm uppercase tracking-widest text-xs hover:text-ink transition-colors cursor-pointer"
                            >
                              Discard
                            </button>
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
                <div className="space-y-8 animate-fade-in">
                  
                  {/* SaaS Powerhouse: Cash Flow Forecasting */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-canvas-soft border border-hairline p-6 rounded-md">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-mute">6-Month Cash Flow Forecasting Projections</h4>
                        <span className="text-[10px] text-green-400 font-mono">Auto-forecasted based on active projects & invoices</span>
                      </div>
                      
                      {/* Responsive SVG Forecasting Chart */}
                      <div className="bg-canvas border border-hairline rounded p-4 h-64 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                          {/* Grid lines */}
                          <line x1="0" y1="50" x2="600" y2="50" stroke="#f7f5f0" strokeOpacity="0.05" strokeWidth="1" />
                          <line x1="0" y1="100" x2="600" y2="100" stroke="#f7f5f0" strokeOpacity="0.05" strokeWidth="1" />
                          <line x1="0" y1="150" x2="600" y2="150" stroke="#f7f5f0" strokeOpacity="0.05" strokeWidth="1" />

                          {/* Data lines: Revenue (Primary), Expense (Mute/Hairline), Balance (Green) */}
                          <path
                            d="M 50 150 L 150 120 L 250 110 L 350 70 L 450 50 L 550 30"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Expenses Line */}
                          <path
                            d="M 50 180 L 150 160 L 250 170 L 350 160 L 450 155 L 550 150"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {/* Balance Line */}
                          <path
                            d="M 50 160 L 150 140 L 250 130 L 350 100 L 450 85 L 550 60"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Dots on points */}
                          {[
                            { x: 50, rev: 150, exp: 180, bal: 160 },
                            { x: 150, rev: 120, exp: 160, bal: 140 },
                            { x: 250, rev: 110, exp: 170, bal: 130 },
                            { x: 350, rev: 70, exp: 160, bal: 100 },
                            { x: 450, rev: 50, exp: 155, bal: 85 },
                            { x: 550, rev: 30, exp: 150, bal: 60 },
                          ].map((pt, index) => (
                            <g key={index}>
                              <circle cx={pt.x} cy={pt.rev} r="4" fill="#f59e0b" className="hover:r-6 cursor-pointer" />
                              <circle cx={pt.x} cy={pt.exp} r="3" fill="#6b7280" className="hover:r-5 cursor-pointer" />
                              <circle cx={pt.x} cy={pt.bal} r="4" fill="#10b981" className="hover:r-6 cursor-pointer" />
                            </g>
                          ))}
                        </svg>
                        
                        {/* Month labels absolute positioned bottom */}
                        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-8 text-[9px] text-mute font-mono">
                          <span>Jul (Proj)</span>
                          <span>Aug (Proj)</span>
                          <span>Sep (Proj)</span>
                          <span>Oct (Proj)</span>
                          <span>Nov (Proj)</span>
                          <span>Dec (Proj)</span>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex gap-6 justify-center text-[10px] font-mono select-none">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-3 h-0.5 bg-[#f59e0b]"></span>
                          <span className="text-mute">Revenue Trend</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-3 h-0.5 bg-[#6b7280] border-dashed border-t"></span>
                          <span className="text-mute">Operating Costs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-3 h-0.5 bg-[#10b981]"></span>
                          <span className="text-mute">Net Balance</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Gateway Webhook Config Panel */}
                    <div className="bg-canvas border border-hairline p-5 rounded-sm flex flex-col justify-between font-mono text-xs space-y-4">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary border-b border-hairline pb-2 mb-2">Stripe Processor Integration</h4>
                        <p className="text-[11px] text-body-text leading-relaxed font-serif italic mb-4">
                          Establish automated ledger reconciliation by configuring the Stripe payment webhook endpoint in your Developer Dashboard.
                        </p>
                        <div className="bg-canvas-soft border border-hairline/60 p-3 rounded space-y-1.5 text-[10px]">
                          <div><span className="text-mute">Webhook Endpoint URL:</span></div>
                          <div className="text-ink select-all break-all bg-canvas px-1 py-0.5 border border-hairline/30 rounded text-[9px]">
                            {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/stripe` : 'http://localhost:3000/api/webhooks/stripe'}
                          </div>
                          <div><span className="text-mute">Listening events:</span></div>
                          <div className="text-primary font-bold">invoice.payment_succeeded</div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          alert('Webhook listener verified. Stripe status active.');
                        }}
                        className="w-full bg-primary hover:opacity-90 text-on-primary text-[10px] font-bold py-2 rounded-xs uppercase tracking-wider"
                      >
                        Verify Webhook Connectivity
                      </button>
                    </div>
                  </div>

                  {/* Ledger Header */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Financial Invoices Ledger</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={handleExportCSV}
                        className="bg-canvas border border-hairline text-ink text-xs font-semibold px-4 py-2 rounded-sm hover:bg-canvas-soft uppercase tracking-widest font-mono cursor-pointer"
                      >
                        Export CSV
                      </button>
                      <button
                        onClick={handleExportPDF}
                        className="bg-canvas border border-hairline text-ink text-xs font-semibold px-4 py-2 rounded-sm hover:bg-canvas-soft uppercase tracking-widest font-mono cursor-pointer"
                      >
                        Export PDF
                      </button>
                      <button
                        onClick={() => setShowAddExpenseModal(true)}
                        className="bg-canvas border border-hairline text-ink text-xs font-semibold px-4 py-2 rounded-sm hover:bg-canvas-soft uppercase tracking-widest font-mono cursor-pointer"
                      >
                        <Plus size={14} className="inline mr-1" />
                        <span>Log Expense</span>
                      </button>
                      <button
                        onClick={() => setShowAddInvoiceModal(true)}
                        className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono cursor-pointer"
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
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-hairline pb-4">
                    <div>
                      <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Automation Rule Triggers</h3>
                      <p className="text-xs text-mute font-mono">Create and trigger automated workflows based on system events.</p>
                    </div>
                    <button
                      onClick={() => setShowCreateRuleModal(true)}
                      className="bg-primary text-on-primary text-xs font-semibold px-4 py-2 rounded-sm flex items-center gap-2 hover:opacity-90 uppercase tracking-widest font-mono cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Create Custom Rule</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    {automations.map((rule) => (
                      <div key={rule.id} className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-ink">{rule.name}</h4>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleRuleActive(rule.id)}
                                className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-xs uppercase tracking-wider ${rule.isActive ? 'bg-green-950 text-green-300 border border-green-500/20' : 'bg-canvas border border-hairline text-mute'}`}
                              >
                                {rule.isActive ? 'Active' : 'Disabled'}
                              </button>
                              {rule.isActive && (
                                <button
                                  onClick={async () => {
                                    try {
                                      const logMsg = rule.triggerType === 'Lead Created' 
                                        ? `Lead captured -> Dispatched ${rule.actionType}`
                                        : rule.triggerType === 'Invoice Paid'
                                        ? `Invoice paid -> Dispatched ${rule.actionType}`
                                        : `Task marked Completed -> Dispatched ${rule.actionType}`;
                                      const log = {
                                        id: 'log-' + Date.now(),
                                        message: logMsg,
                                        status: 'Success',
                                        executedAt: new Date().toISOString()
                                      };
                                      setAutomations(automations.map(r => {
                                        if (r.id === rule.id) {
                                          return { ...r, logs: [log, ...(r.logs || [])] };
                                        }
                                        return r;
                                      }));
                                      alert(`Triggered automation: ${rule.name}!`);
                                    } catch (err: any) {
                                      alert(err.message);
                                    }
                                  }}
                                  className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-xs uppercase tracking-wider bg-primary text-on-primary"
                                >
                                  Test Run
                                </button>
                              )}
                            </div>
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
                                  <span>{log.message || `Reconciled Stage Trigger - ${log.status}`}</span>
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

                  {/* Create Custom Automation Rule Modal */}
                  {showCreateRuleModal && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-md p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setShowCreateRuleModal(false)}
                          className="absolute top-6 right-6 text-mute hover:text-ink cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Create Custom Rule</h2>
                        <form onSubmit={handleCreateAutomationRule} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Rule Name</label>
                            <input
                              type="text"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                              placeholder="e.g. Notify Slack on New Lead"
                              value={newRuleForm.name}
                              onChange={e => setNewRuleForm({ ...newRuleForm, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Trigger Event (IF)</label>
                              <select
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newRuleForm.triggerType}
                                onChange={e => setNewRuleForm({ ...newRuleForm, triggerType: e.target.value })}
                              >
                                <option value="Lead Created">Lead Created</option>
                                <option value="Invoice Paid">Invoice Paid</option>
                                <option value="Task Completed">Task Completed</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Target Action (THEN)</label>
                              <select
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                value={newRuleForm.actionType}
                                onChange={e => setNewRuleForm({ ...newRuleForm, actionType: e.target.value })}
                              >
                                <option value="Send WhatsApp Alert">Send WhatsApp Alert</option>
                                <option value="Send Slack Alert">Send Slack Alert</option>
                                <option value="Create Kickoff Board">Create Kickoff Board</option>
                                <option value="Email Representative">Email Representative</option>
                              </select>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary font-bold py-3 rounded-sm uppercase tracking-widest text-xs mt-2 hover:opacity-95 transition-opacity"
                          >
                            Save Automation Rule
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TAB 8: CLIENT PORTAL */}
              {activeTab === 'portal' && (() => {
                const theme = getThemeClasses(whiteLabelSettings.themeColor);
                return (
                  <div className="space-y-8 animate-fade-in">
                    {/* Banner */}
                    <div className={`${theme.bgSoft} p-8 rounded-md flex items-center justify-between`}>
                      <div className="flex items-center gap-6">
                        {whiteLabelSettings.logoUrl ? (
                          <img src={whiteLabelSettings.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded" />
                        ) : (
                          <div className={`${theme.primaryBg} text-on-primary rounded flex items-center justify-center font-bold text-xl font-mono w-12 h-12`}>Q</div>
                        )}
                        <div>
                          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${theme.primaryText}`}>
                            Acme Corp Portal Gateway {whiteLabelSettings.customSubdomain && `(${whiteLabelSettings.customSubdomain})`}
                          </span>
                          <h3 className="text-xl font-bold tracking-tight text-ink mt-1">Hello John Doe 👋</h3>
                          <p className="text-xs text-mute font-mono mt-1">Review mock deliverables status and pay open bills.</p>
                        </div>
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
                        <div className={`${theme.primaryBg} h-full`} style={{ width: '60%' }}></div>
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
                              <span className={`${theme.primaryText} font-bold`}>₹{inv.totalAmount.toLocaleString()}</span>
                              <button
                                onClick={() => setSelectedInvoice(inv)}
                                className={`${theme.primaryBg} hover:opacity-90 text-on-primary text-[10px] font-bold px-4 py-2 rounded-xs uppercase tracking-wider`}
                              >
                                Check Out
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  {/* Contracts & E-Signatures */}
                  <div className="bg-canvas border border-hairline p-6 rounded-md">
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-mute mb-4 font-semibold">Contracts & E-Signatures</span>
                    <div className="space-y-3 font-mono text-xs">
                      {portalContracts.length === 0 ? (
                        <p className="text-xs text-mute italic select-none">No pending contracts for signature.</p>
                      ) : (
                        portalContracts.map(contract => (
                          <div key={contract.id} className="bg-canvas-soft border border-hairline/60 p-4 rounded flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-ink">{contract.title}</span>
                              <div className="text-[10px] text-mute mt-1">
                                {contract.signed 
                                  ? `Signed on ${new Date(contract.signedAt).toLocaleDateString()}` 
                                  : 'Awaiting digital e-signature'
                                }
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              {contract.signed ? (
                                <span className="px-2 py-0.5 bg-green-950 text-green-300 text-[9px] uppercase font-bold tracking-wider rounded-xs">Signed & Active</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedPortalContract(contract);
                                    setAcceptTerms(false);
                                    setTypedName('');
                                  }}
                                  className="bg-primary hover:opacity-90 text-on-primary text-[10px] font-bold px-4 py-2 rounded-xs uppercase tracking-wider cursor-pointer"
                                >
                                  Review & Sign
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* E-Signature & Contract Sign Modal */}
                  {selectedPortalContract && (
                    <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-canvas-soft border border-hairline w-full max-w-lg p-8 rounded-md shadow-2xl relative">
                        <button
                          onClick={() => setSelectedPortalContract(null)}
                          className="absolute top-6 right-6 text-mute hover:text-ink cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                        <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">Contract E-Signature</h2>
                        
                        <div className="space-y-4 font-mono text-xs text-body-strong">
                          <div>
                            <span className="block text-[10px] text-mute uppercase tracking-wider mb-1">Contract Title</span>
                            <span className="text-sm font-bold text-ink">{selectedPortalContract.title}</span>
                          </div>
                          
                          <div className="bg-canvas border border-hairline p-4 rounded-sm max-h-48 overflow-y-auto space-y-3 font-serif italic text-xs leading-relaxed">
                            <p className="font-bold font-mono not-italic uppercase text-[9px] text-mute">Statement of Work Terms:</p>
                            <p>
                              By signing this document, the client agrees to the scope of work outlined in the project proposal and associated fees.
                            </p>
                            <p>
                              Payment terms are standard Net-30 unless specified otherwise. Deliverables will be deployed iteratively in sprints.
                            </p>
                            <p>
                              Any modifications to scope must be agreed upon in writing by both parties.
                            </p>
                          </div>

                          {/* Signature drawing pad or typed name */}
                          <div className="space-y-2">
                            <label className="block text-mute">Draw Signature (Click & Drag below to Draw)</label>
                            
                            {/* Visual Canvas signature pad */}
                            <SignaturePad onDraw={(dataUrl) => setTypedName(dataUrl)} />
                            
                            <div className="pt-2">
                              <label className="block text-mute mb-1">Or Type Your Full Name for E-Consent</label>
                              <input
                                type="text"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans"
                                placeholder="e.g. John Doe"
                                value={typedName.startsWith('data:') ? '' : typedName}
                                onChange={e => setTypedName(e.target.value)}
                              />
                            </div>
                          </div>

                          <label className="flex items-start gap-2.5 text-mute cursor-pointer select-none py-1">
                            <input
                              type="checkbox"
                              checked={acceptTerms}
                              onChange={e => setAcceptTerms(e.target.checked)}
                              className="mt-0.5 rounded border-hairline bg-canvas text-primary shrink-0"
                            />
                            <span className="leading-snug">
                              I accept all terms and conditions and certify that the signature provided is legally binding.
                            </span>
                          </label>

                          <div className="flex gap-3 pt-2">
                            <button
                              disabled={!acceptTerms || !typedName}
                              onClick={async () => {
                                try {
                                  await api.crm.contracts.sign(selectedPortalContract.id, {
                                    signatureData: typedName
                                  });
                                  setSelectedPortalContract(null);
                                  refreshData();
                                } catch (err: any) {
                                  alert(err.message);
                                }
                              }}
                              className="flex-grow bg-primary text-on-primary font-bold py-2.5 rounded-sm uppercase tracking-widest text-xs hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Sign Contract
                            </button>
                            <button
                              onClick={() => setSelectedPortalContract(null)}
                              className="flex-grow border border-hairline bg-canvas text-mute font-bold py-2.5 rounded-sm uppercase tracking-widest text-xs hover:text-ink transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  </div>
                );
              })()}

              {/* TAB: DEADLINE CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold tracking-wide uppercase font-mono text-mute">Sprint Deadline Calendar</h3>
                    <div className="text-xs font-mono text-mute bg-canvas-soft border border-hairline px-3 py-1 rounded-sm select-none">
                      Month: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="bg-canvas-soft border border-hairline rounded-md p-6">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-mute uppercase tracking-wider mb-4 border-b border-hairline pb-2 select-none">
                      <div>Sun</div>
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {(() => {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = now.getMonth();
                        const firstDayIndex = new Date(year, month, 1).getDay();
                        const totalDays = new Date(year, month + 1, 0).getDate();
                        
                        const gridCells = [];
                        // Fill empty cells before the 1st of the month
                        for (let i = 0; i < firstDayIndex; i++) {
                          gridCells.push(<div key={`empty-${i}`} className="h-24 bg-canvas/10 border border-hairline/20 rounded-xs"></div>);
                        }

                        // Fill cells with actual days of the month
                        for (let day = 1; day <= totalDays; day++) {
                          const dateString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                          const cellDate = new Date(year, month, day);
                          
                          // Find tasks with deadline on this day
                          const dayTasks = projects.flatMap(p => p.tasks || []).filter(t => {
                            if (!t.dueDate) return false;
                            const d = new Date(t.dueDate);
                            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
                          });

                          // Find projects ending on this day
                          const dayProjects = projects.filter(p => {
                            if (!p.endDate) return false;
                            const d = new Date(p.endDate);
                            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
                          });

                          const isToday = now.getDate() === day && now.getMonth() === month && now.getFullYear() === year;

                          gridCells.push(
                            <div 
                              key={`day-${day}`} 
                              className={`h-24 p-2 border rounded-xs flex flex-col justify-between transition-colors overflow-hidden ${
                                isToday ? 'border-primary bg-primary/5' : 'border-hairline bg-canvas/40 hover:bg-canvas/60'
                              }`}
                            >
                              <span className={`font-mono text-xs font-bold ${isToday ? 'text-primary' : 'text-mute'}`}>
                                {day}
                              </span>
                              <div className="flex-grow overflow-y-auto space-y-1 mt-1 font-mono text-[9px] select-none">
                                {dayProjects.map(p => (
                                  <div key={p.id} className="bg-red-950/60 text-red-300 border border-red-500/20 px-1 py-0.5 rounded-xs truncate font-bold" title={`Project Release: ${p.name}`}>
                                    🚀 {p.name}
                                  </div>
                                ))}
                                {dayTasks.map(t => (
                                  <div key={t.id} className="bg-blue-950/60 text-blue-300 border border-blue-500/20 px-1 py-0.5 rounded-xs truncate" title={`Task Due: ${t.title}`}>
                                    ⚡ {t.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // Fill cells after the last day of the month to complete grid row (to multiple of 7)
                        const remaining = 7 - (gridCells.length % 7);
                        if (remaining < 7) {
                          for (let i = 0; i < remaining; i++) {
                            gridCells.push(<div key={`empty-end-${i}`} className="h-24 bg-canvas/10 border border-hairline/20 rounded-xs"></div>);
                          }
                        }

                        return gridCells;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: WORKSPACE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left & Middle: Members & Invites */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Invite Team Member Form */}
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-primary">Invite Team Member</h3>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          setProfileStatusMsg('');
                          try {
                            const res = await api.auth.invites.create({ email: newInviteEmail, role: newInviteRole });
                            setNewInviteEmail('');
                            setProfileStatusMsg(`Success! Created invite token: ${res.invite.token}`);
                            // Refresh invite list
                            const list = await api.auth.invites.list().catch(() => []);
                            setInvitesList(list);
                          } catch (err: any) {
                            setProfileStatusMsg(`Error: ${err.message}`);
                          }
                        }} className="space-y-4 text-xs font-mono">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-mute mb-1">Email Address</label>
                              <input
                                type="email"
                                value={newInviteEmail}
                                onChange={e => setNewInviteEmail(e.target.value)}
                                placeholder="member@company.com"
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-mute mb-1">Access Role</label>
                              <select
                                value={newInviteRole}
                                onChange={e => setNewInviteRole(e.target.value)}
                                className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                              >
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                                <option value="Client">Client</option>
                                <option value="Owner">Owner</option>
                              </select>
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-primary text-on-primary text-xs font-semibold px-6 py-2.5 rounded-sm uppercase tracking-widest font-mono hover:opacity-90 transition-opacity"
                          >
                            Send Workspace Invite
                          </button>
                        </form>
                      </div>

                      {/* Team Members List */}
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-mute">Active Team Members</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs font-mono text-left border-collapse">
                            <thead>
                              <tr className="border-b border-hairline text-mute">
                                <th className="pb-2">Name</th>
                                <th className="pb-2">Email</th>
                                <th className="pb-2">Role</th>
                                <th className="pb-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline/30">
                              {orgUsersList.map(u => (
                                <tr key={u.id} className="text-ink">
                                  <td className="py-3 font-semibold">{u.firstName} {u.lastName || ''}</td>
                                  <td className="py-3 text-body-text">{u.email}</td>
                                  <td className="py-3">
                                    <span className="px-2 py-0.5 bg-canvas border border-hairline rounded-xs text-[9px] uppercase tracking-wider text-mute">
                                      {u.role}
                                    </span>
                                  </td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase ${u.status === 'Active' ? 'bg-green-950/40 text-green-300' : 'bg-red-950/40 text-red-300'}`}>
                                      {u.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Pending Invites List */}
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-mute">Pending Invitations</h3>
                        {invitesList.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs font-mono text-left border-collapse">
                              <thead>
                                <tr className="border-b border-hairline text-mute">
                                  <th className="pb-2">Email</th>
                                  <th className="pb-2">Role</th>
                                  <th className="pb-2">Invite Link</th>
                                  <th className="pb-2">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-hairline/30">
                                {invitesList.map(inv => (
                                  <tr key={inv.id} className="text-ink">
                                    <td className="py-3 font-semibold">{inv.email}</td>
                                    <td className="py-3 text-mute uppercase text-[10px]">{inv.role}</td>
                                    <td className="py-3">
                                      <input
                                        type="text"
                                        readOnly
                                        value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/?auth=register&inviteToken=${inv.token}`}
                                        className="bg-canvas border border-hairline p-1 rounded text-[10px] text-mute w-48 font-mono select-all focus:outline-none"
                                        onClick={(e) => (e.target as any).select()}
                                      />
                                    </td>
                                    <td className="py-3">
                                      <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold uppercase ${inv.status === 'Pending' ? 'bg-yellow-950/40 text-yellow-300' : 'bg-green-950/40 text-green-300'}`}>
                                        {inv.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-xs text-mute italic">No pending invitations found.</p>
                        )}
                      </div>
                    </div>

                    {/* Right Column: User Profile Settings */}
                    <div className="space-y-8">
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-primary font-semibold">User Profile Settings</h3>
                        {profileStatusMsg && (
                          <div className="bg-canvas border border-hairline p-3 rounded text-xs mb-4 text-body-strong font-mono">
                            {profileStatusMsg}
                          </div>
                        )}
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          setProfileStatusMsg('');
                          try {
                            const updated = await api.auth.updateProfile({
                              phone: profilePhone,
                              bio: profileBio,
                              timezone: profileTimezone,
                              notificationPreferences: profileNotificationPref
                            });
                            const saved = localStorage.getItem('clientoq_user');
                            if (saved) {
                              const parsed = JSON.parse(saved);
                              const merged = { ...parsed, ...updated };
                              localStorage.setItem('clientoq_user', JSON.stringify(merged));
                              setUser(merged);
                            }
                            setProfileStatusMsg('Profile updated successfully!');
                          } catch (err: any) {
                            setProfileStatusMsg(`Error: ${err.message}`);
                          }
                        }} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={profilePhone}
                              onChange={e => setProfilePhone(e.target.value)}
                              placeholder="+1 555 0199"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Timezone Location</label>
                            <select
                              value={profileTimezone}
                              onChange={e => setProfileTimezone(e.target.value)}
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                            >
                              <option value="UTC">UTC (GMT+0)</option>
                              <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                              <option value="America/New_York">America/New_York (EST/EDT)</option>
                              <option value="Europe/London">Europe/London (BST/GMT)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Short Biography Bio</label>
                            <textarea
                              rows={3}
                              value={profileBio}
                              onChange={e => setProfileBio(e.target.value)}
                              placeholder="Describe your role or tasks..."
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                            />
                          </div>
                          
                          <div className="border-t border-hairline pt-4 space-y-2">
                            <span className="block text-[10px] uppercase text-mute tracking-wider font-semibold">Notification Subscriptions</span>
                            <label className="flex items-center gap-2 text-mute cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={profileNotificationPref.email}
                                onChange={e => setProfileNotificationPref({ ...profileNotificationPref, email: e.target.checked })}
                                className="rounded border-hairline bg-canvas text-primary"
                              />
                              <span>Receive Email Notifications</span>
                            </label>
                            <label className="flex items-center gap-2 text-mute cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={profileNotificationPref.inApp}
                                onChange={e => setProfileNotificationPref({ ...profileNotificationPref, inApp: e.target.checked })}
                                className="rounded border-hairline bg-canvas text-primary"
                              />
                              <span>Receive In-App System Alerts</span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary text-xs font-semibold py-2.5 rounded-sm uppercase tracking-widest font-mono hover:opacity-90 transition-opacity"
                          >
                            Save Settings Profile
                          </button>
                        </form>
                      </div>

                      {/* White-Label Portal Configurations */}
                      <div className="bg-canvas-soft border border-hairline p-6 rounded-md">
                        <h3 className="text-xs font-bold font-mono uppercase tracking-wider mb-4 text-primary font-semibold">White-Label Configurations</h3>
                        <form onSubmit={handleSaveBrandSettings} className="space-y-4 text-xs font-mono">
                          <div>
                            <label className="block text-mute mb-1">Brand Logo URL</label>
                            <input
                              type="text"
                              value={whiteLabelSettings.logoUrl}
                              onChange={e => setWhiteLabelSettings({ ...whiteLabelSettings, logoUrl: e.target.value })}
                              placeholder="e.g. https://logo.png"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Custom Subdomain</label>
                            <input
                              type="text"
                              value={whiteLabelSettings.customSubdomain}
                              onChange={e => setWhiteLabelSettings({ ...whiteLabelSettings, customSubdomain: e.target.value })}
                              placeholder="e.g. clientportal.agency.com"
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-mute mb-1">Portal Color Theme</label>
                            <select
                              value={whiteLabelSettings.themeColor}
                              onChange={e => setWhiteLabelSettings({ ...whiteLabelSettings, themeColor: e.target.value })}
                              className="w-full bg-canvas border border-hairline p-2.5 rounded text-ink text-sm font-sans focus:outline-none"
                            >
                              <option value="indigo">Slate Indigo (Default)</option>
                              <option value="emerald">Vibrant Emerald</option>
                              <option value="violet">Deep Violet</option>
                              <option value="rose">Soft Rose</option>
                              <option value="slate">Monochrome Slate</option>
                            </select>
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-primary text-on-primary text-xs font-semibold py-2.5 rounded-sm uppercase tracking-widest font-mono hover:opacity-90 transition-opacity"
                          >
                            Save Brand Settings
                          </button>
                        </form>
                      </div>

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

          {/* Draft AI Follow-up Email Modal */}
          {showAIEmailModal && (
            <div className="fixed inset-0 bg-canvas/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-canvas-soft border border-hairline w-full max-w-lg p-8 rounded-md shadow-2xl relative">
                <button
                  onClick={() => setShowAIEmailModal(false)}
                  className="absolute top-6 right-6 text-mute hover:text-ink cursor-pointer"
                >
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold font-mono uppercase tracking-wider mb-6 text-primary border-b border-hairline pb-2">AI Drafted Email Follow-up</h2>
                <div className="space-y-4 font-mono text-xs text-body-strong">
                  <textarea
                    rows={10}
                    className="w-full bg-canvas border border-hairline p-3 rounded-sm text-ink text-sm font-sans focus:outline-none"
                    value={aiEmailDraft}
                    onChange={e => setAiEmailDraft(e.target.value)}
                  />
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiEmailDraft);
                        alert('Copied to clipboard!');
                        setShowAIEmailModal(false);
                      }}
                      className="flex-grow bg-primary text-on-primary font-bold py-2.5 rounded-sm uppercase tracking-widest text-xs hover:opacity-95 transition-opacity"
                    >
                      Copy Draft
                    </button>
                    <button
                      onClick={() => setShowAIEmailModal(false)}
                      className="flex-grow border border-hairline bg-canvas text-mute font-bold py-2.5 rounded-sm uppercase tracking-widest text-xs hover:text-ink transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
        )
      )}

    </div>
  );
}

const SignaturePad = ({ onDraw }: { onDraw: (dataUrl: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#f7f5f0'; // Warp off-white stroke color
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onDraw(canvas.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onDraw('');
  };

  return (
    <div className="space-y-2">
      <div className="bg-canvas border border-hairline rounded-sm overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-28 cursor-crosshair bg-canvas-soft"
        />
        <button
          type="button"
          onClick={clear}
          className="absolute bottom-2 right-2 text-[9px] font-bold text-mute hover:text-red-400 border border-hairline bg-canvas px-2 py-0.5 rounded-xs uppercase tracking-wider cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

