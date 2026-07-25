"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Lenis from "lenis";
import { PortfolioSections } from "../components/PortfolioSections";
import { PillNavigation } from "../components/ui/PillNavigation";
import { FilmGrainOverlay } from "../components/ui/PremiumEffects";

const WorldScene = dynamic(() => import("../three/scenes/WorldScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#030305] flex flex-col items-center justify-center gap-4">
      {/* Premium loading state */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#ffff23] animate-spin" />
      </div>
      <span className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">
        INITIALIZING SPATIAL WORLD
      </span>
    </div>
  ),
});

export default function Home() {
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen bg-[#030305] text-[#f4f4f7] selection:bg-[#ffff23] selection:text-black">
      {/* Film Grain Texture Overlay */}
      <FilmGrainOverlay />

      {/* Floating Pill Navigation */}
      <PillNavigation />

      {/* Fixed WebGL Continuous 3D Spatial Campus World */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <WorldScene highlightIndex={highlightIndex} />
      </div>

      {/* Editorial Content Overlay */}
      <PortfolioSections onHighlightProject={setHighlightIndex} />
    </main>
  );
}
