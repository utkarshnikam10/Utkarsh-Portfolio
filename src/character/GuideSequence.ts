import { EventBus } from "@/core/EventBus";
import { CharacterController } from "./CharacterController";
import { CameraStateMachine } from "@/camera/CameraState";

/**
 * PROJECT NEXUS // GUIDE SEQUENCE COORDINATOR
 * Responsibility: Orchestrates the cinematic opening sequence after loading finishes.
 * Guides the visitor through the emotional arc:
 * Curiosity → Calm → Wonder → Anticipation
 *
 * Sequence timeline (emotional pacing):
 *   - 0.0s: Guide is reading his holographic notebook peacefully.
 *   - 3.5s: Guide turns a page (FSM: pageturn).
 *   - 5.0s: Page turn ends, Guide returns to reading for a brief pause.
 *   - 6.0s: Visitor enters, Guide notices movement, looks up (FSM: lookingup).
 *   - 7.5s: Guide closes the notebook (FSM: closenotebook).
 *   - 8.3s: Guide smiles naturally at visitor (FSM: smile).
 *   - 10.3s: Camera transitions to "guided", Guide turns (FSM: turn) and walks forward.
 */
export class GuideSequence {
  private static activeTimeouts: NodeJS.Timeout[] = [];

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
   * Run the sequence step-by-step.
   */
  private static beginSequence(): void {
    this.clear();

    const controller = CharacterController.getInstance();

    // Step 1: Ensure character starts in reading state and camera is in cinematic intro view
    controller.transitionTo("reading");
    CameraStateMachine.transitionTo("intro");

    console.log("PROJECT NEXUS // Guide Sequence: Started reading...");

    // Step 2: At 3.5s, turn a page
    this.activeTimeouts.push(
      setTimeout(() => {
        console.log("PROJECT NEXUS // Guide Sequence: Guide turns a page...");
        controller.transitionTo("pageturn");
      }, 3500)
    );

    // Step 3: At 6.0s, look up at visitor
    this.activeTimeouts.push(
      setTimeout(() => {
        console.log("PROJECT NEXUS // Guide Sequence: Guide looks up...");
        controller.transitionTo("lookingup");
      }, 6000)
    );

    // Step 4: At 10.3s (LookingUp 1.5s + CloseNotebook 0.8s + Smile 2.0s = 4.3s after lookingup starts),
    // Transition camera to guided follow before Guide walks
    this.activeTimeouts.push(
      setTimeout(() => {
        console.log("PROJECT NEXUS // Guide Sequence: Guide turns, camera follows...");
        CameraStateMachine.transitionTo("guided");
      }, 10300)
    );
  }

  /**
   * Clears any active sequence timeouts.
   */
  public static clear(): void {
    this.activeTimeouts.forEach((t) => clearTimeout(t));
    this.activeTimeouts = [];
  }
}
