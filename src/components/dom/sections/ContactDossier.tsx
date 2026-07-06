"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export function ContactDossier() {
  const focusedObject = useStore((state) => state.focusedObject);
  const active = focusedObject === "mailbox";
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
          04 // Transmission
        </span>
        <h2 className="font-[var(--font-inter)] text-4xl font-light uppercase tracking-tight text-zinc-150 mb-8">
          The <span className="font-normal text-amber-200">Mailbox</span>
        </h2>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5 mt-10">
          <div>
            <label className="block font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-500 mb-2">
              Identity / Name
            </label>
            <input
              type="text"
              className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-amber-200/50 outline-none px-4 py-2.5 text-zinc-150 text-xs font-[var(--font-inter)] rounded-sm transition-all"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-500 mb-2">
              Frequency / Email
            </label>
            <input
              type="email"
              className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-amber-200/50 outline-none px-4 py-2.5 text-zinc-150 text-xs font-[var(--font-inter)] rounded-sm transition-all"
              placeholder="name@domain.com"
            />
          </div>
          <div>
            <label className="block font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-500 mb-2">
              Signal / Message
            </label>
            <textarea
              rows={4}
              className="w-full bg-zinc-900/40 border border-zinc-800 focus:border-amber-200/50 outline-none px-4 py-2.5 text-zinc-150 text-xs font-[var(--font-inter)] rounded-sm transition-all resize-none"
              placeholder="Your request details..."
            />
          </div>
          <button
            type="submit"
            className="border border-amber-200/40 hover:border-amber-200 bg-amber-250/5 hover:bg-amber-250/10 text-amber-200 font-[var(--font-fira-code)] text-[10px] uppercase tracking-[0.2em] px-6 py-3 rounded-sm transition-all cursor-pointer w-full"
          >
            Transmit Signal
          </button>
        </form>
      </div>

      <div className="border-t border-zinc-900 pt-6 flex justify-between items-center text-[9px] font-[var(--font-fira-code)] text-zinc-600">
        <span>PROJECT NEXUS // MAILBOX</span>
        <span>NODE ID: MLBOX-01</span>
      </div>
    </div>
  );
}

export default ContactDossier;
