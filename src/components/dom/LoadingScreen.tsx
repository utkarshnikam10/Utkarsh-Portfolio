"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // CINEMATIC OPENING
 * Responsibility: A pure fade-from-black. No text. No buttons. No progress bar.
 * The visitor enters an already-living world through a slow 2-second dissolve.
 *
 * Emotional arc: Darkness → Light → "I've entered somewhere."
 */
export function LoadingScreen() {
  const assetsLoaded = useStore((state) => state.assetsLoaded);
  const engineReady = useStore((state) => state.engineReady);

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  /**
   * Listen for loading lifecycle events directly from the EventBus.
   */
  useEffect(() => {
    const handleProgress = (payload: unknown) => {
      const data = payload as { percent: number };
      void data;
    };
    EventBus.on("loading:progress", handleProgress);
    return () => EventBus.off("loading:progress", handleProgress);
  }, []);

  /**
   * Trigger fade-out when both assets are loaded and engine is ready.
   */
  useEffect(() => {
    if (assetsLoaded && engineReady && !isFadingOut) {
      // Brief pause — let the first frame render behind the black curtain
      const timer = setTimeout(() => {
        setIsFadingOut(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [assetsLoaded, engineReady, isFadingOut]);

  /**
   * Remove from DOM after the 2-second dissolve completes.
   */
  useEffect(() => {
    if (isFadingOut) {
      const timer = setTimeout(() => {
        setIsHidden(true);
        EventBus.emit("curtain:lifted");
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isFadingOut]);

  if (isHidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: "opacity 2.0s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isFadingOut ? "none" : "auto",
      }}
    />
  );
}

export default LoadingScreen;
