/**
 * PROJECT NEXUS // SCENE TYPES
 * Responsibility: Declares interface and type structures for global lighting,
 * sky gradients, fog parameters, and rendering configurations.
 */

export interface LightProfile {
  color: string;
  intensity: number;
  temperature: number; // in Kelvin
  position?: [number, number, number];
}

export interface FogConfig {
  color: string;
  density: number;
  near: number;
  far: number;
}
