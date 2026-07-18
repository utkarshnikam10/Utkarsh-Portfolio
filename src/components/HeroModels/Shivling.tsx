"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Shivling — Procedural 3D model representing the sacred stone of Shiva
 * Built with layered geometries (base, Yoni, Linga, and gold engravings)
 */

export default function Shivling() {
  const groupRef = useRef<THREE.Group>(null);
  const lingaRef = useRef<THREE.Mesh>(null);

  // Smooth mouse-pointer parallax and floating animation
  useFrame((state) => {
    if (groupRef.current) {
      const targetRotY = state.pointer.x * 0.4 + 0.2;
      const targetRotX = -state.pointer.y * 0.15;
      const targetPosY = Math.sin(state.clock.elapsedTime * 0.4) * 0.04 - 0.2;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotY,
        0.08
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX,
        0.08
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetPosY,
        0.08
      );
    }

    if (lingaRef.current) {
      // Gentle breathing pulse to show divine energy
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 1.5) * 0.01;
      lingaRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Flowing water drops (procedural dripping animation)
  const dropCount = 12;
  const drops = useMemo(() => {
    return Array.from({ length: dropCount }).map((_, i) => {
      const pseudoRandom1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      const pseudoRandom2 = Math.abs(Math.sin(i * 78.233) * 43758.5453) % 1;
      return {
        speed: 0.02 + pseudoRandom1 * 0.02,
        delay: pseudoRandom2 * 2,
        radius: 0.36,
        angle: (i / dropCount) * Math.PI * 2,
      };
    });
  }, [dropCount]);

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.3}>
      {/* Stone Pedestal Base */}
      <mesh castShadow receiveShadow position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
        <meshStandardMaterial
          color="#221b16"
          roughness={0.4}
          metalness={0.5}
          emissive="#d4af37"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Yoni Base (The circular ring) */}
      <group position={[0, -0.4, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 1.3, 0.25, 32]} />
          <meshStandardMaterial
            color="#2a201a"
            roughness={0.35}
            metalness={0.6}
            emissive="#d4af37"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Yoni Spout (The projecting channel) */}
        <mesh castShadow receiveShadow position={[1.0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.25, 0.5]} />
          <meshStandardMaterial
            color="#2a201a"
            roughness={0.35}
            metalness={0.6}
            emissive="#d4af37"
            emissiveIntensity={0.1}
          />
        </mesh>
      </group>

      {/* The Central Linga Stone */}
      <mesh ref={lingaRef} castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 32, 1, false]} />
        <meshStandardMaterial
          color="#2c221a"
          roughness={0.3}
          metalness={0.7}
          emissive="#d4af37"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Rounded top of the Linga */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#2c221a"
          roughness={0.3}
          metalness={0.7}
          emissive="#d4af37"
          emissiveIntensity={0.12}
        />
      </mesh>

      {/* Royal Gold Ring (Engraving around the Linga) */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[0.36, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#f3c623"
          emissive="#f3c623"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Tripundra (The three horizontal lines of sacred ash in Gold) */}
      <group position={[0.01, 0.22, 0.29]} rotation={[0, 0.3, 0]}>
        {/* Top ash line */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.2, 0.01, 0.01]} />
          <meshStandardMaterial
            color="#f3c623"
            emissive="#f3c623"
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Middle ash line */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.24, 0.01, 0.01]} />
          <meshStandardMaterial
            color="#f3c623"
            emissive="#f3c623"
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Bottom ash line */}
        <mesh position={[0, -0.01, 0]}>
          <boxGeometry args={[0.2, 0.01, 0.01]} />
          <meshStandardMaterial
            color="#f3c623"
            emissive="#f3c623"
            emissiveIntensity={1.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Red Tilak Bindi in center */}
        <mesh position={[0, 0.02, 0.01]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#ff0033" emissive="#ff0033" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Flowing Water Drops (Dripping down the Linga) */}
      {drops.map((drop, i) => (
        <WaterDrop key={i} {...drop} />
      ))}
    </group>
  );
}

function WaterDrop({
  speed,
  delay,
  radius,
  angle,
}: {
  speed: number;
  delay: number;
  radius: number;
  angle: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = 0.55;
  const endY = -0.3;

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime + delay;
    const progress = (time * speed) % 1.0;

    // Set position sliding down the Linga cylinder
    const currentY = THREE.MathUtils.lerp(startY, endY, progress);
    ref.current.position.y = currentY;

    // Fade out as it reaches the bottom
    if (ref.current.material) {
      (ref.current.material as THREE.MeshStandardMaterial).opacity =
        progress > 0.8 ? (1.0 - progress) * 5 : 0.8;
    }
  });

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  return (
    <mesh ref={ref} position={[x, startY, z]}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshStandardMaterial
        color="#f3c623"
        emissive="#d4af37"
        emissiveIntensity={0.8}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}
