"use client";

import React, { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { RENDERER_GL_PROPS, configureRenderer } from "@/rendering/Renderer";
import SceneManager from "@/rendering/SceneManager";
import CameraManager from "@/camera/CameraManager";
import WorldManager from "@/world/WorldManager";
import CharacterManager from "@/character/CharacterManager";
import AssetManager from "@/systems/AssetManager";
import AudioManager from "@/audio/AudioManager";
import { DebugCollector, DebugPanel, DebugData } from "@/components/dom/DebugPanel";
import LoadingScreen from "@/components/dom/LoadingScreen";
import { Application } from "@/core/Application";

/**
 * PROJECT NEXUS // CANVAS CONTAINER
 * Responsibility: Mounts the main WebGL canvas element, initializes the R3F environment
 * with production renderer settings, and coordinates the Bootstrap → Engine lifecycle.
 *
 * Architecture:
 *   - Canvas uses centralized GL config from Renderer.ts
 *   - LoadingScreen overlays during bootstrap (DOM layer)
 *   - DebugCollector lives inside R3F for renderer access
 *   - DebugPanel renders as a DOM overlay outside the Canvas
 *   - Application singleton manages the full lifecycle
 */
export function CanvasContainer() {
  const hasBootstrapped = useRef(false);
  const [debugData, setDebugData] = useState<DebugData | null>(null);

  const handleDebugData = useCallback((data: DebugData) => {
    setDebugData(data);
  }, []);

  /**
   * Initialize the Application lifecycle on mount, teardown on unmount.
   */
  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    const app = Application.getInstance();
    app.initialize().catch((err) => {
      console.error("PROJECT NEXUS // Application initialization failed:", err);
    });

    return () => {
      app.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-[#0a0a0a]">
      {/*
        Canvas with production renderer configuration.
        - GL props from centralized Renderer.ts config
        - onCreated applies tone mapping, color space, and shadow settings
        - DPR capped at 2 to prevent mobile VRAM exhaustion
      */}
      <Canvas
        gl={RENDERER_GL_PROPS}
        onCreated={configureRenderer}
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 2, 12] }}
      >
        <Suspense fallback={null}>
          {/* Core Manager Pipeline */}
          <AssetManager />
          <AudioManager />
          <CameraManager />
          <WorldManager />
          <CharacterManager />
          <SceneManager />

          {/* Debug data collector (R3F inner) */}
          <DebugCollector onData={handleDebugData} />

          {/* Preload all assets to prevent rendering stuttering during district transitions */}
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Loading Experience — cinematic loading screen (DOM layer) */}
      <LoadingScreen />

      {/* Debug overlay (DOM layer — outside Canvas) */}
      <DebugPanel data={debugData} />
    </div>
  );
}

export default CanvasContainer;
