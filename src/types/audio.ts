/**
 * PROJECT NEXUS // AUDIO TYPES
 * Responsibility: Declares sound structures, positional nodes, and audio filter states.
 */

export type AudioLayerType =
  "ambient-drone" | "environmental-effect" | "score-instrument" | "tactile-feedback";

export interface AudioLayer {
  id: string;
  src: string;
  type: AudioLayerType;
  volume: number;
  loop: boolean;
  positional?: boolean;
}
