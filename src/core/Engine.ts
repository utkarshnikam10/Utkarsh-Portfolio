import { EventBus } from "@/core/EventBus";
import { CameraStateMachine } from "@/camera/CameraState";
import { LoadingPipeline } from "@/systems/LoadingPipeline";

/**
 * PROJECT NEXUS // CORE ENGINE
 * Responsibility: Coordinates runtime ticks across all modular systems. Bridges the
 * React Three Fiber render loop (useFrame) with the singleton system managers.
 * Manages frame timing, delta computation, and system update dispatching.
 *
 * The Engine does NOT own the render loop — R3F does. Instead, the Engine exposes
 * an `update(time, delta)` method that is called from within useFrame hooks.
 *
 * Events emitted:
 *   "engine:start"  — Engine begins accepting ticks
 *   "engine:stop"   — Engine stops processing
 *   "engine:tick"   — { time, delta, frame } emitted every frame
 */
export class Engine {
  private static instance: Engine | null = null;
  private isRunning = false;
  private frameCount = 0;

  private constructor() {}

  /**
   * Singleton accessor.
   */
  public static getInstance(): Engine {
    if (!this.instance) {
      this.instance = new Engine();
    }
    return this.instance;
  }

  /**
   * Returns whether the engine is currently processing ticks.
   */
  public get running(): boolean {
    return this.isRunning;
  }

  /**
   * Returns the total number of frames processed since start.
   */
  public get frames(): number {
    return this.frameCount;
  }

  /**
   * Start accepting frame ticks.
   */
  public start(): void {
    if (this.isRunning) return;

    // Only start if the loading pipeline has finished
    if (LoadingPipeline.getPhase() !== "complete") {
      console.warn("Engine: Cannot start — loading pipeline not complete.");
      return;
    }

    this.isRunning = true;
    this.frameCount = 0;
    EventBus.emit("engine:start");
    console.log("PROJECT NEXUS // Engine tick scheduler started.");
  }

  /**
   * Process a single frame tick. Called from within R3F useFrame.
   * @param time - Elapsed time in seconds since the R3F clock started
   * @param delta - Time in seconds since the last frame
   */
  public update(time: number, delta: number): void {
    if (!this.isRunning) return;

    this.frameCount++;

    // Dispatch per-frame event for any system that needs frame-level updates
    EventBus.emit("engine:tick", {
      time,
      delta,
      frame: this.frameCount,
    });
  }

  /**
   * Stop the engine tick loop.
   */
  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    EventBus.emit("engine:stop");
    console.log("PROJECT NEXUS // Engine tick scheduler stopped.");
  }

  /**
   * Returns diagnostic info for the debug panel.
   */
  public getDiagnostics(): {
    running: boolean;
    frames: number;
    cameraState: string;
    loadingPhase: string;
    registeredAssets: number;
  } {
    return {
      running: this.isRunning,
      frames: this.frameCount,
      cameraState: CameraStateMachine.getStateId(),
      loadingPhase: LoadingPipeline.getPhase(),
      registeredAssets: 0, // Will be populated when AssetRegistry is imported
    };
  }

  /**
   * Full engine reset — used during teardown or hot reload.
   */
  public reset(): void {
    this.isRunning = false;
    this.frameCount = 0;
  }
}
