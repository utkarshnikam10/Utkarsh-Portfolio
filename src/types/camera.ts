/**
 * PROJECT NEXUS // CAMERA TYPES
 * Responsibility: Declares type definitions and interfaces for the camera systems,
 * tracking splines, and camera rails.
 */

export interface CameraRailConfig {
  fov: number;
  lensFocalLength: number; // in mm
  defaultDistance: number;
  minDistance: number;
  maxDistance: number;
  transitionDuration: number; // in ms
  viewportAltitude: number;
  pitchClamp: number;
}

export type CameraMode =
  | "isometric-lock"
  | "crane-pan"
  | "blueprint-track"
  | "endless-fly"
  | "dolly-track"
  | "telephoto-lock";
