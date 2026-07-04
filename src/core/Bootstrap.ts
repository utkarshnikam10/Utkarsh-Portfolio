import { EventBus } from "@/core/EventBus";
import { AssetRegistry } from "@/systems/AssetRegistry";
import { LoadingPipeline } from "@/systems/LoadingPipeline";
import { CameraStateMachine } from "@/camera/CameraState";
import { CameraSplinePlayer } from "@/camera/CameraSpline";
import { TransitionManager } from "@/systems/TransitionManager";
import { AudioEngine } from "@/audio/AudioEngine";
import { GuideSequence } from "@/character/GuideSequence";

/**
 * PROJECT NEXUS // CORE BOOTSTRAP
 * Responsibility: Initializes all subsystems in the correct dependency order,
 * registers core asset entries, and prepares the application for the rendering phase.
 *
 * Initialization order:
 *   1. EventBus          (no dependencies)
 *   2. AssetRegistry     (no dependencies)
 *   3. CameraState       (depends on EventBus)
 *   4. CameraSpline      (depends on EventBus)
 *   5. AudioEngine       (depends on EventBus)
 *   6. TransitionManager (depends on EventBus)
 *   7. LoadingPipeline   (depends on AssetRegistry, EventBus)
 *
 * Extension point: Add new system registrations as they are built.
 */
export class Bootstrap {
  private static hasBooted = false;

  /**
   * Execute the full bootstrap sequence. Idempotent — safe to call multiple times.
   */
  public static async start(): Promise<void> {
    if (this.hasBooted) {
      console.warn("Bootstrap: Already initialized — skipping.");
      return;
    }

    console.log("PROJECT NEXUS // Bootstrap sequence starting...");

    // Phase 1: Clear any stale state from previous sessions (hot reload safety)
    this.resetSystems();

    // Phase 2: Register core asset manifest entries
    this.registerCoreAssets();

    // Phase 3: Initialize camera systems
    CameraStateMachine.reset();
    CameraSplinePlayer.clear();

    // Phase 4: Initialize audio engine (context starts suspended per browser policy)
    AudioEngine.initialize();

    // Phase 5: Hook Guide sequence listeners before pipeline triggers loading:complete
    GuideSequence.startListener();

    // Phase 6: Enqueue critical asset groups for the loading pipeline
    LoadingPipeline.enqueue("core");

    // Phase 7: Start the loading pipeline
    await LoadingPipeline.start();

    this.hasBooted = true;
    EventBus.emit("bootstrap:complete");
    console.log("PROJECT NEXUS // Bootstrap sequence complete.");
  }

  /**
   * Register core assets. Environment assets will be added as real files
   * are created in future sprints.
   */
  private static registerCoreAssets(): void {
    AssetRegistry.registerBatch([
      {
        id: "hdri-twilight-sky",
        label: "Twilight Mountain Sky HDRI",
        path: "/textures/hdri/twilight_sky.hdr",
        type: "hdri",
        group: "core",
        sizeEstimate: 4_000_000,
        critical: true,
      },
      {
        id: "font-inter",
        label: "Inter Variable Font",
        path: "/fonts/Inter-Variable.woff2",
        type: "font",
        group: "core",
        sizeEstimate: 100_000,
        critical: true,
      },
      {
        id: "font-fira-code",
        label: "Fira Code Monospace Font",
        path: "/fonts/FiraCode-Variable.woff2",
        type: "font",
        group: "core",
        sizeEstimate: 120_000,
        critical: true,
      },
      {
        id: "guide-character-model",
        label: "Guide Character Rigged Model",
        path: "/models/guide_character.gltf",
        type: "model",
        group: "core", // Critical for arrival experience
        sizeEstimate: 2_500_000,
        critical: true,
      },
    ]);

    console.log(`Bootstrap: ${AssetRegistry.count} core assets registered.`);
  }

  /**
   * Reset all singleton systems to a clean state. Critical for hot-reload safety.
   */
  private static resetSystems(): void {
    EventBus.clear();
    AssetRegistry.clear();
    LoadingPipeline.reset();
    TransitionManager.reset();
    CameraStateMachine.reset();
    CameraSplinePlayer.clear();
    GuideSequence.clear();
  }

  /**
   * Teardown the bootstrap — used for full application shutdown.
   */
  public static teardown(): void {
    AudioEngine.destroy();
    this.resetSystems();
    this.hasBooted = false;
    console.log("PROJECT NEXUS // Bootstrap teardown complete.");
  }
}
