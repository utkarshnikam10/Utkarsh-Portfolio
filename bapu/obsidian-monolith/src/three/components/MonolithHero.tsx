"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MorphingSphere } from "./MorphingSphere";
import { ObsidianSculpture } from "./ObsidianSculpture";

interface MonolithHeroProps {
  visible: boolean;
}

/**
 * HelixOrbitalStream — High-speed 3D energy helix orbiting the monolith centerpiece.
 */
function HelixOrbitalStream({ visible }: { visible: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const { positions, colors, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    const color1 = new THREE.Color("#38bdf8"); // Cyan
    const color2 = new THREE.Color("#ffff23"); // Solar Gold
    const color3 = new THREE.Color("#e879f9"); // Magenta

    for (let i = 0; i < count; i++) {
      const p = i / count;
      ph[i] = p * Math.PI * 2;

      // Initial double helix path
      const strand = i % 2 === 0 ? 1 : -1;
      const radius = 2.8 + Math.sin(p * Math.PI * 6) * 0.4;
      const angle = p * Math.PI * 12 * strand;
      const y = (p - 0.5) * 7.0;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const pickColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      col[i * 3] = pickColor.r;
      col[i * 3 + 1] = pickColor.g;
      col[i * 3 + 2] = pickColor.b;
    }

    return { positions: pos, colors: col, phases: ph };
  }, [count]);

  useFrame((state) => {
    if (!visible || !pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const p = i / count;
      const angle = p * Math.PI * 12 * strand + t * (1.8 + strand * 0.5);
      const radius = 2.6 + Math.sin(t * 2.0 + p * Math.PI * 8) * 0.5;

      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = ((p - 0.5) * 7.0 + Math.sin(t * 1.5 + p * 6.28) * 0.3);
      array[i * 3 + 2] = Math.sin(angle) * radius;
    }

    posAttr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * EnergyQuasarBeam — Dual vertical laser light pillars shooting out top/bottom.
 */
function EnergyQuasarBeam({ visible }: { visible: boolean }) {
  const topMeshRef = useRef<THREE.Mesh>(null);
  const botMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * 4.0) * 0.15 + 0.85;

    if (topMeshRef.current) {
      topMeshRef.current.scale.set(pulse, 1.0 + Math.sin(t * 3.0) * 0.2, pulse);
    }
    if (botMeshRef.current) {
      botMeshRef.current.scale.set(pulse, 1.0 + Math.cos(t * 3.0) * 0.2, pulse);
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Top Beam */}
      <mesh ref={topMeshRef} position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.02, 0.4, 6.0, 16, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bottom Beam */}
      <mesh ref={botMeshRef} position={[0, -4.5, 0]}>
        <cylinderGeometry args={[0.4, 0.02, 6.0, 16, 1, true]} />
        <meshBasicMaterial
          color="#ffff23"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * CyberOrbitalRings — 5 nested gyroscopic glowing holographic rings with differential rotation.
 */
function CyberOrbitalRings({ visible, speedFactor }: { visible: boolean; speedFactor: number }) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);
  const ring5Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!visible) return;
    const t = state.clock.getElapsedTime();
    const boost = 1.0 + speedFactor * 3.5;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4 * boost;
      ring1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.6 * boost;
      ring2Ref.current.rotation.y = Math.cos(t * 0.6) * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.5 * boost;
      ring3Ref.current.rotation.y += delta * 0.3 * boost;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y -= delta * 0.7 * boost;
      ring4Ref.current.rotation.z += delta * 0.2 * boost;
    }
    if (ring5Ref.current) {
      ring5Ref.current.rotation.x -= delta * 0.3 * boost;
      ring5Ref.current.rotation.z -= delta * 0.5 * boost;
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Ring 1: Outer Cyan Torus Array */}
      <group ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.6, 0.015, 16, 120]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
        </mesh>
        {/* Orbital Energy Nodes */}
        {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 3.6, Math.sin(angle) * 3.6, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffff23" />
          </mesh>
        ))}
      </group>

      {/* Ring 2: Solar Gold Gyro Ring */}
      <group ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[3.0, 0.012, 16, 100]} />
          <meshBasicMaterial color="#ffff23" transparent opacity={0.65} />
        </mesh>
        {[0, Math.PI * 0.67, Math.PI * 1.33].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 3.0, Math.sin(angle) * 3.0, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        ))}
      </group>

      {/* Ring 3: Magenta Quantum Energy Ring */}
      <group ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 3, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[2.4, 0.01, 16, 90]} />
          <meshBasicMaterial color="#e879f9" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Ring 4: Laser Wireframe Outer Ring */}
      <group ref={ring4Ref} rotation={[-Math.PI / 6, 0, Math.PI / 3]}>
        <mesh>
          <torusGeometry args={[4.2, 0.008, 12, 80]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} wireframe />
        </mesh>
      </group>

      {/* Ring 5: Inner Tachyon Ring */}
      <group ref={ring5Ref} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <torusGeometry args={[1.8, 0.008, 16, 80]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

export function MonolithHero({ visible }: MonolithHeroProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const prevPointer = useRef({ x: 0, y: 0 });
  const pointerSpeed = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!visible && groupRef.current.scale.x < 0.005) return;

    // Calculate cursor movement velocity for reactive hyper-tilt
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    const instSpeed = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001);
    pointerSpeed.current = THREE.MathUtils.lerp(pointerSpeed.current, instSpeed, delta * 6.0);
    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;

    const targetScale = visible ? 1.0 + Math.min(pointerSpeed.current * 0.02, 0.15) : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (visible) {
      // Dynamic kinetic 3D parallax tilt & sway
      targetRotation.current.x = pointer.y * 0.45;
      targetRotation.current.y = pointer.x * 0.55;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 4.0
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 4.0
      );

      // Kinetic Z-roll when moving fast
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -dx * 0.8,
        delta * 6.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Key Dynamic SpotLight */}
      <spotLight
        position={[5, 8, 7]}
        angle={0.7}
        penumbra={0.9}
        intensity={visible ? 8.0 : 0}
        color="#ffffff"
      />
      {/* Electric Cyan Rim Light */}
      <directionalLight
        position={[-5, 4, -4]}
        intensity={visible ? 3.5 : 0}
        color="#38bdf8"
      />
      {/* Solar Gold Fill Light */}
      <pointLight
        position={[0, -3, 4]}
        intensity={visible ? 2.5 : 0}
        color="#ffff23"
        distance={10}
      />
      {/* Magenta Backlight */}
      <pointLight
        position={[0, 3, -4]}
        intensity={visible ? 2.0 : 0}
        color="#e879f9"
        distance={8}
      />

      {/* Quasar Energy Pillars */}
      <EnergyQuasarBeam visible={visible} />

      {/* Double Helix Orbital Particle Stream */}
      <HelixOrbitalStream visible={visible} />

      {/* 5-Axis Gyroscopic Holo-Rings */}
      <CyberOrbitalRings visible={visible} speedFactor={pointerSpeed.current} />

      {/* Inner Glowing Morphing Liquid Core */}
      <group scale={0.75}>
        <MorphingSphere visible={visible} />
      </group>

      {/* Outer Fragmented Glass Obsidian Sculpture */}
      <ObsidianSculpture />
    </group>
  );
}
