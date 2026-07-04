/**
 * PROJECT NEXUS // WORLD TYPES
 * Responsibility: Declares structural definitions for the districts, physical elements,
 * and Tree of Curiosity central landmark.
 */

import { ActiveDistrict } from "@/store/useStore";

export interface DistrictInfo {
  id: ActiveDistrict;
  name: string;
  compassDirection: "north" | "east" | "west" | "south" | "center-subterranean";
  purpose: string;
  story: string;
}

export interface LandmarkNode {
  id: string;
  name: string;
  position: [number, number, number];
}
