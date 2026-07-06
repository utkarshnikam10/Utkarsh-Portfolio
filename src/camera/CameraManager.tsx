"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

/**
 * PROJECT NEXUS // CAMERA ENGINE (OBJECT DRIVEN WITH PARALLAX)
 * Responsibility: Governs camera movements by interpolating between landing view
 * and focused object target compositions. Adds continuous inertial mouse parallax
 * and natural handheld sways.
 */
export function CameraManager() {
  const focusedObject = useStore((state) => state.focusedObject);
  const activeDistrict = useStore((state) => state.activeDistrict);

  // Refs to cache lookAt and position targets for smooth interpolation
  const currentCameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3(-1.2, 1.25, -2.5));
  const isFirstFrame = useRef(true);

  // Mouse coordinate tracker for parallax depth
  const mousePos = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    void activeDistrict;
  }, [activeDistrict]);

  // Global cursor tracker
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // -1 to 1
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

    // 3. Inertial Mouse Parallax Interpolation (ease the parallax drift)
    // Interpolate parallax offset to prevent instant snaps when mouse moves fast
    currentParallax.current.x = THREE.MathUtils.lerp(
      currentParallax.current.x,
      mousePos.current.x * 0.15,
      2.5 * delta
    );
    currentParallax.current.y = THREE.MathUtils.lerp(
      currentParallax.current.y,
      mousePos.current.y * 0.1,
      2.5 * delta
    );

    // 4. Define target position and look targets based on focused state
    const targetPos = new THREE.Vector3();
    const targetLook = new THREE.Vector3();

    if (focusedObject === "library") {
      // Focus on Library (📚 About) pedestal
      targetPos.set(-3.1, 1.4, -0.2);
      targetLook.set(-2.5, 1.0, -1.0);
    } else if (focusedObject === "workshop") {
      // Focus on Workshop (⚙️ Projects) pedestal
      targetPos.set(1.9, 1.4, -0.2);
      targetLook.set(2.5, 1.0, -1.0);
    } else if (focusedObject === "tree") {
      // Focus on Tree (🌳 Philosophy) pedestal
      targetPos.set(-0.6, 1.5, -3.7);
      targetLook.set(0.0, 1.0, -4.5);
    } else if (focusedObject === "mailbox") {
      // Focus on Mailbox (📬 Contact) pedestal
      targetPos.set(1.9, 1.3, 3.3);
      targetLook.set(2.5, 1.0, 2.5);
    } else {
      // Landing Wide: Frames the Guide standing on the left and the landscape
      targetPos.set(2.4, 1.6, 5.8);
      targetLook.set(-1.2, 1.25, -2.5);
    }

    // Apply sways and mouse parallax
    targetPos.x += swayX + currentParallax.current.x;
    targetPos.y += swayY + currentParallax.current.y;
    targetPos.z += swayZ;

    targetLook.x += swayLookX + currentParallax.current.x;
    targetLook.y += swayLookY + currentParallax.current.y;

    // 5. Smoothly ease to the target positions to create cinematic transitions
    // We use a low lerp factor (2.0) to give it a heavy, slow, premium feel.
    cam.position.lerp(targetPos, 2.0 * delta);
    currentCameraLookAt.current.lerp(targetLook, 2.0 * delta);
    cam.lookAt(currentCameraLookAt.current);
  });

  return null;
}

export default CameraManager;
