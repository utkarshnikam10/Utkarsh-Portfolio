"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

/**
 * Camera spline keyframes driven by Lenis Scroll Progress.
 * Structure: { progress, position, lookAt }
 */
const CAM_KEYFRAMES = [
  { progress: 0.0, pos: [2.4, 1.6, 5.8], look: [-1.2, 1.25, -2.5] }, // Opening Scene
  { progress: 0.125, pos: [2.4, 1.6, 5.8], look: [-1.2, 1.25, -2.5] }, // Start of About
  { progress: 0.25, pos: [1.8, 1.6, 5.2], look: [-0.8, 1.15, -2.0] }, // Journey Node
  { progress: 0.375, pos: [0.0, 1.8, 1.8], look: [0.0, 1.25, -2.0] }, // Projects Node
  { progress: 0.5, pos: [-1.8, 1.5, 1.4], look: [2.2, 1.2, -1.0] }, // Skills Node
  { progress: 0.625, pos: [0.0, 4.0, 2.5], look: [0.0, 1.0, -1.5] }, // Process Node
  { progress: 0.75, pos: [0.0, 2.2, 6.5], look: [0.0, 1.2, 0.0] }, // Vision Node
  { progress: 0.875, pos: [0.5, 2.0, 8.5], look: [0.0, 1.8, -12.0] }, // Tree/Monolith Reveal
  { progress: 1.0, pos: [0.0, 1.4, 3.2], look: [0.0, 1.4, 0.0] }, // Contact Monolith
];

/**
 * PROJECT NEXUS // CAMERA ENGINE (SCROLL DRIVEN)
 * Responsibility: Governs camera movements by interpolating along keyframes
 * mapped to Lenis scroll progress. Adds natural handheld breathing.
 */
export function CameraManager() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeDistrict = useStore((state) => state.activeDistrict);

  // Refs to cache lookAt and position targets for smooth interpolation
  const currentCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));
  const isFirstFrame = useRef(true);

  useEffect(() => {
    void activeDistrict;
  }, [activeDistrict]);

  /**
   * Per-frame camera update loop.
   * Interpolates position/target based on scrollProgress from Zustand.
   */
  useFrame((rootState, delta) => {
    const cam = rootState.camera;
    const elapsed = rootState.clock.getElapsedTime();

    // 1. First-frame fallback initialization
    if (isFirstFrame.current) {
      isFirstFrame.current = false;
      const initialFrame = CAM_KEYFRAMES[0];
      cam.position.set(initialFrame.pos[0], initialFrame.pos[1], initialFrame.pos[2]);
      currentCameraLookAt.current.set(
        initialFrame.look[0],
        initialFrame.look[1],
        initialFrame.look[2]
      );
      cam.lookAt(currentCameraLookAt.current);
    }

    // 2. Continuous Subtle Handheld Camera Sway (Cinematic breathing)
    const swayX = Math.sin(elapsed * 0.45) * 0.04;
    const swayY = Math.cos(elapsed * 0.35) * 0.03;
    const swayZ = Math.sin(elapsed * 0.25) * 0.035;

    const swayLookX = Math.sin(elapsed * 0.35) * 0.015;
    const swayLookY = Math.cos(elapsed * 0.4) * 0.012;

    // 3. Find keyframes bracketing the current scroll progress
    let idx = 0;
    for (let i = 0; i < CAM_KEYFRAMES.length - 1; i++) {
      if (
        scrollProgress >= CAM_KEYFRAMES[i].progress &&
        scrollProgress <= CAM_KEYFRAMES[i + 1].progress
      ) {
        idx = i;
        break;
      }
    }
    const k1 = CAM_KEYFRAMES[idx];
    const k2 = CAM_KEYFRAMES[idx + 1];

    // Compute interpolation weight
    const range = k2.progress - k1.progress;
    const factor = range > 0 ? (scrollProgress - k1.progress) / range : 0;

    // Apply smooth cubic Hermite easing to the interpolation factor
    const smoothedFactor = factor * factor * (3.0 - 2.0 * factor);

    // 4. Interpolate position and look targets
    const targetPos = new THREE.Vector3()
      .fromArray(k1.pos)
      .lerp(new THREE.Vector3().fromArray(k2.pos), smoothedFactor);
    const targetLook = new THREE.Vector3()
      .fromArray(k1.look)
      .lerp(new THREE.Vector3().fromArray(k2.look), smoothedFactor);

    // Apply sways
    targetPos.x += swayX;
    targetPos.y += swayY;
    targetPos.z += swayZ;

    targetLook.x += swayLookX;
    targetLook.y += swayLookY;

    // 5. Smoothly ease to the target positions to eliminate scroll stutter
    cam.position.lerp(targetPos, 2.5 * delta);
    currentCameraLookAt.current.lerp(targetLook, 2.5 * delta);
    cam.lookAt(currentCameraLookAt.current);
  });

  return null;
}

export default CameraManager;
