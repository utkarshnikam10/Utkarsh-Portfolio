/**
 * PROJECT NEXUS // CHARACTER TYPES
 * Responsibility: Declares interface and type structures for skeletal meshes
 * and guide character states.
 */

import { GuideState } from "@/store/useStore";

export interface CharacterSkeletonConfig {
  meshPath: string;
  defaultAnimation: string;
  movementSpeed: number;
}

export interface CharacterTarget {
  position: [number, number, number];
  rotation: [number, number, number];
  state: GuideState;
}
