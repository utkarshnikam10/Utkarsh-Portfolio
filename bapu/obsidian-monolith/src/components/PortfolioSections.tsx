"use client";

import React, { useState } from "react";
import { portfolioData, SkillCategory, CareerMilestone } from "../data/portfolio";
import { useAudio } from "../hooks/useAudio";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { InteractiveProjectCards } from "./ui/InteractiveProjectCards";
import { HeroStats, SectionDivider } from "./ui/PremiumEffects";
import { KineticMarquee } from "./ui/KineticMarquee";

interface PortfolioSectionsProps {
  onHighlightProject?: (index: number | null) => void;
}

export function PortfolioSections({ onHighlightProject }: PortfolioSectionsProps) {
  const { profile, skills, trajectory } = portfolioData;
  const { playHoverTick, playClickPulse } = useAudio();
  const containerRef = useScrollReveal();

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    playClickPulse();
    navigator.clipboard.writeText(profile.contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-[#f5f5f7]">
      {/* Ambient Floating Gradient Orbs */}
      <div className="ambient-orb ambient-orb-cyan" style={{ top: '15%', right: '-10%' }} />
      <div className="ambient-orb ambient-orb-gold" style={{ top: '45%', left: '-8%' }} />
      <div className="ambient-orb ambient-orb-violet" style={{ top: '75%', right: '-5%' }} />

      {/* ═══ HERO OVERLAY (0 - 100vh) ═══ */}
      <section id="hero" className="min-h-screen flex flex-col justify-between pt-20 md:pt-36 pb-10 md:pb-16">
        {/* Top Tagline — fade in */}
        <div data-reveal className="reveal-up stagger-1 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-glow-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/80 font-semibold">
            {profile.name} // {profile.title}
          </span>
        </div>

        {/* Hero Headline — staggered word reveal */}
        <div className="max-w-4xl space-y-6">
          <h1 data-reveal className="reveal-up stagger-2 text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white uppercase leading-[0.92] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            SPATIAL <span className="gradient-text-gold animate-shimmer">ENGINEERING</span> & GRAPHICS
          </h1>
          <div data-reveal className="reveal-up stagger-3 p-6 rounded-2xl bg-[#050508]/85 border border-white/10 backdrop-blur-xl shadow-2xl max-w-xl">
            <p className="text-sm md:text-base font-sans text-white/90 leading-relaxed tracking-wide font-light">
              {profile.bio}
            </p>
          </div>

          {/* Animated Stat Counters */}
          <div data-reveal className="reveal-up stagger-4">
            <HeroStats />
          </div>
        </div>

        {/* Bottom Scroll Hint */}
        <div data-reveal className="reveal-up stagger-5 flex justify-between items-end border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <div>[01 // SPATIAL CONTINUUM]</div>
          <div className="flex items-center gap-2 text-[#ffff23] font-semibold animate-gentle-bounce">
            <span>SCROLL TO EXPLORE</span>
            <span>↓</span>
          </div>
        </div>
      </section>

      <SectionDivider color="cyan" />

      {/* ═══ SPACE 01: ARRIVAL PLAZA / ABOUT ═══ */}
      <section id="about" className="py-36 md:py-48 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
          <div className="w-full md:w-1/3">
            <span data-reveal className="reveal-left stagger-1 text-[10px] font-mono tracking-[0.3em] text-[#38bdf8] uppercase block mb-3 opacity-90 font-semibold">
              [01 // ARRIVAL PLAZA]
            </span>
            <h2 data-reveal className="reveal-left stagger-2 text-4xl md:text-6xl font-display font-bold tracking-tight text-white uppercase leading-none">
              PHILOSOPHY & <span className="gradient-text-gold">CRAFT</span>
            </h2>
          </div>

          <div className="w-full md:w-2/3 space-y-12 leading-relaxed">
            <p data-reveal className="reveal-right stagger-2 text-2xl md:text-4xl text-white font-display font-medium leading-snug tracking-tight">
              &ldquo;Fusing core Computer Science algorithms with high-craft spatial WebGL graphics and responsive full-stack systems.&rdquo;
            </p>

            <div data-reveal className="reveal-up stagger-3 p-8 rounded-2xl glass-panel gradient-border hover-lift space-y-4 shadow-2xl">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-glow-pulse" />
                <span className="font-mono text-[10px] text-[#38bdf8] tracking-[0.3em] uppercase font-bold">
                  EDUCATION & ALMA MATER
                </span>
              </div>
              <h3 className="text-2xl font-display font-semibold text-white tracking-tight">
                {profile.university}
              </h3>
              <p className="text-xs md:text-sm text-white/70 font-sans font-light leading-relaxed">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-6 font-mono text-xs border-t border-white/10 text-white/50">
              {[
                { label: "ENGINEER", value: profile.name },
                { label: "LOCATION", value: profile.location },
                { label: "STATUS", value: "AVAILABLE FOR HIRE", highlight: true },
              ].map((stat, i) => (
                <div key={stat.label} data-reveal className={`reveal-up stagger-${i + 4}`}>
                  <span className="text-white/40 block mb-1 text-[9px] tracking-widest uppercase">{stat.label}</span>
                  <span className={stat.highlight ? "text-[#38bdf8] font-medium" : "text-white font-medium"}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <KineticMarquee />

      <SectionDivider color="yellow" />

      {/* ═══ SPACE 02: SELECTED WORKS DOSSIERS ═══ */}
      <section id="projects" className="py-24 border-t border-white/10">
        <div data-reveal className="reveal-up">
          <InteractiveProjectCards />
        </div>
      </section>

      <SectionDivider color="cyan" />

      {/* ═══ SPACE 03: ENGINEERING CORE ═══ */}
      <section id="capabilities" className="py-36 md:py-48 border-t border-white/10">
        <div className="mb-20">
          <span data-reveal className="reveal-left stagger-1 text-[10px] font-mono tracking-[0.3em] text-[#38bdf8] uppercase block mb-3 opacity-90 font-semibold">
            [03 // ENGINEERING CORE]
          </span>
          <h2 data-reveal className="reveal-left stagger-2 text-4xl md:text-6xl font-display font-bold tracking-tight text-white uppercase leading-none">
            TECHNICAL <span className="gradient-text-cyan">MATRIX</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((cat: SkillCategory, i: number) => (
            <div
              key={cat.category}
              data-reveal
              className={`reveal-up stagger-${i + 1} p-8 rounded-2xl glass-panel hover-lift hover-glow-cyan cursor-pointer group`}
              data-cursor-label="EXPLORE"
              onMouseEnter={playHoverTick}
            >
              <h3 className="text-xs font-mono text-[#38bdf8] mb-8 uppercase tracking-[0.2em] border-b border-white/10 pb-4 font-semibold group-hover:text-white transition-colors duration-300">
                {cat.category}
              </h3>

              <ul className="space-y-3 font-mono text-xs text-white/50">
                {cat.items.map((item: string) => (
                  <li key={item} className="flex items-center space-x-2.5 group-hover:text-white/90 transition-colors duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]/80 group-hover:animate-glow-pulse" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <KineticMarquee text={["GRAPHICS SHADERS", "WEBGPU COMPUTATION", "FULL-STACK ARCHITECTURE", "LOVELY PROFESSIONAL UNIVERSITY", "REAL-TIME TELEMETRY"]} />

      {/* ═══ SPACE 04: RESEARCH ARCHIVE ═══ */}
      <section id="trajectory" className="py-36 md:py-48 border-t border-white/10">
        <div className="mb-20">
          <span data-reveal className="reveal-left stagger-1 text-[10px] font-mono tracking-[0.3em] text-[#38bdf8] uppercase block mb-3 opacity-90 font-semibold">
            [04 // RESEARCH ARCHIVE]
          </span>
          <h2 data-reveal className="reveal-left stagger-2 text-4xl md:text-6xl font-display font-bold tracking-tight text-white uppercase leading-none">
            ACADEMIC <span className="gradient-text-gold">CHRONICLE</span>
          </h2>
        </div>

        <div className="relative timeline-line-animated pl-8 md:pl-16 space-y-16">
          {trajectory.map((item: CareerMilestone, idx: number) => (
            <div
              key={idx}
              data-reveal
              className={`reveal-up stagger-${idx + 1} relative group cursor-pointer`}
              data-cursor-label="CHRONICLE"
              onMouseEnter={playHoverTick}
            >
              <span className="absolute -left-[37px] md:-left-[71px] top-2 w-3.5 h-3.5 rounded-full bg-[#040406] border-2 border-white/20 group-hover:border-[#38bdf8] group-hover:bg-[#38bdf8]/30 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.5)] transition-all duration-500" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-[#38bdf8] tracking-[0.2em] font-semibold">
                  {item.year}
                </span>
                <span className="text-xs font-mono text-white/40">
                  {item.company}
                </span>
              </div>
              <h3 className="text-2xl font-display font-semibold text-white mb-3 group-hover:text-[#38bdf8] transition-colors duration-300 tracking-tight">
                {item.role}
              </h3>
              <p className="text-sm md:text-base text-white/60 font-sans font-light max-w-2xl leading-relaxed">
                {item.impact}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SPACE 05: CONTROL CENTER ═══ */}
      <section id="contact" className="py-24 md:py-48 border-t border-white/10 text-center">
        <span data-reveal className="reveal-up stagger-1 text-[10px] font-mono tracking-[0.3em] text-[#38bdf8] uppercase block mb-4 opacity-90 font-semibold">
          [05 // CONTROL CENTER]
        </span>
        <h2 data-reveal className="reveal-scale stagger-2 text-4xl md:text-7xl font-display font-bold tracking-tight text-white uppercase mb-12 leading-none">
          LET&apos;S BUILD <span className="gradient-text-gold">TOMORROW.</span>
        </h2>
        <p data-reveal className="reveal-up stagger-3 text-white/60 max-w-xl mx-auto mb-16 text-sm md:text-base font-sans font-light leading-relaxed">
          Available for Computer Science engineering roles, real-time WebGL experiences, and full-stack software architecture.
        </p>

        <div data-reveal className="reveal-up stagger-4 flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <a
            href={`mailto:${profile.contactEmail}`}
            data-cursor-label="TRANSMIT"
            onMouseEnter={playHoverTick}
            onClick={playClickPulse}
            className="magnetic-press px-6 md:px-12 py-4 md:py-5 bg-white text-[#040406] font-mono text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-[#ffff23] transition-all duration-300 rounded-lg shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,35,0.4)] font-bold break-all sm:break-normal"
          >
            {profile.contactEmail}
          </a>

          <button
            onClick={handleCopyEmail}
            onMouseEnter={playHoverTick}
            data-cursor-label="COPY"
            className="magnetic-press px-8 py-5 glass-panel hover-glow-cyan text-white font-mono text-xs tracking-widest uppercase rounded-lg"
          >
            {copiedEmail ? "✓ COPIED!" : "[COPY EMAIL]"}
          </button>
        </div>

        <div data-reveal className="reveal-up stagger-5 flex items-center justify-center space-x-12 font-mono text-xs text-white/50">
          {[
            { label: "GITHUB", url: profile.github },
            { label: "LINKEDIN", url: profile.linkedin },
            { label: "TWITTER / X", url: profile.twitter },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label={link.label}
              onMouseEnter={playHoverTick}
              className="hover:text-[#ffff23] transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#ffff23] hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>

      {/* ═══ LUXURY BRANDED FOOTER ═══ */}
      <footer className="pb-16 pt-8">
        <div className="footer-gradient-line mb-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
            <span>© {new Date().getFullYear()} UTKARSH TIWARI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/15">CRAFTED WITH</span>
            <span className="text-[#38bdf8]">THREE.JS</span>
            <span className="text-white/15">+</span>
            <span className="text-[#ffff23]">NEXT.JS</span>
            <span className="text-white/15">+</span>
            <span className="text-violet-400">GLSL</span>
          </div>
          <div className="text-white/20">v3.0 // OBSIDIAN MONOLITH</div>
        </div>
      </footer>
    </div>
  );
}
