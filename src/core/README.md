# Core Module (`src/core/`)

## Purpose

The primary bootstrapper, entry point, and frame tick coordinator for the Project Nexus application.

## Responsibilities

- **Application:** Handles the high-level initialization and shutdown lifecycles.
- **Bootstrap:** Coordinates preloader routines, registers configs, and warms up rendering states.
- **Engine:** Schedules system ticks and ties them to the Three.js update loop.
- **Config:** Centralizes global environment, deployment, and feature flag states.

## Dependencies

- `src/store/` (for updating and retrieving global reactive settings)
- React Three Fiber rendering context hooks.

## Future Responsibilities

- Add hooks for automated performance degradation tracking.
- Manage dynamic asset eviction schedules on memory warning thresholds.
