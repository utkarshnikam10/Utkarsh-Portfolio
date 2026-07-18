"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Room — Procedural 3D developer desk scene
 * A stylized desk with glowing monitor, keyboard, lamp, and coffee mug.
 * Fully procedural — no GLTF required.
 */

export default function Room() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle auto-rotation combined with mouse-pointer displacement
      const targetRotY = state.pointer.x * 0.35 + 0.3;
      const targetRotX = -state.pointer.y * 0.15;
      const targetPosY = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 - 0.5;

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
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={1.2}>
      {/* Desk surface */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.08, 1.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Desk legs */}
      {[
        [-1.6, -0.5, -0.75],
        [1.6, -0.5, -0.75],
        [-1.6, -0.5, 0.75],
        [1.6, -0.5, 0.75],
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 1, 0.06]} />
          <meshStandardMaterial color="#16213e" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.65, -0.5]}>
        {/* Monitor bezel */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.1, 0.05]} />
          <meshStandardMaterial color="#0f0f23" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* Screen (emissive glow) */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.65, 0.95]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>

        {/* Code lines on screen */}
        {[0.3, 0.15, 0, -0.15, -0.3].map((y, i) => {
          const width = 0.5 + ((i * 7) % 5) * 0.1;
          return (
            <mesh key={`code-${i}`} position={[-0.3 + i * 0.1, y, 0.035]}>
              <planeGeometry args={[width, 0.03]} />
              <meshStandardMaterial
                color="#0a0a0f"
                emissive="#06b6d4"
                emissiveIntensity={0.2}
                transparent
                opacity={0.6}
              />
            </mesh>
          );
        })}

        {/* Monitor stand */}
        <mesh position={[0, -0.7, 0.1]} castShadow>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.7} />
        </mesh>

        {/* Monitor base */}
        <mesh position={[0, -0.88, 0.1]} castShadow>
          <boxGeometry args={[0.5, 0.03, 0.3]} />
          <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0.06, 0.2]} castShadow>
        <boxGeometry args={[1.0, 0.03, 0.35]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Keyboard keys (subtle grid) */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 12 }).map((_, col) => (
          <mesh key={`key-${row}-${col}`} position={[-0.38 + col * 0.07, 0.085, 0.08 + row * 0.06]}>
            <boxGeometry args={[0.05, 0.015, 0.04]} />
            <meshStandardMaterial color="#0f0f23" roughness={0.6} metalness={0.3} />
          </mesh>
        ))
      )}

      {/* Mouse */}
      <mesh position={[0.8, 0.06, 0.25]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Desk lamp */}
      <group position={[-1.3, 0.04, -0.4]}>
        {/* Lamp base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#16213e" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Lamp arm */}
        <mesh position={[0.15, 0.4, 0]} rotation={[0, 0, 0.3]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Lamp head */}
        <mesh position={[0.35, 0.75, 0]} rotation={[0, 0, 0.8]} castShadow>
          <coneGeometry args={[0.12, 0.18, 16]} />
          <meshStandardMaterial color="#16213e" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Lamp glow */}
        <pointLight
          position={[0.35, 0.65, 0]}
          color="#22d3ee"
          intensity={0.5}
          distance={2}
          decay={2}
        />
      </group>

      {/* Coffee mug */}
      <group position={[1.3, 0.04, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.14, 16]} />
          <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Coffee */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
          <meshStandardMaterial color="#3b1e08" roughness={0.8} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#374151" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Small plant/cactus */}
      <group position={[-0.9, 0.04, -0.6]}>
        {/* Pot */}
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.05, 0.08, 8]} />
          <meshStandardMaterial color="#b45309" roughness={0.7} />
        </mesh>
        {/* Plant */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#059669" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#10b981" roughness={0.8} />
        </mesh>
      </group>

      {/* Notebook/book stack */}
      <group position={[1.0, 0.04, -0.6]}>
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.03, 0.35]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.03, 0]} castShadow>
          <boxGeometry args={[0.22, 0.025, 0.32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
