import { EventBus } from "@/core/EventBus";
import { CharacterController } from "./CharacterController";
import { CameraStateMachine } from "@/camera/CameraState";
import * as THREE from "three";

/**
 * PROJECT NEXUS // GUIDE SEQUENCE COORDINATOR (WELCOMING TIMELINE)
 * Responsibility: Orchestrates the automatic welcoming animation sequence
 * for the Guide Character on initial page load. Places the Guide static
 * in the plaza.
 */
export class GuideSequence {
  private static activeTimeouts: NodeJS.Timeout[] = [];

  /**
   * Starts the opening sequence listener.
   */
  public static startListener(): void {
    EventBus.on("loading:complete", () => {
      this.beginSequence();
    });
  }

  /**
   * Run the welcoming animation sequence.
   */
  private static beginSequence(): void {
    this.clear();

    const controller = CharacterController.getInstance();

    // 1. Position Guide static at welcoming location in the plaza
    controller.setCharacterPosition(new THREE.Vector3(-1.2, 0.0, -1.8));
    controller.setCharacterRotation(new THREE.Euler(0, Math.PI * 0.8, 0));

    // 2. Start initial state: Reading notebook
    controller.transitionTo("reading");
    CameraStateMachine.transitionTo("intro");

    // Step 2: Page turn after 3s
    this.activeTimeouts.push(
      setTimeout(() => {
        controller.transitionTo("pageturn");
      }, 3000)
    );

    // Step 3: Notice visitor and look up after 6s
    this.activeTimeouts.push(
      setTimeout(() => {
        controller.transitionTo("lookingup");
      }, 6000)
    );

    // Step 4: Close notebook after 8s
    this.activeTimeouts.push(
      setTimeout(() => {
        controller.transitionTo("closenotebook");
      }, 8000)
    );

    // Step 5: Smile at visitor after 9.5s
    this.activeTimeouts.push(
      setTimeout(() => {
        controller.transitionTo("smile");
      }, 9500)
    );

    // Step 6: Go to idle breathing posture after 11.5s
    this.activeTimeouts.push(
      setTimeout(() => {
        controller.transitionTo("idle");
      }, 11500)
    );

    console.log("PROJECT NEXUS // Guide Sequence: Welcome sequence registered.");
  }

  /**
   * Clears any active sequence timeouts.
   */
  public static clear(): void {
    this.activeTimeouts.forEach((t) => clearTimeout(t));
    this.activeTimeouts = [];
  }
}
