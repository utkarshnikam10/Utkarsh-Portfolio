"use client";

import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { MorphingSphere } from "./MorphingSphere";
import { ObsidianSculpture } from "./ObsidianSculpture";

interface MonolithHeroProps {
  visible: boolean;
}

/**
 * CyberOrbitalRings — Concentric glowing holographic rings orbiting the monolith.
 */
function CyberOrbitalRings({ visible }: { visible: boolean }) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!visible) return;
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.15;
      ring1Ref.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.22;
      ring2Ref.current.rotation.y = Math.cos(t * 0.25) * 0.2;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.18;
      ring3Ref.current.rotation.y = t * 0.12;
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Outer Cyan Energy Ring */}
      <group ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.2, 0.012, 16, 100]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Energy nodes on ring */}
        {[0, Math.PI * 0.67, Math.PI * 1.33].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0]}
          >
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#ffff23" />
          </mesh>
        ))}
      </group>

      {/* Mid Gold Energy Ring */}
      <group ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <mesh>
          <torusGeometry args={[2.5, 0.008, 16, 100]} />
          <meshBasicMaterial color="#ffff23" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Inner Quantum Ring */}
      <group ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[1.9, 0.006, 16, 80]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}

export function MonolithHero({ visible }: MonolithHeroProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!visible && groupRef.current.scale.x < 0.005) return;

    const targetScale = visible ? 1.0 : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4.0)
    );

    if (visible) {
      // Smooth cursor parallax rotation
      targetRotation.current.x = pointer.y * 0.2;
      targetRotation.current.y = pointer.x * 0.3;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 3.0
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 3.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Key SpotLight */}
      <spotLight
        position={[4, 6, 6]}
        angle={0.6}
        penumbra={0.8}
        intensity={visible ? 6.0 : 0}
        color="#ffffff"
      />
      {/* Electric Rim Light */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={visible ? 2.5 : 0}
        color="#38bdf8"
      />
      {/* Warm Ambient Gold Fill */}
      <pointLight
        position={[0, -2, 3]}
        intensity={visible ? 1.8 : 0}
        color="#ffff23"
        distance={8}
      />

      {/* Cybernetic Orbital Holo-Rings */}
      <CyberOrbitalRings visible={visible} />

      {/* Inner Glowing Morphing Liquid Core */}
      <group scale={0.75}>
        <MorphingSphere visible={visible} />
      </group>

      {/* Outer Fragmented Glass Obsidian Sculpture */}
      <ObsidianSculpture />
    </group>
  );
}
