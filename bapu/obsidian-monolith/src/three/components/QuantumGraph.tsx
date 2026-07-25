"use client";

import React, { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useAudio } from "../../hooks/useAudio";
import { useMousePhysics } from "../hooks/useMousePhysics";

interface QuantumGraphProps {
  visible: boolean;
}

export function QuantumGraph({ visible }: QuantumGraphProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { playHoverTick, playClickPulse } = useAudio();
  const physics = useMousePhysics();

  const nodes = useMemo(
    () => [
      { name: "C++", pos: [-2.4, 1.4, 0.2], category: "Core Languages", color: "#d4af37" },
      { name: "THREE.JS", pos: [0, 1.8, -0.4], category: "Graphics", color: "#ffffff" },
      { name: "GLSL SHADERS", pos: [2.2, 1.2, 0.3], category: "Shaders", color: "#d4af37" },
      { name: "NEXT.JS 16", pos: [-1.8, -0.8, -0.2], category: "Frontend", color: "#ffffff" },
      { name: "GPGPU SIM", pos: [0.2, -1.4, 0.4], category: "Physics", color: "#d4af37" },
      { name: "WEB AUDIO API", pos: [2.0, -1.0, -0.3], category: "Audio", color: "#ffffff" },
    ],
    []
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetScale = visible ? 1.0 : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (visible) {
      groupRef.current.rotation.y += delta * (0.08 + physics.speed * 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        physics.velocity.y * 0.05,
        delta * 3.0
      );
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, idx) => {
        const isHovered = hoveredIndex === idx;
        return (
          <group
            key={node.name}
            position={node.pos as [number, number, number]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredIndex(idx);
              playHoverTick();
            }}
            onPointerOut={() => setHoveredIndex(null)}
            onClick={(e) => {
              e.stopPropagation();
              playClickPulse();
            }}
          >
            {/* Dark Matte & Crystalline Node Geometry */}
            <mesh scale={isHovered ? 1.4 : 1.0}>
              <octahedronGeometry args={[0.35, 1]} />
              <meshPhysicalMaterial
                color="#0c0c10"
                roughness={0.2}
                metalness={0.8}
                clearcoat={1.0}
                emissive={node.color}
                emissiveIntensity={isHovered ? 1.4 : 0.2}
                wireframe={!isHovered}
              />
            </mesh>

            <Text
              position={[0, -0.55, 0]}
              fontSize={0.14}
              color={isHovered ? "#d4af37" : "#ffffff"}
              anchorX="center"
              anchorY="middle"
            >
              {node.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
