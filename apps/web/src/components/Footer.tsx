'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-hairline bg-canvas pt-16 pb-12 px-8 select-none">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity w-fit">
            <div className="w-7 h-7 rounded bg-orange-500 flex items-center justify-center font-bold text-white text-md font-sans shadow-sm select-none">
              Q
            </div>
            <span className="font-bold tracking-tight text-sm uppercase font-mono text-ink">Clientoq</span>
          </a>
          <p className="text-body-text text-xs leading-relaxed max-w-sm font-sans">
            Supercharge your client delivery, task pipelines, and payment collection. A single-tenant, privacy-first workstation built specifically for independent professionals and service teams in India.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-2.5 mt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-hairline/80 flex items-center justify-center text-mute hover:text-primary hover:border-primary/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-hairline/80 flex items-center justify-center text-mute hover:text-primary hover:border-primary/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-hairline/80 flex items-center justify-center text-mute hover:text-primary hover:border-primary/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded border border-hairline/80 flex items-center justify-center text-mute hover:text-primary hover:border-primary/50 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Product Column */}
        <div className="md:col-span-2 flex flex-col gap-3 font-sans text-xs">
          <span className="font-bold font-mono uppercase tracking-wider text-ink text-[10px] select-none">Product</span>
          <a href="/features" className="text-mute hover:text-primary transition-colors">Features</a>
          <a href="/how-it-works" className="text-mute hover:text-primary transition-colors">How it works</a>
          <a href="/pricing" className="text-mute hover:text-primary transition-colors">Pricing</a>
          <a href="/demo" className="text-mute hover:text-primary transition-colors">Demo</a>
        </div>

        {/* Company Column */}
        <div className="md:col-span-2 flex flex-col gap-3 font-sans text-xs">
          <span className="font-bold font-mono uppercase tracking-wider text-ink text-[10px] select-none">Company</span>
          <a href="/about" className="text-mute hover:text-primary transition-colors">About</a>
          <a href="/contact" className="text-mute hover:text-primary transition-colors">Contact</a>
          <a href="/faq" className="text-mute hover:text-primary transition-colors">FAQ</a>
          <a href="/security" className="text-mute hover:text-primary transition-colors">Security</a>
        </div>

        {/* Legal Column */}
        <div className="md:col-span-2 flex flex-col gap-3 font-sans text-xs">
          <span className="font-bold font-mono uppercase tracking-wider text-ink text-[10px] select-none">Legal</span>
          <a href="/privacy-policy" className="text-mute hover:text-primary transition-colors">Privacy Policy</a>
          <a href="/terms-of-service" className="text-mute hover:text-primary transition-colors">Terms of Service</a>
          <a href="/refund-and-cancellation" className="text-mute hover:text-primary transition-colors">Refund & Cancellation</a>
        </div>

        {/* Get started Column */}
        <div className="md:col-span-2 flex flex-col gap-3 font-sans text-xs">
          <span className="font-bold font-mono uppercase tracking-wider text-ink text-[10px] select-none">Get started</span>
          <a href="/join-waitlist" className="text-mute hover:text-primary transition-colors">Join the waitlist</a>
          <a href="/?auth=login" className="text-mute hover:text-primary transition-colors">Sign in</a>
          <a href="/pricing" className="text-mute hover:text-primary transition-colors">See pricing</a>
        </div>
      </div>

      {/* Bottom section */}
      <div className="max-w-6xl mx-auto border-t border-hairline/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-wider text-mute">
        <span>&copy; 2026 Clientoq. All rights reserved.</span>
        <span className="flex items-center gap-1 select-none">
          Built with <span className="text-red-500 animate-pulse">&hearts;</span> by CodeCrest Studio for freelancers
        </span>
      </div>
    </footer>
  );
}
