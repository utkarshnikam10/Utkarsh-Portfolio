"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface ProjectCardsChapterProps {
  visible: boolean;
  highlightIndex: number | null;
}

export function ProjectCardsChapter({
  visible,
  highlightIndex,
}: ProjectCardsChapterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const card0Ref = useRef<THREE.Mesh>(null);
  const card1Ref = useRef<THREE.Mesh>(null);
  const card2Ref = useRef<THREE.Mesh>(null);
  const card3Ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetScale = visible ? 1.0 : 0.0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    // Continuous idle spin
    groupRef.current.rotation.y += delta * 0.15;

    // Shader swapper & framing reaction on highlightIndex
    if (highlightIndex !== null) {
      const targetYRot = highlightIndex * (Math.PI * 0.5);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetYRot,
        delta * 4.0
      );
    }
  });

  return (
    <group ref={groupRef} scale={0}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Mode A: Wireframe GLSL Grid Card */}
        <mesh ref={card0Ref} position={[-2.2, 0.5, 0.5]}>
          <boxGeometry args={[1.6, 2.4, 0.1]} />
          <meshStandardMaterial
            color="#181820"
            wireframe={true}
            emissive="#d4af37"
            emissiveIntensity={highlightIndex === 0 ? 0.95 : 0.15}
          />
        </mesh>

        {/* Mode B: GPGPU Particle Field Portal Card */}
        <mesh ref={card1Ref} position={[2.2, 0.5, -0.5]}>
          <boxGeometry args={[1.6, 2.4, 0.1]} />
          <meshStandardMaterial
            color="#08080a"
            metalness={0.9}
            roughness={0.1}
            emissive="#38bdf8"
            emissiveIntensity={highlightIndex === 1 ? 0.95 : 0.15}
          />
        </mesh>

        {/* Mode C: Prism Crystal Refractive Card */}
        <mesh ref={card2Ref} position={[0, -1.8, 1.2]}>
          <boxGeometry args={[2.4, 1.4, 0.1]} />
          <meshPhysicalMaterial
            color="#0a0a0c"
            roughness={0.05}
            transmission={0.92}
            thickness={1.5}
            ior={1.52}
            clearcoat={1.0}
            emissive="#f3e5ab"
            emissiveIntensity={highlightIndex === 2 ? 0.95 : 0.0}
          />
        </mesh>

        {/* Mode D: Crystalline Core Card */}
        <mesh ref={card3Ref} position={[0, 1.8, -1.2]}>
          <boxGeometry args={[2.4, 1.4, 0.1]} />
          <meshPhysicalMaterial
            color="#0f0f14"
            roughness={0.08}
            metalness={0.95}
            clearcoat={1.0}
            emissive="#a855f7"
            emissiveIntensity={highlightIndex === 3 ? 0.95 : 0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}
