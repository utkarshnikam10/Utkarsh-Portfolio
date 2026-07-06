"use client";

import React from "react";
import { useStore } from "@/store/useStore";

export function ContactSection() {
  const activeScene = useStore((state) => state.activeScene);
  const active = activeScene === "contact";

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
      <div className="max-w-xl w-full">
        <span className="font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.3em] text-amber-350 mb-3 block">
          07 // Final Node
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl md:text-5xl font-light uppercase tracking-tight text-zinc-100 leading-[1.1] mb-8">
          Establish <br />
          <span className="font-normal text-amber-200">Contact</span>
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 pointer-events-auto">
          <div>
            <label className="block font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-500 mb-2">
              Identity / Name
            </label>
            <input
              type="text"
              className="w-full bg-zinc-950/40 border border-zinc-800 focus:border-amber-200/50 outline-none px-4 py-2 text-zinc-150 text-sm font-[var(--font-inter)] rounded-sm transition-all"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-500 mb-2">
              Frequency / Email
            </label>
            <input
              type="email"
              className="w-full bg-zinc-950/40 border border-zinc-800 focus:border-amber-200/50 outline-none px-4 py-2 text-zinc-150 text-sm font-[var(--font-inter)] rounded-sm transition-all"
              placeholder="name@domain.com"
            />
          </div>
          <div>
            <label className="block font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-500 mb-2">
              Signal / Message
            </label>
            <textarea
              rows={3}
              className="w-full bg-zinc-950/40 border border-zinc-800 focus:border-amber-200/50 outline-none px-4 py-2 text-zinc-150 text-sm font-[var(--font-inter)] rounded-sm transition-all resize-none"
              placeholder="Your request details..."
            />
          </div>
          <button
            type="submit"
            className="border border-amber-200/40 hover:border-amber-200 bg-amber-250/5 hover:bg-amber-250/10 text-amber-200 font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.2em] px-6 py-2.5 rounded-sm transition-all cursor-pointer"
          >
            Send Signal
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactSection;
