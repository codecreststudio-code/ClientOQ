'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I use Clientoq completely free of charge?",
      a: "Yes. Our Basic tier is lifetime free and stores data locally using SQLite, which is ideal for single practitioners looking to handle client projects and draft tax invoices."
    },
    {
      q: "How do WhatsApp notifications function?",
      a: "Clientoq features a built-in webhook receiver. Once you plug in your Meta developer token parameters, our system parses verification handshakes and incoming notifications to show them inside the app team inbox."
    },
    {
      q: "Which billing systems are integrated?",
      a: "We currently interface directly with Razorpay, allowing you to settle cgst/sgst bills easily. We are planning support for other processors in subsequent cycles."
    },
    {
      q: "Is my organization and transaction data secure?",
      a: "Yes. Clientoq is structured as a single-tenant environment. Data sits inside distinct files or isolated schemas depending on your tier, so it is never aggregated or mixed with other tenants."
    },
    {
      q: "Are the monthly subscription levels subject to GST?",
      a: "Yes. Subscriptions exclude 18% IGST. We generate and email proper invoices carrying your business registration GST details automatically upon billing clearance."
    },
    {
      q: "Can I cancel my account or get a refund?",
      a: "You can cancel your subscription anytime via your workspace settings pane. Cancellations take effect at the end of the active cycle. Refund claims are processed under our refund policies within 7 days."
    }
  ];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-semibold text-primary tracking-widest">[ Frequently Asked Questions ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight font-serif italic">
            Common Inquiries
          </h1>
          <p className="text-body-text text-sm font-sans">
            Find immediate answers regarding pricing tiers, database setup parameters, and payment automations.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4 mt-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-canvas-soft border border-hairline rounded-lg overflow-hidden hover:border-mute/30 transition-colors starbucks-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between font-sans text-sm font-semibold text-ink tracking-tight select-none cursor-pointer"
              >
                <span>{faq.q}</span>
                {openIndex === idx ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} className="text-primary" />}
              </button>
              
              {openIndex === idx && (
                <div className="px-5 pb-5 pt-1 border-t border-hairline/30">
                  <p className="text-body-text text-xs leading-relaxed font-sans">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-canvas-soft border border-hairline p-8 rounded-lg text-center flex flex-col items-center gap-4 mt-8 starbucks-shadow">
          <h3 className="text-lg font-bold text-ink font-serif italic">Have a unique scenario?</h3>
          <p className="text-body-text text-xs font-sans max-w-md">
            Reach out directly to our help desk support. We respond to all technical queries within 12 business hours.
          </p>
          <a
            href="/contact"
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-full font-sans uppercase tracking-widest mt-2 cursor-pointer active:scale-95 shadow-sm"
          >
            Contact Support
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
