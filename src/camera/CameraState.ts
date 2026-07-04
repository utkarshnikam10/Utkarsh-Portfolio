import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // CAMERA STATE MACHINE
 * Responsibility: Defines the state-based camera architecture supporting four modes:
 *   - Intro:   Cinematic opening sequence (locked, scripted path)
 *   - Guided:  Following the Guide Character along district rails
 *   - Focus:   Locked onto an interactive node (project pedestal, monolith)
 *   - Free:    User-controlled orbit for detailed inspection
 *
 * Each state carries its own configuration constraints (FOV, distance, damping).
 * The CameraManager reads the active state to determine interpolation targets.
 *
 * Events emitted:
 *   "camera:state:change" — { previous, current }
 */

export type CameraStateId = "intro" | "guided" | "focus" | "free";

export interface CameraStateConfig {
  id: CameraStateId;
  /** Field of view in degrees */
  fov: number;
  /** Distance from the target in units */
  distance: number;
  /** Spring damping factor for smooth transitions */
  damping: number;
  /** Whether user input is accepted in this state */
  allowsInput: boolean;
  /** Whether the camera auto-follows the Guide Character */
  followsGuide: boolean;
}

/** Default configurations for each camera state */
const STATE_CONFIGS: Record<CameraStateId, CameraStateConfig> = {
  intro: {
    id: "intro",
    fov: 45,
    distance: 12.0,
    damping: 0.02,
    allowsInput: false,
    followsGuide: false,
  },
  guided: {
    id: "guided",
    fov: 50,
    distance: 8.5,
    damping: 0.05,
    allowsInput: false,
    followsGuide: true,
  },
  focus: {
    id: "focus",
    fov: 35,
    distance: 3.0,
    damping: 0.08,
    allowsInput: false,
    followsGuide: false,
  },
  free: {
    id: "free",
    fov: 60,
    distance: 7.5,
    damping: 0.1,
    allowsInput: true,
    followsGuide: false,
  },
};

class CameraStateMachineImpl {
  private currentStateId: CameraStateId = "intro";
  private previousStateId: CameraStateId | null = null;

  /**
   * Returns the active camera state configuration.
   */
  public getState(): CameraStateConfig {
    return STATE_CONFIGS[this.currentStateId];
  }

  /**
   * Returns the active state id.
   */
  public getStateId(): CameraStateId {
    return this.currentStateId;
  }

  /**
   * Returns the previous state id, or null if no transition has occurred.
   */
  public getPreviousStateId(): CameraStateId | null {
    return this.previousStateId;
  }

  /**
   * Transition to a new camera state. Emits a state change event.
   */
  public transitionTo(stateId: CameraStateId): void {
    if (stateId === this.currentStateId) return;

    this.previousStateId = this.currentStateId;
    this.currentStateId = stateId;

    EventBus.emit("camera:state:change", {
      previous: this.previousStateId,
      current: this.currentStateId,
    });
  }

  /**
   * Returns the config for a given state id without transitioning.
   */
  public getConfigFor(stateId: CameraStateId): CameraStateConfig {
    return STATE_CONFIGS[stateId];
  }

  /**
   * Reset to the initial intro state.
   */
  public reset(): void {
    this.previousStateId = null;
    this.currentStateId = "intro";
  }
}

/**
 * Singleton CameraStateMachine shared across the application.
 */
export const CameraStateMachine = new CameraStateMachineImpl();
