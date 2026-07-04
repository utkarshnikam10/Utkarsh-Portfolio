"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * PROJECT NEXUS // ARRIVAL PLAZA DISTRICT
 * Responsibility: Renders the first physical district.
 * Art Direction: Biophilic design, Apple Park meets Japanese Zen Garden,
 * Scandinavian minimalism. Concrete slabs, natural stone, gravel paths,
 * small plants, stylized trees, and a reflective water feature.
 *
 * Reusable and self-contained district mesh hierarchy.
 */
export function ArrivalPlaza() {
  const waterRef = useRef<THREE.Mesh>(null);
  const foliageRef = useRef<THREE.Group>(null);

  // Animate water ripples and gentle tree swaying
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // Water surface animation (slow breathing/rippling)
    if (waterRef.current) {
      const material = waterRef.current.material as THREE.MeshStandardMaterial;
      material.roughness = 0.1 + Math.sin(elapsed * 0.5) * 0.05;
      waterRef.current.position.y = -0.15 + Math.sin(elapsed * 1.5) * 0.005;
    }

    // Sway foliage gently in the wind
    if (foliageRef.current) {
      foliageRef.current.children.forEach((child, index) => {
        child.rotation.z = Math.sin(elapsed * 1.2 + index) * 0.02;
        child.rotation.x = Math.cos(elapsed * 0.8 + index) * 0.01;
      });
    }
  });

  return (
    <group name="arrival-plaza-district">
      {/* ────────────────────── Terrain & Slabs ────────────────────── */}
      {/* Central circular concrete courtyard (Brutalist foundation) */}
      <mesh
        name="plaza-floor"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
      >
        <ringGeometry args={[0, 12, 64]} />
        <meshStandardMaterial color="#5a5a65" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Travertine step terraces wrapping the north side */}
      <group name="terracotta-steps">
        <mesh position={[0, -0.1, -8]} receiveShadow castShadow>
          <boxGeometry args={[16, 0.2, 3]} />
          <meshStandardMaterial color="#bfb0a0" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, -10]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.4, 3]} />
          <meshStandardMaterial color="#bfb0a0" roughness={0.8} />
        </mesh>
      </group>

      {/* Zen Slate Stepping Stones guiding towards Z < 0 (Tree Plaza direction) */}
      <group name="stepping-stones">
        {[-2, -4, -6, -8].map((z, i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0.1 * i]}
            position={[i % 2 === 0 ? 0.4 : -0.4, -0.18, z]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[1.2, 0.8, 0.05]} />
            <meshStandardMaterial color="#3a3a45" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Gravel / Pebble Bed surrounding the plaza floor */}
      <mesh
        name="gravel-surround"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.21, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2a2a32" roughness={0.9} />
      </mesh>

      {/* ────────────────────── Natural Stones (Zen Boulders) ────────────────────── */}
      <group name="zen-boulders">
        {/* Main large sculptural anchor stone */}
        <mesh position={[-5, 0.6, -3]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#6a6d78" roughness={0.85} />
        </mesh>
        {/* Accent stones */}
        <mesh position={[6, 0.3, 2]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial color="#3f4249" roughness={0.9} />
        </mesh>
        <mesh position={[5.2, 0.1, 3.2]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color="#303238" roughness={0.9} />
        </mesh>
      </group>

      {/* ────────────────────── Water Feature (Reflecting Pool) ────────────────────── */}
      <group name="reflecting-pool">
        {/* Pool frame border */}
        <mesh position={[4, -0.15, -4]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 0.15, 6.4]} />
          <meshStandardMaterial color="#2d2e33" roughness={0.8} />
        </mesh>
        {/* Water Surface plane */}
        <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[4, -0.15, -4]}>
          <planeGeometry args={[4.2, 6.2]} />
          <meshStandardMaterial
            color="#0b1a20"
            roughness={0.15}
            metalness={0.9}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* ────────────────────── Biophilic Foliage & Trees ────────────────────── */}
      {/* Procedural stylized trees */}
      <group name="trees" ref={foliageRef}>
        {/* Tree 1: Zen Pine structure left */}
        <group position={[-7, 0, -6]}>
          <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 3, 8]} />
            <meshStandardMaterial color="#2b1b17" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 3.2, 0]}>
            <icosahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial color="#3d493a" roughness={0.7} />
          </mesh>
        </group>

        {/* Tree 2: Zen Pine structure right */}
        <group position={[8, 0, -8]}>
          <mesh castShadow receiveShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.14, 0.2, 3.6, 8]} />
            <meshStandardMaterial color="#2b1b17" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 3.8, 0]}>
            <icosahedronGeometry args={[1.6, 1]} />
            <meshStandardMaterial color="#445240" roughness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Small plants / grasses (Minimalist scattered blocks) */}
      <group name="shrubbery">
        {/* Group of plants around boulders */}
        <mesh position={[-4.2, 0.1, -1.8]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial color="#556644" roughness={0.8} />
        </mesh>
        <mesh position={[-5.8, 0.15, -4.2]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.4]} />
          <meshStandardMaterial color="#4a5a3a" roughness={0.8} />
        </mesh>
        <mesh position={[6.5, 0.08, 0.8]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color="#556644" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export default ArrivalPlaza;
