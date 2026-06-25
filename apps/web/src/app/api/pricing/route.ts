import { NextResponse } from 'next/server';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    priceDisplay: '₹0',
    period: 'forever',
    description: 'Perfect for solo operators starting out',
    features: [
      'Local SQLite database',
      '1 workspace instance',
      '10 AI prompts/month',
      'Standard invoicing',
      'Email support'
    ],
    cta: 'Start Free',
    highlight: false,
    badge: null,
    tier: 'free'
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 699,
    priceDisplay: '₹699',
    period: 'month',
    description: 'Complete operating stack for growing teams',
    features: [
      'Shared database structure',
      '10 active team seats',
      'Unlimited AI queries',
      'WhatsApp broadcasts',
      'Razorpay integration',
      'Priority email support'
    ],
    cta: 'Start 14-day Trial',
    highlight: true,
    badge: 'MOST POPULAR',
    tier: 'standard'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    priceDisplay: '₹1,999',
    period: 'month',
    description: 'Enterprise power for mature agencies',
    features: [
      'Dedicated database',
      'Unlimited team seats',
      'Custom whitelabeling',
      'Multi-org management',
      '24/7 priority support',
      'Custom integrations'
    ],
    cta: 'Contact Sales',
    highlight: false,
    badge: 'ENTERPRISE',
    tier: 'premium'
  }
];

const features = [
  {
    category: 'Core CRM',
    items: [
      { feature: 'Lead & Contact Management', available: true },
      { feature: 'Pipeline Automation', available: true },
      { feature: 'AI-Powered Lead Scoring', available: true },
      { feature: 'Email Sequence Automation', available: true },
      { feature: 'Contact Segmentation', available: true },
    ]
  },
  {
    category: 'Project & Task',
    items: [
      { feature: 'Kanban & Gantt Views', available: true },
      { feature: 'Time Tracking & Logs', available: true },
      { feature: 'Client Portal Access', available: true },
      { feature: 'Milestone Management', available: true },
      { feature: 'Team Collaboration', available: true },
    ]
  },
  {
    category: 'Finance & Invoicing',
    items: [
      { feature: 'Multi-Currency Invoices', available: true },
      { feature: 'Razorpay Integration', available: true },
      { feature: 'Expense Tracking', available: true },
      { feature: 'Payment Reminders', available: true },
      { feature: 'GST-Ready Billing', available: true },
    ]
  },
  {
    category: 'Communication',
    items: [
      { feature: 'WhatsApp Business API', available: true },
      { feature: 'Shared Team Inbox', available: true },
      { feature: 'Broadcast Templates', available: true },
      { feature: 'Automated Notifications', available: true },
      { feature: 'Client Communication Log', available: true },
    ]
  },
  {
    category: 'Customization',
    items: [
      { feature: 'White-Label Portal', available: true },
      { feature: 'Custom Domain Mapping', available: true },
      { feature: 'Theme & Branding', available: true },
      { feature: 'API Access', available: true },
      { feature: 'Custom Workflows', available: true },
    ]
  },
  {
    category: 'Support & Security',
    items: [
      { feature: '24/7 Priority Support', available: 'Premium' },
      { feature: 'GDPR Compliant', available: true },
      { feature: 'End-to-End Encryption', available: true },
      { feature: 'Multi-Factor Auth', available: true },
      { feature: 'Audit Logs', available: true },
    ]
  },
];

const stats = [
  { value: '2,400+', label: 'Active Agencies' },
  { value: '₹18L+', label: 'Monthly Revenue Tracked' },
  { value: '50,000+', label: 'Invoices Processed' },
  { value: '98%', label: 'Retention Rate' },
];

const faqItems = [
  {
    q: "Can I switch plans later?",
    a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments."
  },
  {
    q: "Is there a free trial available?",
    a: "Yes, our Basic plan is free forever with essential features. For paid plans, we offer a 14-day trial with full access to all features."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and Razorpay payments. For annual subscriptions, we also offer bank transfers."
  },
  {
    q: "How does the client portal work?",
    a: "Each client gets their own secure portal where they can view project progress, download invoices, approve proposals, and communicate with your team."
  },
  {
    q: "Is my data secure?",
    a: "We use bank-grade 256-bit encryption, GDPR-compliant data handling, and regular security audits. Your data is stored in Indian data centers."
  },
  {
    q: "Do you offer custom enterprise plans?",
    a: "Yes! For agencies with 50+ users or complex requirements, we offer custom Enterprise plans with dedicated support and custom integrations."
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      plans: pricingPlans,
      features,
      stats,
      faqItems,
      trustBadges: [
        { key: 'security', label: 'Bank-Grade Security' },
        { key: 'datacenters', label: 'Indian Data Centers' },
        { key: 'agencies', label: '2,400+ Agencies' },
        { key: 'support', label: '24/7 Support' },
      ]
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pricing data' }, { status: 500 });
  }
}