"use client";

import React from "react";
import { useStore, FocusedObject } from "@/store/useStore";
import { AudioEngine } from "@/audio/AudioEngine";

export function HUD() {
  const focusedObject = useStore((state) => state.focusedObject);
  const setFocusedObject = useStore((state) => state.setFocusedObject);

  if (focusedObject === null) return null;

  const items: { id: FocusedObject; label: string }[] = [
    { id: "library", label: "📚 Library" },
    { id: "workshop", label: "⚙️ Workshop" },
    { id: "tree", label: "🌳 Tree" },
    { id: "mailbox", label: "📬 Mailbox" },
  ];

  return (
    <div className="fixed top-8 right-8 z-50 flex items-center gap-6 pointer-events-auto bg-zinc-950/80 border border-zinc-850 backdrop-blur-md px-5 py-2.5 rounded-sm transition-all duration-[1s]">
      {items.map((item) => {
        const active = focusedObject === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              AudioEngine.playClickTone();
              setFocusedObject(item.id);
            }}
            className="font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider transition-colors cursor-pointer hover:text-amber-100"
            style={{ color: active ? "#ffd69e" : "#71717a" }}
          >
            {item.label}
          </button>
        );
      })}
      <div className="h-3 w-[1px] bg-zinc-800" />
      <button
        onClick={() => {
          AudioEngine.playClickTone();
          setFocusedObject(null);
        }}
        className="font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
      >
        [ Exit ]
      </button>
    </div>
  );
}

export default HUD;
