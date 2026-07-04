# Rendering Module (`src/rendering/`)

## Purpose

Manages environmental lighting layouts, background shaders, color balance, and post-processing effects.

## Responsibilities

- **SceneManager:** Dictates light profiles matching specific color temperatures (4000K, 5500K, 3200K, 2700K).
- **PostProcess:** Set up bloom filters, vignetting, tone-mapping, and defocus depth-of-field rules.

## Dependencies

- `src/store/` (to read active district parameters)
- Three.js standard materials and R3F context bindings.

## Future Responsibilities

- Add custom post-processing shaders for the "Convergence of the Lattice" matrix alignment transition.
- Add performance scaling loops that turn off post-processing layers dynamically on slow frame rates.
