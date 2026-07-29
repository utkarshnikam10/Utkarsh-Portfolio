"use client";

import { useEffect, useRef } from "react";

/**
 * Keeps scroll choreography outside React's render cycle. The number begins
 * once the visitor leaves the landing composition and reaches 1 at the end of
 * the spatial introduction.
 */
export function useWorldChoreography() {
  const progress = useRef(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const start = window.innerHeight * 0.88;
      const length = window.innerHeight * 1.65;
      progress.current = Math.min(Math.max((window.scrollY - start) / length, 0), 1);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return progress;
}
