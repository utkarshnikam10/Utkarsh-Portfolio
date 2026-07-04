/**
 * PROJECT NEXUS // ANIMATION TYPES
 * Responsibility: Declares animation curves, timeline config, and interpolation states.
 */

export interface EasingCurves {
  power1In: string;
  power1Out: string;
  power1InOut: string;
  power2Out: string;
  customDecompression: string;
}

export interface TransitionState {
  fromDistrict: string;
  toDistrict: string;
  progress: number; // 0 to 1
  isAnimating: boolean;
}
