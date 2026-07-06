"use client";

import React, { useRef, useState, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useStore } from "@/store/useStore";
import { AudioEngine } from "@/audio/AudioEngine";

/**
 * Clickable navigation object inside the Arrival Plaza.
 * Represents the ⚙️ Workshop / Projects node.
 */
function WorkshopPedestal() {
  const [hovered, setHovered] = useState(false);
  const focusedObject = useStore((state) => state.focusedObject);
  const setFocusedObject = useStore((state) => state.setFocusedObject);
  const sphereRef = useRef<THREE.Mesh>(null);

  // Sync cursor state when hovering
  useEffect(() => {
    if (focusedObject === null) {
      document.body.style.cursor = hovered ? "pointer" : "auto";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, focusedObject]);

  // Animate the floating mechanical element
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    if (sphereRef.current) {
      sphereRef.current.rotation.y = elapsed * 0.8;
      sphereRef.current.rotation.x = elapsed * 0.4;
      // Pulse scale slightly if hovered
      const pulseFactor =
        hovered && focusedObject === null ? 1.15 + Math.sin(elapsed * 8) * 0.04 : 1.0;
      sphereRef.current.scale.setScalar(pulseFactor);

      // Floating motion
      sphereRef.current.position.y = 0.4 + Math.sin(elapsed * 2.0) * 0.05;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (focusedObject !== null) return;
    e.stopPropagation();
    setHovered(true);
    AudioEngine.playHoverTone();
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (focusedObject !== null) return;
    e.stopPropagation();
    AudioEngine.playClickTone();
    setFocusedObject("workshop");
    setHovered(false);
  };

  return (
    <group
      position={[2.5, 0.4, -1.0]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Base: Concrete cylindrical stand */}
      <mesh castShadow receiveShadow position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.6, 24]} />
        <meshStandardMaterial color="#1f1f28" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Floating Mechanical Node (glowing dodecahedron) */}
      <mesh ref={sphereRef} position={[0, 0.4, 0]} castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={hovered && focusedObject === null ? "#ffe2b3" : "#bfb0a0"}
          emissive={hovered && focusedObject === null ? "#ffd69e" : "#000000"}
          emissiveIntensity={hovered && focusedObject === null ? 0.8 : 0.0}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Outer activation projection ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.49, 0]}>
        <ringGeometry args={[0.4, 0.42, 32]} />
        <meshBasicMaterial
          color={hovered && focusedObject === null ? "#ffd69e" : "#3a3a45"}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* R3F Drei HTML overlay label */}
      {hovered && focusedObject === null && (
        <Html distanceFactor={6} position={[0, 0.8, 0]} center>
          <div className="select-none pointer-events-none px-2.5 py-1 bg-zinc-950/90 border border-zinc-800/80 backdrop-blur-md rounded shadow-xl whitespace-nowrap">
            <span className="font-[var(--font-fira-code)] text-[9px] uppercase tracking-wider text-amber-200">
              ⚙️ Workshop // Projects
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * PROJECT NEXUS // ARRIVAL PLAZA DISTRICT
 * Responsibility: Renders the first physical district.
 * Art Direction: Biophilic design, Apple Park meets Japanese Zen Garden,
 * Scandinavian minimalism. Concrete slabs, natural stone, gravel paths,
 * small plants, stylized trees, and a reflective water feature.
 */
export function ArrivalPlaza() {
  const waterRef = useRef<THREE.Mesh>(null);
  const foliageRef = useRef<THREE.Group>(null);

  // Animate water ripples and gentle tree swaying
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();

    // 1. Water ripple simulation
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      mat.roughness = 0.15 + Math.sin(elapsed * 1.5) * 0.05;
    }

    // 2. Gentle wind swaying of foliage
    if (foliageRef.current) {
      foliageRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Group) {
          const leafCrown = child.children[1];
          if (leafCrown) {
            const speed = 0.5 + index * 0.1;
            const amp = 0.02 + index * 0.005;
            leafCrown.position.x = Math.sin(elapsed * speed) * amp;
            leafCrown.position.z = Math.cos(elapsed * speed * 0.8) * amp;
          }
        }
      });
    }
  });

  return (
    <group name="arrival-plaza-root">
      {/* ────────────────────── Hardscape Foundations ────────────────────── */}
      {/* Main Concrete Plaza Floor Slab */}
      <mesh
        name="plaza-floor"
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, 0]}
        receiveShadow
        castShadow
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

      {/* ────────────────────── Water Features ────────────────────── */}
      {/* Rectangular reflecting pool along the western boundary */}
      <group name="reflecting-pool" position={[-8, -0.19, 2]}>
        {/* Pool Border */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.1, 8.2]} />
          <meshStandardMaterial color="#2b2b35" roughness={0.7} />
        </mesh>
        {/* Water Surface */}
        <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} receiveShadow>
          <planeGeometry args={[4, 8]} />
          <meshStandardMaterial color="#1a252c" roughness={0.15} metalness={0.9} />
        </mesh>
      </group>

      {/* ────────────────────── Stylized Flora / Trees ────────────────────── */}
      <group ref={foliageRef} name="plaza-foliage">
        {/* Tree 1: Zen Pine structure left */}
        <group position={[-7, 0, -6]}>
          <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.16, 3, 8]} />
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

      {/* Interaction Redesign Clickable Workshop Node */}
      <WorkshopPedestal />
    </group>
  );
}

export default ArrivalPlaza;
