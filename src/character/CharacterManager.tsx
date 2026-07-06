"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CharacterController } from "./CharacterController";
import { createMockGuideModel, MockGuideModel } from "./MockGuideModel";
import { useStore } from "@/store/useStore";

/**
 * PROJECT NEXUS // CHARACTER SYSTEM MANAGER
 * Responsibility: Renders and animates the Guide Character (stylized young engineer).
 * Instantiates the procedural skeletal model, hooks it into the CharacterController,
 * and runs the frame update ticks for the animation blending state machine.
 */
export function CharacterManager() {
  const [model] = useState<MockGuideModel>(() => createMockGuideModel());
  const containerRef = useRef<THREE.Group>(null);

  /**
   * Instantiate the mock biped model and register it with the controller.
   */
  useEffect(() => {
    const controller = CharacterController.getInstance();
    controller.initialize(model);

    // Position character in the scene
    controller.setCharacterPosition(new THREE.Vector3(0, 0, 0));

    return () => {
      controller.reset();
    };
  }, [model]);

  const scrollProgress = useStore((state) => state.scrollProgress);

  /**
   * Per-frame character system tick.
   * Updates FSM logic, animation mixes, and procedural look-at.
   */
  useFrame((_state, delta) => {
    CharacterController.getInstance().update(delta, scrollProgress);
  });

  return (
    <group ref={containerRef} name="guide-character-root">
      <primitive object={model.group} />
    </group>
  );
}

export default CharacterManager;
