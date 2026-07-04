/**
 * PROJECT NEXUS // PERFORMANCE RULES CONFIGURATION
 * Responsibility: Sets device-specific constraints to optimize client runs.
 */

export const PERFORMANCE_CONFIG = {
  mobile: {
    maxDevicePixelRatio: 1.0,
    enablePostProcessing: false,
    volumetricLighting: false,
    instancedMeshCountLimit: 2500,
  },
  desktop: {
    maxDevicePixelRatio: 2.0,
    enablePostProcessing: true,
    volumetricLighting: true,
    instancedMeshCountLimit: 10000,
  },
  general: {
    dracoDecoderPath: "/draco/",
    meshQuantization: true,
  },
};
