/* eslint-disable */
"use client";

import React, { useRef } from "react";
import { OrganicCore } from "../components/OrganicCore";
import { QuantumGraph } from "../components/QuantumGraph";
import { ObsidianPlate } from "../components/ObsidianPlate";
import { useChapterState } from "../../hooks/useChapterState";

export function MultiverseScene() {
  const { activeChapter } = useChapterState();

  return (
    <group>
      {/* World 01: Organic Liquid Core (Hero Chapter 0) */}
      <OrganicCore visible={activeChapter === 0} />

      {/* World 03: Quantum Spatial Graph (Skills Chapter 2) */}
      <QuantumGraph visible={activeChapter === 2} />

      {/* World 04: The Void Spotlight (Contact Chapter 3) */}
      <ObsidianPlate visible={activeChapter === 3} />
    </group>
  );
}
