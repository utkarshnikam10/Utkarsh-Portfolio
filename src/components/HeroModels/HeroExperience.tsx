"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import Room from "./Room";

/**
 * HeroExperience — R3F Canvas wrapping the Room model + floating particles + lighting
 */

function Particles({ count = 80 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random generation based on index i
      pos[i * 3] = (Math.sin(i * 12.9898) * 43758.5453) % 4;
      pos[i * 3 + 1] = (Math.sin(i * 78.233) * 43758.5453) % 3;
      pos[i * 3 + 2] = (Math.sin(i * 45.123) * 43758.5453) % 4;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
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
      <pointsMaterial size={0.02} color="#007aff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function HeroExperience() {
  return (
    <Canvas
      camera={{ position: [3, 1.5, 4], fov: 45 }}
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.3} color="#8e9192" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          color="#ffffff"
          castShadow
          shadow-mapSize={1024}
        />
        <pointLight position={[-3, 2, -2]} intensity={0.5} color="#007aff" />
        <pointLight position={[2, -1, 3]} intensity={0.3} color="#1a8aff" />

        {/* 3D Room Model */}
        <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
          <Room />
        </Float>

        {/* Floating particles */}
        <Particles />

        {/* Orbit controls for desktop */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate={false}
        />
      </Suspense>
    </Canvas>
  );
}
