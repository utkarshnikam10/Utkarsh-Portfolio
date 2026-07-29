"use client";

import { CHAPTERS } from "@/constants/chapters";
import type { ChapterId } from "@/types/world";
import { cn } from "@/utils/cn";

interface DestinationDockProps {
  activeId: ChapterId | null;
  onSelect: (id: ChapterId) => void;
  visited: readonly ChapterId[];
}

export function DestinationDock({ activeId, onSelect, visited }: DestinationDockProps) {
  return (
    <nav className="destination-dock" aria-label="Explore portfolio destinations">
      <span className="destination-dock__lead">Explore</span>
      <div className="destination-dock__scroll">
        {CHAPTERS.map((chapter) => {
          const isActive = activeId === chapter.id;
          const isVisited = visited.includes(chapter.id);

          return (
            <button
              aria-pressed={isActive}
              className={cn("destination-pill", isActive && "is-active", isVisited && "is-visited")}
              data-cursor
              key={chapter.id}
              onClick={() => onSelect(chapter.id)}
              type="button"
            >
              <span className="destination-pill__number">{chapter.order}</span>
              <span>{chapter.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
