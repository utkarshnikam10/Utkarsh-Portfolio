import * as THREE from "three";
import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // CAMERA SPLINE SYSTEM
 * Responsibility: Defines spline-based camera path architecture for cinematic sequences.
 * Supports easing functions, timed pauses at keyframes, and lookAt target interpolation.
 *
 * This is the SYSTEM only — no animations are defined here.
 * Cinematic sequences (intro flythrough, district transitions) will be authored
 * as SplinePath data in future sprints.
 *
 * Events emitted:
 *   "camera:spline:start"    — { pathId }
 *   "camera:spline:keyframe" — { pathId, index, progress }
 *   "camera:spline:pause"    — { pathId, index, duration }
 *   "camera:spline:complete" — { pathId }
 */

// ─────────────────────── Easing Functions ───────────────────────

export type EasingName =
  | "linear"
  | "easeInQuad"
  | "easeOutQuad"
  | "easeInOutQuad"
  | "easeInCubic"
  | "easeOutCubic"
  | "easeInOutCubic"
  | "easeInOutSine";

const EASING_FUNCTIONS: Record<EasingName, (t: number) => number> = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};

/**
 * Resolve an easing function by name.
 */
export function getEasing(name: EasingName): (t: number) => number {
  return EASING_FUNCTIONS[name];
}

// ─────────────────────── Data Structures ───────────────────────

/**
 * A single keyframe on a camera spline path.
 */
export interface SplineKeyframe {
  /** Position the camera moves to */
  position: THREE.Vector3Tuple;
  /** Optional lookAt target position */
  lookAt?: THREE.Vector3Tuple;
  /** Easing function for the segment leading TO this keyframe */
  easing: EasingName;
  /** Duration in seconds for the segment leading TO this keyframe */
  duration: number;
  /** Optional pause duration in seconds at this keyframe before continuing */
  pauseDuration?: number;
  /** Optional FOV override at this keyframe */
  fov?: number;
}

/**
 * A complete camera spline path composed of sequential keyframes.
 */
export interface SplinePath {
  /** Unique identifier for this path */
  id: string;
  /** Human-readable label */
  label: string;
  /** Whether the path loops back to the first keyframe */
  loop: boolean;
  /** Ordered list of keyframes */
  keyframes: SplineKeyframe[];
}

// ─────────────────────── Playback State ───────────────────────

export type PlaybackState = "idle" | "playing" | "paused" | "complete";

interface PlaybackContext {
  path: SplinePath;
  currentIndex: number;
  segmentElapsed: number;
  pauseElapsed: number;
  isPausing: boolean;
  state: PlaybackState;
}

// ─────────────────────── Spline Player ───────────────────────

/**
 * CameraSplinePlayer drives camera position/rotation along a SplinePath.
 * Call `update(delta)` each frame from useFrame. The player interpolates
 * between keyframes, applies easing, handles pauses, and emits events.
 */
class CameraSplinePlayerImpl {
  private context: PlaybackContext | null = null;
  private registeredPaths = new Map<string, SplinePath>();

  // Reusable vectors to avoid per-frame allocations
  private readonly tempVecA = new THREE.Vector3();
  private readonly tempVecB = new THREE.Vector3();
  private readonly tempLookA = new THREE.Vector3();
  private readonly tempLookB = new THREE.Vector3();

  /**
   * Register a spline path for later playback.
   */
  public registerPath(path: SplinePath): void {
    this.registeredPaths.set(path.id, path);
  }

  /**
   * Remove a registered spline path.
   */
  public unregisterPath(pathId: string): void {
    this.registeredPaths.delete(pathId);
  }

  /**
   * Returns all registered path ids.
   */
  public getRegisteredPathIds(): string[] {
    return Array.from(this.registeredPaths.keys());
  }

  /**
   * Start playing a registered spline path from the beginning.
   */
  public play(pathId: string): void {
    const path = this.registeredPaths.get(pathId);
    if (!path) {
      console.warn(`CameraSplinePlayer: Path "${pathId}" not registered.`);
      return;
    }
    if (path.keyframes.length < 2) {
      console.warn(`CameraSplinePlayer: Path "${pathId}" needs at least 2 keyframes.`);
      return;
    }

    this.context = {
      path,
      currentIndex: 1, // Start interpolating toward keyframe[1]
      segmentElapsed: 0,
      pauseElapsed: 0,
      isPausing: false,
      state: "playing",
    };

    EventBus.emit("camera:spline:start", { pathId });
  }

  /**
   * Stop playback and reset to idle.
   */
  public stop(): void {
    if (this.context) {
      EventBus.emit("camera:spline:complete", { pathId: this.context.path.id });
    }
    this.context = null;
  }

  /**
   * Pause playback (can be resumed).
   */
  public pause(): void {
    if (this.context && this.context.state === "playing") {
      this.context.state = "paused";
    }
  }

  /**
   * Resume paused playback.
   */
  public resume(): void {
    if (this.context && this.context.state === "paused") {
      this.context.state = "playing";
    }
  }

  /**
   * Returns the current playback state.
   */
  public getState(): PlaybackState {
    return this.context?.state ?? "idle";
  }

  /**
   * Returns the current path id being played, or null.
   */
  public getActivePathId(): string | null {
    return this.context?.path.id ?? null;
  }

  /**
   * Returns the normalized progress (0–1) through the entire path.
   */
  public getProgress(): number {
    if (!this.context) return 0;
    const { path, currentIndex, segmentElapsed } = this.context;
    const totalKeyframes = path.keyframes.length - 1;
    const currentKeyframe = path.keyframes[currentIndex];
    const segmentProgress = Math.min(segmentElapsed / currentKeyframe.duration, 1);
    return (currentIndex - 1 + segmentProgress) / totalKeyframes;
  }

  /**
   * Update the spline player for the current frame. Returns the interpolated
   * camera target (position, lookAt, fov) or null if not playing.
   *
   * @param delta - Time in seconds since last frame
   */
  public update(delta: number): {
    position: THREE.Vector3;
    lookAt: THREE.Vector3 | null;
    fov: number | null;
  } | null {
    if (!this.context || this.context.state !== "playing") return null;

    const { path, currentIndex } = this.context;
    const keyframe = path.keyframes[currentIndex];
    const prevKeyframe = path.keyframes[currentIndex - 1];

    // Handle pause at previous keyframe
    if (this.context.isPausing) {
      this.context.pauseElapsed += delta;
      const pauseDur = prevKeyframe.pauseDuration ?? 0;
      if (this.context.pauseElapsed >= pauseDur) {
        this.context.isPausing = false;
        this.context.pauseElapsed = 0;
      }
      // During pause, return the previous keyframe's position
      this.tempVecA.set(...prevKeyframe.position);
      const lookAt = prevKeyframe.lookAt ? this.tempLookA.set(...prevKeyframe.lookAt) : null;
      return { position: this.tempVecA, lookAt, fov: prevKeyframe.fov ?? null };
    }

    // Advance segment time
    this.context.segmentElapsed += delta;
    const t = Math.min(this.context.segmentElapsed / keyframe.duration, 1);
    const easedT = getEasing(keyframe.easing)(t);

    // Interpolate position
    this.tempVecA.set(...prevKeyframe.position);
    this.tempVecB.set(...keyframe.position);
    const position = this.tempVecA.clone().lerp(this.tempVecB, easedT);

    // Interpolate lookAt (if both keyframes define lookAt)
    let lookAt: THREE.Vector3 | null = null;
    if (keyframe.lookAt) {
      if (prevKeyframe.lookAt) {
        this.tempLookA.set(...prevKeyframe.lookAt);
        this.tempLookB.set(...keyframe.lookAt);
        lookAt = this.tempLookA.clone().lerp(this.tempLookB, easedT);
      } else {
        lookAt = this.tempLookA.set(...keyframe.lookAt);
      }
    }

    // Interpolate FOV
    let fov: number | null = null;
    if (keyframe.fov !== undefined) {
      const prevFov = prevKeyframe.fov ?? keyframe.fov;
      fov = prevFov + (keyframe.fov - prevFov) * easedT;
    }

    // Check segment completion
    if (t >= 1) {
      EventBus.emit("camera:spline:keyframe", {
        pathId: path.id,
        index: currentIndex,
        progress: this.getProgress(),
      });

      // Check for pause at this keyframe
      if (keyframe.pauseDuration && keyframe.pauseDuration > 0) {
        this.context.isPausing = true;
        this.context.pauseElapsed = 0;
        EventBus.emit("camera:spline:pause", {
          pathId: path.id,
          index: currentIndex,
          duration: keyframe.pauseDuration,
        });
      }

      // Advance to next segment
      if (currentIndex + 1 < path.keyframes.length) {
        this.context.currentIndex++;
        this.context.segmentElapsed = 0;
      } else if (path.loop) {
        // Loop back to start
        this.context.currentIndex = 1;
        this.context.segmentElapsed = 0;
      } else {
        // Path complete
        this.context.state = "complete";
        EventBus.emit("camera:spline:complete", { pathId: path.id });
      }
    }

    return { position, lookAt, fov };
  }

  /**
   * Reset the player to idle state.
   */
  public reset(): void {
    this.context = null;
  }

  /**
   * Clear all registered paths and reset playback.
   */
  public clear(): void {
    this.registeredPaths.clear();
    this.context = null;
  }
}

/**
 * Singleton CameraSplinePlayer shared across the application.
 */
export const CameraSplinePlayer = new CameraSplinePlayerImpl();
