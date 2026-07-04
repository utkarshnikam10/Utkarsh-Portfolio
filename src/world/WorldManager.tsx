"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import ArrivalPlaza from "./ArrivalPlaza";

/**
 * PROJECT NEXUS // WORLD SYSTEM MANAGER
 * Responsibility: Loads and renders the structural environment assets.
 * Instantiates the Tree of Curiosity as the central landmark, coordinates
 * the 6 brutalist districts, applies baked lightmaps, and manages
 * the interactive deconstruction pedestals and sliding concrete bricks.
 */
export function WorldManager() {
  const activeDistrict = useStore((state) => state.activeDistrict);

  return (
    <group name="world-root">
      {/* Central Landmark: The Tree of Curiosity (Visual/Spatial Anchor) */}
      <group name="tree-of-curiosity">
        {/* TODO (Sprint 5): Instanced crystalline foliage (Index of Refraction 1.54) */}
      </group>

      {/* District Geometries */}
      <group name="districts-container">
        {/* District 1: The Well Vault / Arrival Plaza */}
        {activeDistrict === "well-vault" && (
          <group name="district-well-vault">
            <ArrivalPlaza />
          </group>
        )}

        {/* District 2: The Horizon Reveal (Bridge transition) */}
        {activeDistrict === "horizon-bridge" && (
          <group name="district-horizon-bridge">
            {/* TODO (Sprint 5): Archway and aluminum pathing */}
          </group>
        )}

        {/* District 3: The Kinetic Forge Pavilion (Glass walls, white terrazzo, steel trusses) */}
        {activeDistrict === "kinetic-forge" && (
          <group name="district-kinetic-forge">
            {/* TODO (Sprint 5): Deconstruction Pedestals (3-axis split mechanics) */}
          </group>
        )}

        {/* District 4: The Lattice Matrix (Black void, golden light line vectors) */}
        {activeDistrict === "lattice-matrix" && (
          <group name="district-lattice-matrix">
            {/* TODO (Sprint 5): Matrix snapped light lines (10,000 instanced items) */}
          </group>
        )}

        {/* District 5: The Travertine Terrace (Travertine marble, titanium columns) */}
        {activeDistrict === "travertine-terrace" && (
          <group name="district-travertine-terrace">
            {/* TODO (Sprint 5): Chronograph Stream & bronze plates */}
          </group>
        )}

        {/* District 6: The Root Vault Sanctuary (Roots with amber veins, dark granite, bronze table) */}
        {activeDistrict === "root-vault" && (
          <group name="district-root-vault">
            {/* TODO (Sprint 5): Terminal Monolith touch interface */}
          </group>
        )}
      </group>
    </group>
  );
}

export default WorldManager;
