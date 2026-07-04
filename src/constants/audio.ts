/**
 * PROJECT NEXUS // AUDIO ENGINE CONSTANTS
 * Responsibility: Stores frequencies, decay timings, and gain limits.
 */

export const SUB_BASS_FREQUENCY_HZ = 30; // base drone frequency
export const LATTICE_CLIMAX_BASS_HZ = 24; // sub-bass audio pulse during climax
export const DAMPING_REVERB_ENCLOSED = 0.4; // 0.4-second window inside Forge
export const DAMPING_REVERB_OPEN = 2.4; // 2.4-second reverberation inside Well

export const AUDIO_FADE_DURATION_MS = 1200;
export const AUDIO_INTERACTION_LATENCY_MAX_MS = 16; // strict 16ms tactile audio response
export const AUDIO_HEARTBEAT_BPM = 60; // 60 beats per minute loop in Threshold
