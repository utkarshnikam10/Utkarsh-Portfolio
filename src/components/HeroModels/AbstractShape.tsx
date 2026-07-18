"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * AbstractShape — Frosted glass/chrome morphing geometric sculpture
 * Deforms gently and aligns with the mouse pointer
 */
export default function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle float/pulse
    meshRef.current.position.y = Math.sin(time * 0.6) * 0.1;

    // Lerp rotation to mouse coordinates + slow idle rotation
    const targetX = -state.pointer.y * 0.6;
    const targetY = state.pointer.x * 0.6 + time * 0.15;

    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow scale={1.3}>
      {/* High-res Torus Knot for Apple/Linear-style premium shape */}
      <torusKnotGeometry args={[1.0, 0.32, 160, 18, 3, 4]} />

      <meshPhysicalMaterial
        color="#0066ff" // Electric Blue base reflection
        emissive="#002266"
        roughness={0.15}
        metalness={0.8}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.4} // Frosted glass transmission
        thickness={1.5}
        ior={1.6}
        flatShading={false}
      />
    </mesh>
  );
}
