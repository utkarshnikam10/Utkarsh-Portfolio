"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { MathUtils } from "three";

const KEYS = Array.from({ length: 30 }, (_, index) => ({
  x: ((index % 10) - 4.5) * 0.25,
  z: (Math.floor(index / 10) - 1) * 0.27,
}));

const PARTICLES = [
  [-3.2, 0.2, -0.8, 0.16],
  [-2.6, 0.8, -1.3, 0.22],
  [-1.9, 1.4, -0.5, 0.13],
  [-1.2, 0.2, -1.1, 0.18],
  [-0.6, 1.0, -0.7, 0.24],
  [0.1, 0.45, -1.3, 0.14],
  [0.8, 1.2, -0.8, 0.2],
  [1.5, 0.35, -1.25, 0.16],
  [2.1, 1.5, -0.75, 0.21],
  [2.8, 0.7, -1.1, 0.15],
  [3.25, 1.35, -0.65, 0.23],
  [0.5, 2.0, -1.3, 0.17],
] as const;

function FloatingParticle({ particle }: { particle: (typeof PARTICLES)[number] }) {
  const particleRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!particleRef.current) return;
    const offset = Math.sin(clock.elapsedTime * particle[3] * 4 + particle[0]) * 0.35;
    particleRef.current.position.y = particle[1] + offset;
    particleRef.current.position.x =
      particle[0] + Math.sin(clock.elapsedTime * particle[3] + particle[2]) * 0.08;
  });

  return (
    <mesh ref={particleRef} position={[particle[0], particle[1], particle[2]]}>
      <boxGeometry args={[0.025, 0.025, 0.025]} />
      <meshBasicMaterial color="#d9e7ff" transparent opacity={0.65} />
    </mesh>
  );
}

function Keyboard() {
  return (
    <group position={[0, 0.44, 0.74]} rotation={[-0.1, 0, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.85, 0.12, 1.28]} />
        <meshStandardMaterial color="#303842" metalness={0.48} roughness={0.42} />
      </mesh>
      {KEYS.map((key, index) => (
        <mesh key={index} position={[key.x, 0.08, key.z]}>
          <boxGeometry args={[0.2, 0.04, 0.21]} />
          <meshStandardMaterial
            color={index % 11 === 0 ? "#b8d3ff" : "#1f2630"}
            emissive={index % 11 === 0 ? "#365b9e" : "#000000"}
            emissiveIntensity={0.45}
            roughness={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function DeskEnvironment() {
  const scene = useRef<Group>(null);

  useFrame(({ camera, pointer }, delta) => {
    camera.position.x = MathUtils.damp(camera.position.x, pointer.x * 0.65, 2.8, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 3.05 + pointer.y * 0.38, 2.8, delta);
    camera.lookAt(pointer.x * 0.17, 0.82 + pointer.y * 0.08, 0);
    if (scene.current)
      scene.current.rotation.y = MathUtils.damp(
        scene.current.rotation.y,
        pointer.x * -0.09,
        2.6,
        delta
      );
  });

  return (
    <group ref={scene} position={[0, -0.8, 0]}>
      <mesh receiveShadow position={[0, -0.03, 0]}>
        <boxGeometry args={[9.4, 0.13, 5.4]} />
        <meshStandardMaterial color="#10161e" roughness={0.95} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.47, 0]}>
        <boxGeometry args={[7.1, 0.27, 2.9]} />
        <meshStandardMaterial color="#28313b" metalness={0.67} roughness={0.28} />
      </mesh>
      {[-3.1, 3.1]
        .flatMap((x) => [-1.1, 1.1].map((z) => [x, z] as const))
        .map(([x, z]) => (
          <mesh castShadow key={`${x}-${z}`} position={[x, -0.45, z]}>
            <boxGeometry args={[0.16, 1.75, 0.16]} />
            <meshStandardMaterial color="#202932" metalness={0.72} roughness={0.25} />
          </mesh>
        ))}

      <group position={[0, 1.98, -0.45]}>
        <mesh castShadow>
          <boxGeometry args={[3.5, 2.15, 0.16]} />
          <meshStandardMaterial color="#1e2731" metalness={0.7} roughness={0.23} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[3.18, 1.78, 0.04]} />
          <meshStandardMaterial
            color="#1e4b9d"
            emissive="#306ddd"
            emissiveIntensity={1.65}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, -1.3, 0]}>
          <boxGeometry args={[0.32, 0.55, 0.18]} />
          <meshStandardMaterial color="#27313b" metalness={0.75} roughness={0.28} />
        </mesh>
        <mesh position={[0, -1.58, 0]}>
          <boxGeometry args={[1.55, 0.12, 0.72]} />
          <meshStandardMaterial color="#27313b" metalness={0.75} roughness={0.28} />
        </mesh>
      </group>

      <Keyboard />
      <mesh castShadow position={[2.3, 0.63, 0.55]}>
        <boxGeometry args={[0.58, 0.16, 0.85]} />
        <meshStandardMaterial color="#d3d9e3" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[-2.62, 0.82, 0.25]}>
        <boxGeometry args={[0.1, 0.65, 0.1]} />
        <meshStandardMaterial color="#d5a576" metalness={0.25} roughness={0.64} />
      </mesh>
      <mesh position={[-2.62, 1.18, 0.25]}>
        <boxGeometry args={[0.75, 0.16, 0.42]} />
        <meshStandardMaterial color="#d5a576" metalness={0.25} roughness={0.64} />
      </mesh>

      {PARTICLES.map((particle) => (
        <FloatingParticle key={particle.join("-")} particle={particle} />
      ))}
    </group>
  );
}

export default function DeskScene() {
  return (
    <Canvas
      camera={{ fov: 37, near: 0.1, far: 100, position: [0, 3.05, 8.8] }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows="basic"
    >
      <ambientLight intensity={1.05} color="#b7c8e2" />
      <directionalLight
        castShadow
        color="#c3d7ff"
        intensity={2.25}
        position={[-4.4, 6.8, 5.2]}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight color="#4f8dff" intensity={18} distance={8.5} position={[0, 2.4, 1]} />
      <pointLight color="#f1b27e" intensity={5} distance={5} position={[-3.4, 2.5, 1]} />
      <DeskEnvironment />
    </Canvas>
  );
}
