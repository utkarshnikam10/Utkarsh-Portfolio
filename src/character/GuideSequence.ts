import { EventBus } from "@/core/EventBus";
import { CharacterController } from "./CharacterController";
import { CameraStateMachine } from "@/camera/CameraState";

/**
 * PROJECT NEXUS // GUIDE SEQUENCE COORDINATOR (SCROLL-LINKED)
 * Responsibility: Sets the initial state for the cinematic opening.
 * Locomotion and FSM state sequences are then driven dynamically
 * by scroll coordinates.
 */
export class GuideSequence {
  /**
   * Starts the opening sequence listener.
   */
  public static startListener(): void {
    // When the loading pipeline finishes, start the sequence
    EventBus.on("loading:complete", () => {
      this.beginSequence();
    });
  }

  /**
   * Run the initial state setup.
   */
  private static beginSequence(): void {
    this.clear();

    const controller = CharacterController.getInstance();

    // Initial state: Guide is reading, camera is in intro mode
    controller.transitionTo("reading");
    CameraStateMachine.transitionTo("intro");

    console.log("PROJECT NEXUS // Guide Sequence: Initialized in reading state.");
  }

  /**
   * Clears any active sequence timeouts.
   */
  public static clear(): void {
    // Scroll-linked flow does not use timed timeouts
  }
}
