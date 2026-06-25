'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { LayoutDashboard, Users, Briefcase, DollarSign, MessageSquare, Cpu } from 'lucide-react';
import SmoothScroll from '../../components/motion/SmoothScroll';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <SmoothScroll>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Workstation Capabilities ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            An Integrated System for Client Operations
          </h1>
          <p className="text-body-text text-sm font-serif italic">
            Clientoq brings lead capturing, client hubs, agile task execution, and automated invoicing together in a unified, high-performance workstation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Users size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Lead Intake & CRM</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Organize pipeline stages, record phone or email touchpoints, attach engagement agreements, and manage relationships using a drag-and-drop board. Transition won prospects into active spaces instantly.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Briefcase size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Project Workspaces</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Track active delivery cycles, map roadmap milestones, manage task cards, and monitor estimated hours. Give clients dedicated access to live dashboard readouts.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <DollarSign size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Invoicing Ledgers & Expenses</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Generate itemized custom currency invoices, track business expenses, record cash flows, and collect customer payments through built-in Razorpay checkout integrations.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">WhatsApp Notifications</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Link with the official Meta WhatsApp API to broadcast automated invoice links, update project statuses, and review responses in a collaborative shared message inbox.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Cpu size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Assisted AI Core</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Leverage an embedded LLM context engine to outline work scopes, draft custom follow-ups, synthesize code milestones, and perform quick audits on resource allocation.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <LayoutDashboard size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Control Dashboard</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Observe critical agency vitals like accounts receivable totals, monthly run-rate metrics, team capacity statistics, and system event triggers from a centralized pane.
            </p>
          </div>
        </div>

        <div className="bg-canvas-soft border border-hairline p-8 rounded-md text-center flex flex-col items-center gap-4 mt-8">
          <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-ink">Ready to try it out?</h3>
          <p className="text-body-text text-xs font-serif italic max-w-md">
            Experiment with the live mock system right on our landing page, or create a secure client console.
          </p>
          <a
            href="/?auth=register"
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest mt-2 cursor-pointer"
          >
            Start Free Account
          </a>
        </div>
      </main>
      <Footer />
      </SmoothScroll>
    </div>
  );
}
