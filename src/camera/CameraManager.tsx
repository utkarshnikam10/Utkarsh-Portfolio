"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

/**
 * PROJECT NEXUS // CAMERA ENGINE (OBJECT DRIVEN)
 * Responsibility: Governs camera movements by interpolating between landing view
 * and focused object target compositions. Adds natural handheld sways.
 */
export function CameraManager() {
  const focusedObject = useStore((state) => state.focusedObject);
  const activeDistrict = useStore((state) => state.activeDistrict);

  // Refs to cache lookAt and position targets for smooth interpolation
  const currentCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(-1.2, 1.25, -2.5));
  const isFirstFrame = useRef(true);

  useEffect(() => {
    void activeDistrict;
  }, [activeDistrict]);

  /**
   * Per-frame camera update loop.
   */
  useFrame((rootState, delta) => {
    const cam = rootState.camera;
    const elapsed = rootState.clock.getElapsedTime();

    // 1. First-frame fallback initialization
    if (isFirstFrame.current) {
      isFirstFrame.current = false;
      cam.position.set(2.4, 1.6, 5.8);
      currentCameraLookAt.current.set(-1.2, 1.25, -2.5);
      cam.lookAt(currentCameraLookAt.current);
    }

    // 2. Continuous Subtle Handheld Camera Sway (Cinematic breathing)
    const swayX = Math.sin(elapsed * 0.45) * 0.04;
    const swayY = Math.cos(elapsed * 0.35) * 0.03;
    const swayZ = Math.sin(elapsed * 0.25) * 0.035;

    const swayLookX = Math.sin(elapsed * 0.35) * 0.015;
    const swayLookY = Math.cos(elapsed * 0.4) * 0.012;

    // 3. Define target position and look targets based on focused state
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (focusedObject === "workshop") {
      // Direct focus on the projects pedestal: over-the-shoulder framing
      targetPos.set(1.9, 1.4, -0.2);
      targetLook.set(2.5, 1.0, -1.0);
    } else {
      // Landing Wide: Frames the Guide standing on the left and the landscape
      targetPos.set(2.4, 1.6, 5.8);
      targetLook.set(-1.2, 1.25, -2.5);
    }

    // Apply handheld sways
    targetPos.x += swayX;
    targetPos.y += swayY;
    targetPos.z += swayZ;

    targetLook.x += swayLookX;
    targetLook.y += swayLookY;

    // 4. Smoothly ease to the target positions to create cinematic transitions
    // We use a low lerp factor (2.0) to give it a heavy, slow, premium feel.
    cam.position.lerp(targetPos, 2.0 * delta);
    currentCameraLookAt.current.lerp(targetLook, 2.0 * delta);
    cam.lookAt(currentCameraLookAt.current);
  });

  return null;
}

export default CameraManager;
