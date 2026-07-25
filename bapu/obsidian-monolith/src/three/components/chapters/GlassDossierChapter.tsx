"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export function GlassDossierChapter({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const targetScale = visible ? 1.0 : 0.0;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (visible) {
      meshRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh ref={meshRef} position={[0, 0, 0]} scale={0}>
        <boxGeometry args={[3.4, 2.1, 0.12]} />
        <meshPhysicalMaterial
          color="#08080c"
          roughness={0.03}
          metalness={0.88}
          transmission={0.96}
          thickness={1.6}
          ior={1.52}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          emissive="#f3e5ab"
          emissiveIntensity={visible ? 0.25 : 0.0}
        />
      </mesh>
    </Float>
  );
}
