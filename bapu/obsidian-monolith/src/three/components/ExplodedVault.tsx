"use client";

import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useAudio } from "../../hooks/useAudio";

interface ExplodedVaultProps {
  title: string;
  category: string;
  position: [number, number, number];
  index: number;
  visible?: boolean;
}

export function ExplodedVault({
  title,
  category,
  position,
  index,
  visible = true,
}: ExplodedVaultProps) {
  const [hovered, setHovered] = useState(false);
  const { playHoverTick } = useAudio();
  const { pointer } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const layerARef = useRef<THREE.Mesh>(null);
  const layerBRef = useRef<THREE.Mesh>(null);
  const layerCRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const rotTilt = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    if (!visible || !groupRef.current) return;

    if (hovered) {
      const targetRotY = THREE.MathUtils.clamp(pointer.x * 0.45, -0.4, 0.4);
      const targetRotX = THREE.MathUtils.clamp(-pointer.y * 0.45, -0.4, 0.4);

      rotTilt.current.x = THREE.MathUtils.lerp(rotTilt.current.x, targetRotX, delta * 6.0);
      rotTilt.current.y = THREE.MathUtils.lerp(rotTilt.current.y, targetRotY, delta * 6.0);
    } else {
      rotTilt.current.x = THREE.MathUtils.lerp(rotTilt.current.x, 0, delta * 5.0);
      rotTilt.current.y = THREE.MathUtils.lerp(rotTilt.current.y, 0, delta * 5.0);
    }

    groupRef.current.rotation.x = rotTilt.current.x;
    groupRef.current.rotation.y = rotTilt.current.y;

    // Interpolate Z-offsets from 0 to 2.2 units on hover reveal
    const targetOffsetA = hovered ? 1.1 : 0.15;
    const targetOffsetB = hovered ? 0.0 : 0.0;
    const targetOffsetC = hovered ? -1.1 : -0.15;

    if (layerARef.current) {
      layerARef.current.position.z = THREE.MathUtils.lerp(
        layerARef.current.position.z,
        targetOffsetA,
        delta * 5.0
      );
    }

    if (layerBRef.current) {
      layerBRef.current.position.z = THREE.MathUtils.lerp(
        layerBRef.current.position.z,
        targetOffsetB,
        delta * 5.0
      );
    }

    if (layerCRef.current) {
      layerCRef.current.position.z = THREE.MathUtils.lerp(
        layerCRef.current.position.z,
        targetOffsetC,
        delta * 5.0
      );
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        hovered ? 4.0 : 0.5,
        delta * 6.0
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
      {/* Layer A (Top): Glass slab with Snell's law refraction */}
      <mesh ref={layerARef} position={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[3.0, 1.8, 0.1]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.98}
          roughness={0.04}
          ior={1.52}
          thickness={1.4}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
        />
        {hovered && (
          <Text
            position={[1.8, 0, 0]}
            fontSize={0.12}
            color="#38bdf8"
            anchorX="left"
            anchorY="middle"
          >
            [LAYER A // SNELL GLASS]
          </Text>
        )}
      </mesh>

      {/* Layer B (Middle): Glowing GPGPU shader plate casting real light */}
      <mesh ref={layerBRef} position={[0, 0, 0]}>
        <boxGeometry args={[2.7, 1.5, 0.2]} />
        <meshStandardMaterial
          color="#06070a"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 1.4 : 0.3}
          wireframe={true}
        />
        <pointLight
          ref={pointLightRef}
          distance={3.0}
          intensity={0.5}
          color="#38bdf8"
        />
        {hovered && (
          <Text
            position={[1.8, 0, 0]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            [LAYER B // GPGPU SHADER]
          </Text>
        )}
      </mesh>

      {/* Layer C (Base): Dark matte titanium chassis plate */}
      <mesh ref={layerCRef} position={[0, 0, -0.15]} receiveShadow>
        <boxGeometry args={[3.2, 2.0, 0.12]} />
        <meshStandardMaterial color="#0b0c10" roughness={0.2} metalness={0.9} />
        {hovered && (
          <Text
            position={[1.8, 0, 0]}
            fontSize={0.12}
            color="#6e6e73"
            anchorX="left"
            anchorY="middle"
          >
            [LAYER C // TITANIUM CHASSIS]
          </Text>
        )}
      </mesh>

      {/* Project Title Callout */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.2}
        color="#f4f4f7"
        anchorX="center"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}
