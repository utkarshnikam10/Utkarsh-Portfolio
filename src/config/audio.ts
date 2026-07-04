import { AudioLayer } from "@/types/audio";

/**
 * PROJECT NEXUS // AUDIO CONFIGURATION
 * Responsibility: Declares asset references and target volumes for the sound engine layers.
 */

export const MASTER_GAIN_LIMIT = 1.0;
export const INSPECTION_ATTENUATION_DECIBELS = -12; // Drop env volumes by 12dB during code inspection

export const AUDIO_ASSET_LAYERS: Record<string, AudioLayer> = {
  "facility-hum": {
    id: "facility-hum",
    src: "/audio/ambient_hum_30hz.mp3",
    type: "ambient-drone",
    volume: 0.5,
    loop: true,
  },
  "wind-loop": {
    id: "wind-loop",
    src: "/audio/mountain_wind.mp3",
    type: "environmental-effect",
    volume: 0.3,
    loop: true,
    positional: true,
  },
  "rain-loop": {
    id: "rain-loop",
    src: "/audio/evening_rain.mp3",
    type: "environmental-effect",
    volume: 0.2,
    loop: true,
  },
  "choral-score": {
    id: "choral-score",
    src: "/audio/choral_resonance.mp3",
    type: "score-instrument",
    volume: 0.4,
    loop: true,
  },
};
