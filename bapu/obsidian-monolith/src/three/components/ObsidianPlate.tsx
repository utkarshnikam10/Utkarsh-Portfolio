"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface ObsidianPlateProps {
  visible: boolean;
}

export function ObsidianPlate({ visible }: ObsidianPlateProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const targetScale = visible ? 1.0 : 0.001;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (visible) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {visible && (
        <spotLight
          ref={spotLightRef}
          position={[0, 5.5, 3.5]}
          angle={0.3}
          penumbra={0.8}
          intensity={10.0}
          color="#ffffff"
          castShadow
        />
      )}

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef} position={[0, -0.5, 0]}>
          <boxGeometry args={[3.6, 2.2, 0.15]} />
          <meshPhysicalMaterial
            color="#08080c"
            roughness={0.03}
            metalness={0.9}
            transmission={0.94}
            thickness={1.6}
            ior={1.52}
            clearcoat={1.0}
            clearcoatRoughness={0.02}
            emissive="#ffffff"
            emissiveIntensity={0.05}
          />
        </mesh>
      </Float>
    </group>
  );
}
