'use client';

import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { CheckCircle2, Check, X, Zap, Shield, Users, Headphones, Sparkles, ArrowRight, Crown, Globe, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import SmoothScroll from '../../components/motion/SmoothScroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

interface Plan {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  badge: string | null;
  tier: string;
}

interface FeatureCategory {
  category: string;
  items: { feature: string; available: boolean | string }[];
}

interface PricingData {
  plans: Plan[];
  features: FeatureCategory[];
  stats: { value: string; label: string }[];
  faqItems: { q: string; a: string }[];
  trustBadges: { key: string; label: string }[];
}

const trustBadgeIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  security: Shield,
  datacenters: Globe,
  agencies: Users,
  support: Headphones,
};

export default function PricingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isInView = useInView(plansRef, { once: true, margin: '-100px' });
  const comparisonInView = useInView(comparisonRef, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const res = await fetch('/api/pricing');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setPricingData(data);
        setError(null);
      } catch (err) {
        console.warn('Pricing fetch error (non-critical):', err);
        setError(null);
        setPricingData({
          plans: [
            {
              id: 'basic',
              name: 'Basic',
              price: 0,
              priceDisplay: '₹0',
              period: 'forever',
              description: 'Perfect for solo operators starting out',
              features: ['Local SQLite database', '1 workspace instance', '10 AI prompts/month', 'Standard invoicing', 'Email support'],
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
              features: ['Shared database structure', '10 active team seats', 'Unlimited AI queries', 'WhatsApp broadcasts', 'Razorpay integration', 'Priority email support'],
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
              features: ['Dedicated database', 'Unlimited team seats', 'Custom whitelabeling', 'Multi-org management', '24/7 priority support', 'Custom integrations'],
              cta: 'Contact Sales',
              highlight: false,
              badge: 'ENTERPRISE',
              tier: 'premium'
            }
          ],
          features: [
            { category: 'Core CRM', items: [
              { feature: 'Lead & Contact Management', available: true },
              { feature: 'Pipeline Automation', available: true },
              { feature: 'AI-Powered Lead Scoring', available: true },
              { feature: 'Email Sequence Automation', available: true },
              { feature: 'Contact Segmentation', available: true },
            ]},
            { category: 'Project & Task', items: [
              { feature: 'Kanban & Gantt Views', available: true },
              { feature: 'Time Tracking & Logs', available: true },
              { feature: 'Client Portal Access', available: true },
              { feature: 'Milestone Management', available: true },
              { feature: 'Team Collaboration', available: true },
            ]},
            { category: 'Finance & Invoicing', items: [
              { feature: 'Multi-Currency Invoices', available: true },
              { feature: 'Razorpay Integration', available: true },
              { feature: 'Expense Tracking', available: true },
              { feature: 'Payment Reminders', available: true },
              { feature: 'GST-Ready Billing', available: true },
            ]},
            { category: 'Communication', items: [
              { feature: 'WhatsApp Business API', available: true },
              { feature: 'Shared Team Inbox', available: true },
              { feature: 'Broadcast Templates', available: true },
              { feature: 'Automated Notifications', available: true },
              { feature: 'Client Communication Log', available: true },
            ]},
            { category: 'Customization', items: [
              { feature: 'White-Label Portal', available: true },
              { feature: 'Custom Domain Mapping', available: true },
              { feature: 'Theme & Branding', available: true },
              { feature: 'API Access', available: true },
              { feature: 'Custom Workflows', available: true },
            ]},
            { category: 'Support & Security', items: [
              { feature: '24/7 Priority Support', available: 'Premium' },
              { feature: 'GDPR Compliant', available: true },
              { feature: 'End-to-End Encryption', available: true },
              { feature: 'Multi-Factor Auth', available: true },
              { feature: 'Audit Logs', available: true },
            ]},
          ],
          stats: [
            { value: '2,400+', label: 'Active Agencies' },
            { value: '₹18L+', label: 'Monthly Revenue Tracked' },
            { value: '50,000+', label: 'Invoices Processed' },
            { value: '98%', label: 'Retention Rate' },
          ],
          faqItems: [
            { q: "Can I switch plans later?", a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments." },
            { q: "Is there a free trial available?", a: "Yes, our Basic plan is free forever with essential features. For paid plans, we offer a 14-day trial with full access to all features." },
            { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and Razorpay payments. For annual subscriptions, we also offer bank transfers." },
            { q: "How does the client portal work?", a: "Each client gets their own secure portal where they can view project progress, download invoices, approve proposals, and communicate with your team." },
            { q: "Is my data secure?", a: "We use bank-grade 256-bit encryption, GDPR-compliant data handling, and regular security audits. Your data is stored in Indian data centers." },
            { q: "Do you offer custom enterprise plans?", a: "Yes! For agencies with 50+ users or complex requirements, we offer custom Enterprise plans with dedicated support and custom integrations." },
          ],
          trustBadges: [
            { key: 'security', label: 'Bank-Grade Security' },
            { key: 'datacenters', label: 'Indian Data Centers' },
            { key: 'agencies', label: '2,400+ Agencies' },
            { key: 'support', label: '24/7 Support' },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  useEffect(() => {
    if (!pricingData || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo('.pricing-hero-text',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )
      .fromTo('.pricing-badge',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5 },
        '-=0.4'
      );

      gsap.fromTo('.plan-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: plansRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo('.comparison-card',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: comparisonRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo('.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: faqRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [pricingData]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f0eb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={32} className="text-[#00754A] animate-spin" />
          <p className="text-sm text-[rgba(0,0,0,0.58)] font-mono">Loading pricing...</p>
        </div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div className="min-h-screen bg-[#f2f0eb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle size={32} className="text-red-500" />
          <p className="text-sm text-[rgba(0,0,0,0.58)] font-mono">{error || 'Failed to load pricing data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00754A] text-white rounded-full text-xs font-mono"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f0eb] text-[rgba(0,0,0,0.87)] flex flex-col font-sans selection:bg-[#00754A] selection:text-white">
      <SmoothScroll>
        <Header />
        
        {/* Hero Section */}
        <section ref={heroRef} className="pt-20 pb-16 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4e9e2]/30 to-transparent pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div 
              className="pricing-badge inline-flex items-center gap-2 bg-[#00754A]/10 text-[#00754A] text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Zap size={14} />
              <span>Transparent Pricing</span>
            </motion.div>
            
            <h1 className="pricing-hero-text text-4xl md:text-6xl font-bold tracking-tight text-[#006241] mb-4" style={{ letterSpacing: '-0.01em' }}>
              Plans That Scale With Your Agency
            </h1>
            
            <p className="pricing-hero-text text-lg text-[rgba(0,0,0,0.58)] max-w-2xl mx-auto mb-8" style={{ letterSpacing: '-0.01em' }}>
              Stop paying for bloated tools that do less. Get CRM, projects, invoicing, and WhatsApp integration in one cohesive workspace — starting free.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6">
              {pricingData.trustBadges.map((badge) => {
                const Icon = trustBadgeIcons[badge.key] || Shield;
                return (
                  <div key={badge.key} className="flex items-center gap-2 text-[rgba(0,0,0,0.58)]">
                    <Icon size={16} className="text-[#00754A]" />
                    <span className="text-xs font-mono uppercase tracking-wider">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section ref={plansRef} className="py-16 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingData.plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  className={`plan-card relative rounded-xl p-8 ${
                    plan.highlight
                      ? 'bg-[#1E3932] text-white shadow-2xl scale-105 z-10'
                      : 'bg-white shadow-lg'
                  }`}
                  initial={{ opacity: 0, y: 60, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest ${
                      plan.highlight ? 'bg-[#00754A] text-white' : 'bg-[#f2f0eb] text-[#1E3932]'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${plan.highlight ? 'text-[#d4e9e2]' : 'text-[rgba(0,0,0,0.58)]'}`}>
                      {plan.name}
                    </span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-bold" style={{ letterSpacing: '-0.01em' }}>
                        {plan.priceDisplay}
                      </span>
                      <span className={`text-xs ${plan.highlight ? 'text-[rgba(255,255,255,0.7)]' : 'text-[rgba(0,0,0,0.58)]'}`}>
                        /{plan.period}
                      </span>
                    </div>
                    <p className={`text-xs mt-2 ${plan.highlight ? 'text-[rgba(255,255,255,0.7)]' : 'text-[rgba(0,0,0,0.58)]'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check size={14} className={plan.highlight ? 'text-[#d4e9e2]' : 'text-[#00754A]'} />
                        <span className={plan.highlight ? 'text-white' : 'text-[rgba(0,0,0,0.87)]'}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    className={`w-full py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-all ${
                      plan.highlight
                        ? 'bg-white text-[#00754A] hover:bg-[#d4e9e2]'
                        : 'bg-[#00754A] text-white hover:opacity-90'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Comparison Table */}
        <section ref={comparisonRef} className="py-16 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <motion.div 
                className="inline-flex items-center gap-2 bg-[#00754A]/10 text-[#00754A] text-[10px] font-mono uppercase tracking-widest px-4 py-2 rounded-full mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Crown size={14} />
                <span>Everything You Need</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#006241] mb-3" style={{ letterSpacing: '-0.01em' }}>
                One Platform. Complete Agency Stack.
              </h2>
              <p className="text-[rgba(0,0,0,0.58)] text-sm max-w-xl mx-auto">
                Stop juggling multiple tools. Clientoq brings your entire agency workflow into one cohesive workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pricingData.features.map((category, catIndex) => (
                <motion.div
                  key={category.category}
                  className="comparison-card bg-[#f2f0eb] rounded-xl p-6 border border-[#e7e7e7]/50 hover:shadow-lg hover:border-[#00754A]/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={comparisonInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: catIndex * 0.08 }}
                >
                  <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#00754A] font-bold mb-4 pb-3 border-b border-[#e7e7e7]">
                    {category.category}
                  </h3>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        {typeof item.available === 'string' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#00754A]/10 text-[#00754A] text-[9px] font-mono font-bold rounded-full uppercase">
                            {item.available}
                          </span>
                        ) : item.available ? (
                          <CheckCircle2 size={16} className="text-[#00754A] shrink-0 mt-0.5" />
                        ) : (
                          <X size={16} className="text-[rgba(0,0,0,0.2)] shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs ${item.available ? 'text-[rgba(0,0,0,0.87)]' : 'text-[rgba(0,0,0,0.38)]'}`}>
                          {item.feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="inline-flex items-center gap-2 bg-[#00754A] text-white px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Your Free Trial
                <ArrowRight size={14} />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-8 bg-[#1E3932]">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {pricingData.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>
                    {stat.value}
                  </div>
                  <div className="text-[rgba(255,255,255,0.7)] text-xs font-mono uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="py-16 px-8 bg-[#f2f0eb]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#006241] mb-3" style={{ letterSpacing: '-0.01em' }}>
                Frequently Asked Questions
              </h2>
              <p className="text-[rgba(0,0,0,0.58)] text-sm">
                Everything you need to know about our pricing and plans.
              </p>
            </div>

            <div className="space-y-3">
              {pricingData.faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="faq-item bg-white rounded-lg overflow-hidden shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-xs font-bold text-[rgba(0,0,0,0.87)] pr-4">{item.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-[#00754A] shrink-0" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-xs text-[rgba(0,0,0,0.58)] leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-8 bg-[#00754A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles size={32} className="text-white/80 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.01em' }}>
                Ready to Transform Your Agency?
              </h2>
              <p className="text-[rgba(255,255,255,0.8)] text-sm mb-8 max-w-xl mx-auto">
                Join 2,400+ agencies who replaced their scattered SaaS stack with Clientoq. Start free, upgrade when you&apos;re ready.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="bg-white text-[#00754A] px-8 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free Trial
                  <ArrowRight size={14} />
                </motion.button>
                <motion.button
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-widest"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </SmoothScroll>
    </div>
  );
}