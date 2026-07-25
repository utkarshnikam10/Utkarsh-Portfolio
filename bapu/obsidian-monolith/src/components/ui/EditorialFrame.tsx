"use client";

import React, { useEffect, useState } from "react";

const NEXUS_ZONES = [
  { id: "01", label: "ORIGIN FIELD", coord: "0.00 // VOID" },
  { id: "02", label: "INNOVATION LAB", coord: "0.25 // STRUCTURE" },
  { id: "03", label: "ENGINEERING CORE", coord: "0.55 // MATRIX" },
  { id: "04", label: "RESEARCH ARCHIVE", coord: "0.80 // HORIZON" },
  { id: "05", label: "CONTROL SINGULARITY", coord: "1.00 // TERMINUS" },
];

export function EditorialFrame() {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      setScrollRatio(window.scrollY / maxScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // FPS counter
    let lastTime = performance.now();
    let frames = 0;
    let raf: number;
    const countFPS = () => {
      frames++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frames);
        frames = 0;
        lastTime = now;
      }
      raf = requestAnimationFrame(countFPS);
    };
    raf = requestAnimationFrame(countFPS);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const zoneIdx = Math.min(
    Math.floor(scrollRatio * NEXUS_ZONES.length),
    NEXUS_ZONES.length - 1
  );
  const zone = NEXUS_ZONES[zoneIdx];
  const depth = (scrollRatio * 100).toFixed(1);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 select-none"
      style={{
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        fontSize: "9px",
        letterSpacing: "0.3em",
        textTransform: "uppercase" as const,
        color: "rgba(244,244,247,0.38)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      {/* ── Top-Left: Identity ── */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-3">
        <span
          className="w-1 h-1 rounded-full bg-sky-400"
          style={{ boxShadow: "0 0 6px rgba(56,189,248,0.8)" }}
        />
        <span className="hidden sm:inline">NEXUS // UTKARSH</span>
        <span className="sm:hidden">NEXUS</span>
      </div>

      {/* ── Top-Right: FPS Telemetry ── */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-right">
        <div style={{ color: fps >= 55 ? "rgba(56,189,248,0.5)" : "rgba(248,113,113,0.5)" }}>
          {fps.toString().padStart(2, "0")} FPS
        </div>
      </div>

      {/* ── Center Horizontal Rule (desktop only) ── */}
      <div
        className="hidden md:block absolute left-6 right-6"
        style={{ top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="flex justify-between items-center">
          <span>+</span>
          <span style={{ opacity: 0.2 }}>
            {"—".repeat(12)} SPATIAL CONTINUUM {"—".repeat(12)}
          </span>
          <span>+</span>
        </div>
      </div>

      {/* ── Bottom-Left: Current Zone ── */}
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 hidden sm:block">
        <div style={{ color: "rgba(244,244,247,0.65)", marginBottom: "4px" }}>
          {zone.id} // {zone.label}
        </div>
        <div>{zone.coord}</div>
      </div>

      {/* ── Bottom-Right: Depth + scroll hint ── */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-right">
        <div style={{ marginBottom: "4px" }}>
          DEPTH {depth}%
        </div>
        {scrollRatio < 0.06 && (
          <div style={{ animation: "pulse 2s infinite", color: "rgba(244,244,247,0.25)" }}>
            SCROLL ↓
          </div>
        )}
      </div>
    </div>
  );
}
