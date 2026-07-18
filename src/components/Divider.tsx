"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Divider — Notched divider line
 * The line draws left-to-right, then the notch pops up using GSAP ScrollTrigger.
 */

interface DividerProps {
  className?: string;
  notch?: boolean;
}

export default function Divider({ className = "", notch = true }: DividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const line = el.querySelector(".divider-line");
    const notchEl = el.querySelector(".divider-notch");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.0, ease: "power3.out", transformOrigin: "left" }
    );

    if (notch && notchEl) {
      tl.fromTo(
        notchEl,
        { scaleY: 0 },
        { scaleY: 1, duration: 0.4, ease: "back.out(1.5)" },
        "-=0.4"
      );
    }
  }, [notch]);

  return (
    <div ref={containerRef} className={`flex items-center gap-4 ${className}`}>
      <div className="divider-line flex-1 h-[0.5px] bg-[rgba(212,175,55,0.2)] origin-left scale-x-0" />
      {notch && (
        <div className="divider-notch w-[24px] h-[12px] bg-transparent border-l border-r border-b border-primary relative origin-top scale-y-0 after:content-['❖'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-[8px] after:text-primary" />
      )}
    </div>
  );
}
