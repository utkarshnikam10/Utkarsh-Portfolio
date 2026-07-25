"use client";

import React, { useState, useEffect } from "react";
import { useTheme, THEME_CONFIGS, ThemeMode } from "../../context/ThemeContext";
import { useAudio } from "../../hooks/useAudio";

export function ThemeHUD() {
  const { theme, setTheme, isLocked, unlockAutoTheme } = useTheme();
  const { isMuted, toggleMute, playHoverTick, playThemeMorphSweep } = useAudio();
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calcFps = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }

      animId = requestAnimationFrame(calcFps);
    };

    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode, true);
    playThemeMorphSweep();
  };

  return (
    <>
      {/* Top Fixed Control Deck */}
      <div className="fixed top-20 right-6 z-40 flex items-center space-x-2 font-mono text-[10px] tracking-widest bg-black/60 backdrop-blur-md p-1.5 border border-white/10 rounded-sm">
        {(Object.keys(THEME_CONFIGS) as ThemeMode[]).map((mode) => {
          const cfg = THEME_CONFIGS[mode];
          const isActive = theme === mode;
          return (
            <button
              key={mode}
              onClick={() => handleThemeChange(mode)}
              onMouseEnter={playHoverTick}
              className={`px-2.5 py-1 transition-all rounded-xs uppercase ${
                isActive
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {cfg.label}
            </button>
          );
        })}

        {/* Audio Mute Control */}
        <button
          onClick={toggleMute}
          onMouseEnter={playHoverTick}
          className="ml-2 px-2.5 py-1 border border-white/20 text-amber-300 hover:bg-amber-300/20 uppercase"
        >
          {isMuted ? "[AUDIO: OFF]" : "[AUDIO: ON]"}
        </button>

        {isLocked && (
          <button
            onClick={unlockAutoTheme}
            onMouseEnter={playHoverTick}
            className="text-[9px] text-zinc-500 hover:text-white px-1 underline"
          >
            [AUTO SCROLL]
          </button>
        )}
      </div>

      {/* TACTICAL CAD LAB Live Telemetry Overlay */}
      {theme === "TACTICAL_CAD" && (
        <div className="pointer-events-none fixed bottom-8 left-8 z-30 font-mono text-[10px] text-orange-400/90 space-y-1 bg-black/80 p-3 border border-orange-500/30 rounded-none shadow-[0_0_20px_rgba(255,85,0,0.15)]">
          <div className="flex items-center space-x-2 border-b border-orange-500/20 pb-1 mb-1">
            <span className="w-1.5 h-1.5 bg-orange-500 animate-ping" />
            <span className="font-bold tracking-widest text-orange-300">
              CAD_LAB // TELEMETRY
            </span>
          </div>
          <div>GPU FRAME RATE: {fps} FPS</div>
          <div>RENDER PASSES: 4 GPGPU PING-PONG</div>
          <div>FBO TEX RESOLUTION: 256x256 (65,536 PTS)</div>
          <div>PARADIGM MATRIX: TACTICAL_CAD ACTIVE</div>
          <div className="text-[9px] text-orange-500/60 pt-1">
            PRESS KEYS [1, 2, 3] TO SWITCH PARADIGM
          </div>
        </div>
      )}
    </>
  );
}
