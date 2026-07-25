"use client";

import { wrapEffect } from "@react-three/postprocessing";
import { FluidRippleEffect } from "./FluidRipplePass";

/**
 * FluidRipple — wrapped postprocessing Effect component for R3F EffectComposer.
 */
export const FluidRipple = wrapEffect(FluidRippleEffect);
