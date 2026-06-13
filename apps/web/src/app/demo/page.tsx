'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Play, Terminal, HelpCircle, ArrowRight } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ System Overview ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            See Clientoq in Action
          </h1>
          <p className="text-body-text text-sm font-serif italic">
            Watch our workspace guide overview or log in to the interactive sandbox on our homepage to test features live.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="bg-canvas-soft border border-hairline rounded-md overflow-hidden aspect-video flex flex-col items-center justify-center p-8 gap-4 hover:border-mute/40 transition-colors group relative">
          <div className="absolute inset-0 bg-gradient-to-t from-canvas/40 to-transparent z-0"></div>
          
          <button 
            className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg z-10 cursor-pointer"
            onClick={() => alert("Video demo placeholder. You can interact with the live Sandbox workspace on the homepage directly!")}
          >
            <Play size={24} className="fill-current text-white translate-x-0.5" />
          </button>
          
          <span className="font-mono text-xs uppercase text-ink tracking-wider font-semibold z-10">
            Clientoq Onboarding Video Guide
          </span>
          <span className="text-[10px] text-mute font-mono z-10 font-medium">
            Duration: 4 minutes • 1080p Web Stream
          </span>
        </div>

        {/* Sandbox CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between hover:border-mute/40 transition-colors">
            <div className="flex flex-col gap-2">
              <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink flex items-center gap-2">
                <Terminal size={16} className="text-orange-500" /> Test Live Sandbox
              </h2>
              <p className="text-body-text text-xs font-sans leading-relaxed">
                We have embedded a fully interactive dashboard simulator on our home page. Switch between the Analytics, CRM, and Billing Ledger tabs instantly to see the operational flow.
              </p>
            </div>
            <a 
              href="/#sandbox" 
              className="text-xs font-bold font-mono uppercase text-orange-500 hover:text-orange-400 mt-6 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Go to Sandbox <ArrowRight size={14} />
            </a>
          </div>

          <div className="bg-canvas-soft border border-hairline p-6 rounded-md flex flex-col justify-between hover:border-mute/40 transition-colors">
            <div className="flex flex-col gap-2">
              <h2 className="text-md font-bold uppercase font-mono tracking-tight text-ink flex items-center gap-2">
                <HelpCircle size={16} className="text-orange-500" /> Have Questions?
              </h2>
              <p className="text-body-text text-xs font-sans leading-relaxed">
                Check our Frequently Asked Questions section to learn more about setting up custom domain integrations, pricing limits, and local database security protocols.
              </p>
            </div>
            <a 
              href="/faq" 
              className="text-xs font-bold font-mono uppercase text-orange-500 hover:text-orange-400 mt-6 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Check FAQs <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="bg-canvas-soft border border-hairline p-8 rounded-md text-center flex flex-col items-center gap-4 mt-8">
          <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-ink">Ready to start?</h3>
          <p className="text-body-text text-xs font-serif italic max-w-md">
            Click launch console to log in to the default workspace environment instantly.
          </p>
          <a
            href="/?auth=login"
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-3 rounded-sm font-mono uppercase tracking-widest mt-2 cursor-pointer"
          >
            Launch Console
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
