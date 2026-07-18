"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { skillsData } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AudioSynth } from "@/utils/audio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills — Category grid with hover expansions
 * Displays technology categories in a premium grid with subtle micro-interactions
 */
export default function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const cards = el.querySelectorAll("[data-skill-card]");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.08,
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
    <section id="skills" className="relative h-full flex items-center py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader index="02" title="Technical Skills" />

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((category) => (
            <div
              key={category.category}
              data-skill-card
              className="group relative p-8 rounded-lg border border-border bg-surface/30 hover:border-primary/40 hover:bg-surface/60 transition-all duration-500 cursor-default opacity-0"
              onMouseEnter={() => AudioSynth.playHover()}
            >
              {/* Category Label */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-bold text-text group-hover:text-primary transition-colors duration-300">
                  {category.category}
                </h3>
                <span className="text-primary/40 group-hover:text-primary text-xs font-mono transition-colors duration-300">
                  {category.skills.length} tools
                </span>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block px-3 py-1.5 text-[11px] font-mono tracking-wide text-text-secondary bg-background/60 border border-border/60 rounded-md group-hover:border-primary/20 group-hover:text-text transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Subtle hover glow */}
              <div className="absolute inset-0 rounded-lg bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
