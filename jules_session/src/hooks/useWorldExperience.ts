"use client";

import { useCallback, useEffect, useState } from "react";

import type { ChapterId } from "@/types/world";

export function useWorldExperience() {
  const [activeId, setActiveId] = useState<ChapterId | null>(null);
  const [visited, setVisited] = useState<ChapterId[]>([]);

  const selectChapter = useCallback((id: ChapterId) => {
    setActiveId(id);
    setVisited((current) => (current.includes(id) ? current : [...current, id]));
  }, []);

  const returnToWorld = useCallback(() => setActiveId(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") returnToWorld();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [returnToWorld]);

  return { activeId, visited, selectChapter, returnToWorld };
}
