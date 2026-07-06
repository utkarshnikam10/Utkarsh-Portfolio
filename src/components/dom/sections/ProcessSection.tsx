"use client";

import React from "react";
import { useStore } from "@/store/useStore";

const STAGES = [
  {
    step: "01",
    name: "Anatomy & Structure",
    desc: "Setting the geometric foundations and volumetric spaces first.",
  },
  {
    step: "02",
    name: "Motion & Easing",
    desc: "Rigging dynamic camera tracks and curves to build flow.",
  },
  {
    step: "03",
    name: "Sensory Atmosphere",
    desc: "Synthesizing shaders, morning light, and procedural acoustics.",
  },
];

export function ProcessSection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "process";

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center px-12 md:px-24 pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(40px)",
        transition:
          "opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <div className="max-w-4xl">
        <span className="font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.3em] text-amber-350 mb-3 block">
          05 // Methodology
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-6xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-12">
          The Creative <br />
          <span className="font-normal text-amber-200">Process</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STAGES.map((stage, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-zinc-950/20 border border-zinc-800/40 p-6 transition-all duration-700"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              <span className="font-[var(--font-fira-code)] text-xs text-amber-200 mb-4 block font-semibold">
                {stage.step}
              </span>
              <h3 className="font-[var(--font-inter)] text-base text-zinc-200 mb-2 font-normal">
                {stage.name}
              </h3>
              <p className="font-[var(--font-inter)] text-xs text-zinc-400 font-light leading-relaxed">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProcessSection;
