import { EventBus } from "@/core/EventBus";
import { AssetRegistry, AssetGroup, AssetEntry } from "@/systems/AssetRegistry";

/**
 * PROJECT NEXUS // LOADING PIPELINE
 * Responsibility: Orchestrates the sequential download of asset groups registered
 * in the AssetRegistry. Tracks progress per-group and globally, emits lifecycle
 * events for splash screen integration, and manages the loading state machine.
 *
 * Events emitted:
 *   "loading:start"          — Pipeline begins processing
 *   "loading:group:start"    — { group: AssetGroup }
 *   "loading:group:complete" — { group: AssetGroup }
 *   "loading:progress"       — { loaded: number, total: number, percent: number }
 *   "loading:complete"       — All queued groups finished
 *   "loading:error"          — { assetId: string, error: string }
 *
 * Extension point: Override `loadAsset` to plug in real Three.js loaders (GLTFLoader,
 * KTX2Loader, AudioLoader) in Sprint 3+.
 */

export type LoadingPhase = "idle" | "loading" | "complete" | "error";

interface GroupProgress {
  group: AssetGroup;
  loaded: number;
  total: number;
}

class LoadingPipelineImpl {
  private phase: LoadingPhase = "idle";
  private groupQueue: AssetGroup[] = [];
  private groupProgress = new Map<AssetGroup, GroupProgress>();
  private loadedAssetIds = new Set<string>();

  /**
   * Returns the current loading phase.
   */
  public getPhase(): LoadingPhase {
    return this.phase;
  }

  /**
   * Returns the set of successfully loaded asset ids.
   */
  public getLoadedIds(): ReadonlySet<string> {
    return this.loadedAssetIds;
  }

  /**
   * Returns whether a specific asset has been loaded.
   */
  public isLoaded(assetId: string): boolean {
    return this.loadedAssetIds.has(assetId);
  }

  /**
   * Enqueue a set of asset groups for loading. Groups load in the order provided.
   * Call `start()` after enqueuing to begin the pipeline.
   */
  public enqueue(...groups: AssetGroup[]): void {
    for (const group of groups) {
      if (!this.groupQueue.includes(group)) {
        this.groupQueue.push(group);
      }
    }
  }

  /**
   * Begin processing the enqueued groups sequentially.
   */
  public async start(): Promise<void> {
    if (this.phase === "loading") {
      console.warn("LoadingPipeline: Already loading.");
      return;
    }

    this.phase = "loading";
    EventBus.emit("loading:start");

    for (const group of this.groupQueue) {
      await this.loadGroup(group);
    }

    this.phase = "complete";
    this.groupQueue = [];
    EventBus.emit("loading:complete");
  }

  /**
   * Load all assets within a single group.
   */
  private async loadGroup(group: AssetGroup): Promise<void> {
    const entries = AssetRegistry.getByGroup(group);
    const progress: GroupProgress = { group, loaded: 0, total: entries.length };
    this.groupProgress.set(group, progress);

    EventBus.emit("loading:group:start", { group });

    for (const entry of entries) {
      try {
        await this.loadAsset(entry);
        this.loadedAssetIds.add(entry.id);
        progress.loaded++;
        this.emitGlobalProgress();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        EventBus.emit("loading:error", { assetId: entry.id, error: message });

        if (entry.critical) {
          this.phase = "error";
          throw new Error(`Critical asset failed: ${entry.id}`);
        }
      }
    }

    EventBus.emit("loading:group:complete", { group });
  }

  /**
   * Load a single asset entry. This is the extension point where real loaders
   * (GLTFLoader, TextureLoader, etc.) will be wired in future sprints.
   * Currently simulates a network fetch delay for pipeline validation.
   */
  private async loadAsset(entry: AssetEntry): Promise<void> {
    // Placeholder: simulate async loading for pipeline verification
    void entry;
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
  }

  /**
   * Emit a global progress event aggregating all group progress.
   */
  private emitGlobalProgress(): void {
    let loaded = 0;
    let total = 0;
    for (const gp of this.groupProgress.values()) {
      loaded += gp.loaded;
      total += gp.total;
    }
    const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
    EventBus.emit("loading:progress", { loaded, total, percent });
  }

  /**
   * Returns the current progress snapshot.
   */
  public getProgress(): { loaded: number; total: number; percent: number } {
    let loaded = 0;
    let total = 0;
    for (const gp of this.groupProgress.values()) {
      loaded += gp.loaded;
      total += gp.total;
    }
    const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
    return { loaded, total, percent };
  }

  /**
   * Reset all internal state. Used during teardown or full scene reload.
   */
  public reset(): void {
    this.phase = "idle";
    this.groupQueue = [];
    this.groupProgress.clear();
    this.loadedAssetIds.clear();
  }
}

/**
 * Singleton LoadingPipeline shared across the application.
 */
export const LoadingPipeline = new LoadingPipelineImpl();
