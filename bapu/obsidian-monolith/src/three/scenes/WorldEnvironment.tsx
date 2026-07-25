"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function WorldEnvironment() {
  const pointsRef = useRef<THREE.Points>(null);

  const [{ positions, velocities }] = useState(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24;

      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = Math.random() * 0.006 + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    return { positions: pos, velocities: vel };
  });

  useFrame((state) => {
    if (pointsRef.current) {
      const geom = pointsRef.current.geometry;
      const posAttr = geom.getAttribute("position");

      for (let i = 0; i < 1200; i++) {
        let py = posAttr.getY(i) + velocities[i * 3 + 1];
        if (py > 12) py = -12;
        posAttr.setY(i, py);

        const px = posAttr.getX(i) + Math.sin(state.clock.getElapsedTime() * 0.5 + i) * 0.001;
        posAttr.setX(i, px);
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <fogExp2 attach="fog" args={["#030305", 0.028]} />

      <ambientLight intensity={0.05} color="#030305" />

      <spotLight
        position={[0, 7, 7]}
        angle={0.5}
        penumbra={0.9}
        intensity={4.0}
        color="#ffffff"
        castShadow
      />

      <directionalLight
        position={[-6, 8, -5]}
        intensity={1.8}
        color="#38bdf8"
      />

      {/* 1,200 Instanced Ambient GPU Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#f4f4f7"
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
