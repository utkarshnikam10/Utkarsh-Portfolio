"use client";

import { useEffect, useState } from "react";
import { socialLinks } from "@/constants";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { AudioSynth } from "@/utils/audio";

/**
 * FooterSocialLink — Magnetic social links with hover sound triggers
 */
function FooterSocialLink({ social }: { social: (typeof socialLinks)[0] }) {
  const ref = useMagneticHover(15, 0.3);

  return (
    <a
      ref={ref}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => AudioSynth.playHover()}
      onClick={() => AudioSynth.playClick()}
      className="text-text-tertiary hover:text-primary transition-colors text-xs font-mono uppercase tracking-widest no-underline"
    >
      {social.label}
    </a>
  );
}

/**
 * Footer — Cinematic bottom fold with massive outlined title, live IST clock, and telemetry
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [timeStr, setTimeStr] = useState("");
  const [ping, setPing] = useState(14);
  const [fps, setFps] = useState(60);

  // Live IST (India Standard Time) clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTimeStr(new Date().toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live ping drift simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(12 + Math.random() * 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Frame rate checker
  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;
    let rafId: number;

    const checkFps = () => {
      frames++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }
      rafId = requestAnimationFrame(checkFps);
    };

    rafId = requestAnimationFrame(checkFps);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleBackToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToTopRef = useMagneticHover(20, 0.4);

  return (
    <footer className="border-t border-border bg-[#0a0806] pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Decorative top gold line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[0.5px] bg-[rgba(212,175,55,0.15)]" />

      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12">
          {/* Copyright & Core Identity */}
          <div className="flex flex-col gap-2">
            <span className="font-serif text-sm font-bold tracking-[0.1em] text-text uppercase">
              Utkarsh Portfolio
            </span>
            <span className="text-text-tertiary text-xs leading-relaxed max-w-xs font-sans">
              Designing premium interactive user experiences and high-performance frontend
              architectures.
            </span>
            <span className="text-[10px] text-text-tertiary font-mono tracking-wider mt-4">
              &copy; {currentYear} ALL SOVEREIGN RIGHTS RESERVED
            </span>
          </div>

          {/* Telemetry log monitors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 font-mono text-[9px] text-text-tertiary uppercase tracking-widest border-l border-border pl-6 md:pl-12">
            <div className="flex flex-col gap-1">
              <span className="text-primary font-semibold">Location:</span>
              <span>IST Province</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-primary font-semibold">Local Time:</span>
              <span className="text-text">{timeStr || "--:--:--"} IST</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-primary font-semibold">System Load:</span>
              <span>
                {ping}MS // {fps} FPS
              </span>
            </div>
          </div>

          {/* Magnetic back-to-top & social links */}
          <div className="flex flex-col items-start md:items-end gap-6">
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <FooterSocialLink key={social.label} social={social} />
              ))}
            </div>

            <a
              ref={backToTopRef}
              href="#hero"
              onClick={handleBackToTop}
              onMouseEnter={() => AudioSynth.playHover()}
              onClickCapture={() => AudioSynth.playClick()}
              className="flex-center w-12 h-12 rounded-full border border-border text-text-secondary hover:text-primary hover:border-primary transition-all duration-300 relative inline-block"
              aria-label="Back to top"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </a>
          </div>
        </div>

        {/* Massive Outlined Title Fold */}
        <div className="select-none pointer-events-none mt-8 text-center relative">
          <h2
            className="font-serif text-[8vw] sm:text-[9vw] font-black uppercase tracking-[0.2em] leading-none opacity-[0.06] text-transparent"
            style={{ WebkitTextStroke: "0.5px rgba(255,255,255,0.7)" }}
          >
            Mahishmati
          </h2>
        </div>
      </div>
    </footer>
  );
}
