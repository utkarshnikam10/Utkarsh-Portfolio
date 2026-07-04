# Config Module (`src/config/`)

## Purpose

Aggregates key system runtime configurations and parameters. This module stores initial values only and contains no runtime logic.

## Responsibilities

- **camera.ts:** District-specific camera configurations (lens, distance, transition timelines).
- **world.ts:** Geographic coordinates and story metadata for each of the 6 zones.
- **audio.ts:** Static mappings of audio files and initial volume/gain settings.
- **performance.ts:** Limits and settings optimized for mobile and desktop runtimes.
- **rendering.ts:** Basic parameters for Three.js WebGL canvas context creation.
- **lighting.ts:** Color temperature settings for each brutalist district.

## Dependencies

- `src/types/` (for strict schema validation)
