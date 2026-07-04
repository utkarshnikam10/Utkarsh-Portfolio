"use client";

import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Engine } from "@/core/Engine";
import { CameraStateMachine } from "@/camera/CameraState";
import { CameraSplinePlayer } from "@/camera/CameraSpline";
import { LoadingPipeline } from "@/systems/LoadingPipeline";
import { AssetRegistry } from "@/systems/AssetRegistry";
import { TransitionManager } from "@/systems/TransitionManager";
import { AudioEngine } from "@/audio/AudioEngine";
import { useStore } from "@/store/useStore";

/**
 * PROJECT NEXUS // DEBUG PANEL
 * Responsibility: Developer-only diagnostic overlay displaying real-time
 * engine metrics across all active systems. Toggled via backtick key.
 *
 * Sections:
 *   - Performance:  FPS, frame count, JS heap memory
 *   - Renderer:     Draw calls, triangles, geometries, textures, programs
 *   - Camera:       State, FOV, position, spline playback
 *   - Scene:        Active district, loading phase, asset counts
 *   - Audio:        Context state, layers, master volume
 *   - Transitions:  Active transition, queue length
 *   - Systems:      Engine, bootstrap, loader, audio, transitions status
 */

export interface DebugData {
  // Performance
  fps: number;
  frameCount: number;
  memoryMb: number;
  // Renderer
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
  // Camera
  cameraState: string;
  cameraFov: number;
  cameraPosition: string;
  splineState: string;
  splineProgress: number;
  // Scene
  activeDistrict: string;
  loadingPhase: string;
  loadedAssets: number;
  totalAssets: number;
  // Engine
  engineRunning: boolean;
  // Audio
  audioContextState: string;
  audioLayers: number;
  // Transitions
  transitionState: string;
  transitionQueue: number;
}

interface DebugCollectorProps {
  onData: (data: DebugData) => void;
}

/**
 * Inner R3F component that reads renderer info and pushes it to the DOM panel.
 */
export function DebugCollector({ onData }: DebugCollectorProps) {
  const { gl, camera } = useThree();
  const activeDistrict = useStore((state) => state.activeDistrict);
  const frameTimesRef = useRef<number[]>([]);
  const lastUpdateRef = useRef(0);

  useFrame(() => {
    // Throttle debug updates to ~4Hz to avoid performance overhead
    const now = performance.now();
    if (now - lastUpdateRef.current < 250) return;
    lastUpdateRef.current = now;

    // Calculate FPS from recent frame times
    const frameTimes = frameTimesRef.current;
    frameTimes.push(now);
    while (frameTimes.length > 60) frameTimes.shift();
    const fps =
      frameTimes.length > 1
        ? Math.round(
            ((frameTimes.length - 1) / (frameTimes[frameTimes.length - 1] - frameTimes[0])) * 1000
          )
        : 0;

    const info = gl.info;
    const engine = Engine.getInstance();
    const progress = LoadingPipeline.getProgress();
    const audioDiag = AudioEngine.getDiagnostics();

    const memoryMb =
      typeof performance !== "undefined" && "memory" in performance && performance.memory
        ? Math.round(
            (performance.memory as { usedJSHeapSize: number }).usedJSHeapSize / 1024 / 1024
          )
        : 0;

    onData({
      fps,
      frameCount: engine.frames,
      memoryMb,
      drawCalls: info.render?.calls ?? 0,
      triangles: info.render?.triangles ?? 0,
      geometries: info.memory?.geometries ?? 0,
      textures: info.memory?.textures ?? 0,
      programs: info.programs?.length ?? 0,
      cameraState: CameraStateMachine.getStateId(),
      cameraFov: camera instanceof THREE.PerspectiveCamera ? camera.fov : 0,
      cameraPosition: `${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)}`,
      splineState: CameraSplinePlayer.getState(),
      splineProgress: Math.round(CameraSplinePlayer.getProgress() * 100),
      activeDistrict,
      loadingPhase: LoadingPipeline.getPhase(),
      loadedAssets: progress.loaded,
      totalAssets: AssetRegistry.count,
      engineRunning: engine.running,
      audioContextState: audioDiag.contextState,
      audioLayers: audioDiag.layers.length,
      transitionState: TransitionManager.getState(),
      transitionQueue: TransitionManager.queueLength,
    });
  });

  return null;
}

/**
 * DOM overlay debug panel.
 */
interface DebugPanelProps {
  data: DebugData | null;
}

export function DebugPanel({ data }: DebugPanelProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "`") setVisible((v) => !v);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!visible || !data) return null;

  return (
    <div
      className="pointer-events-none fixed left-4 top-4 z-[90] w-72 rounded-lg border border-zinc-700/50 bg-black/90 p-4 font-mono text-[10px] uppercase tracking-wider text-zinc-400 backdrop-blur-sm"
      style={{ lineHeight: "1.8" }}
    >
      <div className="mb-2 text-[11px] font-bold text-emerald-400">Project Nexus // Debug</div>

      <Section title="Performance">
        <Row label="FPS" value={String(data.fps)} color={fpsColor(data.fps)} />
        <Row label="Frame" value={String(data.frameCount)} />
        <Row label="Memory" value={`${data.memoryMb} MB`} />
      </Section>

      <Section title="Renderer">
        <Row label="Draw Calls" value={String(data.drawCalls)} />
        <Row label="Triangles" value={formatNumber(data.triangles)} />
        <Row label="Geometries" value={String(data.geometries)} />
        <Row label="Textures" value={String(data.textures)} />
        <Row label="Programs" value={String(data.programs)} />
      </Section>

      <Section title="Camera">
        <Row label="State" value={data.cameraState} />
        <Row label="FOV" value={`${data.cameraFov.toFixed(0)}°`} />
        <Row label="Position" value={data.cameraPosition} />
        <Row label="Spline" value={data.splineState} />
        {data.splineState === "playing" && (
          <Row label="Progress" value={`${data.splineProgress}%`} />
        )}
      </Section>

      <Section title="Scene">
        <Row label="District" value={data.activeDistrict} />
        <Row label="Loading" value={data.loadingPhase} />
        <Row label="Assets" value={`${data.loadedAssets} / ${data.totalAssets}`} />
      </Section>

      <Section title="Audio">
        <Row
          label="Context"
          value={data.audioContextState}
          color={stateColor(data.audioContextState === "running")}
        />
        <Row label="Layers" value={String(data.audioLayers)} />
      </Section>

      <Section title="Transitions">
        <Row label="State" value={data.transitionState} />
        <Row label="Queue" value={String(data.transitionQueue)} />
      </Section>

      <Section title="Active Systems">
        <Row
          label="Engine"
          value={data.engineRunning ? "RUNNING" : "STOPPED"}
          color={stateColor(data.engineRunning)}
        />
        <Row
          label="Loader"
          value={data.loadingPhase}
          color={stateColor(data.loadingPhase === "complete")}
        />
        <Row
          label="Audio"
          value={data.audioContextState}
          color={stateColor(data.audioContextState === "running")}
        />
        <Row label="Camera" value={data.cameraState} />
      </Section>

      <div className="mt-2 border-t border-zinc-800 pt-2 text-[9px] text-zinc-600">
        Press ` to toggle
      </div>
    </div>
  );
}

// ─────────────────────── Helper Components ───────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="mb-1 text-[9px] font-bold text-zinc-500">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span style={{ color: color || "#a1a1aa" }}>{value}</span>
    </div>
  );
}

// ─────────────────────── Helpers ───────────────────────

function fpsColor(fps: number): string {
  if (fps >= 50) return "#4ade80";
  if (fps >= 30) return "#facc15";
  return "#ef4444";
}

function stateColor(active: boolean): string {
  return active ? "#4ade80" : "#ef4444";
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default DebugPanel;
