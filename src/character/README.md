# Character Module (`src/character/`)

## Purpose

Manages character representation, skeletal rigging, and walk/idle animation states.

## Responsibilities

- **CharacterManager:** Loads the stylized young engineer mesh and plays/blends skeletal movement states.

## Dependencies

- `src/store/` (for playing the guide's state changes)
- Three.js `AnimationMixer` and keyframes.

## Future Responsibilities

- Integrate the holographic notebook accessory which projects structural project specs.
- Setup target position path tracking synchronized with the camera paths.
