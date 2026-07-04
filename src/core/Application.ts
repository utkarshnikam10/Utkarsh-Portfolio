import { Bootstrap } from "@/core/Bootstrap";
import { Engine } from "@/core/Engine";
import { EventBus } from "@/core/EventBus";

/**
 * PROJECT NEXUS // CORE APPLICATION
 * Responsibility: The top-level entry point and lifecycle manager for the entire
 * experience runtime. Coordinates the Bootstrap → Engine → Teardown lifecycle.
 *
 * Lifecycle:
 *   1. initialize()  — Runs Bootstrap, then starts the Engine
 *   2. Engine runs    — Processes frame ticks via R3F useFrame
 *   3. destroy()      — Stops Engine, tears down Bootstrap, clears EventBus
 *
 * Events emitted:
 *   "app:initialized" — Application is fully ready
 *   "app:destroyed"   — Application has been torn down
 */
export class Application {
  private static instance: Application | null = null;
  private isInitialized = false;
  private engine: Engine;

  private constructor() {
    this.engine = Engine.getInstance();
  }

  /**
   * Singleton accessor for the Application layer.
   */
  public static getInstance(): Application {
    if (!this.instance) {
      this.instance = new Application();
    }
    return this.instance;
  }

  /**
   * Returns whether the application has completed initialization.
   */
  public get ready(): boolean {
    return this.isInitialized;
  }

  /**
   * Returns the Engine instance for frame-level operations.
   */
  public getEngine(): Engine {
    return this.engine;
  }

  /**
   * Start the application: run bootstrap, then start the engine.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn("Application: Already initialized.");
      return;
    }

    console.log("PROJECT NEXUS // Application initializing...");

    // Phase 1: Bootstrap all systems
    await Bootstrap.start();

    // Phase 2: Start the engine tick scheduler
    this.engine.start();

    this.isInitialized = true;
    EventBus.emit("app:initialized");
    console.log("PROJECT NEXUS // Application ready.");
  }

  /**
   * Tear down the application: stop engine, teardown bootstrap, clear events.
   */
  public destroy(): void {
    if (!this.isInitialized) return;

    console.log("PROJECT NEXUS // Application shutting down...");

    this.engine.stop();
    this.engine.reset();
    Bootstrap.teardown();

    this.isInitialized = false;
    EventBus.emit("app:destroyed");
    EventBus.clear();

    console.log("PROJECT NEXUS // Application destroyed.");
  }
}
