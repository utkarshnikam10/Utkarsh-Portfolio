/**
 * PROJECT NEXUS // CORE CONFIGURATION
 * Responsibility: Aggregates global application metadata, feature flags,
 * rendering parameters, camera defaults, and deployment paths.
 */
export const CORE_CONFIG = {
  app: {
    name: "PROJECT NEXUS",
    version: "1.0.0-sprint2",
    author: "Lead Architect",
  },
  features: {
    enableAudio: process.env.NEXT_PUBLIC_ENABLE_AUDIO === "true",
    debug: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
    isProduction: process.env.NODE_ENV === "production",
  },
  network: {
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || "",
  },
  rendering: {
    /** Maximum device pixel ratio */
    maxDpr: 2,
    /** Shadow map resolution (width and height) */
    shadowMapSize: 2048,
    /** Default tone mapping exposure */
    toneMappingExposure: 1.0,
    /** Target framerate for performance budgeting */
    targetFps: 60,
    /** Maximum draw calls before performance warning */
    maxDrawCalls: 200,
    /** Maximum triangle budget */
    maxTriangles: 500_000,
  },
  camera: {
    /** Default field of view in degrees */
    defaultFov: 45,
    /** Near clipping plane */
    near: 0.1,
    /** Far clipping plane */
    far: 1000,
    /** Initial camera position */
    initialPosition: [0, 2, 12] as [number, number, number],
  },
  loading: {
    /** Timeout in ms before a loading error is raised */
    assetTimeoutMs: 30_000,
    /** Minimum splash screen display time in ms */
    minSplashDuration: 2_000,
  },
};
