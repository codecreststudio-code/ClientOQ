'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Magnetic from './motion/Magnetic';

interface HeaderProps {
  onLaunchConsole?: () => void;
}

export default function Header({ onLaunchConsole }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Scroll handler for background transition
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // 2. Entrance Animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      
      tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(logoRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1 }, '-=0.3')
        .fromTo(navRef.current ? navRef.current.children : [], { y: -10, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08 }, '-=0.4')
        .fromTo(buttonRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1 }, '-=0.4');
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const handleLaunchClick = () => {
    if (onLaunchConsole) {
      onLaunchConsole();
    } else {
      window.location.href = '/?auth=login';
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`w-full border-b border-hairline h-16 flex items-center justify-between px-8 z-30 sticky top-0 select-none transition-all duration-300 ${
        isScrolled 
          ? 'bg-canvas/85 backdrop-blur-md shadow-xs border-hairline/60' 
          : 'bg-canvas border-hairline'
      }`}
      style={{ opacity: 0 }}
    >
      <a ref={logoRef} href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm font-sans shadow-sm select-none">
          Q
        </div>
        <span className="font-bold tracking-tight text-sm uppercase font-mono text-ink">Clientoq</span>
      </a>
      <nav ref={navRef} className="hidden md:flex items-center gap-8 text-xs font-sans font-semibold text-body-text tracking-tight">
        <a href="/features" className="hover:text-primary transition-colors">Features</a>
        <a href="/how-it-works" className="hover:text-primary transition-colors">How it works</a>
        <a href="/pricing" className="hover:text-primary transition-colors">Pricing</a>
        <a href="/demo" className="hover:text-primary transition-colors">Demo</a>
      </nav>
      <div ref={buttonRef}>
        <Magnetic>
          <button
            onClick={handleLaunchClick}
            className="bg-primary hover:opacity-90 text-on-primary text-xs font-bold px-6 py-2.5 rounded-full font-sans uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Launch Console
          </button>
        </Magnetic>
      </div>
    </header>
  );
}

