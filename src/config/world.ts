import { DistrictInfo } from "@/types/world";

/**
 * PROJECT NEXUS // WORLD MAP CONFIGURATION
 * Responsibility: Maps layout properties of the 6 districts.
 */

export const DISTRICT_MAP: Record<string, DistrictInfo> = {
  "well-vault": {
    id: "well-vault",
    name: "The Well of Beginnings",
    compassDirection: "north",
    purpose: "Expose foundational computer science theories & academic history.",
    story: "Absorbing core constraints and low-level truths inside a concrete isolation vault.",
  },
  "horizon-bridge": {
    id: "horizon-bridge",
    name: "The Horizon Reveal",
    compassDirection: "center-subterranean", // Transition link
    purpose: "Sensory release and visual transition to the core structures.",
    story: "Walking across an aluminum bridge suspended over a calm obsidian ocean.",
  },
  "kinetic-forge": {
    id: "kinetic-forge",
    name: "The Kinetic Forge",
    compassDirection: "east",
    purpose: "Present major software engineering systems and deployed codebases.",
    story: "Inspecting models that split apart on three axes to show internal API gates.",
  },
  "lattice-matrix": {
    id: "lattice-matrix",
    name: "The Lattice of Systems",
    compassDirection: "west",
    purpose: "Map technical skills and toolchains into an interconnected grid.",
    story:
      "Witnessing 10,000 skill-grid lines snap together in parallax showing first architecture.",
  },
  "travertine-terrace": {
    id: "travertine-terrace",
    name: "The Terrace of Impact",
    compassDirection: "south",
    purpose: "Showcase career milestones, team leadership, and large-scale industrial impact.",
    story: "Walking past Travertine columns casting sunset shadows over a Chronograph Stream.",
  },
  "root-vault": {
    id: "root-vault",
    name: "The Threshold",
    compassDirection: "center-subterranean",
    purpose: "Download resume dossiers and dispatch messages via the Terminal Monolith.",
    story: "Stepping inside a circular granite sanctuary underneath the roots of the Tree.",
  },
};
