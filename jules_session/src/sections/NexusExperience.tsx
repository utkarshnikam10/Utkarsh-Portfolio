"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { MagneticCursor } from "@/components/ui/MagneticCursor";
import { chapterById } from "@/constants/chapters";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useWorldChoreography } from "@/hooks/useWorldChoreography";
import { useWorldExperience } from "@/hooks/useWorldExperience";
import { ChapterPanel } from "@/sections/ChapterPanel";
import { DestinationDock } from "@/sections/DestinationDock";
import { ExperienceHeader } from "@/sections/ExperienceHeader";
import { cn } from "@/utils/cn";

const WorldScene = dynamic(() => import("@/three/scenes/WorldScene"), {
  ssr: false,
  loading: () => (
    <div className="world-loading" aria-hidden="true">
      <span />
    </div>
  ),
});

export function NexusExperience() {
  const [hasArrived, setHasArrived] = useState(false);
  const { activeId, visited, selectChapter, returnToWorld } = useWorldExperience();
  const activeChapter = activeId ? (chapterById(activeId) ?? null) : null;
  const choreography = useWorldChoreography();

  useSmoothScroll();

  useEffect(() => {
    const timer = window.setTimeout(() => setHasArrived(true), 720);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className={cn("nexus-experience", hasArrived && "has-arrived", activeId && "has-selection")}
      aria-label="Interactive portfolio world"
    >
      <MagneticCursor />
      <div className="world-stage" aria-label="Interactive portfolio world">
        <WorldScene
          activeId={activeId}
          onSelect={selectChapter}
          scrollProgress={choreography}
          visited={visited}
        />
      </div>

      <div className="atmosphere atmosphere--one" aria-hidden="true" />
      <div className="atmosphere atmosphere--two" aria-hidden="true" />

      <ExperienceHeader
        activeLabel={activeChapter?.label}
        onHome={returnToWorld}
        visited={visited}
      />

      <section className="arrival-copy" aria-label="Portfolio introduction">
        <p className="arrival-copy__eyebrow">Utkarsh / creative developer / 2026</p>
        <h1>
          Work with
          <br />
          <em>gravity.</em>
        </h1>
        <p className="arrival-copy__summary">
          A small, living index of product systems, experiments, and the decisions behind them.
        </p>
        <div className="arrival-copy__actions">
          <a href="#projects">
            View selected work <span aria-hidden="true">↘</span>
          </a>
          <a href="#contact">
            Start a conversation <span aria-hidden="true">↘</span>
          </a>
        </div>
      </section>

      <DestinationDock activeId={activeId} onSelect={selectChapter} visited={visited} />
      <ChapterPanel chapter={activeChapter} onClose={returnToWorld} />

      <div className="arrival-curtain" aria-hidden="true">
        <span>U/</span>
      </div>
    </section>
  );
}
