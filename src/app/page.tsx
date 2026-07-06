"use client";

import React from "react";
import CanvasContainer from "@/components/canvas/CanvasContainer";
import ProjectsDossier from "@/components/dom/sections/ProjectsDossier";
import { useStore } from "@/store/useStore";

export default function Home() {
  const focusedObject = useStore((state) => state.focusedObject);

  return (
    <main className="relative h-screen w-screen bg-[#0a0a0f] overflow-hidden select-none">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <CanvasContainer />
      </div>

      {/* DOM Interactive Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-12">
        {/* Header HUD */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="font-[var(--font-inter)] text-sm font-semibold tracking-[0.2em] text-zinc-150">
              PROJECT NEXUS
            </h1>
            <span className="font-[var(--font-fira-code)] text-[9px] uppercase tracking-widest text-zinc-500 mt-1 block">
              MINIATURE ARCHIVE WORLD // PROTOTYPE 1.0
            </span>
          </div>
          <div className="text-right">
            <span className="font-[var(--font-fira-code)] text-[9px] uppercase tracking-widest text-zinc-400">
              EST. FREQUENCY // 5800 MHz
            </span>
          </div>
        </header>

        {/* Center Bottom Hover Hint (fades out when focused) */}
        <div
          className="w-full flex justify-center pb-6 transition-opacity duration-700"
          style={{ opacity: focusedObject === null ? 1 : 0 }}
        >
          <div className="bg-zinc-950/60 border border-zinc-900/60 px-4 py-2 backdrop-blur-sm rounded-sm">
            <span className="font-[var(--font-fira-code)] text-[9px] uppercase tracking-[0.25em] text-zinc-500 animate-pulse">
              [ Hover and Click Floating Objects to Explore ]
            </span>
          </div>
        </div>
      </div>

      {/* Projects Dossier Content Slide-in Panel */}
      <ProjectsDossier />
    </main>
  );
}
