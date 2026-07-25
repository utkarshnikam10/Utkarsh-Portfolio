"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function ParticleField({ count = 10000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { pointer } = useThree();

  const { positions, basePositions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const basePos = new Float32Array(count * 3);
    const vels = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 12 - 2;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      basePos[i * 3] = x;
      basePos[i * 3 + 1] = y;
      basePos[i * 3 + 2] = z;

      vels[i * 3] = 0;
      vels[i * 3 + 1] = 0;
      vels[i * 3 + 2] = 0;
    }

    return { positions: pos, basePositions: basePos, velocities: vels };
  }, [count]);

  const pointerVector = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!pointsRef.current) return;

    pointerVector.current.set(pointer.x * 7, pointer.y * 7, 0);

    const posAttr = pointsRef.current.geometry
      .attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const px = array[idx];
      const py = array[idx + 1];
      const pz = array[idx + 2];

      const bx = basePositions[idx] + Math.sin(time * 0.5 + i) * 0.15;
      const by =
        basePositions[idx + 1] + Math.cos(time * 0.5 + i * 0.5) * 0.15;
      const bz = basePositions[idx + 2];

      // Distance to pointer
      const dx = px - pointerVector.current.x;
      const dy = py - pointerVector.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 2.5 && dist > 0.001) {
        const force = (2.5 - dist) / 2.5;
        velocities[idx] += (dx / dist) * force * 0.15;
        velocities[idx + 1] += (dy / dist) * force * 0.15;
      }

      // Elastic return force
      velocities[idx] += (bx - px) * 0.05;
      velocities[idx + 1] += (by - py) * 0.05;
      velocities[idx + 2] += (bz - pz) * 0.05;

      // Friction damping
      velocities[idx] *= 0.92;
      velocities[idx + 1] *= 0.92;
      velocities[idx + 2] *= 0.92;

      array[idx] += velocities[idx];
      array[idx + 1] += velocities[idx + 1];
      array[idx + 2] += velocities[idx + 2];
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#f3e5ab"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
