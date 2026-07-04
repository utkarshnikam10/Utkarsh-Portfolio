# Camera Module (`src/camera/`)

## Purpose

Orchestrates spline movements, lens characteristics, and transitions focusing on the Guide Character.

## Responsibilities

- **CameraManager:** Computes rail paths, transitions focal lengths/FOV scales, and frames targets dynamically.

## Dependencies

- `src/store/` (for detecting active district changes)
- GSAP (for smooth timeline interpolations)

## Future Responsibilities

- Integrate collision boundaries preventing clipping through concrete and titanium surfaces.
- Implement custom shake/dampening physics on high-altitude view transitions.
