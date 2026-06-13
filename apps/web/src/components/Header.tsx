'use client';

import React from 'react';

interface HeaderProps {
  onLaunchConsole?: () => void;
}

export default function Header({ onLaunchConsole }: HeaderProps) {
  const handleLaunchClick = () => {
    if (onLaunchConsole) {
      onLaunchConsole();
    } else {
      window.location.href = '/?auth=login';
    }
  };

  return (
    <header className="w-full border-b border-hairline bg-canvas h-16 flex items-center justify-between px-8 z-30 sticky top-0 select-none">
      <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <div className="w-7 h-7 rounded bg-orange-500 flex items-center justify-center font-bold text-white text-md font-sans shadow-sm select-none">
          Q
        </div>
        <span className="font-bold tracking-tight text-sm uppercase font-mono text-ink">Clientoq</span>
      </a>
      <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-mute">
        <a href="/features" className="hover:text-primary transition-colors">Features</a>
        <a href="/how-it-works" className="hover:text-primary transition-colors">How it works</a>
        <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
        <a href="/demo" className="hover:text-primary transition-colors">Demo</a>
      </nav>
      <div>
        <button
          onClick={handleLaunchClick}
          className="bg-primary hover:opacity-90 text-on-primary text-xs font-semibold px-4 py-2 rounded-sm font-mono uppercase tracking-wider transition-all cursor-pointer"
        >
          Launch Console
        </button>
      </div>
    </header>
  );
}
