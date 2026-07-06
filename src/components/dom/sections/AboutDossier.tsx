"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export function AboutDossier() {
  const focusedObject = useStore((state) => state.focusedObject);
  const active = focusedObject === "library";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (active) {
      t = setTimeout(() => {
        setVisible(true);
      }, 800);
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
      className="fixed inset-y-0 right-0 z-40 w-full md:w-[480px] bg-zinc-950/80 border-l border-zinc-800/80 backdrop-blur-xl flex flex-col justify-between p-8 md:p-12 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] text-zinc-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(40px)",
      }}
    >
      <div>
        <span className="font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.3em] text-amber-350 mb-3 block">
          01 // Identity
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl font-light uppercase tracking-tight text-zinc-150 mb-8">
          The <span className="font-normal text-amber-200">Library</span>
        </h2>

        <div className="space-y-6 mt-12 font-[var(--font-inter)] text-sm font-light leading-relaxed">
          <p>
            I am a creative developer operating at the intersection of design engineering, spatial
            computing, and interactive storytelling.
          </p>
          <p>
            By treating code as a tangible medium and animations as communication structures, I
            build software that feels expensive, premium, and deeply human.
          </p>
          <div className="border-t border-zinc-900 pt-6 mt-8 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-[var(--font-fira-code)] text-[9px] uppercase text-zinc-500">
                Core Focus
              </span>
              <span className="text-zinc-200">Creative Technology, WebGL, UI Design</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-[var(--font-fira-code)] text-[9px] uppercase text-zinc-500">
                Location
              </span>
              <span className="text-zinc-200">Earth Node // remote</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-6 flex justify-between items-center text-[9px] font-[var(--font-fira-code)] text-zinc-600">
        <span>PROJECT NEXUS // LIBRARY</span>
        <span>NODE ID: LBRY-01</span>
      </div>
    </div>
  );
}

export default AboutDossier;
