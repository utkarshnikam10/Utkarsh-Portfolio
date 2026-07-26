"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { CinematicCamera } from "../camera/CinematicCamera";
import { WorldEnvironment } from "./WorldEnvironment";
import { ShatterGlass } from "../components/ShatterGlass";
import { NonEuclideanPortal } from "../components/NonEuclideanPortal";
import { BlackHoleLensing } from "../components/BlackHoleLensing";
import { TemporalScrubber } from "../components/TemporalScrubber";
import { ExplodedVault } from "../components/ExplodedVault";
import { NeuralMatrix } from "../components/NeuralMatrix";
import { MonolithHorizon } from "../components/MonolithHorizon";
import { MonolithHero } from "../components/MonolithHero";
import { ReactiveMicroParticleVoid } from "../components/ReactiveMicroParticleVoid";
import { CanvasLoader } from "../components/CanvasLoader";
import { PerformanceController } from "../components/PerformanceController";
import { useChapterState } from "../../hooks/useChapterState";
import { useBulletTime } from "../hooks/useBulletTime";
import { portfolioData } from "../../data/portfolio";
import { spatialAudio } from "../../utils/SpatialAudio";
import { audioSynth } from "../../utils/AudioSynth";

function SpatialAudioUpdater() {
  const { camera } = useThree();
  const { activeChapter } = useChapterState();

  useFrame(() => {
    spatialAudio.updateCameraPosition(
      camera.position.x,
      camera.position.y,
      camera.position.z,
      activeChapter
    );
  });

  return null;
}

/** Sandbox HUD Toggle — renders outside Canvas */
function SandboxHUD({
  active,
  timeLocked,
  onToggle,
}: {
  active: boolean;
  timeLocked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 right-6 z-50 font-mono text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 border transition-all duration-300 pointer-events-auto"
      style={{
        color: active ? "#38bdf8" : "rgba(255,255,255,0.4)",
        borderColor: active ? "#38bdf8" : "rgba(255,255,255,0.15)",
        background: active ? "rgba(56,189,248,0.08)" : "transparent",
      }}
    >
      [E // KINETIC_SANDBOX]
      {timeLocked && (
        <span className="ml-2 text-amber-400">⏸ TIME_LOCKED</span>
      )}
    </button>
  );
}

/** Bullet-Time post-processing controller mounted inside Canvas */
function BulletTimeEffects() {
  const bt = useBulletTime();
  const aberrationOffset = React.useMemo(() => new THREE.Vector2(0, 0), []);

  React.useEffect(() => {
    aberrationOffset.set(bt.aberration * 0.5, bt.aberration * 0.5);
  }, [bt.aberration, aberrationOffset]);

  // ChromaticAberration only when bullet-time active
  if (bt.aberration < 0.001) return null;

  return (
    <ChromaticAberration
      blendFunction={BlendFunction.NORMAL}
      offset={aberrationOffset}
    />
  );
}

interface WorldSceneProps {
  highlightIndex?: number | null;
}

export default function WorldScene({ highlightIndex = null }: WorldSceneProps = {}) {
  const [isMobile, setIsMobile] = useState(true); // Default to true for safety
  const [mounted, setMounted] = useState(false);
  const [sandboxActive, setSandboxActive] = useState(false);
  const [timeLocked, setTimeLocked] = useState(false);

  const { activeChapter } = useChapterState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      updateMobile();
      setMounted(true); // Now we know the exact window size

      // Update on resize / orientation change
      window.addEventListener("resize", updateMobile);

      const handleFirstGesture = () => {
        spatialAudio.init();
        spatialAudio.unlock();
        audioSynth.init();
        audioSynth.unlock();
        window.removeEventListener("pointerdown", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
      };

      window.addEventListener("pointerdown", handleFirstGesture);
      window.addEventListener("keydown", handleFirstGesture);

      // Sandbox E-key toggle (desktop only)
      const handleKey = (e: KeyboardEvent) => {
        if (e.code === "KeyE") setSandboxActive((prev) => !prev);
        if (e.code === "Space" && sandboxActive) {
          e.preventDefault();
          setTimeLocked(e.type === "keydown");
        }
      };

      window.addEventListener("keydown", handleKey);
      window.addEventListener("keyup", handleKey);

      return () => {
        window.removeEventListener("resize", updateMobile);
        window.removeEventListener("keydown", handleKey);
        window.removeEventListener("keyup", handleKey);
      };
    }
  }, [sandboxActive]);

  return (
    <div className="relative w-full h-full bg-[#030305]">
      {/* Sandbox HUD Toggle Button — desktop only */}
      {!isMobile && (
        <SandboxHUD
          active={sandboxActive}
          timeLocked={timeLocked}
          onToggle={() => setSandboxActive((prev) => !prev)}
        />
      )}

      {mounted && (
        <Canvas
          camera={{ position: [0, 0, 7.5], fov: 45 }}
          dpr={isMobile ? [0.75, 1.0] : [1.0, 1.25]}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            stencil: true,
          }}
          style={{ background: "#030305" }}
        >
        <color attach="background" args={["#030305"]} />
        <PerformanceController onQualityChange={() => {}} />

        <Suspense fallback={<CanvasLoader />}>
          <CinematicCamera />
          <WorldEnvironment />
          <SpatialAudioUpdater />

          {/* 150,000 Ultra-Density Reactive Micro-Particle Void */}
          <ReactiveMicroParticleVoid />

          {/* Chamber I: Pristine Obsidian Monolith Hero */}
          <group visible={activeChapter === 0}>
            <MonolithHero visible={activeChapter === 0} />
          </group>

          {/* Chamber II: Exploded Hardware Vault with Voronoi Shatter Glass & Temporal Scrubber */}
          <group visible={activeChapter >= 1}>
            <TemporalScrubber
              position={[0, 2.2, 0.5]}
              visible={activeChapter === 1}
            />
            {portfolioData.projects.map((p, idx) => (
              <group key={p.id} visible={activeChapter === 1}>
                <ExplodedVault
                  title={p.title}
                  category={p.category}
                  position={[(idx - 1.5) * 3.2, -0.2, 0.5 - idx * 0.4]}
                  index={idx}
                  visible={activeChapter === 1}
                />
                <ShatterGlass
                  position={[(idx - 1.5) * 3.2, -0.2, 0.8 - idx * 0.4]}
                  visible={activeChapter === 1}
                />
              </group>
            ))}
          </group>

          {/* Chamber III: Non-Euclidean Stencil Portal & Neural Energy Matrix */}
          <group visible={activeChapter >= 2}>
            <NonEuclideanPortal position={[3.5, 0, -3.0]} portalZ={-3.0} visible={activeChapter === 2} />
            <NeuralMatrix visible={activeChapter === 2} />
          </group>

          {/* Chamber IV: Kerr Black Hole Gravitational Lensing & Monolithic Convergence */}
          <group visible={activeChapter >= 3}>
            <BlackHoleLensing
              position={[-3.5, 0, -6.0]}
              visible={activeChapter === 3}
            />
            <MonolithHorizon visible={activeChapter === 3} />
          </group>

          <Environment preset="studio" environmentIntensity={0.1} />
        </Suspense>

        {!isMobile && (
          <EffectComposer enableNormalPass={false} stencilBuffer={true}>
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.92}
              mipmapBlur={true}
            />
            <Vignette offset={0.35} darkness={0.75} />
            <BulletTimeEffects />
          </EffectComposer>
        )}
      </Canvas>
      )}
    </div>
  );
}
