"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { spatialAudio } from "../../utils/SpatialAudio";

interface NeuralMatrixProps {
  visible?: boolean;
}

export function NeuralMatrix({ visible = true }: NeuralMatrixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // 24 Instanced glass-and-titanium crystal nodes in 3D volume
  const nodes = useMemo(() => {
    const arr = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const radius = 3.5 + (i % 3) * 0.8;
      const angle = (i / count) * Math.PI * 2;
      const y = ((i % 6) - 2.5) * 0.9;
      arr.push({
        id: i,
        pos: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        label: i % 2 === 0 ? `NODE_0${i} // GLSL` : `NODE_0${i} // SYS`,
        code: `fn_main(vec3 p) { return snoise(p * ${i}.0); }`,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!visible && groupRef.current.scale.x < 0.005) return;

    const targetScale = visible ? 1.0 : 0.001;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (visible) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <group
            key={node.id}
            position={node.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredIdx(idx);
              spatialAudio.playGlassNodePulse();
            }}
            onPointerOut={() => setHoveredIdx(null)}
          >
            {/* Glass & Titanium Octahedron Crystal Node */}
            <mesh scale={isHovered ? 1.4 : 1.0}>
              <octahedronGeometry args={[0.28, 1]} />
              <meshPhysicalMaterial
                color="#0b0c10"
                roughness={0.1}
                metalness={0.8}
                transmission={0.9}
                clearcoat={1.0}
                emissive={isHovered ? "#38bdf8" : "#ffffff"}
                emissiveIntensity={isHovered ? 1.5 : 0.2}
                wireframe={!isHovered}
              />
            </mesh>

            {/* Monospace Micro-Blueprint Callout */}
            {isHovered && (
              <group position={[0.5, 0.2, 0]}>
                <Text fontSize={0.1} color="#38bdf8" anchorX="left">
                  {node.label}
                </Text>
                <Text position={[0, -0.15, 0]} fontSize={0.07} color="#6e6e73" anchorX="left">
                  {node.code}
                </Text>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}
