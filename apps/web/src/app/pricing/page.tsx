'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Check, Info } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-primary tracking-widest">[ Transparent Pricing ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Flexible Plans for Growing Agencies
          </h1>
          <p className="text-body-text text-sm font-serif italic">
            Get started with our free tier, or choose standard and premium levels for API automation webhooks and multi-tenant capabilities.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {/* Basic Card */}
          <div className="bg-canvas-soft border border-hairline p-8 rounded-md flex flex-col justify-between hover:border-mute/40 transition-all duration-200">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-mute mb-2 block">Basic</span>
              <div className="text-4xl font-extrabold text-ink font-mono mb-1">₹0</div>
              <span className="text-[9px] text-mute uppercase font-mono block mb-6">Lifetime Free for Solo Ops</span>
              <p className="text-body-text text-xs leading-relaxed font-serif italic mb-6">
                Ideal for solo operators who need a structured SQLite database and quick invoice compilation.
              </p>
              <ul className="space-y-3.5 text-xs text-body-text">
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> Local SQLite data scope</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> 1 workspace instance</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> 10 AI assistant prompts / mo</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> Standard invoice compilation</li>
              </ul>
            </div>
            <a
              href="/?auth=register"
              className="w-full text-center mt-8 border border-hairline hover:bg-canvas text-ink text-xs font-bold py-3 rounded-sm font-mono uppercase tracking-widest transition-colors block cursor-pointer"
            >
              Choose Basic
            </a>
          </div>

          {/* Standard Card */}
          <div className="bg-canvas-soft border-2 border-primary p-8 rounded-md flex flex-col justify-between relative shadow-2xl">
            <span className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-on-primary text-[8px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-sm">
              RECOMMENDED
            </span>
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-primary mb-2 block">Standard</span>
              <div className="text-4xl font-extrabold text-ink font-mono mb-1">₹699<span className="text-xs text-mute font-normal"> / mo</span></div>
              <span className="text-[9px] text-primary uppercase font-mono block mb-6">Complete Delivery Stack</span>
              <p className="text-body-text text-xs leading-relaxed font-serif italic mb-6">
                Crafted for small teams wanting automated payment webhooks and teamwork setups.
              </p>
              <ul className="space-y-3.5 text-xs text-body-text">
                <li className="flex items-center gap-2"><Check size={14} className="text-orange-500 shrink-0" /> Shared database structure</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-orange-500 shrink-0" /> 10 Active team seats</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-orange-500 shrink-0" /> Uncapped AI core queries</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-orange-500 shrink-0" /> WhatsApp alert triggers</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-orange-500 shrink-0" /> Razorpay webhook syncs</li>
              </ul>
            </div>
            <a
              href="/?auth=register"
              className="w-full text-center mt-8 bg-primary hover:opacity-90 text-on-primary text-xs font-bold py-3 rounded-sm font-mono uppercase tracking-widest block cursor-pointer"
            >
              Choose Standard
            </a>
          </div>

          {/* Premium Card */}
          <div className="bg-canvas-soft border border-hairline p-8 rounded-md flex flex-col justify-between hover:border-mute/40 transition-all duration-200">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-mute mb-2 block">Premium</span>
              <div className="text-4xl font-extrabold text-ink font-mono mb-1">₹1,999<span className="text-xs text-mute font-normal"> / mo</span></div>
              <span className="text-[9px] text-mute uppercase font-mono block mb-6">Dedicated Environment</span>
              <p className="text-body-text text-xs leading-relaxed font-serif italic mb-6">
                Engineered for mature studios requiring dedicated database setups and brand control.
              </p>
              <ul className="space-y-3.5 text-xs text-body-text">
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> Dedicated database resource</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> Uncapped team seats</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> Custom whitelabel layout</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> Multi-organization settings</li>
                <li className="flex items-center gap-2 text-mute"><Check size={14} className="text-orange-500 shrink-0" /> 24/7 Priority support channel</li>
              </ul>
            </div>
            <a
              href="/?auth=register"
              className="w-full text-center mt-8 border border-hairline hover:bg-canvas text-ink text-xs font-bold py-3 rounded-sm font-mono uppercase tracking-widest transition-colors block cursor-pointer"
            >
              Choose Premium
            </a>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-12">
          <h2 className="text-lg font-bold font-mono uppercase tracking-tight text-ink mb-6 text-center">Feature Matrix</h2>
          <div className="border border-hairline rounded overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-canvas border-b border-hairline font-mono text-[10px] text-mute uppercase tracking-wider">
                  <th className="p-4">Feature</th>
                  <th className="p-4">Basic</th>
                  <th className="p-4">Standard</th>
                  <th className="p-4">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/30 bg-canvas-soft/20 font-sans">
                <tr>
                  <td className="p-4 font-mono font-bold text-ink">Subscription Fee</td>
                  <td className="p-4 text-mute">₹0</td>
                  <td className="p-4 text-primary font-bold">₹699 / mo</td>
                  <td className="p-4 text-primary font-bold">₹1,999 / mo</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-ink">Invoicing Setup</td>
                  <td className="p-4 text-mute">Manual downloads only</td>
                  <td className="p-4 text-mute">Automated webhook updates</td>
                  <td className="p-4 text-mute">Custom styling options</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-ink">WhatsApp Broadcasts</td>
                  <td className="p-4 text-mute">-</td>
                  <td className="p-4 text-mute">10 Templates / mo</td>
                  <td className="p-4 text-mute">Unlimited Templates</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-ink">AI Assistant Prompts</td>
                  <td className="p-4 text-mute">10 prompts / mo</td>
                  <td className="p-4 text-mute">Unlimited queries</td>
                  <td className="p-4 text-mute">Unlimited queries (custom context)</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono font-bold text-ink">Database isolation</td>
                  <td className="p-4 text-mute">SQLite File</td>
                  <td className="p-4 text-mute">Shared Instance</td>
                  <td className="p-4 text-mute">Dedicated SQLite/Postgres</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* GST Notice */}
        <div className="flex gap-3 bg-canvas-soft border border-hairline/60 p-5 rounded-md font-sans text-xs text-mute">
          <Info size={18} className="shrink-0 text-orange-500 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Tax Notice for Indian Operators:</strong> All plans list prices exclusive of 18% IGST/CGST. Invoices detailing company registration GST numbers will be issued automatically for tax filing deductions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
