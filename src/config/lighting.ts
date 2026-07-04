import { LightProfile } from "@/types/scene";

/**
 * PROJECT NEXUS // LIGHTING HIERARCHY CONFIGURATION
 * Responsibility: Maps lighting parameters matching color temperatures for each district.
 */

export const DISTRICT_LIGHTING: Record<string, LightProfile> = {
  "well-vault": {
    color: "#ffffff",
    intensity: 0.8,
    temperature: 4000, // Diffuse white wash
    position: [0, 10, 0],
  },
  "kinetic-forge": {
    color: "#f5f5f5",
    intensity: 1.2,
    temperature: 5500, // Neutral daylight
    position: [10, 15, 10],
  },
  "lattice-matrix": {
    color: "#ffb000",
    intensity: 0.5,
    temperature: 2000, // Amber vector light lines
    position: [0, 5, 0],
  },
  "travertine-terrace": {
    color: "#ffa700",
    intensity: 1.5,
    temperature: 3200, // Golden hour sunset
    position: [-15, 8, -5],
  },
  "root-vault": {
    color: "#ff5000",
    intensity: 0.6,
    temperature: 2700, // Warm tube cathodes
    position: [0, 2, 0],
  },
};
