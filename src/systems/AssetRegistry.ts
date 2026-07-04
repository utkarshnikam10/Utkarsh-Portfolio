/**
 * PROJECT NEXUS // ASSET REGISTRY
 * Responsibility: Central manifest of all loadable assets. Registers models, textures,
 * audio files, HDRI environment maps, video files, and font assets with typed metadata.
 * This registry does NOT load assets — it only declares what exists and where it lives.
 * The LoadingPipeline reads from this registry to execute actual downloads.
 *
 * Extension point: Add new asset entries here when new districts or features are added.
 */

export type AssetType = "model" | "texture" | "audio" | "hdri" | "video" | "font";

export type AssetGroup =
  | "core" // Always loaded first (engine-critical)
  | "district-well"
  | "district-horizon"
  | "district-forge"
  | "district-lattice"
  | "district-terrace"
  | "district-root"
  | "character"
  | "tree"
  | "audio-ambient"
  | "audio-score";

export interface AssetEntry {
  /** Unique identifier for this asset */
  id: string;
  /** Human-readable label */
  label: string;
  /** File path relative to /public */
  path: string;
  /** Asset category */
  type: AssetType;
  /** Loading group — determines when this asset is fetched */
  group: AssetGroup;
  /** Estimated file size in bytes (used for progress calculation) */
  sizeEstimate: number;
  /** Whether this asset is required before the experience can start */
  critical: boolean;
}

class AssetRegistryImpl {
  private entries = new Map<string, AssetEntry>();

  /**
   * Register a single asset entry into the manifest.
   * Throws if an asset with the same id already exists.
   */
  public register(entry: AssetEntry): void {
    if (this.entries.has(entry.id)) {
      console.warn(`AssetRegistry: Duplicate asset id "${entry.id}" — skipping.`);
      return;
    }
    this.entries.set(entry.id, entry);
  }

  /**
   * Register multiple asset entries at once.
   */
  public registerBatch(entries: AssetEntry[]): void {
    for (const entry of entries) {
      this.register(entry);
    }
  }

  /**
   * Retrieve a registered asset entry by id.
   */
  public get(id: string): AssetEntry | undefined {
    return this.entries.get(id);
  }

  /**
   * Retrieve all entries matching a specific asset type.
   */
  public getByType(type: AssetType): AssetEntry[] {
    return Array.from(this.entries.values()).filter((e) => e.type === type);
  }

  /**
   * Retrieve all entries belonging to a specific loading group.
   */
  public getByGroup(group: AssetGroup): AssetEntry[] {
    return Array.from(this.entries.values()).filter((e) => e.group === group);
  }

  /**
   * Retrieve all entries marked as critical (must load before experience starts).
   */
  public getCritical(): AssetEntry[] {
    return Array.from(this.entries.values()).filter((e) => e.critical);
  }

  /**
   * Returns the total count of registered assets.
   */
  public get count(): number {
    return this.entries.size;
  }

  /**
   * Returns the estimated total byte size across all registered assets.
   */
  public get totalSizeEstimate(): number {
    let total = 0;
    for (const entry of this.entries.values()) {
      total += entry.sizeEstimate;
    }
    return total;
  }

  /**
   * Returns all registered asset ids for debugging.
   */
  public listIds(): string[] {
    return Array.from(this.entries.keys());
  }

  /**
   * Removes all registered assets. Used during teardown.
   */
  public clear(): void {
    this.entries.clear();
  }
}

/**
 * Singleton AssetRegistry shared across the application.
 */
export const AssetRegistry = new AssetRegistryImpl();
