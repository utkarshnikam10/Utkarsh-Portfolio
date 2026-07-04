# Constants Module (`src/constants/`)

## Purpose

Exposes read-only constants and limits. Moving magic numbers here prevents code smell and ensures strict mathematical guidelines (like the Golden Ratio) are unified.

## Responsibilities

- **camera.ts:** Damping bounds and focal length limits.
- **world.ts:** Coordinates of the Tree of Curiosity and district spacing radius.
- **animation.ts:** Transitions timings.
- **audio.ts:** Frequencies (30Hz, 24Hz) and max latencies.
- **performance.ts:** Frametime margins (16.67ms) and memory caps.
