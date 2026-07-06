import React from "react";
import CanvasContainer from "@/components/canvas/CanvasContainer";
import ScrollContainer from "@/components/dom/ScrollContainer";

/**
 * PROJECT NEXUS // MAIN PAGE ENTRY
 * Responsibility: Mounts the WebGL CanvasContainer which includes the
 * loading experience, debug overlay, and 3D scene.
 *
 * The loading screen is the visitor's first emotional experience.
 * It fades out when the engine is ready, revealing the empty workshop
 * waiting for the Guide Character to arrive.
 */
export default function Home() {
  return (
    <main className="relative min-h-screen w-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* 3D WebGL Canvas Layer (Fixed background) */}
      <div className="fixed inset-0 z-0 h-screen w-screen pointer-events-none">
        <CanvasContainer />
      </div>

      {/* DOM Smooth Scrolling Layer */}
      <ScrollContainer />
    </main>
  );
}
