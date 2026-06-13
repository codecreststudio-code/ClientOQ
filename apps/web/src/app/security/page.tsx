'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Shield, Lock, Database, Globe } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Core Security ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Data Integrity & Safety
          </h1>
          <p className="text-body-text text-sm font-serif italic">
            How Clientoq protects your CRM records, team sprint boards, and invoice databases.
          </p>
        </div>

        <div className="prose prose-invert max-w-none text-xs text-body-text leading-relaxed font-sans space-y-6">
          <p>
            At Clientoq, we believe that security is not an add-on; it is the core foundation of a business operating system. Because you manage sensitive financials, tax numbers, and communication channels, we use security hardening protocols to prevent unauthorized access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Shield size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Global Throttling & Rate Limits</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              We protect all Clientoq API endpoints with global NestJS throttler guards. Every IP is restricted to 100 requests per minute to prevent brute-force attacks and denial-of-service vulnerabilities.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Lock size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">SSL & Environment CORS</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              All communications are encrypted using modern TLS protocols. Our backend CORS settings dynamically check and allow requests only from verified client-side environments configured via security keys.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Database size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Single-Tenant Database Files</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              For SQLite deployment files, every client gets a discrete private database instance. We never cross-contaminate lead tables, task checklist objects, or payment ledger lines across org identifiers.
            </p>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md hover:border-mute/40 transition-colors">
            <div className="w-10 h-10 rounded bg-orange-950/40 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
              <Globe size={20} />
            </div>
            <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink">Server-to-Server Webhook Auth</h2>
            <p className="text-body-text text-xs mt-2 font-sans leading-relaxed">
              Our billing webhooks are secured using signature verification. When Razorpay captured payments post data back to our endpoints, signature hashes must match our workspace environment secrets.
            </p>
          </div>
        </div>

        <div className="bg-canvas-soft border border-hairline p-8 rounded-md text-center flex flex-col items-center gap-4 mt-8">
          <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-ink">Have a security question?</h3>
          <p className="text-body-text text-xs font-serif italic max-w-md">
            Contact our developer security desk for details on deployment configurations.
          </p>
          <a
            href="/contact"
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest mt-2 cursor-pointer"
          >
            Contact Desk
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
