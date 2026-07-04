# World Module (`src/world/`)

## Purpose

Maintains static, spatial models, district meshes, and environmental scenery elements.

## Responsibilities

- **WorldManager:** Handles loading and grouping of the 6 districts and registers the interactive components (sliding slate bricks, deconstruction pedestals).
- **Tree of Curiosity Landmark:** Positions and renders the central visual tree anchor.

## Dependencies

- `src/store/` (for switching visible districts dynamically)
- Three.js geometries and lightmaps.

## Future Responsibilities

- Bake lightmaps for final high-fidelity meshes.
- Implement custom vertex shaders for the crystalline foliage.
