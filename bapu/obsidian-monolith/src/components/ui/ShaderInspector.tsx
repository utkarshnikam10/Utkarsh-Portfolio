"use client";

import React, { useState } from "react";
import { useShaderParams, ShaderPreset } from "../../context/ShaderContext";
import { useTheme } from "../../context/ThemeContext";
import { playHoverTone, playSelectSound } from "../../utils/audio";

export function ShaderInspector() {
  const { theme } = useTheme();
  const {
    params,
    setWireframe,
    setNoiseFrequency,
    setChromaticAberration,
    setLightVector,
    setPreset,
  } = useShaderParams();

  const [isOpen, setIsOpen] = useState(false);

  // Auto-show in TACTICAL_CAD mode or when toggled
  const isVisible = theme === "TACTICAL_CAD" || isOpen;

  return (
    <div className="fixed top-20 left-6 z-40 font-mono text-[10px]">
      {/* Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playSelectSound();
        }}
        onMouseEnter={playHoverTone}
        className="flex items-center space-x-2 bg-[#12141a]/90 border border-[#ff5500]/40 px-3 py-1.5 rounded-sm text-orange-400 hover:text-white hover:bg-orange-500/20 transition-all shadow-[0_0_15px_rgba(255,85,0,0.15)]"
      >
        <span className="w-1.5 h-1.5 bg-[#ff5500] rounded-full animate-ping" />
        <span className="tracking-widest uppercase">
          {isOpen ? "[CLOSE INSPECTOR]" : "[SHADER INSPECTOR]"}
        </span>
      </button>

      {/* Control Panel Deck */}
      {isVisible && (
        <div className="mt-3 w-72 bg-[#12141a]/95 border border-[#ff5500]/40 p-4 shadow-[0_0_30px_rgba(255,85,0,0.2)] rounded-none space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#ff5500]/30 pb-2">
            <span className="text-[#ff5500] font-bold tracking-widest uppercase">
              SHADER UNIFORMS // LIVE
            </span>
            <span className="text-zinc-500">v2.4</span>
          </div>

          {/* Preset Selector */}
          <div className="space-y-1">
            <label className="text-zinc-400 block text-[9px] uppercase tracking-wider">
              ALGORITHM PRESET:
            </label>
            <select
              value={params.preset}
              onChange={(e) => {
                setPreset(e.target.value as ShaderPreset);
                playSelectSound();
              }}
              className="w-full bg-black/80 border border-[#ff5500]/30 text-orange-300 p-1.5 rounded-none text-[10px] focus:outline-none focus:border-[#ff5500]"
            >
              <option value="Refractive Glass">Refractive Glass</option>
              <option value="GPGPU Particles">GPGPU Particles</option>
              <option value="Raymarched SDF">Raymarched SDF</option>
            </select>
          </div>

          {/* Wireframe Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-300">WIREFRAME OVERLAY:</span>
            <button
              onClick={() => {
                setWireframe(!params.wireframe);
                playSelectSound();
              }}
              className={`px-3 py-1 border transition-all ${
                params.wireframe
                  ? "bg-[#ff5500] text-black font-bold border-[#ff5500]"
                  : "bg-black/60 text-zinc-400 border-zinc-700"
              }`}
            >
              {params.wireframe ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Noise Frequency Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>SIMPLEX NOISE FREQ:</span>
              <span className="text-orange-400 font-bold">
                {params.noiseFrequency.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="10.0"
              step="0.1"
              value={params.noiseFrequency}
              onChange={(e) => setNoiseFrequency(parseFloat(e.target.value))}
              className="w-full accent-[#ff5500] cursor-pointer"
            />
          </div>

          {/* Chromatic Aberration Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>CHROMATIC DISPERSION:</span>
              <span className="text-orange-400 font-bold">
                {params.chromaticAberration.toFixed(4)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.01"
              step="0.0005"
              value={params.chromaticAberration}
              onChange={(e) => setChromaticAberration(parseFloat(e.target.value))}
              className="w-full accent-[#ff5500] cursor-pointer"
            />
          </div>

          {/* Light Vector Controls */}
          <div className="space-y-1">
            <div className="flex justify-between text-zinc-400">
              <span>LIGHT DIR VECTOR (X / Y):</span>
              <span className="text-orange-400 font-bold">
                [{params.lightVector.x.toFixed(1)}, {params.lightVector.y.toFixed(1)}]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="range"
                min="-15"
                max="15"
                step="0.5"
                value={params.lightVector.x}
                onChange={(e) =>
                  setLightVector({
                    x: parseFloat(e.target.value),
                    y: params.lightVector.y,
                  })
                }
                className="w-full accent-[#ff5500] cursor-pointer"
              />
              <input
                type="range"
                min="-15"
                max="15"
                step="0.5"
                value={params.lightVector.y}
                onChange={(e) =>
                  setLightVector({
                    x: params.lightVector.x,
                    y: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-[#ff5500] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
