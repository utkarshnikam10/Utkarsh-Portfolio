"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { EventBus } from "@/core/EventBus";
import { LoadingPipeline } from "@/systems/LoadingPipeline";

/**
 * PROJECT NEXUS // ASSET SYSTEM MANAGER (R3F Component Bridge)
 * Responsibility: Bridges the LoadingPipeline singleton with React state.
 * Listens to loading lifecycle events on the EventBus and pushes progress
 * and completion status into the Zustand store for UI consumption.
 *
 * Race-condition guard: Because Bootstrap.start() runs as an async fire-and-forget
 * inside a useEffect, the loading pipeline may finish BEFORE this component's
 * useEffect registers its EventBus listeners. We handle this by checking the
 * pipeline's current phase on mount and immediately setting store flags if
 * loading already completed.
 *
 * This manager does NOT load assets directly — the LoadingPipeline handles that.
 * This is a React-to-singleton adapter.
 */
export function AssetManager() {
  const setAssetsLoaded = useStore((state) => state.setAssetsLoaded);
  const setLoadProgress = useStore((state) => state.setLoadProgress);
  const setEngineReady = useStore((state) => state.setEngineReady);

  useEffect(() => {
    /**
     * Handle global loading progress updates.
     */
    const handleProgress = (payload: unknown) => {
      const data = payload as { percent: number };
      setLoadProgress(data.percent);
    };

    /**
     * Handle loading completion — mark assets as loaded.
     */
    const handleComplete = () => {
      setAssetsLoaded(true);
      setLoadProgress(100);
    };

    /**
     * Handle application ready — mark engine as operational.
     */
    const handleAppReady = () => {
      setEngineReady(true);
    };

    EventBus.on("loading:progress", handleProgress);
    EventBus.on("loading:complete", handleComplete);
    EventBus.on("app:initialized", handleAppReady);

    /**
     * Race-condition guard: If the pipeline already completed before
     * this useEffect ran, immediately apply the final state.
     */
    const phase = LoadingPipeline.getPhase();
    if (phase === "complete") {
      setAssetsLoaded(true);
      setLoadProgress(100);
      setEngineReady(true);
    }

    return () => {
      EventBus.off("loading:progress", handleProgress);
      EventBus.off("loading:complete", handleComplete);
      EventBus.off("app:initialized", handleAppReady);
    };
  }, [setAssetsLoaded, setLoadProgress, setEngineReady]);

  return null;
}

export default AssetManager;
