"use client";

import React from "react";
import { useStore } from "@/store/useStore";

const PROJECTS = [
  { id: "01", title: "Monolith System", type: "Core WebGL Engine" },
  { id: "02", title: "Synthesis Sandbox", type: "Interactive Design" },
  { id: "03", title: "Lattice Router", type: "Edge Framework" },
];

export function ProjectsSection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "projects";

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
          03 // Selected Works
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-6xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-10">
          The Engineering <br />
          <span className="font-normal text-amber-200">Portfolio</span>
        </h2>

        <div className="flex flex-col border-t border-zinc-800/80">
          {PROJECTS.map((proj, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-5 border-b border-zinc-800/80 group cursor-pointer pointer-events-auto"
            >
              <div className="flex items-center space-x-6">
                <span className="font-[var(--font-fira-code)] text-xs text-zinc-650 group-hover:text-amber-200 transition-colors duration-300">
                  {proj.id}
                </span>
                <span className="font-[var(--font-inter)] text-lg md:text-xl text-zinc-200 group-hover:text-white transition-colors duration-300 font-light">
                  {proj.title}
                </span>
              </div>
              <span className="font-[var(--font-fira-code)] text-[10px] uppercase tracking-wider text-zinc-500 group-hover:text-zinc-350 transition-colors duration-300">
                {proj.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;
