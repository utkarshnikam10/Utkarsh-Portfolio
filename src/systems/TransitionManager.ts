import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // TRANSITION MANAGER
 * Responsibility: Coordinates visual transitions between scenes, cameras,
 * and districts. Supports multiple transition effects and manages the
 * transition lifecycle with proper state machine semantics.
 *
 * Transition Effects:
 *   - fade:       Opacity 1 → 0 → 1 through solid black
 *   - crossfade:  Simultaneous fade out old / fade in new (blended overlap)
 *   - dissolve:   Particle/noise-based dissolve effect
 *   - cut:        Instant switch with no animation
 *   - cinematic:  Custom GSAP timeline (extension point for Sprint 5+)
 *
 * Events emitted:
 *   "transition:request"   — { id, type, effect, from, to, duration }
 *   "transition:start"     — { id, type, effect, from, to, duration }
 *   "transition:progress"  — { id, progress: 0–1 }
 *   "transition:midpoint"  — { id } (for fade: moment of full black)
 *   "transition:complete"  — { id, type, effect, from, to }
 *   "transition:cancelled" — { id }
 *
 * No transition animations are implemented in this sprint — only the framework.
 */

export type TransitionType = "scene" | "camera" | "district" | "overlay";

export type TransitionEffect = "fade" | "crossfade" | "dissolve" | "cut" | "cinematic";

export interface TransitionRequest {
  /** Unique transition identifier (auto-generated if not provided) */
  id?: string;
  /** What kind of transition this is */
  type: TransitionType;
  /** Visual effect to apply */
  effect: TransitionEffect;
  /** Source state identifier */
  from: string;
  /** Target state identifier */
  to: string;
  /** Duration in seconds */
  duration: number;
  /** Optional callback at the midpoint (useful for swap logic during fades) */
  onMidpoint?: () => void;
  /** Optional callback on completion */
  onComplete?: () => void;
}

export type TransitionState = "idle" | "entering" | "midpoint" | "exiting" | "complete";

interface ActiveTransition {
  request: TransitionRequest;
  state: TransitionState;
  elapsed: number;
  progress: number;
}

class TransitionManagerImpl {
  private active: ActiveTransition | null = null;
  private transitionCounter = 0;
  private queue: TransitionRequest[] = [];

  /**
   * Returns whether a transition is currently in progress.
   */
  public get isTransitioning(): boolean {
    return this.active !== null;
  }

  /**
   * Returns the current active transition, or null if idle.
   */
  public getActive(): ActiveTransition | null {
    return this.active;
  }

  /**
   * Returns the current transition state.
   */
  public getState(): TransitionState {
    return this.active?.state ?? "idle";
  }

  /**
   * Returns the current transition progress (0–1).
   */
  public getProgress(): number {
    return this.active?.progress ?? 0;
  }

  /**
   * Request a transition. If a transition is already active, the request
   * is queued and executed after the current transition completes.
   */
  public request(req: TransitionRequest): string {
    const id = req.id ?? `transition-${++this.transitionCounter}`;
    const request = { ...req, id };

    EventBus.emit("transition:request", request);

    if (this.active) {
      // Queue for later execution
      this.queue.push(request);
      return id;
    }

    this.startTransition(request);
    return id;
  }

  /**
   * Start executing a transition.
   */
  private startTransition(request: TransitionRequest): void {
    this.active = {
      request,
      state: request.effect === "cut" ? "complete" : "entering",
      elapsed: 0,
      progress: 0,
    };

    EventBus.emit("transition:start", {
      id: request.id,
      type: request.type,
      effect: request.effect,
      from: request.from,
      to: request.to,
      duration: request.duration,
    });

    // Instant cut — complete immediately
    if (request.effect === "cut") {
      this.completeTransition();
    }
  }

  /**
   * Update the active transition. Call this each frame from useFrame or Engine tick.
   * @param delta - Time in seconds since last frame
   */
  public update(delta: number): void {
    if (!this.active || this.active.state === "idle" || this.active.state === "complete") {
      return;
    }

    const { request } = this.active;
    this.active.elapsed += delta;
    this.active.progress = Math.min(this.active.elapsed / request.duration, 1);

    // Emit progress event
    EventBus.emit("transition:progress", {
      id: request.id,
      progress: this.active.progress,
    });

    // Handle midpoint for fade transitions (at 50% progress)
    if (
      this.active.state === "entering" &&
      this.active.progress >= 0.5 &&
      (request.effect === "fade" || request.effect === "dissolve")
    ) {
      this.active.state = "exiting";
      EventBus.emit("transition:midpoint", { id: request.id });
      request.onMidpoint?.();
    }

    // Handle completion
    if (this.active.progress >= 1) {
      this.completeTransition();
    }
  }

  /**
   * Complete the active transition and process the queue.
   */
  private completeTransition(): void {
    if (!this.active) return;

    const { request } = this.active;
    this.active.state = "complete";

    EventBus.emit("transition:complete", {
      id: request.id,
      type: request.type,
      effect: request.effect,
      from: request.from,
      to: request.to,
    });

    request.onComplete?.();
    this.active = null;

    // Process next queued transition
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.startTransition(next);
    }
  }

  /**
   * Force-cancel the active transition.
   */
  public cancel(): void {
    if (!this.active) return;
    const id = this.active.request.id;
    this.active = null;
    EventBus.emit("transition:cancelled", { id });
  }

  /**
   * Clear the transition queue without cancelling the active transition.
   */
  public clearQueue(): void {
    this.queue = [];
  }

  /**
   * Returns the number of queued transitions.
   */
  public get queueLength(): number {
    return this.queue.length;
  }

  /**
   * Reset all internal state. Used during teardown.
   */
  public reset(): void {
    this.active = null;
    this.queue = [];
    this.transitionCounter = 0;
  }
}

/**
 * Singleton TransitionManager shared across the application.
 */
export const TransitionManager = new TransitionManagerImpl();
