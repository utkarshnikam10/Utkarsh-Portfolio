"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface MonolithHorizonProps {
  visible: boolean;
}

export function MonolithHorizon({ visible }: MonolithHorizonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!visible && groupRef.current.scale.x < 0.005) return;

    const targetScale = visible ? 1.0 : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (spotLightRef.current) {
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        visible ? 12.0 : 0.0,
        delta * 4.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* 15° Low-Angle Control Center Keylight (#f59e0b) */}
      <spotLight
        ref={spotLightRef}
        position={[0, 1.5, 4.0]}
        angle={0.4}
        penumbra={0.8}
        intensity={0}
        color="#f59e0b"
        castShadow
      />

      <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Colossal Monolithic Portal Frame Slab */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.2, 7.5, 0.25]} />
          <meshPhysicalMaterial
            color="#08080c"
            roughness={0.04}
            metalness={0.9}
            transmission={0.94}
            thickness={2.0}
            ior={1.52}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            emissive="#f59e0b"
            emissiveIntensity={visible ? 0.2 : 0.0}
          />
        </mesh>

        {/* Editorial Final Message */}
        <Text
          position={[0, 0.8, 0.14]}
          fontSize={0.32}
          color="#f4f4f7"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
          textAlign="center"
        >
          LET'S BUILD TOMORROW.
        </Text>

        <Text
          position={[0, -0.6, 0.14]}
          fontSize={0.12}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          UTKARSH // PROJECT NEXUS CONTROL CENTER
        </Text>
      </Float>
    </group>
  );
}
