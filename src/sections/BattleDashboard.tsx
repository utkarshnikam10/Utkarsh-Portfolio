"use client";

import { useState, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { battleTactics } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AudioSynth } from "@/utils/audio";

gsap.registerPlugin(ScrollTrigger);

/**
 * BattleDashboard — Chapter II: The Battle of Trishula
 * Interactive war console simulating troop allocations, strategic layouts,
 * and live tactical metrics calculations for the Mahishmati army.
 */

type TacticKey = keyof typeof battleTactics;

export default function BattleDashboard() {
  const [activeTactic, setActiveTactic] = useState<TacticKey>("trishula");
  const currentTactic = battleTactics[activeTactic];
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal columns stagger
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(
      el.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  // Animate stats bars on active tactic change
  useEffect(() => {
    const fills = document.querySelectorAll(".telemetry-bar-fill");
    fills.forEach((fill) => {
      const targetWidth = fill.getAttribute("data-width") || "0";
      gsap.fromTo(
        fill,
        { width: "0%" },
        {
          width: `${targetWidth}%`,
          duration: 0.9,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    });
  }, [activeTactic]);

  return (
    <section
      id="battle"
      className="py-32 px-6 bg-gradient-to-b from-background to-background-light"
    >
      <div className="max-w-7xl mx-auto">
        <SectionHeader index="Chapter II" title="Project Campaigns" />

        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
          {/* Left Column: Tactic Selectors */}
          <div className="flex flex-col gap-4 opacity-0">
            <h3 className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono mb-2">
              Select Campaign:
            </h3>

            {(Object.keys(battleTactics) as TacticKey[]).map((key) => {
              const tactic = battleTactics[key];
              const isSelected = activeTactic === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    AudioSynth.playClick();
                    setActiveTactic(key);
                  }}
                  onMouseEnter={() => AudioSynth.playHover()}
                  className={`w-full text-left p-6 rounded-sm border transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary-dim shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "border-border bg-surface/40 hover:border-border-light hover:bg-surface/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-serif font-bold text-lg ${isSelected ? "text-primary" : "text-text"}`}
                    >
                      {tactic.name}
                    </span>
                    <span className="text-xs">{isSelected ? "❖" : "◇"}</span>
                  </div>
                  <p className="text-text-tertiary text-xs leading-relaxed">{tactic.description}</p>
                </button>
              );
            })}
          </div>

          {/* Center Column: Live Tactical Telemetry Dials */}
          <div className="glass gold-corners rounded-lg p-8 border border-border flex flex-col gap-6 opacity-0">
            <h3 className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono">
              Performance Telemetry:
            </h3>

            <div className="flex flex-col gap-6">
              {/* Design Integrity */}
              <div>
                <div className="flex justify-between text-xs font-serif mb-2">
                  <span>Design Integrity</span>
                  <span className="text-primary font-mono">{currentTactic.stats.defense}%</span>
                </div>
                <div className="h-2 bg-background border border-border rounded overflow-hidden">
                  <div
                    className="telemetry-bar-fill h-full bg-primary"
                    data-width={currentTactic.stats.defense}
                    style={{ width: "0%" }}
                  />
                </div>
              </div>

              {/* Execution Speed */}
              <div>
                <div className="flex justify-between text-xs font-serif mb-2">
                  <span>Execution Speed</span>
                  <span className="text-primary font-mono">{currentTactic.stats.advantage}%</span>
                </div>
                <div className="h-2 bg-background border border-border rounded overflow-hidden">
                  <div
                    className="telemetry-bar-fill h-full bg-accent-crimson"
                    data-width={currentTactic.stats.advantage}
                    style={{ width: "0%" }}
                  />
                </div>
              </div>

              {/* Code Purity */}
              <div>
                <div className="flex justify-between text-xs font-serif mb-2">
                  <span>Code Purity</span>
                  <span className="text-primary font-mono">
                    {currentTactic.stats.minimization}%
                  </span>
                </div>
                <div className="h-2 bg-background border border-border rounded overflow-hidden">
                  <div
                    className="telemetry-bar-fill h-full bg-success"
                    data-width={currentTactic.stats.minimization}
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Simulated battlefield status */}
            <div className="border-t border-border pt-4 mt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-text-tertiary">CAMPAIGN STATUS:</span>
              <span className={activeTactic === "chariot" ? "text-error" : "text-success"}>
                {activeTactic === "chariot" ? "● DEPLOYED" : "● ALIGNED"}
              </span>
            </div>
          </div>

          {/* Right Column: Strategy Report Generator */}
          <div className="bg-[#0c0a08] gold-corners border border-border p-8 rounded-lg font-mono text-xs leading-relaxed flex flex-col justify-between min-h-[350px] shadow-lg opacity-0">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="text-primary">❖</span>
                <span className="text-text-secondary uppercase">Campaign Report Log</span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-text-tertiary">SYSTEM: ACTIVE</span>
                <span className="text-text-tertiary">CAMPAIGN: {activeTactic.toUpperCase()}</span>
                <span className="text-text-tertiary">ENGINEER: UTKARSH</span>
              </div>

              <div className="h-px bg-border my-2" />

              <div className="text-text-secondary leading-loose">&gt; {currentTactic.report}</div>
            </div>

            <div className="mt-8 text-[10px] text-text-tertiary text-right">
              MAHISHMATI MILITARY SYSTEM v4.12
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
