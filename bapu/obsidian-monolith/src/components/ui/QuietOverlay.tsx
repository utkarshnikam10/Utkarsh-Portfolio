"use client";

import React, { useEffect, useState } from "react";
import { useChapterState } from "../../hooks/useChapterState";

const WORLD_TITLES = [
  "WORLD 01 // ORGANIC LIQUID CORE",
  "WORLD 02 // EXPLODED HARDWARE VAULT",
  "WORLD 03 // QUANTUM SPATIAL GRAPH",
  "WORLD 04 // THE VOID SPOTLIGHT",
];

export function QuietOverlay() {
  const { activeChapter } = useChapterState();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        setScrollProgress(window.scrollY / maxScroll);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const chapterIndexStr = `0${activeChapter + 1} // 04`;
  const currentWorldTitle = WORLD_TITLES[activeChapter] || WORLD_TITLES[0];
  const hideScrollHint = scrollProgress > 0.1;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 p-6 md:p-10 flex flex-col justify-between font-mono text-[11px] text-white/40 tracking-widest uppercase select-none">
      {/* Top Margin Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
          <span>UTKARSH // SPATIAL ARCHITECTURE</span>
        </div>
        <div>{chapterIndexStr}</div>
      </div>

      {/* Bottom Margin Footer */}
      <div className="flex justify-between items-end">
        {/* Dynamic World Title with subtle cross-fade slide transition */}
        <div className="overflow-hidden">
          <div
            key={activeChapter}
            className="transition-all duration-700 ease-out transform translate-y-0 opacity-100 font-semibold text-white/60"
          >
            {currentWorldTitle}
          </div>
        </div>

        {/* Scroll Indicator (Fades out past 10% scroll) */}
        <div
          className={`transition-opacity duration-500 ${
            hideScrollHint ? "opacity-0" : "opacity-100"
          }`}
        >
          SCROLL TO TRAVEL ↓
        </div>
      </div>
    </div>
  );
}
