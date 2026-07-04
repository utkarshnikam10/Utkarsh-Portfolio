"use client";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { CameraStateMachine, CameraStateConfig } from "@/camera/CameraState";
import { CameraSplinePlayer } from "@/camera/CameraSpline";
import { CharacterController } from "@/character/CharacterController";
import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // CAMERA ENGINE
 * Responsibility: Governs camera movements across the structural districts using a
 * state-based architecture with spline path support for cinematic sequences.
 * Implements an "invisible filmmaker" camera look and feel: calm, smooth, respectful,
 * with no sudden orbits or unnecessary motion.
 *
 * Camera States:
 *   - Intro:   Cinematic locked path (spline-driven)
 *   - Guided:  Tracks the Guide Character along district cinematic rails
 *   - Focus:   Snaps to an interactive node for portfolio inspection
 *   - Free:    User orbit control for detailed viewing
 */
export function CameraManager() {
  const activeDistrict = useStore((state) => state.activeDistrict);
  const pendingStateRef = useRef<CameraStateConfig | null>(CameraStateMachine.getState());

  // Refs to cache lookAt and position targets for smooth interpolation
  const interpolatedLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.5, 0));
  const isFirstFrame = useRef(true);

  /**
   * Subscribe to camera state change events from the EventBus.
   */
  useEffect(() => {
    const handleStateChange = () => {
      pendingStateRef.current = CameraStateMachine.getState();
    };
    EventBus.on("camera:state:change", handleStateChange);

    return () => {
      EventBus.off("camera:state:change", handleStateChange);
    };
  }, []);

  useEffect(() => {
    void activeDistrict;
  }, [activeDistrict]);

  /**
   * Per-frame camera update loop.
   * Priority: Spline playback > Guided/State machine follow
   */
  useFrame((rootState, delta) => {
    const cam = rootState.camera;

    if (isFirstFrame.current) {
      isFirstFrame.current = false;
      // Setup initial camera position
      cam.position.set(0, 2.2, 7);
      cam.lookAt(new THREE.Vector3(0, 1.5, 0));
    }

    // Priority 1: Spline-driven camera (cinematic sequences)
    const splineResult = CameraSplinePlayer.update(delta);
    if (splineResult) {
      cam.position.copy(splineResult.position);
      if (splineResult.lookAt) {
        cam.lookAt(splineResult.lookAt);
      }
      if (splineResult.fov !== null && cam instanceof THREE.PerspectiveCamera) {
        cam.fov = splineResult.fov;
        cam.updateProjectionMatrix();
      }
      return; // Spline takes full control
    }

    const stateConfig = CameraStateMachine.getState();

    const elapsed = rootState.clock.getElapsedTime();

    // Subtle handheld-style breathing (noise / sines)
    const swayX = Math.sin(elapsed * 0.45) * 0.05;
    const swayY = Math.cos(elapsed * 0.35) * 0.035;
    const swayZ = Math.sin(elapsed * 0.25) * 0.04;

    const swayLookX = Math.sin(elapsed * 0.35) * 0.02;
    const swayLookY = Math.cos(elapsed * 0.4) * 0.015;

    // Priority 2: Guided Follow (Invisible Filmmaker)
    if (stateConfig.followsGuide) {
      const charController = CharacterController.getInstance();
      const charPos = charController.getCharacterPosition();
      const followPoint = charController.getCameraFollowPoint();

      // Smoothly interpolate the lookAt target (neck height)
      interpolatedLookAt.current.lerp(followPoint, 1.8 * delta);

      // Filmmaker framing: Place camera slightly behind and to the side of the character
      // Keep a calm, slow tracking movement
      const targetCamPos = new THREE.Vector3();
      targetCamPos.copy(charPos);
      targetCamPos.y += 1.8 + swayY; // Height offset + breathing
      targetCamPos.z += 5.5 + swayZ; // Distance behind + breathing
      targetCamPos.x += 1.2 + swayX; // Over-the-shoulder offset + breathing

      const lookTarget = interpolatedLookAt.current.clone();
      lookTarget.x += swayLookX;
      lookTarget.y += swayLookY;

      cam.position.lerp(targetCamPos, 1.2 * delta); // Slow cinematic ease
      cam.lookAt(lookTarget);
      return;
    }

    // Priority 3: Intro Cinematic Mode (Eye level, Guide on left-third, Tree in distance)
    if (stateConfig.id === "intro") {
      const charController = CharacterController.getInstance();
      const charPos = charController.getCharacterPosition();

      // Eye-level camera, offset to the right, looking slightly left
      // Placing the Guide (at [0, 0, 0]) in the left third, with the path heading
      // to the Tree location (towards Z < 0) visible on the right.
      const introCamPos = new THREE.Vector3(2.4 + swayX, 1.6 + swayY, 5.8 + swayZ);
      const introLookTarget = new THREE.Vector3(
        charPos.x - 1.2 + swayLookX,
        1.2 + swayLookY,
        charPos.z - 2.5
      );

      cam.position.lerp(introCamPos, 1.0 * delta); // Slow ease in
      cam.lookAt(introLookTarget);
      return;
    }

    // Priority 4: Standard State Machine / Fallback Config
    const pending = pendingStateRef.current;
    if (pending) {
      if (cam instanceof THREE.PerspectiveCamera) {
        cam.fov = pending.fov;
        cam.updateProjectionMatrix();
      }
      // Smooth position transitions
      const targetPos = new THREE.Vector3(0, 1.8, pending.distance);
      cam.position.lerp(targetPos, 2.0 * delta);
      cam.lookAt(new THREE.Vector3(0, 1.5, 0));
      pendingStateRef.current = null;
    }
  });

  return null;
}

export default CameraManager;
