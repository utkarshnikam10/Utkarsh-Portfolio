import * as THREE from "three";
import { CharacterStateMachine } from "./CharacterFSM";
import {
  CharacterAnimationController,
  IdleState,
  ReadingState,
  PageTurnState,
  LookingUpState,
  CloseNotebookState,
  SmileState,
  TurnState,
  WalkState,
  LookBackState,
  WaitState,
  PointState,
  WaveState,
  SitState,
  ThinkState,
  CelebrateState,
} from "./CharacterStates";
import { MockGuideModel } from "./MockGuideModel";
import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // CHARACTER CONTROLLER
 * Responsibility: Master manager for the Guide Character.
 * Orchestrates:
 *   1. Skeletal structure & model instance
 *   2. Finite State Machine (FSM)
 *   3. Blending and crossfades of clips via THREE.AnimationMixer
 *   4. Natural, dynamic head tracking (lookAt interpolation)
 *   5. Notebook illumination control
 *   6. Camera follow hooks
 */
export class CharacterController implements CharacterAnimationController {
  private static instance: CharacterController | null = null;

  private fsm: CharacterStateMachine;
  private model: MockGuideModel | null = null;
  private currentAction: THREE.AnimationAction | null = null;
  private actions = new Map<string, THREE.AnimationAction>();

  // LookAt variables for smooth head tracking
  private targetLookAt: THREE.Vector3 | null = null;
  private currentLookAtWeight = 0;
  private lookAtSpeed = 2.0;

  // Position and Rotation caches
  private position = new THREE.Vector3(0, 0, 0);
  private rotation = new THREE.Euler(0, 0, 0);

  // Position offset to align character structure
  private initialSetupDone = false;

  // Track time for procedural animations (SSR-safe)
  private accumulatedTime = 0;

  private constructor() {
    this.fsm = new CharacterStateMachine();
    this.registerFsmStates();
  }

  /**
   * Singleton accessor.
   */
  public static getInstance(): CharacterController {
    if (!this.instance) {
      this.instance = new CharacterController();
    }
    return this.instance;
  }

  /**
   * Initializes the character model structure and animation mixer actions.
   */
  public initialize(model: MockGuideModel): void {
    this.model = model;
    this.actions.clear();

    // Map clips to mixer actions
    Object.keys(model.clips).forEach((key) => {
      const clip = model.clips[key];
      const action = model.mixer.clipAction(clip);
      this.actions.set(key.toLowerCase(), action);
    });

    // Default character setup
    this.position.set(0, 0, 0);
    this.rotation.set(0, 0, 0);
    this.model.group.position.copy(this.position);
    this.model.group.rotation.copy(this.rotation);

    this.initialSetupDone = true;

    // Transition to initial state: Reading
    this.transitionTo("reading");
  }

  /**
   * Registers all guide animation states with the FSM.
   */
  private registerFsmStates(): void {
    this.fsm.registerState(new IdleState(this));
    this.fsm.registerState(new ReadingState(this));
    this.fsm.registerState(new PageTurnState(this));
    this.fsm.registerState(new LookingUpState(this));
    this.fsm.registerState(new CloseNotebookState(this));
    this.fsm.registerState(new SmileState(this));
    this.fsm.registerState(new TurnState(this));
    this.fsm.registerState(new WalkState(this));
    this.fsm.registerState(new LookBackState(this));
    this.fsm.registerState(new WaitState(this));

    // Placeholders
    this.fsm.registerState(new PointState(this));
    this.fsm.registerState(new WaveState(this));
    this.fsm.registerState(new SitState(this));
    this.fsm.registerState(new ThinkState(this));
    this.fsm.registerState(new CelebrateState(this));
  }

  /**
   * FSM Transition Method.
   */
  public transitionTo(stateName: string): void {
    this.fsm.transitionTo(stateName);
    EventBus.emit("character:state:change", { state: stateName });
  }

  /**
   * Blends and crossfades between skeletal animations.
   */
  public fadeTo(animName: string, duration: number, loop: boolean): THREE.AnimationAction | null {
    if (!this.model) return null;

    const nextAction = this.actions.get(animName.toLowerCase());
    if (!nextAction) {
      console.warn(`CharacterController: Animation action "${animName}" not found.`);
      return null;
    }

    const prevAction = this.currentAction;
    if (prevAction === nextAction) {
      return nextAction;
    }

    // Configure loop type
    nextAction.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce;
    nextAction.clampWhenFinished = !loop;

    // Perform smooth crossfade
    nextAction.enabled = true;
    nextAction.time = 0;

    if (prevAction) {
      nextAction.play();
      prevAction.crossFadeTo(nextAction, duration, true);
    } else {
      nextAction.play();
      nextAction.fadeIn(duration);
    }

    this.currentAction = nextAction;
    return nextAction;
  }

  /**
   * Set the holographic notebook emission intensity.
   */
  public setNotebookIllumination(intensity: number): void {
    if (this.model) {
      this.model.notebookLight.intensity = intensity;
    }
  }

  /**
   * Set target positional lookAt tracking (IK/Procedural head lookAt).
   */
  public lookAtTarget(target: THREE.Vector3 | null, speed: number): void {
    this.targetLookAt = target;
    this.lookAtSpeed = speed;
  }

  /**
   * Smoothly interpolates the neck/head bones toward the target look position.
   */
  private updateHeadTracking(delta: number): void {
    if (!this.model) return;

    // Find the head bone
    const headBone = this.model.group.getObjectByName("head") as THREE.Bone | undefined;
    if (!headBone) return;

    if (this.targetLookAt) {
      this.currentLookAtWeight = THREE.MathUtils.lerp(
        this.currentLookAtWeight,
        1.0,
        this.lookAtSpeed * delta
      );
    } else {
      this.currentLookAtWeight = THREE.MathUtils.lerp(
        this.currentLookAtWeight,
        0.0,
        this.lookAtSpeed * delta
      );
    }

    if (this.currentLookAtWeight <= 0.01) return;

    // Find local rotation target to look at the target position
    // Convert target to head bone local coordinates
    const targetLocal = this.targetLookAt
      ? this.targetLookAt.clone()
      : new THREE.Vector3(0, 1.6, 5);
    headBone.worldToLocal(targetLocal);

    // Compute target rotation angle to face targetLocal
    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(new THREE.Vector3(), targetLocal, new THREE.Vector3(0, 1, 0))
    );

    // Slerp current head rotation to lookAt target
    headBone.quaternion.slerp(targetQuat, this.currentLookAtWeight * this.lookAtSpeed * delta);
  }

  /**
   * Synchronize position caches and R3F group positioning.
   */
  public setCharacterPosition(pos: THREE.Vector3): void {
    this.position.copy(pos);
    if (this.model) {
      this.model.group.position.copy(pos);
    }
  }

  public getCharacterPosition(): THREE.Vector3 {
    return this.position;
  }

  public setCharacterRotation(rot: THREE.Euler): void {
    this.rotation.copy(rot);
    if (this.model) {
      this.model.group.rotation.copy(rot);
    }
  }

  public getCharacterRotation(): THREE.Euler {
    return this.rotation;
  }

  /**
   * Character frame tick. Updates animation mixer, FSM, and head lookAt.
   */
  public update(delta: number): void {
    if (!this.initialSetupDone || !this.model) return;

    this.accumulatedTime += delta;

    // Tick FSM state machine logic
    this.fsm.update(delta);

    // Tick THREE.AnimationMixer (computes bone tracks)
    this.model.mixer.update(delta);

    // Layer procedural micro-sways on top of active animation tracks
    this.applyProceduralMicroSways();

    // Dynamic head rotation on top of bone tracks
    this.updateHeadTracking(delta);
  }

  /**
   * Applies subtle breathing and weight-shifting to joints procedurally.
   */
  private applyProceduralMicroSways(): void {
    if (!this.model) return;

    const t = this.accumulatedTime;

    // 1. Spine breathing sway (sine-based)
    const spine = this.model.group.getObjectByName("spine") as THREE.Bone | undefined;
    if (spine) {
      const breatheX = Math.sin(t * 0.6) * 0.015;
      const breatheZ = Math.cos(t * 0.5) * 0.01;
      const breatheQuat = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(breatheX, 0, breatheZ)
      );
      spine.quaternion.multiply(breatheQuat);
    }

    // 2. Shoulder breathing shrugs
    const leftShoulder = this.model.group.getObjectByName("left_shoulder") as
      THREE.Bone | undefined;
    if (leftShoulder) {
      const shrug = Math.sin(t * 0.6) * 0.008;
      const shrugQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, shrug));
      leftShoulder.quaternion.multiply(shrugQuat);
    }

    const rightShoulder = this.model.group.getObjectByName("right_shoulder") as
      THREE.Bone | undefined;
    if (rightShoulder) {
      const shrug = Math.sin(t * 0.6) * -0.008;
      const shrugQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, shrug));
      rightShoulder.quaternion.multiply(shrugQuat);
    }

    // 3. Neck slow shift (scanning posture)
    const neck = this.model.group.getObjectByName("neck") as THREE.Bone | undefined;
    if (neck) {
      const swayY = Math.sin(t * 0.25) * 0.02 + Math.cos(t * 0.1) * 0.01;
      const swayQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, swayY, 0));
      neck.quaternion.multiply(swayQuat);
    }
  }

  /**
   * Expose camera focus/look points.
   */
  public getCameraFollowPoint(): THREE.Vector3 {
    // Focus camera slightly above character base position (approx neck height)
    return this.position.clone().add(new THREE.Vector3(0, 1.5, 0));
  }

  /**
   * Reset systems on teardown.
   */
  public reset(): void {
    this.fsm.clear();
    this.model = null;
    this.currentAction = null;
    this.actions.clear();
    this.targetLookAt = null;
    this.currentLookAtWeight = 0;
    this.accumulatedTime = 0;
    this.initialSetupDone = false;
  }
}
