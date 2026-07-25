"use client";

import { useState, useEffect } from "react";

export interface ChapterState {
  progress: number;
  activeChapter: number;
  chapterProgress: number;
  transitionFactor: number;
}

export function useChapterState(): ChapterState {
  const [state, setState] = useState<ChapterState>({
    progress: 0,
    activeChapter: 0,
    chapterProgress: 0,
    transitionFactor: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const currentScroll = window.scrollY;
      const rawProgress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);

      // 4 Chapters: 0 (Hero), 1 (Projects), 2 (Skills), 3 (Contact)
      const exactChapter = rawProgress * 3; // range 0.0 to 3.0
      const activeChapter = Math.min(Math.floor(exactChapter), 3);
      const chapterProgress = exactChapter - activeChapter;
      const transitionFactor = Math.sin(chapterProgress * Math.PI); // smooth bell curve

      setState({
        progress: rawProgress,
        activeChapter,
        chapterProgress,
        transitionFactor,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return state;
}
