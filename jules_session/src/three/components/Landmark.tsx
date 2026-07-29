"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { MathUtils } from "three";

import type { Chapter } from "@/types/world";

interface LandmarkProps {
  chapter: Chapter;
  isActive: boolean;
  isVisited: boolean;
  onSelect: (id: Chapter["id"]) => void;
}

function LandmarkObject({ id, accent }: Pick<Chapter, "id" | "accent">) {
  switch (id) {
    case "tree":
      return (
        <group>
          <mesh castShadow position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.18, 0.26, 1.45, 8]} />
            <meshStandardMaterial color="#47382c" roughness={0.95} />
          </mesh>
          <mesh castShadow position={[-0.2, 1.75, 0.03]} rotation={[0, 0.12, 0.08]}>
            <coneGeometry args={[0.96, 1.9, 7]} />
            <meshStandardMaterial color={accent} roughness={0.86} />
          </mesh>
          <mesh castShadow position={[0.42, 1.37, 0.08]} rotation={[0, -0.24, -0.12]}>
            <coneGeometry args={[0.72, 1.44, 7]} />
            <meshStandardMaterial color="#9ac76a" roughness={0.86} />
          </mesh>
          <mesh castShadow position={[-0.45, 1.2, -0.08]} rotation={[0, 0.32, 0.18]}>
            <coneGeometry args={[0.62, 1.2, 7]} />
            <meshStandardMaterial color="#84b15c" roughness={0.86} />
          </mesh>
        </group>
      );
    case "workshop":
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.62, 0]}>
            <boxGeometry args={[2.15, 1.2, 1.45]} />
            <meshStandardMaterial color="#342d2a" roughness={0.87} />
          </mesh>
          <mesh castShadow position={[0, 1.36, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.45, 1.25, 4]} />
            <meshStandardMaterial color={accent} roughness={0.8} />
          </mesh>
          <mesh position={[-0.54, 0.68, 0.74]}>
            <planeGeometry args={[0.4, 0.55]} />
            <meshBasicMaterial color="#f9d9a5" />
          </mesh>
          <mesh position={[0.52, 0.68, 0.74]}>
            <planeGeometry args={[0.4, 0.55]} />
            <meshBasicMaterial color="#f9d9a5" />
          </mesh>
        </group>
      );
    case "library":
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.66, 0]}>
            <boxGeometry args={[1.95, 1.35, 1.15]} />
            <meshStandardMaterial color="#273348" roughness={0.83} />
          </mesh>
          <mesh castShadow position={[0, 1.46, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.3, 1.15, 4]} />
            <meshStandardMaterial color={accent} roughness={0.75} />
          </mesh>
          {[-0.55, -0.27, 0.03, 0.35, 0.62].map((x, index) => (
            <mesh key={x} position={[x, 0.75, 0.6]}>
              <boxGeometry args={[0.19, 0.7 - (index % 2) * 0.13, 0.04]} />
              <meshBasicMaterial color={index % 2 ? "#f6de78" : "#cfdaed"} />
            </mesh>
          ))}
        </group>
      );
    case "prototype-lab":
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.47, 0]}>
            <cylinderGeometry args={[1.12, 1.28, 0.88, 8]} />
            <meshStandardMaterial color="#3b2944" roughness={0.7} />
          </mesh>
          <mesh castShadow position={[0, 1.0, 0]}>
            <sphereGeometry args={[0.93, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={accent}
              transparent
              opacity={0.68}
              roughness={0.16}
              metalness={0.15}
            />
          </mesh>
          <mesh position={[0, 0.95, 0]}>
            <octahedronGeometry args={[0.31, 0]} />
            <meshStandardMaterial color="#f8e5fb" emissive="#d27bea" emissiveIntensity={1.4} />
          </mesh>
        </group>
      );
    case "observatory":
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.78, 0]}>
            <cylinderGeometry args={[0.74, 0.95, 1.55, 10]} />
            <meshStandardMaterial color="#343546" roughness={0.72} />
          </mesh>
          <mesh castShadow position={[0, 1.72, 0]}>
            <sphereGeometry args={[0.72, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={accent} roughness={0.5} metalness={0.12} />
          </mesh>
          <mesh position={[0, 1.76, 0.58]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.24, 20]} />
            <meshBasicMaterial color="#1e2030" />
          </mesh>
        </group>
      );
    case "mailbox":
      return (
        <group>
          <mesh castShadow position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.1, 0.12, 1.4, 8]} />
            <meshStandardMaterial color="#513935" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 1.46, 0]}>
            <boxGeometry args={[0.86, 0.56, 0.8]} />
            <meshStandardMaterial color={accent} roughness={0.67} />
          </mesh>
          <mesh castShadow position={[0, 1.74, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.84, 12, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={accent} roughness={0.67} />
          </mesh>
          <mesh position={[-0.5, 1.62, 0]}>
            <boxGeometry args={[0.06, 0.5, 0.08]} />
            <meshBasicMaterial color="#f6de78" />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

export function Landmark({ chapter, isActive, isVisited, onSelect }: LandmarkProps) {
  const landmark = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  useFrame(({ clock }, delta) => {
    if (!landmark.current) return;

    const lift =
      (isHovered || isActive ? 0.14 : 0) +
      Math.sin(clock.elapsedTime * 1.35 + chapter.position[0]) * 0.025;
    const targetScale = isHovered || isActive ? 1.08 : 1;
    landmark.current.position.y = MathUtils.damp(landmark.current.position.y, lift, 6, delta);
    landmark.current.scale.setScalar(
      MathUtils.damp(landmark.current.scale.x, targetScale, 8, delta)
    );
  });

  return (
    <group position={chapter.position}>
      <group
        ref={landmark}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(chapter.id);
        }}
        onPointerOut={() => setIsHovered(false)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setIsHovered(true);
        }}
      >
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[isActive ? 1.82 : 1.55, 32]} />
          <meshBasicMaterial
            color={chapter.accent}
            transparent
            opacity={isHovered || isActive ? 0.22 : 0.07}
          />
        </mesh>
        <LandmarkObject accent={chapter.accent} id={chapter.id} />
        {(isHovered || isActive) && (
          <Html center className="world-label" position={[0, 3.15, 0]}>
            <span>{chapter.label}</span>
          </Html>
        )}
        {isVisited && !isActive ? (
          <mesh position={[0.98, 0.18, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={chapter.accent} />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}
