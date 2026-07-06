"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export function PhilosophyDossier() {
  const focusedObject = useStore((state) => state.focusedObject);
  const active = focusedObject === "tree";
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
          03 // Philosophy
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl font-light uppercase tracking-tight text-zinc-150 mb-8">
          The <span className="font-normal text-amber-200">Curiosity Tree</span>
        </h2>

        <div className="space-y-6 mt-12 font-[var(--font-inter)] text-sm font-light leading-relaxed">
          <p className="italic text-amber-100/90 font-normal">
            &ldquo;Nature does not rush, yet everything is accomplished.&rdquo;
          </p>
          <p>
            The Tree of Curiosity symbolizes continuous, organic growth. Software engineering should
            resemble landscaping rather than assembly lines—thoughtfully laid foundations,
            intentional structures, and room to evolve.
          </p>
          <div className="border-t border-zinc-900 pt-6 mt-8 space-y-4">
            <div>
              <span className="font-[var(--font-fira-code)] text-[9px] uppercase text-zinc-500 block mb-1">
                Principle 01
              </span>
              <span className="text-zinc-250">
                Emotion precedes information. Connect with the visitor first.
              </span>
            </div>
            <div>
              <span className="font-[var(--font-fira-code)] text-[9px] uppercase text-zinc-500 block mb-1">
                Principle 02
              </span>
              <span className="text-zinc-250">
                Every transition has purpose. Smooth is fast; fast is slow.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-900 pt-6 flex justify-between items-center text-[9px] font-[var(--font-fira-code)] text-zinc-600">
        <span>PROJECT NEXUS // PHILOSOPHY</span>
        <span>NODE ID: TREE-01</span>
      </div>
    </div>
  );
}

export default PhilosophyDossier;
