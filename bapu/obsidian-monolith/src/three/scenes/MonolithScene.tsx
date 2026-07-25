/* eslint-disable */
"use client";

import React, { useState, useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import { ObsidianSculpture } from "../components/ObsidianSculpture";
import { ParticleField } from "../components/ParticleField";
import { CanvasLoader } from "../components/CanvasLoader";

interface DynamicLightingProps {
  hovered: boolean;
  targetPoint: THREE.Vector3 | null;
  reducedMotion: boolean;
}

function DynamicLighting({
  hovered,
  targetPoint,
  reducedMotion,
}: DynamicLightingProps) {
  const primaryRimRef = useRef<THREE.DirectionalLight>(null);
  const secondaryRimRef = useRef<THREE.DirectionalLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const { pointer, camera } = useThree();

  const prevPointer = useRef({ x: 0, y: 0 });
  const mouseVel = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    // Mouse velocity calculation with spring damping
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;

    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;

    const safeDelta = Math.max(delta, 0.001);
    mouseVel.current.x = THREE.MathUtils.lerp(
      mouseVel.current.x,
      dx / safeDelta,
      delta * 8.0
    );
    mouseVel.current.y = THREE.MathUtils.lerp(
      mouseVel.current.y,
      dy / safeDelta,
      delta * 8.0
    );

    if (!reducedMotion) {
      let scrollProgress = 0;
      if (typeof window !== "undefined") {
        const maxScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          1
        );
        scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      }

      const targetCamZ = 7.0 - scrollProgress * 1.8;
      const targetCamY = -scrollProgress * 0.7 + mouseVel.current.y * 0.04;
      const targetCamX = mouseVel.current.x * 0.04;

      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        targetCamX,
        delta * 4.0
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetCamY,
        delta * 4.0
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetCamZ,
        delta * 3.0
      );
      camera.lookAt(0, -scrollProgress * 0.35, 0);
    }

    // Interactive Point Light lerping smoothly toward mouse position (capped for clean contrast)
    if (pointLightRef.current) {
      const targetX = targetPoint ? targetPoint.x : pointer.x * 4.5;
      const targetY = targetPoint ? targetPoint.y : pointer.y * 4.5;

      pointLightRef.current.position.x = THREE.MathUtils.lerp(
        pointLightRef.current.position.x,
        targetX,
        delta * 6.0
      );
      pointLightRef.current.position.y = THREE.MathUtils.lerp(
        pointLightRef.current.position.y,
        targetY,
        delta * 6.0
      );
    }

    // Primary Directional Rim Light intensity capped at 2.5 max
    if (primaryRimRef.current) {
      const targetIntensity = hovered ? 3.2 : 2.5;
      primaryRimRef.current.intensity = THREE.MathUtils.lerp(
        primaryRimRef.current.intensity,
        targetIntensity,
        delta * 5
      );
    }
  });

  return (
    <>
      {/* Near-zero ambient light for pitch-black shadows */}
      <ambientLight intensity={0.05} color="#050508" />

      {/* Primary directional rim light capped at 2.5 max */}
      <directionalLight
        ref={primaryRimRef}
        position={[8, 12, -10]}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />

      {/* Secondary subtle warm accent rim light */}
      <directionalLight
        ref={secondaryRimRef}
        position={[-10, 8, -8]}
        intensity={1.2}
        color="#d4af37"
      />

      {/* Interactive point light tracking mouse cursor across geometry bevels */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 4.5]}
        intensity={1.8}
        color="#f5f5f7"
        distance={12}
      />

      <Environment preset="studio" environmentIntensity={0.2} />
    </>
  );
}

export default function MonolithScene() {
  const [hovered, setHovered] = useState(false);
  const [targetPoint, setTargetPoint] = useState<THREE.Vector3 | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const maxDpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setTimeout(() => {
        setDpr(maxDpr);
        setReducedMotion(mediaQuery.matches);
      }, 0);
    }
  }, []);

  const chromaticOffset = useMemo(
    () => new THREE.Vector2(0.0012, 0.0012),
    []
  );

  return (
    <div className="relative w-full h-full bg-[#050505]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        style={{ background: "#050505" }}
      >
        <color attach="background" args={["#050505"]} />
        <fogExp2 attach="fog" args={["#050505", 0.03]} />

        <Suspense fallback={<CanvasLoader />}>
          <DynamicLighting
            hovered={hovered}
            targetPoint={targetPoint}
            reducedMotion={reducedMotion}
          />

          <ParticleField count={10000} />

          <ObsidianSculpture
            onHoverChange={setHovered}
            onPointerTargetUpdate={setTargetPoint}
          />
        </Suspense>

        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.92}
            mipmapBlur={true}
          />
          <ChromaticAberration offset={chromaticOffset} />
          <Vignette offset={0.35} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
