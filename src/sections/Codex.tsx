"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { characters } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Codex — Chapter I: The Throne of Mahishmati
 * Displays interactive cards for each of the primary Baahubali characters.
 * Features 3D hover tilt effects, character stats bars, and quote reveals.
 */

export default function Codex() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedChar, setSelectedChar] = useState<(typeof characters)[0] | null>(null);

  // Staggered scroll reveal using GSAP ScrollTrigger
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const cards = el.querySelectorAll("[data-char-card]");

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section id="codex" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader index="Chapter I" title="The Skills Codex" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left/Center: Characters Grid */}
          <div ref={gridRef} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {characters.map((char) => (
              <div
                key={char.name}
                data-char-card
                className="char-card p-6 cursor-pointer opacity-0 translate-y-8 flex flex-col justify-between min-h-[180px]"
                style={{
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                  perspective: "1000px",
                }}
                onClick={() => setSelectedChar(char)}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const rotX = (y - rect.height / 2) / 10;
                  const rotY = (x - rect.width / 2) / -10;
                  card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
                }}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{char.tilak}</span>
                    <span className="text-primary font-mono text-[10px] tracking-widest uppercase">
                      {char.emblem}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-text mb-1">{char.name}</h3>
                  <p className="text-text-tertiary text-xs tracking-wider uppercase font-serif">
                    {char.title}
                  </p>
                </div>

                {/* Footer action */}
                <div className="mt-6 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-text-tertiary text-[10px] font-mono">TAP FOR DETAILS</span>
                  <span className="text-primary text-xs">❖</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Character Detailed Stats Panel */}
          <div className="glass rounded-lg p-8 border border-border sticky top-28 min-h-[500px] flex flex-col justify-between">
            {selectedChar ? (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{selectedChar.tilak}</span>
                    <span className="font-serif text-2xl font-bold text-gradient">
                      {selectedChar.name}
                    </span>
                  </div>
                  <p className="text-primary text-xs font-serif tracking-widest uppercase">
                    {selectedChar.title}
                  </p>
                </div>

                <div className="h-px bg-border-light" />

                <div className="flex flex-col gap-2">
                  <span className="text-text-tertiary text-[10px] tracking-wider uppercase font-mono">
                    Backstory:
                  </span>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {selectedChar.backstory}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-text-tertiary text-[10px] tracking-wider uppercase font-mono">
                    Signature Weapon:
                  </span>
                  <p className="text-primary font-serif text-sm font-semibold">
                    ⚔️ {selectedChar.weapon}
                  </p>
                </div>

                {/* Radar/Bar Stats */}
                <div className="flex flex-col gap-4">
                  <span className="text-text-tertiary text-[10px] tracking-wider uppercase font-mono">
                    Attributes:
                  </span>
                  <div className="flex flex-col gap-3">
                    {Object.entries(selectedChar.stats).map(([stat, val]) => (
                      <div key={stat}>
                        <div className="flex justify-between text-xs font-serif mb-1">
                          <span className="capitalize">{stat}</span>
                          <span className="text-primary font-mono">{val}%</span>
                        </div>
                        <div className="h-1 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-crimson transition-all duration-700 ease-out"
                            style={{ width: `${val}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Royal Decree Quote */}
                <div className="bg-primary-dim border border-primary/20 rounded p-4 font-serif italic text-sm text-primary leading-relaxed relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-1 opacity-10 text-4xl">❝</div>
                  &ldquo;{selectedChar.quote}&rdquo;
                </div>
              </div>
            ) : (
              <div className="flex-center flex-col text-center h-full my-auto py-20 gap-4">
                <span className="text-primary text-4xl animate-pulse">❖</span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-text mb-2">
                    Royal Archives
                  </h3>
                  <p className="text-text-tertiary text-xs max-w-[240px] leading-relaxed font-sans">
                    Select a discipline from the royal codex list to inspect code mastery levels,
                    tool weapon specifications, and engineering philosophies.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
