/**
 * PROJECT NEXUS // INTERACTION TYPES
 * Responsibility: Declares interface bounds for user mouse, keyboard, and touch interactive structures.
 */

export interface InteractionTarget {
  id: string;
  name: string;
  type: "pedestal" | "brick" | "water-plate" | "monolith";
  activeRange: number; // radius in units
  interactive: boolean;
}

export interface UserInputState {
  isPointerDown: boolean;
  pointerPosition: [number, number];
  keysPressed: Record<string, boolean>;
}
