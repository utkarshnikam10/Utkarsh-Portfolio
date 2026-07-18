"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import AbstractShape from "./AbstractShape";

/**
 * CosmicDust — Clean drifting electric blue/silver particles
 */
function CosmicDust({ count = 80 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const pRand1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const pRand2 = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
      const pRand3 = Math.abs(Math.sin(i * 45.123) * 43758.5453) % 1;

      const radius = 1.0 + pRand1 * 3.0;
      const angle = pRand2 * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (pRand3 - 0.5) * 6;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      const positionsAttr = ref.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;

      for (let i = 0; i < count; i++) {
        array[i * 3 + 1] += 0.004;
        if (array[i * 3 + 1] > 3.0) {
          array[i * 3 + 1] = -3.0;
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
        size={0.04}
        color="#0066ff" // Electric Blue dust
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * HeroExperience — High-performance minimalist R3F Canvas wrapping the abstract sculpture
 */
export default function HeroExperience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 45 }}
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        {/* Soft Ambient Light for base visibility */}
        <ambientLight intensity={0.4} color="#ffffff" />

        {/* High-intensity Electric Blue spotlights */}
        <spotLight
          position={[4, 5, 4]}
          angle={0.4}
          penumbra={1}
          intensity={5}
          color="#0066ff"
          castShadow
        />

        {/* Soft fill light */}
        <directionalLight position={[-4, -3, 2]} intensity={1.5} color="#ffffff" />

        {/* Deep blue backlighting */}
        <pointLight position={[0, -2, -3]} intensity={3} color="#001133" />

        {/* Morphing abstract torus */}
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
          <AbstractShape />
        </Float>

        {/* Slow drifting dust */}
        <CosmicDust />

        {/* Interactive controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 4}
        />
      </Suspense>
    </Canvas>
  );
}
