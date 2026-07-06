"use client";

import React from "react";
import { useStore } from "@/store/useStore";

export function AboutSection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "about";

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
      <div className="max-w-3xl">
        <span className="font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.3em] text-amber-350 mb-3 block">
          01 // Introduction
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-6xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-6">
          The Workspace <br />
          <span className="font-normal text-amber-200">As a Living Mind</span>
        </h2>
        <p className="font-[var(--font-inter)] text-zinc-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
          I design and build spatial interfaces where code architecture meets digital design.
          Project Nexus represents a philosophy of digital craftsmanship: creating experiences that
          feel organic, structured, and emotionally resonant.
        </p>
      </div>
    </div>
  );
}

export default AboutSection;
