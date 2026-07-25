"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * FilmGrainOverlay — Animated SVG noise grain overlay for editorial film texture.
 * Pure CSS + SVG filter, zero performance cost.
 */
export function FilmGrainOverlay() {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none mix-blend-overlay opacity-[0.035]">
      <svg className="w-full h-full">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <style jsx>{`
        svg {
          animation: grainShift 0.5s steps(6) infinite;
        }
        @keyframes grainShift {
          0%, 100% { transform: translate(0, 0); }
          20% { transform: translate(-2%, -1%); }
          40% { transform: translate(1%, 2%); }
          60% { transform: translate(-1%, -2%); }
          80% { transform: translate(2%, 1%); }
        }
      `}</style>
    </div>
  );
}

/**
 * AnimatedCounter — Counts up from 0 to target value on mount.
 */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          function tick(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

/**
 * GlowDivider — Animated horizontal neon line separator.
 */
function GlowDivider({ color = "cyan" }: { color?: "cyan" | "yellow" }) {
  const gradientMap = {
    cyan: "from-transparent via-[#38bdf8]/60 to-transparent",
    yellow: "from-transparent via-[#ffff23]/40 to-transparent",
  };

  return (
    <div className="relative w-full h-px my-2">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientMap[color]} animate-line-expand`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientMap[color]} blur-sm opacity-60`} />
    </div>
  );
}

/**
 * HeroStats — Animated stat counters in the hero section.
 */
export function HeroStats() {
  const stats = [
    { value: 100, suffix: "K+", label: "PARTICLES RENDERED", color: "text-[#ffff23]" },
    { value: 60, suffix: " FPS", label: "REAL-TIME SHADERS", color: "text-[#38bdf8]" },
    { value: 5, suffix: "+", label: "SPATIAL CHAMBERS", color: "text-emerald-400" },
  ];

  return (
    <div className="flex items-center gap-8 md:gap-12 py-8">
      {stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {i > 0 && <div className="w-px h-10 bg-white/10" />}
          <div className="font-mono">
            <div className={`text-2xl md:text-3xl font-bold ${stat.color} tracking-tight`}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[9px] text-white/40 tracking-[0.2em] uppercase mt-1">
              {stat.label}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * SectionDivider — Fancy glowing horizontal rule between sections.
 */
export function SectionDivider({ color = "cyan" }: { color?: "cyan" | "yellow" }) {
  return (
    <div data-reveal className="reveal-up py-4">
      <GlowDivider color={color} />
    </div>
  );
}

/**
 * FloatingBadge — Small floating ambient badge for visual richness.
 */
export function FloatingBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 animate-float ${className}`}>
      {children}
    </span>
  );
}
