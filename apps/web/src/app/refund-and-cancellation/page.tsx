'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function RefundAndCancellationPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full py-20 px-8 flex flex-col gap-8" id="main-content">
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Dispute Guidelines ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Refund & Cancellation Policy
          </h1>
          <span className="text-[10px] font-mono text-mute uppercase tracking-wider block">Effective Date: June 13, 2026</span>
        </div>

        <div className="prose prose-invert max-w-none text-xs text-body-text leading-relaxed font-sans space-y-6">
          <p>
            This policy outlines subscription cancellation rights and refund claim procedures for all paid services on Clientoq.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">1. Cancel Subscription</h2>
          <p>
            You can cancel your Standard (₹699/mo) or Premium (₹1,999/mo) plan subscription at any time. To cancel, navigate to your workspace settings panel and trigger the cancellation request. Your access will remain active until the end of the current paid billing cycle, and no further automated charges will occur.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">2. Refund Claims</h2>
          <p>
            We offer a <strong>7-day money-back guarantee</strong> for new subscription activations. If you cancel your subscription and request a refund within 7 calendar days of your initial payment transaction, we will refund the complete subscription fee.
          </p>
          <p>
            To lodge a refund request, email us at <a href="mailto:support@clientoq.in" className="text-primary hover:underline">support@clientoq.in</a> detailing your registered tenant ID and checkout reference details.
          </p>

          <h2 className="font-mono text-xs font-bold text-ink uppercase tracking-wider mt-6 mb-2">3. Processing Time</h2>
          <p>
            Approved refund requests are credited back to the original payment source (credit card, UPI, or net banking) via our Razorpay gateway node within <strong>5 to 7 business days</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
