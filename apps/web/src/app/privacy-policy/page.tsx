'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full py-20 px-8 flex flex-col gap-8" id="main-content">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Privacy Guidelines ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Privacy Policy
          </h1>
          <span className="text-[10px] font-mono text-mute uppercase tracking-wider block">Effective Date: June 13, 2026</span>
        </div>

        <div className="prose prose-invert max-w-none text-xs text-body-text leading-relaxed font-sans space-y-6">
          <p>
            At Clientoq, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy describes how we collect, store, share, and protect your information when you access or use the Clientoq business operating workstation.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when initializing a workspace tenant, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Account credentials (name, email address, hashed passwords).</li>
            <li>Organization details (agency name, brand preferences).</li>
            <li>Billing configurations (tax registry numbers, billing addresses).</li>
          </ul>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">2. How We Use Information</h2>
          <p>
            We utilize the collected data strictly to run and support your workspace operations, including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Authenticating dashboard login sessions.</li>
            <li>Compiling tax invoices and logging payment settlements.</li>
            <li>Relaying WhatsApp webhook message broadcasts.</li>
            <li>Providing technical assistance and answering support tickets.</li>
          </ul>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">3. Storage & Data Security</h2>
          <p>
            Clientoq utilizes single-tenant architectures. Your SQLite database is hosted locally or within isolated server environments. We never sell, rent, or distribute your invoice databases or prospect lists to third-party marketing brokers.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">4. Indian Information Technology Act Compliance</h2>
          <p>
            Our information storage and processing procedures align with Section 43A of the Indian Information Technology Act, 2000, and rules framed thereunder regarding the collection of sensitive personal data or information.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
