import React from "react";
import CanvasContainer from "@/components/canvas/CanvasContainer";

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
    <main className="relative h-screen w-screen overflow-hidden bg-[#0a0a0a]">
      <CanvasContainer />
    </main>
  );
}
