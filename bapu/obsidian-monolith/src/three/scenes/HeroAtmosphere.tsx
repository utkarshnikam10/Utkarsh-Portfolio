/* eslint-disable */
"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { createGlassMaterial } from "../materials/GlassMaterial";

export function HeroAtmosphere() {
  const { camera, pointer } = useThree();
  const monolithRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const cameraOrbit = useRef({ x: 0, y: 0 });

  // 1,500 slow-floating ambient architectural dust particles with subtle brownian motion
  const [{ positions, velocities }] = useState(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = Math.random() * 0.008 + 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return { positions: pos, velocities: vel };
  });

  const glassMaterial = useMemo(() => {
    return createGlassMaterial({
      color: new THREE.Color("#08080c"),
      transmission: 0.98,
      roughness: 0.04,
      ior: 1.52,
      thickness: 1.6,
      dispersion: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.03,
    });
  }, []);

  useFrame((state, delta) => {
    // Slow weightless spring-damped camera orbit driven gently by subtle cursor drift
    cameraOrbit.current.x = THREE.MathUtils.lerp(
      cameraOrbit.current.x,
      pointer.x * 0.5,
      0.02
    );
    cameraOrbit.current.y = THREE.MathUtils.lerp(
      cameraOrbit.current.y,
      pointer.y * 0.3,
      0.02
    );

    camera.position.x = cameraOrbit.current.x;
    camera.position.y = cameraOrbit.current.y;
    camera.lookAt(0, 0, 0);

    // Monolith slow rotation
    if (monolithRef.current) {
      monolithRef.current.rotation.y += delta * 0.12;
      monolithRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    }

    // Particle brownian motion drift
    if (particlesRef.current) {
      const geom = particlesRef.current.geometry;
      const posAttr = geom.getAttribute("position");

      for (let i = 0; i < 1500; i++) {
        let py = posAttr.getY(i) + velocities[i * 3 + 1];
        if (py > 12) py = -12;
        posAttr.setY(i, py);

        const px = posAttr.getX(i) + Math.sin(state.clock.getElapsedTime() + i) * 0.001;
        posAttr.setX(i, px);
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Volumetric Depth Fog */}
      <fogExp2 attach="fog" args={["#040406", 0.025]} />

      {/* Soft Cinematic Spot Lighting */}
      <spotLight
        position={[4, 8, 6]}
        angle={0.5}
        penumbra={0.9}
        intensity={3.5}
        color="#ffffff"
        castShadow
      />
      <ambientLight intensity={0.08} color="#080a10" />

      {/* Floating Central Obsidian Monolith */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={monolithRef} position={[0, 0, 0]} material={glassMaterial}>
          <octahedronGeometry args={[1.5, 2]} />
        </mesh>
      </Float>

      {/* Architectural Dust Particulate Field */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#6e6e73"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
