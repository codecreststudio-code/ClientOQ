'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ArrowRight, Sparkles, CheckCircle2, UserPlus, FileText } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Step-By-Step Workflow ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            How Clientoq Operates
          </h1>
          <p className="text-body-text text-sm font-serif italic">
            Go from account creation to client delivery in minutes. Clientoq aligns lead captures, workspace delivery, milestones, and payment checkouts.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-8 mt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start bg-canvas-soft border border-hairline p-6 rounded-md">
            <div className="w-12 h-12 rounded-full bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-mono font-bold text-orange-500 text-lg shrink-0">
              1
            </div>
            <div className="flex-grow">
              <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink flex items-center gap-2">
                Initialize Private Environment <Sparkles size={14} className="text-orange-500 animate-spin" />
              </h2>
              <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
                Click <strong>Launch Console</strong> to register your workspace instance. Clientoq spins up an isolated, private database scope that holds your logs, metrics, and templates securely.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-canvas-soft border border-hairline p-6 rounded-md">
            <div className="w-12 h-12 rounded-full bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-mono font-bold text-orange-500 text-lg shrink-0">
              2
            </div>
            <div className="flex-grow">
              <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink flex items-center gap-2">
                Qualify Leads & Onboard Clients <UserPlus size={14} className="text-orange-500" />
              </h2>
              <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
                Import potential leads manually or connect endpoints. Log communications, attach contracts, and draft scopes of work using the assisted AI assistant. Win the lead to generate a corresponding client workspace with a single click.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-canvas-soft border border-hairline p-6 rounded-md">
            <div className="w-12 h-12 rounded-full bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-mono font-bold text-orange-500 text-lg shrink-0">
              3
            </div>
            <div className="flex-grow">
              <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink flex items-center gap-2">
                Structure Delivery & Sprint Tasks <FileText size={14} className="text-orange-500" />
              </h2>
              <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
                Establish budgets, map execution milestones, assign duties to your team, and record hourly tracking logs. Share clean status dashboard views with clients to maintain complete visibility.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start bg-canvas-soft border border-hairline p-6 rounded-md">
            <div className="w-12 h-12 rounded-full bg-orange-950/40 border border-orange-500/20 flex items-center justify-center font-mono font-bold text-orange-500 text-lg shrink-0">
              4
            </div>
            <div className="flex-grow">
              <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink flex items-center gap-2">
                Bill Customers & Trigger Alerts <CheckCircle2 size={14} className="text-orange-500" />
              </h2>
              <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
                Compile itemized bills with custom tax parameters. Clientoq sends notifications to customers with hosted UPI/card payment checkout links. Settlement details post straight back to your financial reports.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-canvas-soft border border-hairline p-8 rounded-md text-center flex flex-col items-center gap-4 mt-8">
          <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-ink">Ready to begin?</h3>
          <p className="text-body-text text-xs font-serif italic max-w-md">
            Streamline your delivery engine and payment loops today. Setup takes less than three minutes.
          </p>
          <a
            href="/?auth=register"
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest mt-2 cursor-pointer"
          >
            Create Your Account
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
