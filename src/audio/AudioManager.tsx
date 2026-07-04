"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { AudioEngine } from "@/audio/AudioEngine";

/**
 * PROJECT NEXUS // AUDIO SYSTEM MANAGER (R3F Component Bridge)
 * Responsibility: Bridges the AudioEngine singleton with React state.
 * Initializes the Web Audio API on mount, syncs master volume from
 * the Zustand store, and handles tab visibility changes.
 *
 * This manager does NOT load or play sounds — the AudioEngine handles that.
 * This is a React-to-singleton adapter, similar to AssetManager.
 */
export function AudioManager() {
  const audioEnabled = useStore((state) => state.audioEnabled);
  const masterVolume = useStore((state) => state.masterVolume);

  /**
   * Initialize the AudioEngine on mount.
   */
  useEffect(() => {
    AudioEngine.initialize();

    // Handle tab visibility changes — suspend/resume audio to save resources
    const handleVisibility = () => {
      if (document.hidden) {
        AudioEngine.suspend();
      } else if (audioEnabled) {
        AudioEngine.resume();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [audioEnabled]);

  /**
   * Sync master volume from Zustand store to AudioEngine.
   */
  useEffect(() => {
    AudioEngine.setMasterVolume(masterVolume);
  }, [masterVolume]);

  const activeDistrict = useStore((state) => state.activeDistrict);

  /**
   * Play procedural ambient hum for the active district when audio is enabled.
   */
  useEffect(() => {
    if (audioEnabled) {
      AudioEngine.playDistrictAmbient(activeDistrict);
    } else {
      AudioEngine.stopDistrictAmbient();
    }
  }, [audioEnabled, activeDistrict]);

  /**
   * Handle audio enabled/disabled toggling.
   */
  useEffect(() => {
    if (audioEnabled) {
      AudioEngine.resume();
    } else {
      AudioEngine.suspend();
    }
  }, [audioEnabled]);

  return null;
}

export default AudioManager;
