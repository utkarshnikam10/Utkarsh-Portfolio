/* eslint-disable */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Kinetic Particle Sandbox Engine
 *
 * Provides:
 * - Primary Beam: Raycast cursor into 3D space, apply radial force impulse
 *   F = (k / r²) * r̂ to GPGPU velocity textures
 * - Time Lock (Spacebar): Freeze uDeltaTime = 0 while maintaining 60 FPS
 *   camera flight around frozen debris
 */

export interface ParticleWeaponState {
  isSandboxActive: boolean;
  isTimeLocked: boolean;
  beamOrigin: THREE.Vector3;
  beamDirection: THREE.Vector3;
  beamHitPoint: THREE.Vector3 | null;
  forceMultiplier: number;
  effectiveDelta: number;
  toggleSandbox: () => void;
}

export function useParticleWeapon(): ParticleWeaponState {
  const { camera, pointer, raycaster } = useThree();
  const [isSandboxActive, setIsSandboxActive] = useState(false);
  const [isTimeLocked, setIsTimeLocked] = useState(false);

  const beamOrigin = useRef(new THREE.Vector3());
  const beamDirection = useRef(new THREE.Vector3());
  const beamHitPoint = useRef<THREE.Vector3 | null>(null);
  const forceMultiplier = useRef(1.0);
  const effectiveDelta = useRef(0);

  const toggleSandbox = useCallback(() => {
    setIsSandboxActive((prev) => !prev);
  }, []);

  // Listen for Spacebar (Time Lock) and E key (Sandbox toggle)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && isSandboxActive) {
        e.preventDefault();
        setIsTimeLocked(true);
      }
      if (e.code === "KeyE") {
        toggleSandbox();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsTimeLocked(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isSandboxActive, toggleSandbox]);

  const zPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const tempHitPoint = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!isSandboxActive) {
      effectiveDelta.current = delta;
      return;
    }

    // Time Lock: freeze particle physics delta while maintaining camera render
    effectiveDelta.current = isTimeLocked ? 0.0 : delta;

    // Raycast cursor into 3D coordinate space
    raycaster.setFromCamera(pointer, camera);

    beamOrigin.current.copy(raycaster.ray.origin);
    beamDirection.current.copy(raycaster.ray.direction);

    // Calculate beam hit point on the Z=0 plane using optimized intersectPlane
    const intersect = raycaster.ray.intersectPlane(zPlane.current, tempHitPoint.current);
    if (intersect) {
      if (!beamHitPoint.current) beamHitPoint.current = new THREE.Vector3();
      beamHitPoint.current.copy(tempHitPoint.current);
    } else {
      beamHitPoint.current = null;
    }

    // Force multiplier ramps during mouse hold
    if (state.pointer.x !== 0 || state.pointer.y !== 0) {
      forceMultiplier.current = THREE.MathUtils.lerp(
        forceMultiplier.current,
        3.0,
        delta * 2.0
      );
    } else {
      forceMultiplier.current = THREE.MathUtils.lerp(
        forceMultiplier.current,
        1.0,
        delta * 4.0
      );
    }
  });

  return {
    isSandboxActive,
    isTimeLocked,
    beamOrigin: beamOrigin.current,
    beamDirection: beamDirection.current,
    beamHitPoint: beamHitPoint.current,
    forceMultiplier: forceMultiplier.current,
    effectiveDelta: effectiveDelta.current,
    toggleSandbox,
  };
}

/**
 * Calculate radial force impulse: F = (k / r²) * r̂
 * Apply to particle velocity arrays
 */
export function applyRadialForce(
  positions: Float32Array,
  velocities: Float32Array,
  hitPoint: THREE.Vector3,
  forceK: number,
  count: number
) {
  const hx = hitPoint.x;
  const hy = hitPoint.y;
  const hz = hitPoint.z;

  for (let i = 0; i < count; i += 4) {
    const px = positions[i * 3];
    const py = positions[i * 3 + 1];
    const pz = positions[i * 3 + 2];

    const dx = px - hx;
    const dy = py - hy;
    const dz = pz - hz;

    const r2 = dx * dx + dy * dy + dz * dz;
    if (r2 < 0.01 || r2 > 25.0) continue;

    const r = Math.sqrt(r2);
    const force = forceK / r2;

    // F = (k / r²) * r̂
    velocities[i * 3] += (dx / r) * force;
    velocities[i * 3 + 1] += (dy / r) * force;
    velocities[i * 3 + 2] += (dz / r) * force;
  }
}
