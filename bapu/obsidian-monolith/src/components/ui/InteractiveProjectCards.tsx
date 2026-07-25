"use client";

import React, { useState, useEffect } from "react";
import { portfolioData } from "../../data/portfolio";

export function InteractiveProjectCards() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      setIsTouchDevice(!hasFinePointer);
    }
  }, []);

  const handleCardClick = () => {
    import("../../utils/AudioSynth").then(({ audioSynth }) => {
      audioSynth.playImpactHaptic();
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-0 md:px-6 py-8 md:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4 md:gap-6 border-b border-white/10 pb-6 md:pb-8">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
            <span>02 // SELECTED WORKS</span>
          </div>
          <h2 className="text-2xl md:text-5xl font-display font-bold tracking-tight text-white uppercase">
            FEATURED <span className="gradient-text-gold">DOSSIERS</span>
          </h2>
        </div>
        <p className="text-xs font-mono text-white/50 tracking-[0.2em] uppercase max-w-md">
          EXCELLENCE THROUGH SPATIAL ENGINEERING, HIGH-PERFORMANCE SHADERS & REFINED ARCHITECTURE.
        </p>
      </div>

      {/* Grid of Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {portfolioData.projects.map((project, idx) => {
          const isHovered = hoveredId === project.id;
          const isOtherHovered = hoveredId !== null && !isHovered;

          // On touch devices, never dim other cards
          const shouldDim = isOtherHovered && !isTouchDevice;

          return (
            <div
              key={project.id}
              onMouseEnter={() => !isTouchDevice && setHoveredId(project.id)}
              onMouseLeave={() => !isTouchDevice && setHoveredId(null)}
              onClick={handleCardClick}
              className={`group relative flex flex-col justify-between p-5 md:p-8 rounded-2xl glass-panel transition-all duration-500 cursor-pointer overflow-hidden ${
                isHovered && !isTouchDevice
                  ? "bg-[#0a0a14]/95 border-sky-400/80 shadow-[0_0_50px_rgba(56,189,248,0.3)] scale-[1.01]"
                  : shouldDim
                  ? "bg-[#05050a]/60 border-white/5 opacity-30 scale-[0.99]"
                  : "bg-[#06060c]/85 border-white/10 hover:border-white/20 backdrop-blur-2xl"
              }`}
            >
              {/* Background Subtle Gradient Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-sky-500/15 via-transparent to-amber-500/10 transition-opacity duration-500 pointer-events-none ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Top Row: Index & Category Pill */}
              <div className="relative z-10 flex justify-between items-center mb-6 md:mb-10">
                <span className="font-mono text-xs tracking-[0.3em] text-white/50">
                  {`[0${idx + 1}]`}
                </span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.25em] px-3 md:px-3.5 py-1 rounded-full border transition-colors duration-300 ${
                    isHovered && !isTouchDevice
                      ? "text-[#ffff23] border-[#ffff23]/50 bg-[#ffff23]/10 font-semibold shadow-[0_0_10px_rgba(255,255,35,0.3)]"
                      : "text-white/70 border-white/10 bg-white/[0.04]"
                  }`}
                >
                  {project.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="relative z-10 mb-6 md:mb-8">
                <h3 className="text-xl md:text-3xl font-display font-bold text-white mb-2 md:mb-3 group-hover:text-sky-300 transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {project.title}
                </h3>
                <p className="text-xs md:text-sm font-sans text-white/90 leading-relaxed tracking-wide font-normal">
                  {project.description}
                </p>
              </div>

              {/* Bottom Row: Tech Stack Pills & Interactive Arrow */}
              <div className="relative z-10 flex justify-between items-center pt-4 md:pt-6 border-t border-white/10">
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {project.technologies.map((t: string) => (
                    <span
                      key={t}
                      className="font-mono text-[7px] md:text-[8px] uppercase tracking-[0.2em] px-2 md:px-2.5 py-0.5 rounded-full bg-white/[0.04] text-white/50 border border-white/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Interactive Arrow Button */}
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ml-2 ${
                    isHovered && !isTouchDevice
                      ? "bg-[#ffff23] text-black shadow-[0_0_15px_rgba(255,255,35,0.6)] translate-x-1"
                      : "bg-white/5 text-white/40 border border-white/10"
                  }`}
                >
                  <span className="font-mono text-sm font-bold">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

