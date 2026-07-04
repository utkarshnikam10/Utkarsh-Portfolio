import { CharacterState } from "./CharacterFSM";
import * as THREE from "three";

/**
 * Interface representing the character animation controller required by the states.
 */
export interface CharacterAnimationController {
  fadeTo(animName: string, duration: number, loop: boolean): THREE.AnimationAction | null;
  setCharacterPosition(pos: THREE.Vector3): void;
  getCharacterPosition(): THREE.Vector3;
  setCharacterRotation(rot: THREE.Euler): void;
  getCharacterRotation(): THREE.Euler;
  setNotebookIllumination(intensity: number): void;
  lookAtTarget(target: THREE.Vector3 | null, speed: number): void;
  transitionTo(stateName: string): void;
}

/**
 * Base class for all guide character states.
 */
export abstract class BaseCharacterState implements CharacterState {
  public abstract name: string;
  protected controller: CharacterAnimationController;
  protected stateTime = 0;

  constructor(controller: CharacterAnimationController) {
    this.controller = controller;
  }

  public enter(prevState: CharacterState | null): void {
    void prevState;
    this.stateTime = 0;
  }

  public update(delta: number): void {
    this.stateTime += delta;
  }

  public exit(): void {
    // Override in subclass if needed
  }
}

/**
 * IDLE STATE: Represents a quiet, breathing idle state.
 * The character shifts weight, looks slightly around naturally.
 */
export class IdleState extends BaseCharacterState {
  public name = "idle";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("idle", 0.5, true);
    this.controller.setNotebookIllumination(0.0);
    this.controller.lookAtTarget(null, 1.0);
  }

  public update(delta: number): void {
    super.update(delta);
    // Silent presence: occasionally look around or shift weight naturally
    // If we want natural idle behavior, we can periodically look at the camera
  }
}

/**
 * READING STATE: Guide is peacefully studying his holographic notebook.
 * His face is illuminated by the notebook's soft glow.
 */
export class ReadingState extends BaseCharacterState {
  public name = "reading";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("reading", 0.6, true);
    this.controller.setNotebookIllumination(1.0);
    // Look down at notebook (local coordinates)
    const localNotebookPos = new THREE.Vector3(0, 1.2, 0.4);
    this.controller.lookAtTarget(localNotebookPos, 2.0);
  }

  public update(delta: number): void {
    super.update(delta);
    // Face remains softly lit by notebook
  }
}

/**
 * PAGE TURN STATE: Guide turns a page in his holographic notebook.
 */
export class PageTurnState extends BaseCharacterState {
  public name = "pageturn";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("pageturn", 0.3, false);
    this.controller.setNotebookIllumination(1.0);
    // Keep looking at notebook
    const localNotebookPos = new THREE.Vector3(0, 1.2, 0.4);
    this.controller.lookAtTarget(localNotebookPos, 2.0);
  }

  public update(delta: number): void {
    super.update(delta);
    if (this.stateTime >= 1.5) {
      this.controller.transitionTo("reading");
    }
  }
}

/**
 * LOOKING UP STATE: Guide notices the visitor and looks up from his notebook.
 */
export class LookingUpState extends BaseCharacterState {
  public name = "lookingup";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("lookingup", 0.4, false);
    this.controller.setNotebookIllumination(0.8);
    // Look up toward visitor (camera)
    this.controller.lookAtTarget(new THREE.Vector3(0, 1.6, 5), 1.5);
  }

  public update(delta: number): void {
    super.update(delta);
    // Auto transition to CloseNotebook after look up animation finishes
    if (this.stateTime >= 1.5) {
      this.controller.transitionTo("closenotebook");
    }
  }
}

/**
 * CLOSE NOTEBOOK STATE: Guide closes the holographic notebook.
 * The illumination fades out.
 */
export class CloseNotebookState extends BaseCharacterState {
  public name = "closenotebook";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("closenotebook", 0.3, false);
    // Dim the notebook illumination
  }

  public update(delta: number): void {
    super.update(delta);
    // Fade out illumination over time
    const intensity = Math.max(0, 1.0 - this.stateTime * 2.0);
    this.controller.setNotebookIllumination(intensity);

    if (this.stateTime >= 0.8) {
      this.controller.transitionTo("smile");
    }
  }
}

/**
 * SMILE STATE: Guide looks directly at the visitor, pauses, and smiles naturally.
 */
export class SmileState extends BaseCharacterState {
  public name = "smile";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("smile", 0.4, false);
    this.controller.setNotebookIllumination(0.0);
    // Lock lookAt onto the camera/visitor
    this.controller.lookAtTarget(new THREE.Vector3(0, 1.6, 5), 3.0);
  }

  public update(delta: number): void {
    super.update(delta);
    if (this.stateTime >= 2.0) {
      this.controller.transitionTo("turn");
    }
  }
}

/**
 * TURN STATE: Guide turns around to walk forward.
 */
export class TurnState extends BaseCharacterState {
  public name = "turn";
  private targetRotation = 0;
  private currentRotation = 0;

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("turn", 0.5, false);
    this.controller.lookAtTarget(null, 1.0); // Stop looking at visitor

    const rot = this.controller.getCharacterRotation();
    this.currentRotation = rot.y;
    // Turn 180 degrees (away from visitor who is at Z > 0, walking towards Z < 0)
    this.targetRotation = rot.y + Math.PI;
  }

  public update(delta: number): void {
    super.update(delta);

    // Smoothly rotate the character structure
    const t = Math.min(this.stateTime / 1.0, 1);
    const angle = THREE.MathUtils.lerp(this.currentRotation, this.targetRotation, t);
    const rot = this.controller.getCharacterRotation().clone();
    rot.y = angle;
    this.controller.setCharacterRotation(rot);

    if (this.stateTime >= 1.0) {
      this.controller.transitionTo("walk");
    }
  }
}

/**
 * WALK STATE: Guide walks forward. Moves along path/Z-axis (Root motion).
 */
export class WalkState extends BaseCharacterState {
  public name = "walk";
  private speed = 1.2; // Units per second

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("walk", 0.4, true);
  }

  public update(delta: number): void {
    super.update(delta);

    // Move forward (Root motion along character's local forward vector)
    const currentPos = this.controller.getCharacterPosition().clone();
    const rot = this.controller.getCharacterRotation();
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), rot.y);
    currentPos.addScaledVector(forward, this.speed * delta);
    this.controller.setCharacterPosition(currentPos);

    // Transition to look back after 3 seconds of walking
    if (this.stateTime >= 3.0) {
      this.controller.transitionTo("lookback");
    }
  }
}

/**
 * LOOK BACK STATE: Guide stops walking, turns head to look back at the visitor.
 */
export class LookBackState extends BaseCharacterState {
  public name = "lookback";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("lookback", 0.4, false);
    // Look back at camera
    this.controller.lookAtTarget(new THREE.Vector3(0, 1.6, 5), 2.0);
  }

  public update(delta: number): void {
    super.update(delta);
    if (this.stateTime >= 1.5) {
      this.controller.transitionTo("wait");
    }
  }
}

/**
 * WAIT STATE: Guide waits for the visitor to follow.
 */
export class WaitState extends BaseCharacterState {
  public name = "wait";

  public enter(prevState: CharacterState | null): void {
    super.enter(prevState);
    this.controller.fadeTo("wait", 0.5, true);
    this.controller.lookAtTarget(new THREE.Vector3(0, 1.6, 5), 1.0);
  }

  public update(delta: number): void {
    super.update(delta);
  }
}

// ─────────────────────── Future Placeholder States ───────────────────────

export class PointState extends BaseCharacterState {
  public name = "point";
  public enter(p: CharacterState | null) {
    super.enter(p);
    this.controller.fadeTo("point", 0.5, false);
  }
}

export class WaveState extends BaseCharacterState {
  public name = "wave";
  public enter(p: CharacterState | null) {
    super.enter(p);
    this.controller.fadeTo("wave", 0.5, false);
  }
}

export class SitState extends BaseCharacterState {
  public name = "sit";
  public enter(p: CharacterState | null) {
    super.enter(p);
    this.controller.fadeTo("sit", 0.5, true);
  }
}

export class ThinkState extends BaseCharacterState {
  public name = "think";
  public enter(p: CharacterState | null) {
    super.enter(p);
    this.controller.fadeTo("think", 0.5, true);
  }
}

export class CelebrateState extends BaseCharacterState {
  public name = "celebrate";
  public enter(p: CharacterState | null) {
    super.enter(p);
    this.controller.fadeTo("celebrate", 0.5, false);
  }
}
