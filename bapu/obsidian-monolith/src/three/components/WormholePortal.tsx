"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createGlassMaterial } from "../materials/GlassMaterial";

export function WormholePortal() {
  const torusRef = useRef<THREE.Mesh>(null);

  const glassMaterial = React.useMemo(() => {
    return createGlassMaterial({
      color: new THREE.Color("#08080c"),
      transmission: 0.98,
      roughness: 0.03,
      ior: 1.52,
      thickness: 1.8,
      dispersion: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      emissive: new THREE.Color("#38bdf8"),
      emissiveIntensity: 0.15,
    });
  }, []);

  useFrame((state, delta) => {
    if (torusRef.current) {
      torusRef.current.rotation.z += delta * 0.3;
      torusRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
    }
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Dynamic Refractive Glass Portal Torus */}
      <mesh ref={torusRef} material={glassMaterial}>
        <torusGeometry args={[2.8, 0.4, 32, 64]} />
      </mesh>

      {/* Inner Portal Light Ring */}
      <pointLight position={[0, 0, 0]} intensity={4.0} color="#38bdf8" distance={6.0} />
    </group>
  );
}
