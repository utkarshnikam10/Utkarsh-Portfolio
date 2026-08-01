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
 * KineticShockwaveBurst — Blinding energy ring that expands outward when clicked or hovered.
 */
function KineticShockwaveBurst({ visible }: { visible: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!visible || !ringRef.current) return;
    const t = state.clock.getElapsedTime();
    const scale = (t * 2.5) % 4.5 + 0.5;
    const opacity = Math.max(0, 1.0 - scale / 4.5);

    ringRef.current.scale.set(scale, scale, scale);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    if (mat) mat.opacity = opacity * 0.7;
  });

  if (!visible) return null;

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.0, 1.15, 64]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/**
 * HelixOrbitalStream — Vibrant 3D energy double-helix ribbon orbiting the centerpiece.
 */
function HelixOrbitalStream({ visible }: { visible: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 600;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const color1 = new THREE.Color("#38bdf8"); // Electric Cyan
    const color2 = new THREE.Color("#ffff23"); // Solar Gold
    const color3 = new THREE.Color("#f43f5e"); // Crimson Flash

    for (let i = 0; i < count; i++) {
      const p = i / count;
      const strand = i % 2 === 0 ? 1 : -1;
      const radius = 3.0 + Math.sin(p * Math.PI * 8) * 0.5;
      const angle = p * Math.PI * 14 * strand;
      const y = (p - 0.5) * 8.0;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const pickColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      col[i * 3] = pickColor.r;
      col[i * 3 + 1] = pickColor.g;
      col[i * 3 + 2] = pickColor.b;
    }

    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (!visible || !pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const strand = i % 2 === 0 ? 1 : -1;
      const p = i / count;
      const angle = p * Math.PI * 14 * strand + t * (2.2 + strand * 0.6);
      const radius = 2.8 + Math.sin(t * 2.5 + p * Math.PI * 10) * 0.6;

      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = ((p - 0.5) * 8.0 + Math.sin(t * 2.0 + p * 6.28) * 0.4);
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
        size={0.18}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * EnergyQuasarBeam — Thick dual laser pillars shooting out top & bottom poles.
 */
function EnergyQuasarBeam({ visible }: { visible: boolean }) {
  const topMeshRef = useRef<THREE.Mesh>(null);
  const botMeshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!visible) return;
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * 5.0) * 0.25 + 1.0;

    if (topMeshRef.current) {
      topMeshRef.current.scale.set(pulse, 1.0 + Math.sin(t * 3.5) * 0.3, pulse);
    }
    if (botMeshRef.current) {
      botMeshRef.current.scale.set(pulse, 1.0 + Math.cos(t * 3.5) * 0.3, pulse);
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Top Beam */}
      <mesh ref={topMeshRef} position={[0, 4.8, 0]}>
        <cylinderGeometry args={[0.12, 0.7, 7.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bottom Beam */}
      <mesh ref={botMeshRef} position={[0, -4.8, 0]}>
        <cylinderGeometry args={[0.7, 0.12, 7.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffff23"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * CyberOrbitalRings — Thick, high-contrast gyroscopic holo-rings with glowing energy nodes.
 */
function CyberOrbitalRings({ visible, speedFactor }: { visible: boolean; speedFactor: number }) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!visible) return;
    const t = state.clock.getElapsedTime();
    const boost = 1.0 + speedFactor * 4.0;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.6 * boost;
      ring1Ref.current.rotation.x = Math.sin(t * 0.8) * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.8 * boost;
      ring2Ref.current.rotation.y = Math.cos(t * 0.9) * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.7 * boost;
      ring3Ref.current.rotation.y += delta * 0.4 * boost;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y -= delta * 0.9 * boost;
      ring4Ref.current.rotation.z += delta * 0.3 * boost;
    }
  });

  if (!visible) return null;

  return (
    <group>
      {/* Ring 1: Thick Cyan Torus */}
      <group ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.6, 0.05, 24, 120]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Ring 2: Thick Gold Gyro Ring */}
      <group ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
        <mesh>
          <torusGeometry args={[3.0, 0.04, 24, 100]} />
          <meshBasicMaterial color="#ffff23" transparent opacity={0.85} />
        </mesh>
        {[0, Math.PI * 0.67, Math.PI * 1.33].map((angle, i) => (
          <mesh key={i} position={[Math.cos(angle) * 3.0, Math.sin(angle) * 3.0, 0]}>
            <octahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        ))}
      </group>

      {/* Ring 3: Magenta Quantum Ring */}
      <group ref={ring3Ref} rotation={[Math.PI / 6, -Math.PI / 3, Math.PI / 4]}>
        <mesh>
          <torusGeometry args={[2.4, 0.035, 20, 90]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Ring 4: Outer Wireframe Cage */}
      <group ref={ring4Ref} rotation={[-Math.PI / 6, 0, Math.PI / 3]}>
        <mesh>
          <icosahedronGeometry args={[4.0, 1]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} wireframe />
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

    const targetScale = visible ? 1.0 + Math.min(pointerSpeed.current * 0.04, 0.25) : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (visible) {
      // Dynamic kinetic 3D parallax tilt & sway
      targetRotation.current.x = pointer.y * 0.55;
      targetRotation.current.y = pointer.x * 0.65;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 4.5
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 4.5
      );

      // Kinetic Z-roll when moving fast
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -dx * 1.2,
        delta * 6.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* High-Intensity Key SpotLight */}
      <spotLight
        position={[6, 9, 8]}
        angle={0.8}
        penumbra={0.9}
        intensity={visible ? 12.0 : 0}
        color="#ffffff"
      />
      {/* Electric Cyan Rim Light */}
      <directionalLight
        position={[-6, 5, -4]}
        intensity={visible ? 5.0 : 0}
        color="#38bdf8"
      />
      {/* Solar Gold Fill Light */}
      <pointLight
        position={[0, -4, 5]}
        intensity={visible ? 4.0 : 0}
        color="#ffff23"
        distance={12}
      />
      {/* Crimson/Magenta Backlight */}
      <pointLight
        position={[0, 4, -5]}
        intensity={visible ? 3.5 : 0}
        color="#f43f5e"
        distance={10}
      />

      {/* Kinetic Energy Shockwave Pulse */}
      <KineticShockwaveBurst visible={visible} />

      {/* Quasar Energy Pillars */}
      <EnergyQuasarBeam visible={visible} />

      {/* Double Helix Orbital Particle Stream */}
      <HelixOrbitalStream visible={visible} />

      {/* Thick Gyroscopic Holo-Rings & Outer Cage */}
      <CyberOrbitalRings visible={visible} speedFactor={pointerSpeed.current} />

      {/* Outer Fragmented Glass Obsidian Sculpture */}
      <ObsidianSculpture />
    </group>
  );
}
