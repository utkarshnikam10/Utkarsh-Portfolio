"use client";

import React, { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import * as THREE from "three";
import { GravitationalLensingMaterial } from "../shaders/GravitationalLensing";

/**
 * Kerr Black Hole with Gravitational Lensing
 *
 * Renders the main scene into an FBO, then applies the gravitational
 * lensing distortion shader as a full-screen post-process quad.
 * Surrounds the singularity with 50,000 spinning accretion disk particles.
 */

const ACCRETION_PARTICLE_COUNT = 50000;

function AccretionDisk() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, velocities } = useMemo(() => {
    const pos = new Float32Array(ACCRETION_PARTICLE_COUNT * 3);
    const col = new Float32Array(ACCRETION_PARTICLE_COUNT * 3);
    const vel = new Float32Array(ACCRETION_PARTICLE_COUNT);

    for (let i = 0; i < ACCRETION_PARTICLE_COUNT; i++) {
      // Distribute in a flat disk with random radius
      const r = 0.8 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 0.15;

      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * r;

      // Angular velocity (inner particles orbit faster — Kepler)
      vel[i] = 1.0 / Math.sqrt(r);

      // Base warm color
      col[i * 3] = 0.9 + Math.random() * 0.1;
      col[i * 3 + 1] = 0.4 + Math.random() * 0.3;
      col[i * 3 + 2] = 0.1 + Math.random() * 0.2;
    }

    return { positions: pos, colors: col, velocities: vel };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.getElapsedTime();
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const colAttr = pointsRef.current.geometry.getAttribute("color");
    const camPos = state.camera.position;

    for (let i = 0; i < ACCRETION_PARTICLE_COUNT; i += 8) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const r = Math.sqrt(x * x + z * z);
      if (r < 0.001 || !isFinite(r)) continue;
      const currentAngle = Math.atan2(z, x);

      // Orbital rotation
      const newAngle = currentAngle + velocities[i] * 0.01;
      posAttr.setX(i, Math.cos(newAngle) * r);
      posAttr.setZ(i, Math.sin(newAngle) * r);

      // Doppler shift coloring based on velocity toward/away from camera
      const vx = -Math.sin(newAngle) * velocities[i];
      const vz = Math.cos(newAngle) * velocities[i];
      const toCamX = camPos.x - posAttr.getX(i);
      const toCamZ = camPos.z - posAttr.getZ(i);
      const toCamLen = Math.sqrt(toCamX * toCamX + toCamZ * toCamZ) || 1;
      const radialVelocity = (vx * toCamX + vz * toCamZ) / toCamLen;

      // Blue-shifted approaching, red-shifted receding
      const doppler = Math.tanh(radialVelocity * 3.0);
      colAttr.setXYZ(
        i,
        0.9 - doppler * 0.4,  // R: higher when receding
        0.5 + doppler * 0.2,  // G: neutral
        0.2 + doppler * 0.6   // B: higher when approaching
      );
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface BlackHoleProps {
  position?: [number, number, number];
  visible?: boolean;
}

export function BlackHoleLensing({ position = [0, 0, -15], visible = true }: BlackHoleProps) {
  const lensQuadRef = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();

  const lensMaterial = useMemo(() => {
    const mat = new GravitationalLensingMaterial();
    mat.transparent = true;
    mat.depthWrite = false;
    return mat;
  }, []);

  // FBO to capture the scene for post-process distortion
  const sceneFBO = useFBO(1024, 1024);

  useFrame((state) => {
    const { gl, scene, camera } = state;

    // Hide the lens quad while rendering the scene into FBO
    if (lensQuadRef.current) lensQuadRef.current.visible = false;

    gl.setRenderTarget(sceneFBO);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    if (lensQuadRef.current) lensQuadRef.current.visible = visible;

    // Update shader uniforms
    lensMaterial.uTexture = sceneFBO.texture;
    lensMaterial.uTime = state.clock.getElapsedTime();
    lensMaterial.uResolution = new THREE.Vector2(viewport.width, viewport.height);

    // Singularity follows pointer subtly
    lensMaterial.uSingularity = new THREE.Vector2(
      0.5 + pointer.x * 0.05,
      0.5 + pointer.y * 0.05
    );
  });

  // Cleanup
  React.useEffect(() => {
    return () => {
      sceneFBO.dispose();
      lensMaterial.dispose();
    };
  }, [sceneFBO, lensMaterial]);

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Accretion Disk — 50,000 Doppler-shifting particles */}
      <AccretionDisk />

      {/* Event Horizon Sphere */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Gravitational Lensing Post-Process Quad */}
      <mesh ref={lensQuadRef} position={[0, 0, 5]} material={lensMaterial}>
        <planeGeometry args={[viewport.width, viewport.height]} />
      </mesh>
    </group>
  );
}
