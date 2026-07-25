"use client";

import React, { useState } from "react";
import { Project } from "../../data/portfolio";
import { playHoverTone, playSelectSound } from "../../utils/audio";
import { useTheme } from "../../context/ThemeContext";

interface ProjectCADCardProps {
  project: Project;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ProjectCADCard({
  project,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: ProjectCADCardProps) {
  const { theme } = useTheme();
  const [showArchModal, setShowArchModal] = useState(false);

  const isCadMode = theme === "TACTICAL_CAD" || theme === "BRUTALIST";

  return (
    <>
      <div
        data-cursor-label="VIEW"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`group relative p-8 md:p-12 transition-all duration-500 border cursor-pointer ${
          isCadMode ? "rounded-none" : "rounded-xl"
        } ${
          isHovered
            ? "bg-white/[0.03] border-[#ff5500]/60 shadow-[0_0_40px_rgba(255,85,0,0.15)]"
            : "bg-black/40 border-white/10"
        }`}
      >
        {/* CAD Blueprint Crosshairs */}
        {isCadMode && (
          <>
            <span className="absolute top-2 left-2 font-mono text-[9px] text-[#ff5500]/70">
              + CAD_REF // 0{index + 1}
            </span>
            <span className="absolute top-2 right-2 font-mono text-[9px] text-[#ff5500]/70">
              + [X: 104.2, Y: -84.9]
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-[9px] text-[#ff5500]/70">
              + GEOM_TRIS: 14.8K
            </span>
            <span className="absolute bottom-2 right-2 font-mono text-[9px] text-[#ff5500]/70">
              + NODE_GRAPH_ACTIVE
            </span>
          </>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono text-zinc-500">0{index + 1}</span>
            <h3 className="text-xl md:text-3xl font-mono tracking-tight text-white group-hover:text-amber-300 transition-colors">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              {project.category}
            </span>
            <span>{project.year}</span>
          </div>
        </div>

        <p className="text-sm md:text-base text-zinc-300 font-light mb-8 max-w-3xl leading-relaxed">
          {project.description}
        </p>

        {/* Metrics & Tech Tags */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-none"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowArchModal(true);
                playSelectSound();
              }}
              onMouseEnter={playHoverTone}
              className="font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[#ff5500]/40 text-orange-400 hover:bg-[#ff5500] hover:text-black transition-all"
            >
              [INSPECT ARCHITECTURE]
            </button>

            {project.metrics && (
              <div className="flex items-center space-x-4 font-mono text-xs">
                {project.metrics.map((m) => (
                  <div key={m.label} className="text-right">
                    <span className="text-zinc-500 block text-[10px]">
                      {m.label}
                    </span>
                    <span className="text-amber-300 font-semibold">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Architecture Node Graph Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#12141a] border border-[#ff5500]/60 p-8 shadow-[0_0_50px_rgba(255,85,0,0.25)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#ff5500]/30 pb-4">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest block">
                  SYSTEM ARCHITECTURE INSPECTOR
                </span>
                <h3 className="text-xl font-mono text-white">
                  {project.title} // TOPOLOGY
                </h3>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-xs border border-white/20 px-3 py-1"
              >
                [ESC // CLOSE]
              </button>
            </div>

            {/* Topology Flow Graph */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 font-mono text-xs">
              <div className="p-4 bg-black/60 border border-orange-500/30 space-y-2">
                <span className="text-[9px] text-zinc-500 block">NODE 01</span>
                <div className="text-orange-300 font-bold">CLIENT FRONTEND</div>
                <div className="text-[10px] text-zinc-400">Next.js 16 App Router + React 19 Client</div>
              </div>
              <div className="p-4 bg-black/60 border border-orange-500/30 space-y-2">
                <span className="text-[9px] text-zinc-500 block">NODE 02</span>
                <div className="text-amber-300 font-bold">WEBGL R3F WORLD</div>
                <div className="text-[10px] text-zinc-400">65,536 FBO GPGPU Particles + GLSL Noise</div>
              </div>
              <div className="p-4 bg-black/60 border border-orange-500/30 space-y-2">
                <span className="text-[9px] text-zinc-500 block">NODE 03</span>
                <div className="text-emerald-300 font-bold">AUDIO SYNTH</div>
                <div className="text-[10px] text-zinc-400">Web Audio API Native Oscillator Array</div>
              </div>
              <div className="p-4 bg-black/60 border border-orange-500/30 space-y-2">
                <span className="text-[9px] text-zinc-500 block">NODE 04</span>
                <div className="text-cyan-300 font-bold">PHYSICS ENGINE</div>
                <div className="text-[10px] text-zinc-400">Lenis Physics + Damped Spring Inertia</div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between font-mono text-[10px] text-zinc-500">
              <span>STATUS: LIVE SIMULATION VERIFIED</span>
              <span>PARADIGM: TACTICAL CAD NODE MATRIX</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
