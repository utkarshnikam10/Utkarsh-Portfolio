"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { personalPhilosophy } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * About — Personal journey, philosophy, and goals
 * Interactive scroll reveal with clean bento-style cards
 */
export default function About() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const cards = el.querySelectorAll("[data-about-card]");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
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

  const aboutCards = [
    {
      label: "Journey",
      icon: "→",
      content: personalPhilosophy.journey,
    },
    {
      label: "Philosophy",
      icon: "◆",
      content: personalPhilosophy.philosophy,
    },
    {
      label: "Mission",
      icon: "⬡",
      content: personalPhilosophy.goals,
    },
  ];

  return (
    <section id="about" className="relative h-full flex items-center py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader index="01" title="About Me" />

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutCards.map((card) => (
            <div
              key={card.label}
              data-about-card
              className="group p-8 rounded-lg border border-border bg-surface/40 hover:border-primary/30 hover:bg-surface/60 transition-all duration-500 opacity-0"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-primary font-mono text-[10px] tracking-widest uppercase">
                  {card.label}
                </span>
                <span className="text-primary text-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                  {card.icon}
                </span>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed font-sans">
                {card.content}
              </p>
            </div>
          ))}
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {[
            { value: "6+", label: "Years Experience" },
            { value: "30+", label: "Projects Delivered" },
            { value: "60fps", label: "Performance Target" },
            { value: "∞", label: "Curiosity Level" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-6 border border-border/50 rounded-lg bg-surface/20"
            >
              <span className="block text-3xl font-serif font-bold text-primary mb-1">
                {stat.value}
              </span>
              <span className="text-text-tertiary text-[10px] font-mono tracking-widest uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
