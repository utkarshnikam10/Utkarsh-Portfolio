"use client";

import React from "react";
import { useStore } from "@/store/useStore";

export function VisionSection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "vision";

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
          06 // Ambition
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-6xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-8">
          The Tree of <br />
          <span className="font-normal text-amber-200">Curiosity</span>
        </h2>

        <p className="font-[var(--font-inter)] text-zinc-300 text-lg md:text-2xl font-light italic max-w-2xl leading-relaxed">
          &ldquo;The internet should be felt, not just read. By integrating cinematography and
          spatial design into code, we create portals to new ideas.&rdquo;
        </p>
      </div>
    </div>
  );
}

export default VisionSection;
