/**
 * PROJECT NEXUS // RENDERING CONFIGURATION
 * Responsibility: Stores target render parameters and GL canvas limits.
 */

export const RENDERING_CONFIG = {
  clearColor: "#0a0a0a",
  alpha: false,
  antialias: true,
  stencil: false,
  depth: true,
  logarithmicDepthBuffer: true,
  powerPreference: "high-performance" as const,
  toneMappingExposure: 1.0,
};
