"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FractalMegastructureMaterial } from "../shaders/FractalMegastructure";

interface OmniStructureProps {
  qualitySteps?: number; // raymarching step count — scaled by PerformanceController
}

export function OmniStructure({ qualitySteps = 64 }: OmniStructureProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();

  const material = useMemo(() => {
    const mat = new FractalMegastructureMaterial();
    mat.transparent = true;
    mat.depthWrite = false;
    mat.side = THREE.DoubleSide;
    return mat;
  }, []);

  // Expose uniform access type-safely
  const matAny = material as any;

  const scrollDepth = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollDepth.current = window.scrollY / maxScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    matAny.uTime = state.clock.getElapsedTime();
    matAny.uScrollDepth = scrollDepth.current;
    matAny.uResolution = new THREE.Vector2(viewport.width, viewport.height);
    // Remap pointer (-1..1) to (0..1) for mouse parallax
    matAny.uMouse = new THREE.Vector2(
      pointer.x * 0.5 + 0.5,
      pointer.y * 0.5 + 0.5
    );
    matAny.uRaymarchSteps = qualitySteps;
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return (
    <mesh
      ref={meshRef}
      material={material}
      // Large quad that fills the background behind everything else
      position={[0, 0, -20]}
      renderOrder={-1}
    >
      {/* Generous plane covers all FOVs */}
      <planeGeometry args={[60, 35]} />
    </mesh>
  );
}
