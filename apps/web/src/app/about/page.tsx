'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Target, Users, Code, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Our Philosophy ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            The Clientoq Story
          </h1>
          <p className="text-body-text text-sm font-serif italic">
            Building software that eliminates back-office management chaos for Indian freelancers and digital service agencies.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-xs text-body-text leading-relaxed font-sans space-y-6">
          <p>
            Clientoq was created in 2026 to resolve a major pain point felt by thousands of independent contractors and digital agencies in India: <strong>fragmented workspace tools</strong>. Running a successful business usually required paying for four to five distinct SaaS apps: one for CRM, another for projects, others for invoicing, client portals, and client communications.
          </p>
          <p>
            Our core mission is to deliver a consolidated, high-performance, single-tenant canvas that handles all these workflows in one warm-charcoal workspace. We prioritize speed, security, and developer-centric aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-canvas-soft border border-hairline p-5 rounded flex gap-4 hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Target size={18} />
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold">100% Consolidated</h3>
              <p className="text-mute text-[11px] mt-1">No messy integrations. Invoices link to projects, which relate to tasks, contacts, and active logs automatically.</p>
            </div>
          </div>

          <div className="bg-canvas-soft border border-hairline p-5 rounded flex gap-4 hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Users size={18} />
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold">Built for Indian Ops</h3>
              <p className="text-mute text-[11px] mt-1">Out of the box support for 18% GST invoices, CGST/SGST calculations, and local webhooks like Razorpay.</p>
            </div>
          </div>

          <div className="bg-canvas-soft border border-hairline p-5 rounded flex gap-4 hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Code size={18} />
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold">Developer Centric</h3>
              <p className="text-mute text-[11px] mt-1">Monospaced layouts, warm-charcoal themes, high-contrast dark modes, and fast, light-weight client pages.</p>
            </div>
          </div>

          <div className="bg-canvas-soft border border-hairline p-5 rounded flex gap-4 hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-bold">Privacy First</h3>
              <p className="text-mute text-[11px] mt-1">Single-tenant hosting options and SQLite local files mean your transaction databases belong solely to you.</p>
            </div>
          </div>
        </div>

        <div className="bg-canvas-soft border border-hairline p-8 rounded-md text-center flex flex-col items-center gap-4 mt-8">
          <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-ink">Join our journey</h3>
          <p className="text-body-text text-xs font-serif italic max-w-md">
            Built with care for Indian agencies and freelancers. Initialize your team workspace now.
          </p>
          <a
            href="/?auth-register"
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest mt-2 cursor-pointer"
          >
            Create Workspace
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
