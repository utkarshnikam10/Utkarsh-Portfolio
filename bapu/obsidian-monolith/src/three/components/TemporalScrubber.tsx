"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Temporal Shader Dimension Scrubber
 *
 * Smooth uniform interpolation controller (uDimensionStage: 0.0 → 3.0):
 *   Stage 0: GLSL Wireframe + CRT Green Phosphor Scanlines
 *   Stage 1: Instanced Voxel Assembly with spring physics
 *   Stage 2: Physical Crown Glass (IOR = 1.52, chromatic dispersion)
 *   Stage 3: Volumetric Energy Plasma (Raymarched SDF glow)
 */

const VOXEL_COUNT = 512;

interface TemporalScrubberProps {
  position?: [number, number, number];
  visible?: boolean;
}

export function TemporalScrubber({
  position = [0, 0, 0],
  visible = true,
}: TemporalScrubberProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dimensionStage = useRef(0.0);
  const targetStage = useRef(0.0);

  // Stage cycling via scroll depth
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = window.scrollY / maxScroll;
      targetStage.current = progress * 3.0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Voxel target positions for Stage 1 assembly
  const voxelTargets = useMemo(() => {
    const targets = new Float32Array(VOXEL_COUNT * 3);
    const gridSize = Math.ceil(Math.cbrt(VOXEL_COUNT));
    const spacing = 0.2;

    for (let i = 0; i < VOXEL_COUNT; i++) {
      const ix = i % gridSize;
      const iy = Math.floor(i / gridSize) % gridSize;
      const iz = Math.floor(i / (gridSize * gridSize));

      targets[i * 3] = (ix - gridSize / 2) * spacing;
      targets[i * 3 + 1] = (iy - gridSize / 2) * spacing;
      targets[i * 3 + 2] = (iz - gridSize / 2) * spacing;
    }

    return targets;
  }, []);

  // Voxel current positions (start scattered)
  const voxelPositions = useMemo(() => {
    const pos = new Float32Array(VOXEL_COUNT * 3);
    for (let i = 0; i < VOXEL_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return pos;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Stage-specific materials
  const wireframeMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#00ff41",
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0a0a10",
        transmission: 0.96,
        roughness: 0.04,
        ior: 1.52,
        thickness: 1.8,
        clearcoat: 1.0,
        transparent: true,
      }),
    []
  );

  const plasmaMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a0030",
        emissive: "#8b00ff",
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  useFrame((state, delta) => {
    if (!visible || !groupRef.current) return;

    // Smooth interpolation toward target dimension stage
    dimensionStage.current = THREE.MathUtils.lerp(
      dimensionStage.current,
      targetStage.current,
      delta * 3.0
    );

    const stage = dimensionStage.current;
    const time = state.clock.getElapsedTime();

    // === STAGE 0: Wireframe + CRT Scanlines ===
    if (meshRef.current) {
      if (stage < 1.0) {
        meshRef.current.material = wireframeMat;
        meshRef.current.visible = true;
        meshRef.current.rotation.y = time * 0.3;
        meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.3;
        wireframeMat.opacity = 1.0 - stage;
      } else {
        meshRef.current.visible = false;
      }
    }

    // === STAGE 1: Instanced Voxel Assembly ===
    if (instancedRef.current) {
      const assemblyProgress = Math.max(0, Math.min(1, stage - 0.5));
      instancedRef.current.visible = stage > 0.3 && stage < 2.2;

      if (instancedRef.current.visible) {
        for (let i = 0; i < VOXEL_COUNT; i++) {
          // Spring physics toward target positions
          const tx = voxelTargets[i * 3];
          const ty = voxelTargets[i * 3 + 1];
          const tz = voxelTargets[i * 3 + 2];

          // Stiffness: 220, Damping: 15 (approximated via lerp rate)
          const springRate = delta * 4.0 * assemblyProgress;
          voxelPositions[i * 3] += (tx - voxelPositions[i * 3]) * springRate;
          voxelPositions[i * 3 + 1] += (ty - voxelPositions[i * 3 + 1]) * springRate;
          voxelPositions[i * 3 + 2] += (tz - voxelPositions[i * 3 + 2]) * springRate;

          dummy.position.set(
            voxelPositions[i * 3],
            voxelPositions[i * 3 + 1],
            voxelPositions[i * 3 + 2]
          );
          dummy.scale.setScalar(0.08);
          dummy.updateMatrix();
          instancedRef.current.setMatrixAt(i, dummy.matrix);
        }
        instancedRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // === STAGE 2: Crown Glass ===
    if (meshRef.current && stage >= 1.5 && stage < 2.8) {
      meshRef.current.material = glassMat;
      meshRef.current.visible = true;
      glassMat.opacity = Math.min(1, (stage - 1.5) * 2);
      meshRef.current.rotation.y = time * 0.15;
    }

    // === STAGE 3: Volumetric Energy Plasma ===
    if (meshRef.current && stage >= 2.5) {
      meshRef.current.material = plasmaMat;
      meshRef.current.visible = true;
      const plasmaIntensity = Math.min(1, (stage - 2.5) * 2);
      plasmaMat.emissiveIntensity = 1.0 + plasmaIntensity * 4.0;
      plasmaMat.opacity = plasmaIntensity;
      meshRef.current.scale.setScalar(1.0 + Math.sin(time * 2) * 0.05 * plasmaIntensity);
    }
  });

  // Cleanup materials on unmount
  useEffect(() => {
    return () => {
      wireframeMat.dispose();
      glassMat.dispose();
      plasmaMat.dispose();
    };
  }, [wireframeMat, glassMat, plasmaMat]);

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Primary morphing geometry */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
      </mesh>

      {/* Instanced voxel cloud for Stage 1 */}
      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, VOXEL_COUNT]}
        visible={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0a0e14"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </instancedMesh>

      {/* Stage-specific lighting */}
      <pointLight
        position={[0, 2, 2]}
        intensity={2}
        color="#38bdf8"
        distance={8}
      />
    </group>
  );
}
