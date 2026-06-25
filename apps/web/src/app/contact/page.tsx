'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import SmoothScroll from '../../components/motion/SmoothScroll';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setForm({ name: '', email: '', org: '', message: '' });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-primary selection:text-on-primary">
      <SmoothScroll>
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-8 flex flex-col gap-12" id="main-content">
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-semibold text-primary tracking-widest">[ Contact Support ]</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight font-serif italic">
            Connect With Our Team
          </h1>
          <p className="text-body-text text-sm font-sans">
            Have questions about custom migrations, invoice automation APIs, or multi-tenant structures? We are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 items-start">
          {/* Info Details Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-canvas-soft border border-hairline p-6 rounded-lg space-y-6 starbucks-shadow">
              <span className="block text-[10px] uppercase font-mono tracking-wider text-mute font-semibold">Contact Info</span>
              
              <div className="flex items-center gap-4 text-xs font-sans">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="block text-mute text-[9px] uppercase font-mono">Support Email</span>
                  <a href="mailto:support@clientoq.in" className="text-ink font-semibold hover:underline">support@clientoq.in</a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-sans">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <span className="block text-mute text-[9px] uppercase font-mono">Operator Line</span>
                  <span className="text-ink font-semibold">+91 98765 43210</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-sans">
                <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <span className="block text-mute text-[9px] uppercase font-mono">India Hub</span>
                  <span className="text-ink font-semibold leading-relaxed">
                    123, Jubilee Hills, Hyderabad,<br/>Telangana, 500033
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="bg-canvas-soft border border-green-500/30 p-8 rounded-lg text-center flex flex-col items-center gap-4 starbucks-shadow">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-sans text-sm uppercase font-bold text-ink">Inquiry Submitted Successfully</h3>
                <p className="text-body-text text-xs font-serif italic max-w-sm">
                  Our operations team has received your message and will respond to your email within 12 business hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 border border-hairline hover:bg-canvas text-ink text-xs font-bold px-6 py-2.5 rounded-full font-sans uppercase tracking-widest transition-colors cursor-pointer active:scale-95"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-canvas-soft border border-hairline p-6 rounded-lg space-y-4 starbucks-shadow">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-mute font-semibold mb-2">Write Us a Message</span>
                
                <div>
                  <label className="block text-[10px] font-semibold text-mute uppercase tracking-wider mb-1 font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-canvas border border-hairline p-3 rounded-md text-xs focus:outline-none focus:border-primary text-ink font-sans"
                    placeholder="e.g. clientoq"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-mute uppercase tracking-wider mb-1 font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-canvas border border-hairline p-3 rounded-md text-xs focus:outline-none focus:border-primary text-ink font-sans"
                      placeholder="e.g. hi@client-oq.vercel.app"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-mute uppercase tracking-wider mb-1 font-mono">Organization / Agency</label>
                    <input
                      type="text"
                      className="w-full bg-canvas border border-hairline p-3 rounded-md text-xs focus:outline-none focus:border-primary text-ink font-sans"
                      placeholder="e.g. CodeCrest Studio"
                      value={form.org}
                      onChange={e => setForm({ ...form, org: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-mute uppercase tracking-wider mb-1 font-mono">Message Inquiry</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-canvas border border-hairline p-3 rounded-md text-xs focus:outline-none focus:border-primary text-ink font-sans resize-none"
                    placeholder="Describe what you need help with..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </div>

                {error && (
                  <p className="text-red-500 text-xs font-semibold">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:opacity-90 text-on-primary text-xs font-bold py-3.5 rounded-full font-sans uppercase tracking-widest transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 shadow-sm"
                >
                  {loading ? 'Sending...' : 'Send Message'} <Send size={12} />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      </SmoothScroll>
    </div>
  );
}
