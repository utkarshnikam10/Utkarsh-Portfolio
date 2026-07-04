import * as THREE from "three";

/**
 * PROJECT NEXUS // RENDERER CONFIGURATION
 * Responsibility: Provides the typed configuration object for the React Three Fiber
 * Canvas `gl` prop, and a post-mount configurator that applies advanced settings
 * (tone mapping, color management, shadow maps) that cannot be set declaratively.
 *
 * Usage:
 *   <Canvas gl={RENDERER_GL_PROPS} onCreated={configureRenderer}>
 *
 * Extension point: Swap tone mapping or shadow type for district-specific rendering.
 */

/**
 * GL context creation parameters passed to the R3F Canvas.
 */
export const RENDERER_GL_PROPS: THREE.WebGLRendererParameters = {
  antialias: true,
  alpha: false,
  stencil: false,
  depth: true,
  powerPreference: "high-performance",
  logarithmicDepthBuffer: false,
};

/**
 * Configure the WebGL renderer after Canvas creation.
 * Called via <Canvas onCreated={configureRenderer}>.
 */
export function configureRenderer(state: { gl: THREE.WebGLRenderer }): void {
  const { gl } = state;

  // Color management — use sRGB encoding for correct gamma
  gl.outputColorSpace = THREE.SRGBColorSpace;

  // Tone mapping — ACES Filmic for cinematic contrast
  gl.toneMapping = THREE.ACESFilmicToneMapping;
  gl.toneMappingExposure = 1.0;

  // Shadow configuration — PCF soft shadows for quality
  gl.shadowMap.enabled = true;
  gl.shadowMap.type = THREE.PCFSoftShadowMap;

  // Clear color — deep obsidian black matching the Brutalist palette
  gl.setClearColor(new THREE.Color("#0a0a0a"), 1);

  // Performance: pixel ratio is clamped by R3F's `dpr` prop, but enforce ceiling
  gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
