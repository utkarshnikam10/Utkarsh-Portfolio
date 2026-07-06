import { create } from "zustand";
import { ProjectData } from "@/types/portfolio";

/**
 * PROJECT NEXUS // THE LIVING MIND STORE
 * Responsibility: The central reactive state engine for the interactive portfolio.
 * Maps navigation progress, guide character states, audio controls, engine status,
 * camera state, and active portfolio content overlays.
 */

export type ActiveDistrict =
  | "well-vault" // District 1: The Well Vault
  | "horizon-bridge" // District 2: The Horizon Reveal (Transition)
  | "kinetic-forge" // District 3: The Kinetic Forge Pavilion
  | "lattice-matrix" // District 4: The Lattice Matrix
  | "travertine-terrace" // District 5: The Travertine Terrace
  | "root-vault"; // District 6: The Root Vault Sanctuary

export type GuideState = "idle" | "walking" | "projecting-notebook";

export type CameraMode = "intro" | "guided" | "focus" | "free";

export type ActiveScene =
  "opening" | "about" | "journey" | "projects" | "skills" | "process" | "vision" | "contact";

export type FocusedObject = "library" | "workshop" | "tree" | "mailbox" | null;

interface StoreState {
  // ──────────────────── Navigation ────────────────────
  /** Active narrative district */
  activeDistrict: ActiveDistrict;
  setActiveDistrict: (district: ActiveDistrict) => void;

  // ──────────────────── Engine ────────────────────
  /** Whether the engine has completed bootstrap and is running */
  engineReady: boolean;
  setEngineReady: (ready: boolean) => void;

  /** Debug panel visibility */
  debugVisible: boolean;
  setDebugVisible: (visible: boolean) => void;

  // ──────────────────── Loading ────────────────────
  /** Whether all critical assets have loaded */
  assetsLoaded: boolean;
  loadProgress: number;
  setAssetsLoaded: (loaded: boolean) => void;
  setLoadProgress: (progress: number) => void;

  // ──────────────────── Camera ────────────────────
  /** Current camera mode for UI/overlay coordination */
  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;

  // ──────────────────── Guide Character ────────────────────
  /** Stylized Young Engineer state */
  guideState: GuideState;
  setGuideState: (state: GuideState) => void;

  // ──────────────────── Audio ────────────────────
  /** Positional sound system controls */
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  masterVolume: number;
  setMasterVolume: (volume: number) => void;

  // ──────────────────── Portfolio ────────────────────
  /** Active project overlay */
  activeProject: ProjectData | null;
  setActiveProject: (project: ProjectData | null) => void;

  // ──────────────────── Climax ────────────────────
  /** Signature Moment (Convergence of the Lattice) */
  climaxActive: boolean;
  climaxAligned: boolean;
  setClimaxActive: (active: boolean) => void;
  setClimaxAligned: (aligned: boolean) => void;

  // ──────────────────── Scroll-Motion ────────────────────
  /** Current scroll progress (0 to 1) */
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  /** Active narrative scene */
  activeScene: ActiveScene;
  setActiveScene: (scene: ActiveScene) => void;

  // ──────────────────── Redesign Interaction ────────────────────
  /** Active focused 3D object for navigation */
  focusedObject: FocusedObject;
  setFocusedObject: (obj: FocusedObject) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Redesign Interaction
  focusedObject: null,
  setFocusedObject: (obj) => set({ focusedObject: obj }),

  // Scroll-Motion
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  activeScene: "opening",
  setActiveScene: (scene) => set({ activeScene: scene }),

  // Navigation
  activeDistrict: "well-vault",
  setActiveDistrict: (district) => set({ activeDistrict: district }),

  // Engine
  engineReady: false,
  setEngineReady: (ready) => set({ engineReady: ready }),
  debugVisible: false,
  setDebugVisible: (visible) => set({ debugVisible: visible }),

  // Loading
  assetsLoaded: false,
  loadProgress: 0,
  setAssetsLoaded: (loaded) => set({ assetsLoaded: loaded }),
  setLoadProgress: (progress) => set({ loadProgress: progress }),

  // Camera
  cameraMode: "intro",
  setCameraMode: (mode) => set({ cameraMode: mode }),

  // Guide Character
  guideState: "idle",
  setGuideState: (state) => set({ guideState: state }),

  // Audio — starts disabled until user interaction (browser security policy)
  audioEnabled: false,
  setAudioEnabled: (enabled) => set({ audioEnabled: enabled }),
  masterVolume: 0.8,
  setMasterVolume: (volume) => set({ masterVolume: volume }),

  // Portfolio
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),

  // Climax
  climaxActive: false,
  climaxAligned: false,
  setClimaxActive: (active) => set({ climaxActive: active }),
  setClimaxAligned: (aligned) => set({ climaxAligned: aligned }),
}));
