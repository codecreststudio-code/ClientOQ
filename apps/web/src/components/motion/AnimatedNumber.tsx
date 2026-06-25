'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '', 
  duration = 1.6 
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }

    const obj = { val: 0 };
    const trigger = ScrollTrigger.create({
      trigger: elementRef.current,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(obj, {
          val: value,
          duration: duration,
          ease: 'power3.out',
          onUpdate: () => {
            setDisplayValue(Math.floor(obj.val));
          }
        });
      },
      // Reset when scrolling back up so it re-triggers on scroll-down
      onLeaveBack: () => {
        obj.val = 0;
        setDisplayValue(0);
      }
    });

    return () => {
      trigger.kill();
    };
  }, [value, duration]);

  return <span ref={elementRef}>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}
