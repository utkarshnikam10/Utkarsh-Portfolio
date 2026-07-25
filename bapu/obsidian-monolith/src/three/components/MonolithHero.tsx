"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface MonolithHeroProps {
  visible: boolean;
}

export function MonolithHero({ visible }: MonolithHeroProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!visible && groupRef.current.scale.x < 0.005) return;

    const targetScale = visible ? 1.0 : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4.0)
    );

    if (visible && meshRef.current) {
      // Subtle cursor parallax rotation (capped at +/- 15 degrees)
      targetRotation.current.x = pointer.y * 0.15;
      targetRotation.current.y = pointer.x * 0.25;

      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3.0
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotation.current.y,
        delta * 3.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft key light */}
      <spotLight
        position={[2, 4, 5]}
        angle={0.5}
        penumbra={0.9}
        intensity={visible ? 4.5 : 0}
        color="#ffffff"
      />
      {/* Cool rim light */}
      <directionalLight
        position={[-3, 2, -2]}
        intensity={visible ? 1.2 : 0}
        color="#38bdf8"
      />

      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.25}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          {/* Bevelled obsidian glass monolith slab */}
          <boxGeometry args={[2.4, 4.2, 0.2]} />
          <meshPhysicalMaterial
            color="#050508"
            roughness={0.05}
            metalness={0.85}
            transmission={0.92}
            thickness={1.5}
            ior={1.52}
            dispersion={0.04}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
            reflectivity={0.9}
          />
        </mesh>
      </Float>
    </group>
  );
}
