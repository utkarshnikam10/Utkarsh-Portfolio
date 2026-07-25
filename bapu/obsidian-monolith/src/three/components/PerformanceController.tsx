"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface PerformanceControllerProps {
  onQualityChange?: (quality: number) => void;
}

/**
 * PerformanceController — R3F component mounted INSIDE <Canvas>.
 * Dynamically adjusts device pixel ratio (dpr) and quality level based on
 * live FPS monitoring in the R3F frame loop.
 */
export function PerformanceController({ onQualityChange }: PerformanceControllerProps) {
  const setDpr = useThree((state) => state.setDpr);
  const frameCount = useRef(0);
  const lastTime = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const currentQuality = useRef(1.0);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Monitor FPS every 1.5 seconds
    if (elapsed >= 1500) {
      const fps = (frameCount.current * 1000) / elapsed;
      frameCount.current = 0;
      lastTime.current = now;

      if (fps < 40 && currentQuality.current > 0.5) {
        currentQuality.current = 0.5;
        setDpr(0.75);
        onQualityChange?.(0.5);
      } else if (fps >= 55 && currentQuality.current < 1.0) {
        currentQuality.current = 1.0;
        setDpr(1.25);
        onQualityChange?.(1.0);
      }
    }
  });

  return null;
}
