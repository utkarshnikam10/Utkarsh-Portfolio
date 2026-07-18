"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { achievementsData } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Achievements — Certifications, awards, and credentials
 * Clean card layout with scroll reveal animations
 */
export default function Achievements() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const cards = el.querySelectorAll("[data-achievement]");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
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
    <section id="achievements" className="relative h-full flex items-center py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader index="05" title="Achievements" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievementsData.map((ach) => (
            <div
              key={ach.title}
              data-achievement
              className="group p-8 rounded-lg border border-border bg-surface/30 hover:border-primary/30 transition-all duration-500 opacity-0 flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary font-mono text-[10px] tracking-widest uppercase">
                    {ach.date}
                  </span>
                  <span className="text-primary/50 group-hover:text-primary text-sm transition-colors duration-300">
                    ◆
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-text mb-2 leading-snug">
                  {ach.title}
                </h3>

                <p className="text-text-secondary text-xs leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="border-t border-border/50 pt-3 mt-auto">
                <span className="text-text-tertiary text-[10px] font-mono tracking-wider">
                  {ach.organization}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
