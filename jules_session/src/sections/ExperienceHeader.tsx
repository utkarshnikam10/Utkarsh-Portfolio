"use client";

import { NexusMark } from "@/components/ui/NexusMark";
import { ProgressMeter } from "@/components/ui/ProgressMeter";

interface ExperienceHeaderProps {
  activeLabel?: string;
  visited: readonly string[];
  onHome: () => void;
}

export function ExperienceHeader({ activeLabel, visited, onHome }: ExperienceHeaderProps) {
  return (
    <header className="experience-header">
      <button
        className="brand-lockup"
        type="button"
        onClick={onHome}
        aria-label="Return to the NEXUS world"
        data-cursor
      >
        <NexusMark />
        <span className="brand-lockup__text">UTKARSH / INDEX</span>
      </button>
      <p className="experience-header__location" aria-live="polite">
        {activeLabel ? activeLabel : "The World"}
      </p>
      <ProgressMeter visited={visited} />
    </header>
  );
}
