"use client";

import React from "react";
import ArrivalPlaza from "./ArrivalPlaza";

/**
 * PROJECT NEXUS // WORLD SYSTEM MANAGER
 * Responsibility: Loads and renders the structural environment assets.
 * Instantiates the districts consecutively along the negative Z-axis,
 * allowing a continuous, seamless camera rail tracking shot without
 * unmounting/mounting visual pops or shader compilation drops.
 */
export function WorldManager() {
  return (
    <group name="world-root">
      {/* Central Landmark: The Tree of Curiosity (Visual/Spatial Anchor at Z = -15) */}
      <group name="tree-of-curiosity" position={[0, 0, -15]}>
        {/* Procedural glowing trunk and light emitter */}
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.1, 0.4, 6, 16]} />
          <meshStandardMaterial
            color="#ffd69e"
            emissive="#ffd69e"
            emissiveIntensity={0.5}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 6, 0]}>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#ffd69e"
            emissive="#ffd69e"
            emissiveIntensity={0.2}
            transparent
            opacity={0.85}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* District 1: The Well Vault / Arrival Plaza (Z = 0) */}
      <group name="district-well-vault" position={[0, 0, 0]}>
        <ArrivalPlaza />
      </group>

      {/* District 2: The Horizon Reveal (Z = -18) */}
      <group name="district-horizon-bridge" position={[0, 0, -18]}>
        {/* Concrete/aluminum archway structure */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[6, 5, 0.5]} />
          <meshStandardMaterial color="#1a1a24" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Open portal cut */}
        <mesh position={[0, 1.8, 0]}>
          <boxGeometry args={[3, 3.6, 0.8]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* Path stepping slabs */}
        <mesh position={[0, -0.01, -3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 6]} />
          <meshStandardMaterial color="#1f1f28" roughness={0.8} />
        </mesh>
      </group>

      {/* District 3: The Kinetic Forge Pavilion (Z = -36) */}
      <group name="district-kinetic-forge" position={[0, 0, -36]}>
        {/* Terrazzo platform */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#2d2d35" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Glass walls and deconstruction pedestals */}
        <mesh position={[0, 1.5, 0]}>
          <boxGeometry args={[8, 3, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            roughness={0.05}
            metalness={0.9}
          />
        </mesh>
        {/* Small deconstruction pedestals */}
        {[-2.5, 0, 2.5].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0]}>
            <boxGeometry args={[0.8, 1.0, 0.8]} />
            <meshStandardMaterial color="#ffd69e" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* District 4: The Lattice Matrix (Z = -54) */}
      <group name="district-lattice-matrix" position={[0, 0, -54]}>
        {/* Sleek vector line grids (10,000 points proxy) */}
        <gridHelper args={[20, 20, "#ffdfa0", "#1c1c28"]} position={[0, 0.01, 0]} />
        <mesh position={[0, 2, 0]}>
          <octahedronGeometry args={[1]} />
          <meshStandardMaterial
            color="#ffdfa0"
            emissive="#ffdfa0"
            emissiveIntensity={0.6}
            roughness={0.0}
            wireframe
          />
        </mesh>
      </group>

      {/* District 5: The Travertine Terrace (Z = -72) */}
      <group name="district-travertine-terrace" position={[0, 0, -72]}>
        {/* Travertine marble platform */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#eae5d8" roughness={0.6} />
        </mesh>
        {/* Columns */}
        {[-4, 4].map((x, i) => (
          <mesh key={i} position={[x, 3, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 6, 8]} />
            <meshStandardMaterial color="#dcd7c9" roughness={0.5} metalness={0.2} />
          </mesh>
        ))}
      </group>

      {/* District 6: The Root Vault Sanctuary / Contact (Z = -90) */}
      <group name="district-root-vault" position={[0, 0, -90]}>
        {/* Dark granite floor */}
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#0d0d12" roughness={0.9} />
        </mesh>
        {/* Monolith monolith table */}
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.5, 1.5, 0.8]} />
          <meshStandardMaterial color="#ffdfa0" roughness={0.1} metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

export default WorldManager;
