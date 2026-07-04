/**
 * PROJECT NEXUS // MATHEMATICAL UTILITIES
 * Responsibility: Provides math operations, interpolation helpers, and spline calculations.
 * Used for character spline locomotion, guide movement damping, and alignment calculations.
 */

/**
 * Linearly interpolates between two numbers.
 */
export function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

/**
 * Calculates cubic Hermite spline interpolation (spline curves for smooth paths).
 */
export function hermiteSpline(p0: number, p1: number, m0: number, m1: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    (2 * t3 - 3 * t2 + 1) * p0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * p1 + (t3 - t2) * m1
  );
}

/**
 * Damps a value towards a target using framing delta times.
 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
