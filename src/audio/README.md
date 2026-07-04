# Audio Module (`src/audio/`)

## Purpose

Maintains the Web Audio API context and coordinates spatialized ambient and musical score outputs.

## Responsibilities

- **AudioManager:** Connects source nodes, maps panners to 3D targets, and implements dynamic frequency dampening.

## Dependencies

- `src/store/` (for monitoring user interactions that unmute audio)
- Howler.js / Web Audio API node connections.

## Future Responsibilities

- Incorporate low-frequency 30Hz atmospheric loops and the 24Hz sub-bass climax trigger.
- Setup real-time acoustic echo profiles simulating concrete chambers and open-air outlooks.
