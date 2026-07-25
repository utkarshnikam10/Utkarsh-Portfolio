"use client";

import React, { useEffect, useRef } from "react";

interface KineticMarqueeProps {
  text?: string[];
  speed?: number;
}

export function KineticMarquee({
  text = [
    "SPATIAL WEBGL GRAPHICS",
    "GPGPU PARTICLE COMPUTATION",
    "CUSTOM GLSL SHADERS",
    "HIGH-PERFORMANCE FULL-STACK",
    "CS ALGORITHMS & SYSTEMS",
  ],
  speed = 1.2,
}: KineticMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollSpeed = useRef(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastY = window.scrollY;
    let animId: number;

    const handleScroll = () => {
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      scrollSpeed.current = Math.min(1 + dy * 0.05, 4.0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    let pos = 0;
    const animate = () => {
      // Decay scroll speed surge back to normal base speed
      scrollSpeed.current = 1 + (scrollSpeed.current - 1) * 0.92;
      pos -= speed * scrollSpeed.current;

      if (trackRef.current) {
        if (pos <= -50) pos = 0;
        trackRef.current.style.transform = `translate3d(${pos}%, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [speed]);

  const items = [...text, ...text, ...text, ...text];

  return (
    <div className="w-full overflow-hidden py-10 my-8 border-y border-white/10 bg-white/[0.015] backdrop-blur-md select-none pointer-events-none">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((t, idx) => (
          <div key={idx} className="flex items-center gap-8 px-6 font-mono text-[11px] tracking-[0.4em] uppercase text-white/50">
            <span className="text-white font-bold tracking-widest">{t}</span>
            <span className="text-[#ffff23] font-bold">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
