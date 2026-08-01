"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ObsidianSculpture } from "./ObsidianSculpture";

interface MonolithHeroProps {
  visible: boolean;
}

/**
 * MinimalOrbitRing — A single clean, thin torus ring orbiting in 3D space.
 */
function MinimalOrbitRing({
  radius,
  color,
  opacity,
  rotationAxis,
  speed,
  visible,
}: {
  radius: number;
  color: string;
  opacity: number;
  rotationAxis: [number, number, number];
  speed: number;
  visible: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!visible || !ref.current) return;
    ref.current.rotation.x += delta * speed * rotationAxis[0];
    ref.current.rotation.y += delta * speed * rotationAxis[1];
    ref.current.rotation.z += delta * speed * rotationAxis[2];
  });

  if (!visible) return null;

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 16, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

export function MonolithHero({ visible }: MonolithHeroProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!visible && groupRef.current.scale.x < 0.005) return;

    const targetScale = visible ? 1.0 : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4.0)
    );

    if (visible) {
      // Smooth, subtle cursor parallax — not aggressive
      targetRotation.current.x = pointer.y * 0.15;
      targetRotation.current.y = pointer.x * 0.2;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3.0
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 3.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Clean Key Light */}
      <spotLight
        position={[4, 6, 6]}
        angle={0.6}
        penumbra={0.8}
        intensity={visible ? 6.0 : 0}
        color="#ffffff"
      />
      {/* Subtle Cyan Rim Light */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={visible ? 2.0 : 0}
        color="#38bdf8"
      />
      {/* Warm Fill */}
      <pointLight
        position={[0, -2, 3]}
        intensity={visible ? 1.2 : 0}
        color="#f8fafc"
        distance={8}
      />

      {/* 3 Clean Orbital Rings — different axes, subtle, elegant */}
      <MinimalOrbitRing
        radius={3.2}
        color="#38bdf8"
        opacity={0.35}
        rotationAxis={[0.3, 0, 1]}
        speed={0.15}
        visible={visible}
      />
      <MinimalOrbitRing
        radius={2.6}
        color="#e2e8f0"
        opacity={0.2}
        rotationAxis={[0, 1, 0.2]}
        speed={-0.2}
        visible={visible}
      />
      <MinimalOrbitRing
        radius={3.8}
        color="#94a3b8"
        opacity={0.15}
        rotationAxis={[1, 0.3, 0]}
        speed={0.1}
        visible={visible}
      />

      {/* The core piece: Fragmented Glass Obsidian Sculpture */}
      <ObsidianSculpture />
    </group>
  );
}
