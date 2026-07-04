"use client";

import type { ActiveDistrict } from "@/store/useStore";

/**
 * PROJECT NEXUS // POST-PROCESSING SCAFFOLD
 * Responsibility: Placeholder for district-specific post-processing effects.
 * Will integrate with @react-three/postprocessing in Sprint 3+.
 *
 * Planned effects per district:
 *   - well-vault:         Subtle bloom, chromatic aberration
 *   - horizon-bridge:     Volumetric fog, depth of field
 *   - kinetic-forge:      Emissive bloom, film grain
 *   - lattice-matrix:     Neon glow, scanlines
 *   - travertine-terrace: Warm color grading, lens flare
 *   - root-vault:         Amber bloom, vignette
 */

interface PostProcessProps {
  activeDistrict: ActiveDistrict;
}

export function PostProcess({ activeDistrict }: PostProcessProps) {
  // Sprint 3: Apply district-specific post-processing effects
  void activeDistrict;
  return null;
}

export default PostProcess;
