"use client";

import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useAudio } from "../../hooks/useAudio";

interface ExplodedProjectBlockProps {
  title: string;
  position: [number, number, number];
  index: number;
  highlighted?: boolean;
}

export function ExplodedProjectBlock({
  title,
  position,
  index,
  highlighted = false,
}: ExplodedProjectBlockProps) {
  const [hovered, setHovered] = useState(false);
  const { playHoverTick } = useAudio();
  const { pointer } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const topLayerRef = useRef<THREE.Mesh>(null);
  const centerLayerRef = useRef<THREE.Mesh>(null);
  const bottomLayerRef = useRef<THREE.Mesh>(null);

  const rotTilt = useRef({ x: 0, y: 0 });
  const isExploded = hovered || highlighted;

  useFrame((_, delta) => {
    if (groupRef.current) {
      if (isExploded) {
        // Capped ±25° (approx 0.43 rad) cursor rotational tilt
        const maxTilt = 0.43;
        const targetRotY = THREE.MathUtils.clamp(pointer.x * 0.7, -maxTilt, maxTilt);
        const targetRotX = THREE.MathUtils.clamp(-pointer.y * 0.7, -maxTilt, maxTilt);

        rotTilt.current.x = THREE.MathUtils.lerp(rotTilt.current.x, targetRotX, delta * 6.0);
        rotTilt.current.y = THREE.MathUtils.lerp(rotTilt.current.y, targetRotY, delta * 6.0);
      } else {
        // Return smoothly to zero rotation via spring damping
        rotTilt.current.x = THREE.MathUtils.lerp(rotTilt.current.x, 0, delta * 5.0);
        rotTilt.current.y = THREE.MathUtils.lerp(rotTilt.current.y, 0, delta * 5.0);
      }

      groupRef.current.rotation.x = rotTilt.current.x;
      groupRef.current.rotation.y = rotTilt.current.y;
    }

    const targetYTop = isExploded ? 1.2 : 0.2;
    const targetYCenter = isExploded ? 0.0 : 0.0;
    const targetYBottom = isExploded ? -1.2 : -0.2;

    if (topLayerRef.current) {
      topLayerRef.current.position.y = THREE.MathUtils.lerp(
        topLayerRef.current.position.y,
        targetYTop,
        delta * 5.0
      );
    }

    if (centerLayerRef.current) {
      centerLayerRef.current.position.y = THREE.MathUtils.lerp(
        centerLayerRef.current.position.y,
        targetYCenter,
        delta * 5.0
      );
    }

    if (bottomLayerRef.current) {
      bottomLayerRef.current.position.y = THREE.MathUtils.lerp(
        bottomLayerRef.current.position.y,
        targetYBottom,
        delta * 5.0
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        playHoverTick();
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Top Physical Layer: Glass UI Surface */}
      <mesh ref={topLayerRef} position={[0, 0.2, 0]}>
        <boxGeometry args={[2.4, 0.08, 1.6]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.98}
          roughness={0.03}
          ior={1.52}
          thickness={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
        {isExploded && (
          <Text
            position={[1.5, 0, 0]}
            fontSize={0.12}
            color="#d4af37"
            anchorX="left"
            anchorY="middle"
          >
            [01 // GLASS UI SURFACE]
          </Text>
        )}
      </mesh>

      {/* Center Physical Layer: Glowing Shader Core */}
      <mesh ref={centerLayerRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.4, 1.4]} />
        <meshStandardMaterial
          color="#12141a"
          emissive="#d4af37"
          emissiveIntensity={isExploded ? 1.2 : 0.4}
          wireframe={true}
        />
        {isExploded && (
          <Text
            position={[1.5, 0, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            [02 // GLSL SHADER CORE]
          </Text>
        )}
      </mesh>

      {/* Bottom Physical Layer: Matte Obsidian Base Plate */}
      <mesh ref={bottomLayerRef} position={[0, -0.2, 0]}>
        <boxGeometry args={[2.5, 0.12, 1.7]} />
        <meshStandardMaterial color="#0c0c10" roughness={0.6} metalness={0.8} />
        {isExploded && (
          <Text
            position={[1.5, 0, 0]}
            fontSize={0.12}
            color="#888888"
            anchorX="left"
            anchorY="middle"
          >
            [03 // MATTE BASE PLATE]
          </Text>
        )}
      </mesh>

      {/* Project Title Callout */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}
