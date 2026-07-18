"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import Shivling from "./Shivling";

/**
 * ShivlingExperience — R3F Canvas wrapping the Shivling + golden dust + volumetric spotlights
 */

function GoldenDust({ count = 120 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-randoms based on index i
      const pRand1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const pRand2 = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
      const pRand3 = Math.abs(Math.sin(i * 45.123) * 43758.5453) % 1;

      const radius = 0.5 + pRand1 * 2.5;
      const angle = pRand2 * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (pRand3 - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      // Particles drift slowly upwards and rotate
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      const positionsAttr = ref.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        // Increment Y position
        array[i * 3 + 1] += 0.003;
        // Reset when drifting too high
        if (array[i * 3 + 1] > 2.5) {
          array[i * 3 + 1] = -2.5;
        }
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#d4af37"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ShivlingExperience() {
  return (
    <Canvas
      camera={{ position: [3, 1.8, 4], fov: 40 }}
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        {/* Cinematic Ambient Light (Warm stone tint) */}
        <ambientLight intensity={0.15} color="#1c1410" />

        {/* Volumetric sunbeam shaft shining down on the Shivling */}
        <spotLight
          position={[2, 6, 2]}
          angle={0.4}
          penumbra={0.8}
          intensity={3.5}
          color="#faf6f0"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        {/* Crimson backlighting to represent battle heat/power */}
        <pointLight position={[-4, -1, -3]} intensity={1.5} color="#800020" />

        {/* Golden side highlights */}
        <pointLight position={[3, 1, 2]} intensity={2.0} color="#d4af37" />

        {/* 3D Shivling with float animation */}
        <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.05}>
          <Shivling />
        </Float>

        {/* Golden mist particles */}
        <GoldenDust />

        {/* Restricted orbit controls for desktop interactions */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 4}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  );
}
