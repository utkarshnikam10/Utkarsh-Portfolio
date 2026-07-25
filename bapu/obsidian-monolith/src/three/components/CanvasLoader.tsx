"use client";

import React from "react";
import { Html, useProgress } from "@react-three/drei";

export function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center font-mono text-xs tracking-widest text-zinc-400 uppercase select-none">
        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-3 relative">
          <span className="text-amber-300 font-semibold">{Math.round(progress)}%</span>
          <div
            className="absolute inset-0 rounded-full border border-amber-300 transition-all duration-300"
            style={{
              clipPath: `inset(${100 - Math.max(progress, 5)}% 0 0 0)`,
            }}
          />
        </div>
        <span className="text-[10px] text-zinc-500">INITIALIZING CANVAS</span>
      </div>
    </Html>
  );
}
