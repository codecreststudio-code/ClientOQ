'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SmoothScroll from '../../components/motion/SmoothScroll';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <SmoothScroll>
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full py-20 px-8 flex flex-col gap-8" id="main-content">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Operational Guidelines ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Terms of Service
          </h1>
          <span className="text-[10px] font-mono text-mute uppercase tracking-wider block">Effective Date: June 13, 2026</span>
        </div>

        <div className="prose prose-invert max-w-none text-xs text-body-text leading-relaxed font-sans space-y-6">
          <p>
            By accessing or using Clientoq, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you must cease all access to the workspace application immediately.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">1. Workspace Access & Tenant Registration</h2>
          <p>
            You must register a valid email address and password to initialize a database tenant. You are responsible for keeping your login credentials confidential and monitoring team member actions inside your workspace.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">2. Acceptable Use Policy</h2>
          <p>
            You agree not to exploit Clientoq's automated notification APIs, WhatsApp template routers, or invoice generators to broadcast spam, distribute malware, commit transaction fraud, or violate Meta's WhatsApp Developer terms of service.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">3. Subscription Billing & Fees</h2>
          <p>
            We bill subscription charges in advance on a recurring monthly cycle. All listed pricing plans (Free, Standard ₹699, Premium ₹1,999) do not carry any additional tax charges. Failure to settle invoice balances will result in access suspension.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">4. Disclaimers & Limitation of Liability</h2>
          <p>
            Clientoq is provided 'as is' and 'as available'. We do not guarantee uninterrupted server uptime or error-free API syncs. To the maximum extent permitted by law, our liability is limited to the subscription fees paid to us in the preceding billing cycle.
          </p>
        </div>
      </main>
      <Footer />
      </SmoothScroll>
    </div>
  );
}
