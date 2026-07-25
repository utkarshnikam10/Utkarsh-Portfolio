/* eslint-disable */
"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { playHoverTone, playSelectSound } from "../../../utils/audio";

interface SkillItem {
  id: number;
  label: string;
  initialPos: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Vector3;
  color: string;
}

export function SkillSandboxChapter({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const [grabbedId, setGrabbedId] = useState<number | null>(null);

  const prevPointer = useRef({ x: 0, y: 0 });
  const pointerVel = useRef({ x: 0, y: 0 });

  const items = useMemo<SkillItem[]>(() => {
    const list: SkillItem[] = [];
    const skillLabels = [
      "Three.js",
      "GLSL",
      "React",
      "Next.js",
      "TypeScript",
      "WebGPU",
      "Lenis",
      "GSAP",
      "Tailwind",
      "RxJS",
      "Canvas 2D",
      "Postprocessing",
    ];
    const colors = [
      "#d4af37",
      "#f3e5ab",
      "#38bdf8",
      "#a855f7",
      "#34d399",
      "#f43f5e",
    ];

    for (let i = 0; i < 12; i++) {
      list.push({
        id: i,
        label: skillLabels[i],
        initialPos: new THREE.Vector3(
          (Math.random() - 0.5) * 6.5,
          (Math.random() - 0.5) * 5.0,
          (Math.random() - 0.5) * 3.0
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03
        ),
        color: colors[i % colors.length],
      });
    }

    return list;
  }, []);

  const pointerVec = useRef(new THREE.Vector3());

  const handlePointerDown = (e: ThreeEvent<PointerEvent>, id: number) => {
    e.stopPropagation();
    setGrabbedId(id);
    playSelectSound();
  };

  const handlePointerUp = () => {
    if (grabbedId !== null) {
      // Toss object with mouse pointer velocity!
      const item = items[grabbedId];
      if (item) {
        item.velocity.x += pointerVel.current.x * 0.35;
        item.velocity.y += pointerVel.current.y * 0.35;
      }
    }
    setGrabbedId(null);
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Track mouse velocity for tossing objects
    const dx = pointer.x - prevPointer.current.x;
    const dy = pointer.y - prevPointer.current.y;
    prevPointer.current.x = pointer.x;
    prevPointer.current.y = pointer.y;

    const safeDelta = Math.max(delta, 0.001);
    pointerVel.current.x = dx / safeDelta;
    pointerVel.current.y = dy / safeDelta;

    const targetScale = visible ? 1.0 : 0.0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 5.0)
    );

    if (!visible) return;

    pointerVec.current.set(pointer.x * 5.5, pointer.y * 5.5, 0);

    // Update zero-g physics positions & toss dynamics
    groupRef.current.children.forEach((child, idx) => {
      const item = items[idx];
      if (!item) return;

      const pos = child.position;

      if (grabbedId === item.id) {
        // Drag grabbed item smoothly with cursor
        pos.x = THREE.MathUtils.lerp(pos.x, pointerVec.current.x, delta * 12.0);
        pos.y = THREE.MathUtils.lerp(pos.y, pointerVec.current.y, delta * 12.0);
      } else {
        // Distance to pointer for elastic repulsion
        const dist = Math.hypot(
          pos.x - pointerVec.current.x,
          pos.y - pointerVec.current.y
        );

        if (dist < 2.0 && dist > 0.001) {
          const push = (2.0 - dist) * 0.15;
          item.velocity.x += ((pos.x - pointerVec.current.x) / dist) * push;
          item.velocity.y += ((pos.y - pointerVec.current.y) / dist) * push;
        }

        // Zero-G Spring return force back to floating field center
        item.velocity.x += (item.initialPos.x - pos.x) * 0.03;
        item.velocity.y += (item.initialPos.y - pos.y) * 0.03;
        item.velocity.z += (item.initialPos.z - pos.z) * 0.03;

        // Velocity damping
        item.velocity.multiplyScalar(0.92);
        pos.add(item.velocity);
      }

      child.rotation.x += item.rotation.x;
      child.rotation.y += item.rotation.y;
    });
  });

  return (
    <group
      ref={groupRef}
      scale={0}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {items.map((item) => (
        <mesh
          key={item.id}
          position={item.initialPos}
          data-cursor-label="TOSS"
          onPointerOver={playHoverTone}
          onPointerDown={(e) => handlePointerDown(e, item.id)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshPhysicalMaterial
            color="#0c0c10"
            roughness={0.08}
            metalness={0.92}
            clearcoat={1.0}
            emissive={item.color}
            emissiveIntensity={grabbedId === item.id ? 0.95 : 0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
