"use client";

import React, { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useAudio } from "../../hooks/useAudio";
import { createGlassMaterial } from "../materials/GlassMaterial";

interface PhysicalCardProps {
  title: string;
  category: string;
  position: [number, number, number];
  index: number;
}

export function PhysicalCard({
  title,
  category,
  position,
  index,
}: PhysicalCardProps) {
  const [hovered, setHovered] = useState(false);
  const { playHoverTick } = useAudio();
  const { pointer } = useThree();

  const groupRef = useRef<THREE.Group>(null);
  const outerSlabRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  const rotTilt = useRef({ x: 0, y: 0 });
  const posZ = useRef(0);

  const glassMaterial = useMemo(() => {
    return createGlassMaterial({
      color: new THREE.Color("#0a0b0e"),
      transmission: 0.96,
      roughness: 0.08,
      ior: 1.52,
      thickness: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (hovered) {
      const targetRotY = THREE.MathUtils.clamp(pointer.x * 0.4, -0.3, 0.3);
      const targetRotX = THREE.MathUtils.clamp(-pointer.y * 0.4, -0.3, 0.3);

      rotTilt.current.x = THREE.MathUtils.lerp(rotTilt.current.x, targetRotX, delta * 6.0);
      rotTilt.current.y = THREE.MathUtils.lerp(rotTilt.current.y, targetRotY, delta * 6.0);
      posZ.current = THREE.MathUtils.lerp(posZ.current, 0.6, delta * 5.0);
    } else {
      rotTilt.current.x = THREE.MathUtils.lerp(rotTilt.current.x, 0, delta * 5.0);
      rotTilt.current.y = THREE.MathUtils.lerp(rotTilt.current.y, 0, delta * 5.0);
      posZ.current = THREE.MathUtils.lerp(posZ.current, 0, delta * 5.0);
    }

    groupRef.current.rotation.x = rotTilt.current.x;
    groupRef.current.rotation.y = rotTilt.current.y;
    groupRef.current.position.z = position[2] + posZ.current;

    // Inner layer parallax offset
    if (innerCoreRef.current) {
      innerCoreRef.current.position.x = rotTilt.current.y * 0.5;
      innerCoreRef.current.position.y = -rotTilt.current.x * 0.5;
    }

    if (spotLightRef.current) {
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        hovered ? 6.0 : 0.0,
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
      {/* Focused Directional Spot Keylight on Hover */}
      <spotLight
        ref={spotLightRef}
        position={[0, 2, 3]}
        angle={0.5}
        penumbra={0.8}
        intensity={0}
        color="#38bdf8"
      />

      {/* Outer Physical Glass Slab */}
      <mesh ref={outerSlabRef} material={glassMaterial} castShadow receiveShadow>
        <boxGeometry args={[3.2, 2.0, 0.2]} />
      </mesh>

      {/* Inner Parallax Core Layer */}
      <mesh ref={innerCoreRef} position={[0, 0, -0.1]}>
        <boxGeometry args={[2.8, 1.6, 0.1]} />
        <meshStandardMaterial
          color="#06070a"
          emissive="#38bdf8"
          emissiveIntensity={hovered ? 0.8 : 0.1}
          wireframe={true}
        />
      </mesh>

      {/* 3D Callout Typography */}
      <Text
        position={[-1.2, 0.5, 0.15]}
        fontSize={0.12}
        color="#38bdf8"
        anchorX="left"
        anchorY="middle"
      >
        {`0${index + 1} // ${category.toUpperCase()}`}
      </Text>

      <Text
        position={[-1.2, -0.2, 0.15]}
        fontSize={0.22}
        color="#f5f5f7"
        anchorX="left"
        anchorY="middle"
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}
