"use client";

import React from "react";
import { useStore } from "@/store/useStore";

const JOURNEY_STEPS = [
  { year: "2024 — Present", role: "Creative Technologist", firm: "Studio Nexus" },
  { year: "2022 — 2024", role: "WebGL Developer", firm: "Matrix Labs" },
  { year: "2020 — 2022", role: "Full Stack Engineer", firm: "Travertine Software" },
];

export function JourneySection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "journey";

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
          02 // Career Path
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-6xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-12">
          The Linear <br />
          <span className="font-normal text-amber-200">Chronicle</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {JOURNEY_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="border-l border-zinc-800 pl-6 py-2 transition-all duration-700"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(-20px)",
                transitionDelay: `${idx * 150}ms`,
              }}
            >
              <div className="font-[var(--font-fira-code)] text-[11px] text-zinc-500 mb-2">
                {step.year}
              </div>
              <div className="font-[var(--font-inter)] text-base font-normal text-zinc-200 mb-1">
                {step.role}
              </div>
              <div className="font-[var(--font-inter)] text-xs text-zinc-400 font-light">
                {step.firm}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JourneySection;
