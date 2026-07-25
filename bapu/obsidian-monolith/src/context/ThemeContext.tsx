"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "BRUTALIST" | "EDITORIAL" | "TACTICAL_CAD";

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  label: string;
  bg: string;
  surface: string;
  accent: string;
  accentSecondary?: string;
  border: string;
  borderRadius: string;
  fontHeading: string;
}

export const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  BRUTALIST: {
    id: "BRUTALIST",
    name: "BRUTALIST",
    label: "01 // BRUTALIST",
    bg: "#08080a",
    surface: "#0f1015",
    accent: "#ccff00", // Acid Lime
    border: "rgba(204, 255, 0, 0.35)",
    borderRadius: "0px",
    fontHeading: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  },
  EDITORIAL: {
    id: "EDITORIAL",
    name: "EDITORIAL",
    label: "02 // EDITORIAL",
    bg: "#0d0e10",
    surface: "#16181d",
    accent: "#f4f1ea", // Warm Ivory
    accentSecondary: "#e63946", // Crimson
    border: "rgba(244, 241, 234, 0.25)",
    borderRadius: "4px",
    fontHeading: "Georgia, Cambria, 'Times New Roman', Times, serif",
  },
  TACTICAL_CAD: {
    id: "TACTICAL_CAD",
    name: "TACTICAL_CAD",
    label: "03 // CAD_LAB",
    bg: "#0b0c0e",
    surface: "#12141a",
    accent: "#ff5500", // Safety Orange
    border: "rgba(255, 85, 0, 0.4)",
    borderRadius: "0px",
    fontHeading: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeConfig;
  isLocked: boolean;
  setTheme: (theme: ThemeMode, manualLock?: boolean) => void;
  unlockAutoTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("BRUTALIST");
  const [isLocked, setIsLocked] = useState(false);

  const setTheme = (mode: ThemeMode, manualLock = true) => {
    setThemeState(mode);
    if (manualLock) {
      setIsLocked(true);
    }
  };

  const unlockAutoTheme = () => {
    setIsLocked(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const config = THEME_CONFIGS[theme];
    const root = document.documentElement;

    root.style.setProperty("--bg-color", config.bg);
    root.style.setProperty("--surface-color", config.surface);
    root.style.setProperty("--accent-color", config.accent);
    root.style.setProperty("--border-color", config.border);
    root.style.setProperty("--border-radius", config.borderRadius);

    // Keyboard shortcuts: 1, 2, 3
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "1") setTheme("BRUTALIST", true);
      if (e.key === "2") setTheme("EDITORIAL", true);
      if (e.key === "3") setTheme("TACTICAL_CAD", true);
    };

    // Dual-mode scroll auto-morph logic if not locked manually
    const handleScroll = () => {
      if (isLocked) return;

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const scrollRatio = window.scrollY / maxScroll;

      if (scrollRatio < 0.28) {
        setThemeState("BRUTALIST");
      } else if (scrollRatio < 0.65) {
        setThemeState("EDITORIAL");
      } else {
        setThemeState("TACTICAL_CAD");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [theme, isLocked]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEME_CONFIGS[theme],
        isLocked,
        setTheme,
        unlockAutoTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
