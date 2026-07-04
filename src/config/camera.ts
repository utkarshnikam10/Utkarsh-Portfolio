import { CameraRailConfig, CameraMode } from "@/types/camera";

/**
 * PROJECT NEXUS // CAMERA SYSTEM CONFIGURATION
 * Responsibility: Stores initial values and district-specific camera specifications.
 */

export const DISTRICT_CAMERA_CONFIGS: Record<CameraMode, CameraRailConfig> = {
  "isometric-lock": {
    fov: 45,
    lensFocalLength: 45,
    defaultDistance: 8.5,
    minDistance: 8.5,
    maxDistance: 8.5,
    transitionDuration: 3500,
    viewportAltitude: 3.5,
    pitchClamp: 45,
  },
  "crane-pan": {
    fov: 90, // expands from 45 to 90
    lensFocalLength: 35,
    defaultDistance: 22.0,
    minDistance: 4.0,
    maxDistance: 22.0,
    transitionDuration: 3500,
    viewportAltitude: 0.5,
    pitchClamp: 15,
  },
  "blueprint-track": {
    fov: 60,
    lensFocalLength: 50,
    defaultDistance: 6.0,
    minDistance: 6.0,
    maxDistance: 6.0,
    transitionDuration: 2000,
    viewportAltitude: 0.0,
    pitchClamp: 0,
  },
  "endless-fly": {
    fov: 110,
    lensFocalLength: 24,
    defaultDistance: 12.0,
    minDistance: 3.0,
    maxDistance: 12.0,
    transitionDuration: 2500,
    viewportAltitude: 2.5,
    pitchClamp: 30,
  },
  "dolly-track": {
    fov: 50,
    lensFocalLength: 50,
    defaultDistance: 7.5,
    minDistance: 7.5,
    maxDistance: 7.5,
    transitionDuration: 3000,
    viewportAltitude: 1.6,
    pitchClamp: 0,
  },
  "telephoto-lock": {
    fov: 35,
    lensFocalLength: 85,
    defaultDistance: 2.2,
    minDistance: 2.2,
    maxDistance: 2.2,
    transitionDuration: 1500,
    viewportAltitude: 1.2,
    pitchClamp: 15,
  },
};
