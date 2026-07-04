"use client";

import React, { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { EventBus } from "@/core/EventBus";
import Environment from "@/rendering/Environment";
import LightingSystem from "@/rendering/LightingSystem";
import PostProcess from "@/rendering/PostProcess";

/**
 * PROJECT NEXUS // SCENE MANAGER
 * Responsibility: Creates and manages the root Three.js scene graph. Provides a
 * slot-based registration system for organizational groups within the scene.
 *
 * Scene slots:
 *   "environment"  — Sky, fog, ground plane (Environment component)
 *   "lighting"     — All light sources (LightingSystem component)
 *   "world"        — District geometries and landmarks
 *   "character"    — Guide Character group
 *   "effects"      — Post-processing and particle systems
 *
 * Events emitted:
 *   "scene:ready"    — Root scene graph is mounted and ready
 *   "scene:teardown" — Scene is being unmounted
 *   "scene:district" — { district } when active district changes
 *
 * Extension point: Register new scene nodes via the slot system.
 */

export type SceneSlot = "environment" | "lighting" | "world" | "character" | "effects";

export function SceneManager() {
  const activeDistrict = useStore((state) => state.activeDistrict);

  useEffect(() => {
    EventBus.emit("scene:ready");
    return () => {
      EventBus.emit("scene:teardown");
    };
  }, []);

  useEffect(() => {
    EventBus.emit("scene:district", { district: activeDistrict });
  }, [activeDistrict]);

  return (
    <group name="scene-root">
      {/* Slot: Environment — sky dome, fog, ground plane */}
      <group name="slot-environment">
        <Environment />
      </group>

      {/* Slot: Lighting — ambient, directional, hemisphere lights */}
      <group name="slot-lighting">
        <LightingSystem />
      </group>

      {/* Slot: World — district geometries injected by WorldManager */}
      <group name="slot-world" />

      {/* Slot: Character — Guide Character injected by CharacterManager */}
      <group name="slot-character" />

      {/* Slot: Effects — post-processing and VFX */}
      <group name="slot-effects">
        <PostProcess activeDistrict={activeDistrict} />
      </group>
    </group>
  );
}

export default SceneManager;
