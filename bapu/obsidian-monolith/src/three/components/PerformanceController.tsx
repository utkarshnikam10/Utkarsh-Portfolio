"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface PerformanceControllerProps {
  onQualityChange?: (quality: number) => void;
}

/**
 * PerformanceController — R3F component mounted INSIDE <Canvas>.
 * 3-tier adaptive quality system:
 *   HIGH (1.0): dpr=1.25, full effects
 *   MEDIUM (0.7): dpr=0.85, reduced bloom
 *   LOW (0.5): dpr=0.65, minimal post-processing
 * Samples FPS every 1s for faster response on mobile.
 */
export function PerformanceController({ onQualityChange }: PerformanceControllerProps) {
  const setDpr = useThree((state) => state.setDpr);
  const frameCount = useRef(0);
  const lastTime = useRef(typeof performance !== "undefined" ? performance.now() : 0);
  const currentQuality = useRef(1.0);
  const consecutiveLow = useRef(0);

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    // Sample FPS every 1 second for faster mobile adaptation
    if (elapsed >= 1000) {
      const fps = (frameCount.current * 1000) / elapsed;
      frameCount.current = 0;
      lastTime.current = now;

      if (fps < 28) {
        // Critical: drop to LOW immediately
        consecutiveLow.current++;
        if (currentQuality.current > 0.5) {
          currentQuality.current = 0.5;
          setDpr(0.65);
          onQualityChange?.(0.5);
        }
      } else if (fps < 45 && currentQuality.current > 0.7) {
        // Struggling: drop to MEDIUM
        currentQuality.current = 0.7;
        setDpr(0.85);
        onQualityChange?.(0.7);
        consecutiveLow.current = 0;
      } else if (fps >= 55 && currentQuality.current < 1.0) {
        // Stable: promote to HIGH
        consecutiveLow.current = 0;
        currentQuality.current = 1.0;
        setDpr(1.25);
        onQualityChange?.(1.0);
      } else {
        consecutiveLow.current = 0;
      }
    }
  });

  return null;
}
