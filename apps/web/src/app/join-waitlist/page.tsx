'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Send, CheckCircle, ArrowRight } from 'lucide-react';

export default function JoinWaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubmitted(true);
      setEmailInput('');
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-xl mx-auto w-full py-20 px-8 flex flex-col justify-center gap-12" id="main-content">
        {submitted ? (
          <div className="bg-canvas-soft border border-green-500/30 p-10 rounded-md text-center flex flex-col items-center gap-5 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-green-950/50 flex items-center justify-center text-green-400">
              <CheckCircle size={28} />
            </div>
            <h1 className="font-mono text-base uppercase font-bold text-ink tracking-tight">You Are On The List!</h1>
            <p className="text-body-text text-xs font-serif italic max-w-sm">
              Thanks for joining the Clientoq waitlist. We will notify you via email as soon as new single-tenant database instances are provisioned.
            </p>
            <a 
              href="/" 
              className="mt-6 border border-hairline hover:bg-canvas text-ink text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              Back to Home <ArrowRight size={14} />
            </a>
          </div>
        ) : (
          <div className="bg-canvas-soft border border-hairline p-8 rounded-md flex flex-col gap-6 shadow-2xl">
            <div className="text-center flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Early Access ]</span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink font-mono uppercase">
                Join Clientoq Waitlist
              </h1>
              <p className="text-body-text text-xs font-serif italic max-w-sm mx-auto">
                Be the first to know when we launch dedicated team seats, custom domain integrations, and advanced template builders.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-mute uppercase tracking-wider mb-1 font-mono">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full bg-canvas border border-hairline p-3 rounded-sm text-xs focus:outline-none focus:border-primary text-ink font-sans"
                  placeholder="e.g. hello@clientoq.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:opacity-90 text-on-primary text-xs font-bold py-3.5 rounded-sm font-mono uppercase tracking-widest transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                Join Waitlist <Send size={12} />
              </button>
            </form>

            <span className="text-[9px] text-mute font-mono text-center block">
              Zero spam. Unsubscribe anytime.
            </span>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
