"use client";

import dynamic from "next/dynamic";

import { UTKARSH } from "@/constants/portfolio";

const DeskScene = dynamic(() => import("@/three/scenes/DeskScene"), {
  ssr: false,
  loading: () => <div className="desk-scene__fallback" aria-hidden="true" />,
});

export function HeroSection() {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-section__copy">
        <p className="telemetry-label">UTKARSH // INDEPENDENT PRACTICE // 2026</p>
        <h1 id="hero-title">
          Technical
          <br />
          <em>clarity</em> for
          <br />
          ambitious ideas.
        </h1>
        <p className="hero-section__summary">
          {UTKARSH.role}. I design and build digital experiences with an editorial eye and a
          production engineer&apos;s discipline.
        </p>
        <a className="technical-button" href="#campaigns">
          <span>View selected campaigns</span>
          <i aria-hidden="true">↘</i>
        </a>
      </div>

      <div className="hero-section__scene" aria-label="Procedural developer desk scene">
        <DeskScene />
        <div
          className="hero-section__scene-label hero-section__scene-label--top"
          aria-hidden="true"
        >
          CAMERA / 42.10 — LIVE
        </div>
        <div
          className="hero-section__scene-label hero-section__scene-label--bottom"
          aria-hidden="true"
        >
          PROCEDURAL ENVIRONMENT // NO ASSET DEBT
        </div>
      </div>

      <div className="hero-section__footer" aria-hidden="true">
        <span>SCROLL TO DECODE</span>
        <span>01 / 04</span>
      </div>
    </section>
  );
}
