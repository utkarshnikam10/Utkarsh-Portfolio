"use client";

import { useState, useEffect } from "react";
import { audioEngine } from "../utils/audioEngine";

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(audioEngine.getMuted());

    const handleFirstInteraction = () => {
      audioEngine.unlockAudio();
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    window.addEventListener("pointerdown", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const toggleMute = () => {
    const nextState = audioEngine.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      audioEngine.playClickPulse();
    }
  };

  return {
    isMuted,
    toggleMute,
    playHoverTick: () => audioEngine.playHoverTick(),
    playThemeMorphSweep: () => audioEngine.playThemeMorphSweep(),
    playClickPulse: () => audioEngine.playClickPulse(),
  };
}
