/**
 * PROJECT NEXUS // CHARACTER ANIMATION STATE
 * Responsibility: Interface defining a single state in the Character FSM.
 */
export interface CharacterState {
  name: string;
  enter(prevState: CharacterState | null): void;
  update(delta: number): void;
  exit(): void;
}

/**
 * PROJECT NEXUS // CHARACTER FINITE STATE MACHINE (FSM)
 * Responsibility: Manages animation state transitions, crossfading, and updates.
 * Exposes a clean, modular API to register and transition between states.
 */
export class CharacterStateMachine {
  private states = new Map<string, CharacterState>();
  private activeState: CharacterState | null = null;

  constructor() {}

  /**
   * Register a state with the FSM.
   */
  public registerState(state: CharacterState): void {
    this.states.set(state.name.toLowerCase(), state);
  }

  /**
   * Transition the FSM to a new state.
   * Handles state exit and entry hooks.
   */
  public transitionTo(stateName: string): void {
    const key = stateName.toLowerCase();
    const nextState = this.states.get(key);

    if (!nextState) {
      console.warn(`CharacterFSM: State "${stateName}" not found.`);
      return;
    }

    if (this.activeState && this.activeState.name.toLowerCase() === key) {
      return; // Already in this state
    }

    const prevState = this.activeState;
    if (prevState) {
      prevState.exit();
    }

    this.activeState = nextState;
    nextState.enter(prevState);
  }

  /**
   * Update the active state.
   */
  public update(delta: number): void {
    if (this.activeState) {
      this.activeState.update(delta);
    }
  }

  /**
   * Get the active state.
   */
  public getActiveState(): CharacterState | null {
    return this.activeState;
  }

  /**
   * Clear all states and reset the FSM.
   */
  public clear(): void {
    if (this.activeState) {
      this.activeState.exit();
    }
    this.states.clear();
    this.activeState = null;
  }
}
