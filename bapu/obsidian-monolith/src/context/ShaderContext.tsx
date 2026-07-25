"use client";

import React, { createContext, useContext, useState } from "react";

export type ShaderPreset = "GPGPU Particles" | "Raymarched SDF" | "Refractive Glass";

export interface ShaderParams {
  wireframe: boolean;
  noiseFrequency: number;
  chromaticAberration: number;
  lightVector: { x: number; y: number };
  preset: ShaderPreset;
}

interface ShaderContextType {
  params: ShaderParams;
  setWireframe: (val: boolean) => void;
  setNoiseFrequency: (val: number) => void;
  setChromaticAberration: (val: number) => void;
  setLightVector: (vec: { x: number; y: number }) => void;
  setPreset: (preset: ShaderPreset) => void;
}

const ShaderContext = createContext<ShaderContextType | undefined>(undefined);

export function ShaderProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<ShaderParams>({
    wireframe: false,
    noiseFrequency: 1.5,
    chromaticAberration: 0.0015,
    lightVector: { x: 8, y: 12 },
    preset: "Refractive Glass",
  });

  const setWireframe = (wireframe: boolean) =>
    setParams((p) => ({ ...p, wireframe }));
  const setNoiseFrequency = (noiseFrequency: number) =>
    setParams((p) => ({ ...p, noiseFrequency }));
  const setChromaticAberration = (chromaticAberration: number) =>
    setParams((p) => ({ ...p, chromaticAberration }));
  const setLightVector = (lightVector: { x: number; y: number }) =>
    setParams((p) => ({ ...p, lightVector }));
  const setPreset = (preset: ShaderPreset) =>
    setParams((p) => ({ ...p, preset }));

  return (
    <ShaderContext.Provider
      value={{
        params,
        setWireframe,
        setNoiseFrequency,
        setChromaticAberration,
        setLightVector,
        setPreset,
      }}
    >
      {children}
    </ShaderContext.Provider>
  );
}

export function useShaderParams(): ShaderContextType {
  const context = useContext(ShaderContext);
  if (!context) {
    throw new Error("useShaderParams must be used within a ShaderProvider");
  }
  return context;
}
