"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useStore, ActiveDistrict } from "@/store/useStore";

/**
 * PROJECT NEXUS // LIGHTING SYSTEM
 * Responsibility: Production-ready lighting architecture supporting ambient,
 * directional, and environment-based illumination. Provides a typed configuration
 * system per district for future artistic lighting.
 *
 * Light layers:
 *   - Ambient:      Global fill light (scene-wide base illumination)
 *   - Directional:  Primary key light with shadow casting
 *   - Hemisphere:    Sky/ground color blending for natural fill
 *   - Environment:   HDRI-based image lighting (slot for future Sprint)
 *
 * Future support:
 *   - Volumetric fog lights (via custom shaders)
 *   - Baked lightmaps (loaded as textures per district)
 *   - Point lights for interactive nodes
 *   - Rect area lights for the Kinetic Forge Pavilion glass walls
 *
 * No artistic lighting in this sprint — structural foundation only.
 */

// ─────────────────────── Configuration ───────────────────────

interface LightingConfig {
  /** Ambient light intensity (0–1) */
  ambientIntensity: number;
  /** Ambient light color */
  ambientColor: string;
  /** Directional key light intensity */
  keyIntensity: number;
  /** Directional key light color */
  keyColor: string;
  /** Directional key light position */
  keyPosition: [number, number, number];
  /** Hemisphere sky color */
  hemiSkyColor: string;
  /** Hemisphere ground color */
  hemiGroundColor: string;
  /** Hemisphere intensity */
  hemiIntensity: number;
  /** Shadow map resolution (width & height) */
  shadowMapSize: number;
  /** Shadow camera frustum bounds */
  shadowBounds: number;
}

/**
 * Default lighting configuration — neutral studio lighting.
 * Future sprints will define per-district overrides.
 */
const DEFAULT_LIGHTING: LightingConfig = {
  ambientIntensity: 0.6,
  ambientColor: "#e8e4df",
  keyIntensity: 1.8,
  keyColor: "#ffffff",
  keyPosition: [10, 20, 10],
  hemiSkyColor: "#b8c4e0",
  hemiGroundColor: "#1a1820",
  hemiIntensity: 0.5,
  shadowMapSize: 2048,
  shadowBounds: 25,
};

/**
 * Per-district lighting overrides (color temperatures from the World Bible).
 * Currently all return defaults — values will be tuned in Sprint 4+ when
 * district geometries exist to receive light.
 */
const DISTRICT_LIGHTING: Record<ActiveDistrict, Partial<LightingConfig>> = {
  "well-vault": {
    // Warm Golden Hour morning sun
    ambientColor: "#dfd2bc",
    ambientIntensity: 0.8,
    keyColor: "#ffdfa0",
    keyIntensity: 2.6,
    keyPosition: [18, 7, 14], // lower angle for long shadows
    hemiSkyColor: "#424d6b",
    hemiGroundColor: "#1d1814",
    hemiIntensity: 0.65,
  },
  "horizon-bridge": {
    // Neutral transition lighting
    ambientIntensity: 0.1,
  },
  "kinetic-forge": {
    // 5500K Neutral White Daylight
    ambientColor: "#ffffff",
    keyColor: "#f5f5f5",
    keyIntensity: 0.55,
  },
  "lattice-matrix": {
    // Golden/White Vector Line Emission
    ambientColor: "#ffd700",
    ambientIntensity: 0.05,
    keyIntensity: 0.2,
  },
  "travertine-terrace": {
    // 3200K Golden Sunset Glow
    ambientColor: "#ffc078",
    keyColor: "#ffb347",
    keyIntensity: 0.45,
  },
  "root-vault": {
    // 2700K Warm Amber Cathode Glow
    ambientColor: "#ff8c42",
    ambientIntensity: 0.08,
    keyColor: "#ffa64d",
    keyIntensity: 0.3,
  },
};

/**
 * Resolves the lighting config for a district by merging defaults with overrides.
 */
function resolveLightingConfig(district: ActiveDistrict): LightingConfig {
  return { ...DEFAULT_LIGHTING, ...DISTRICT_LIGHTING[district] };
}

// ─────────────────────── Component ───────────────────────

export function LightingSystem() {
  const activeDistrict = useStore((state) => state.activeDistrict);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  const config = resolveLightingConfig(activeDistrict);

  return (
    <group name="lighting-system">
      {/* Layer 1: Ambient — global fill light */}
      <ambientLight
        name="light-ambient"
        intensity={config.ambientIntensity}
        color={config.ambientColor}
      />

      {/* Layer 2: Hemisphere — sky/ground color blending */}
      <hemisphereLight
        name="light-hemisphere"
        args={[config.hemiSkyColor, config.hemiGroundColor, config.hemiIntensity]}
        position={[0, 50, 0]}
      />

      {/* Layer 3: Directional — primary key light with shadows */}
      <directionalLight
        ref={directionalLightRef}
        name="light-key"
        intensity={config.keyIntensity}
        color={config.keyColor}
        position={config.keyPosition}
        castShadow
        shadow-mapSize-width={config.shadowMapSize}
        shadow-mapSize-height={config.shadowMapSize}
        shadow-camera-near={0.5}
        shadow-camera-far={100}
        shadow-camera-left={-config.shadowBounds}
        shadow-camera-right={config.shadowBounds}
        shadow-camera-top={config.shadowBounds}
        shadow-camera-bottom={-config.shadowBounds}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/*
        Layer 4: Environment Light (HDRI-based)
        Sprint 3B+: Apply loaded HDRI texture as scene.environment
        for physically-based image lighting

        Layer 5: Volumetric Fog Lights
        Sprint 5+: Custom volumetric shader pass

        Layer 6: Baked Lightmaps
        Sprint 4+: Per-district lightmap textures applied to geometry materials
      */}
    </group>
  );
}

export default LightingSystem;
