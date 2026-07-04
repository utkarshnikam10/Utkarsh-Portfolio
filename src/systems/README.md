# Systems Module (`src/systems/`)

## Purpose

Contains structural, non-visual operations and controllers that process data or synchronize resources.

## Responsibilities

- **AssetManager:** Coordinates the download and cache orchestration of GLTF geometries, audio layers, and texture profiles. Tracks progress and triggers store updates.

## Dependencies

- `src/store/` (for broadcasting load percentage and ready status)
- Three.js loading managers.

## Future Responsibilities

- Integrate Draco decoder workers.
- Implement progressive streaming queues for high-resolution KTX2 files.
