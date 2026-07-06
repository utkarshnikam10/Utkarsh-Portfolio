"use client";

import React from "react";
import { useStore } from "@/store/useStore";

const SKILL_CATEGORIES = [
  {
    name: "Frontend Core",
    items: [
      "Three.js / React Three Fiber",
      "GSAP / Framer Motion",
      "Tailwind CSS",
      "Next.js Architecture",
    ],
  },
  {
    name: "Systems & Cloud",
    items: [
      "Google Cloud Platform",
      "Node.js / TypeScript",
      "Web Audio API Synthesis",
      "Draco / Asset Compression",
    ],
  },
];

export function SkillsSection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "skills";

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
          04 // Expert Domains
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-6xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-12">
          The Crystalline <br />
          <span className="font-normal text-amber-200">Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="flex flex-col">
              <h3 className="font-[var(--font-inter)] text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-6 border-b border-zinc-800 pb-2">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="font-[var(--font-fira-code)] text-[11px] text-zinc-300 bg-zinc-900/50 border border-zinc-800/80 px-3 py-1.5 rounded-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkillsSection;
