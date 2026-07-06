"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: "01",
    title: "PROJECT NEXUS",
    category: "INTERACTIVE COGNITIVE SPACE",
    year: "2026",
    description:
      "A premium motion-first cinematic web application built on top of React Three Fiber, Custom Shaders, and Web Audio API synthesis.",
  },
  {
    id: "02",
    title: "CEREBRAL GARDEN",
    category: "SPATIAL ARCHIVE ENGINE",
    year: "2025",
    description:
      "An experimental semantic search browser visualizing connection vectors of private thought logs as dynamic foliage growth graphs.",
  },
  {
    id: "03",
    title: "HORIZON RAILWAY",
    category: "FLUID LOCOMOTION PROTOTYPE",
    year: "2024",
    description:
      "A high-fidelity physics-based train sandbox demonstrating kinetic friction, procedural track curves, and realistic spring damping.",
  },
];

export function ProjectsDossier() {
  const focusedObject = useStore((state) => state.focusedObject);
  const setFocusedObject = useStore((state) => state.setFocusedObject);

  const active = focusedObject === "workshop";
  const [visible, setVisible] = useState(false);

  // Delay content visibility slightly until camera flight gets closer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (active) {
      t = setTimeout(() => {
        setVisible(true);
      }, 800); // Wait for camera to fly halfway
    } else {
      t = setTimeout(() => {
        setVisible(false);
      }, 0);
    }
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-y-0 right-0 z-40 w-full md:w-[480px] bg-zinc-950/80 border-l border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between p-8 md:p-12 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(40px)",
      }}
    >
      <div>
        <button
          onClick={() => setFocusedObject(null)}
          className="group flex items-center gap-2 font-[var(--font-fira-code)] text-[9px] uppercase tracking-[0.2em] text-zinc-500 hover:text-amber-200 transition-colors cursor-pointer mb-12"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Plaza
        </button>

        <span className="font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.3em] text-amber-350 mb-3 block">
          02 // Selected Works
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl font-light uppercase tracking-tight text-zinc-150 mb-8">
          The <span className="font-normal text-amber-200">Workshop</span>
        </h2>

        <div className="space-y-8 mt-12">
          {PROJECTS_DATA.map((proj) => (
            <div key={proj.id} className="border-t border-zinc-900 pt-6 group">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="font-[var(--font-inter)] text-zinc-200 text-sm font-semibold tracking-wide group-hover:text-amber-100 transition-colors">
                  {proj.title}
                </h3>
                <span className="font-[var(--font-fira-code)] text-[8px] text-zinc-600">
                  {proj.year}
                </span>
              </div>
              <span className="font-[var(--font-fira-code)] text-[8px] tracking-wider text-amber-250/70 block mb-2">
                {proj.category}
              </span>
              <p className="font-[var(--font-inter)] text-zinc-400 text-xs font-light leading-relaxed">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-6 flex justify-between items-center text-[9px] font-[var(--font-fira-code)] text-zinc-600">
        <span>PROJECT NEXUS // PROTOTYPE 1.0</span>
        <span>NODE ID: WORKSHOP-01</span>
      </div>
    </div>
  );
}

export default ProjectsDossier;
