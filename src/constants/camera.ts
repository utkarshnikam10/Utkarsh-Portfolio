/**
 * PROJECT NEXUS // CAMERA CONSTANTS
 * Responsibility: Stores mathematical limits and coordinate offsets for camera rails.
 */

export const CAMERA_SPRING_DAMPING = 15;
export const CAMERA_SPRING_STIFFNESS = 100;

export const DEFAULT_CAMERA_ALTITUDE = 1.6; // average eye-level height in units
export const CAMERA_COLLISION_OFFSET = 0.5; // buffer distance away from mesh walls
export const MIN_FOCAL_LENGTH_MM = 18;
export const MAX_FOCAL_LENGTH_MM = 135;
export const ISOMETRIC_CAMERA_ANGLE = Math.PI / 4; // 45 degrees
