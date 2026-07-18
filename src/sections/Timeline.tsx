"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { experienceTimeline } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience — Professional timeline
 * Clean vertical timeline showing career milestones with scroll-driven animations
 */
export default function Experience() {
  const spineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const spine = spineRef.current;
    if (!section || !spine) return;

    // Scroll-driven spine fill
    gsap.fromTo(
      spine,
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 45%",
          end: "bottom 70%",
          scrub: true,
        },
      }
    );

    // Staggered card reveal
    const items = section.querySelectorAll(".timeline-entry-row");
    items.forEach((item) => {
      const card = item.querySelector(".timeline-card");
      const dot = item.querySelector(".timeline-dot-indicator");
      const isLeft = item.classList.contains("entry-left");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        dot,
        {
          scale: 0,
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-border)",
        },
        {
          scale: 1,
          backgroundColor: "var(--color-primary)",
          borderColor: "var(--color-primary)",
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      ).fromTo(
        card,
        { opacity: 0, x: isLeft ? -40 : 40 },
        { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
        "-=0.2"
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative h-full flex items-center py-12 md:py-20 px-6"
    >
      <div className="max-w-5xl mx-auto w-full">
        <SectionHeader index="04" title="Experience" />

        <div className="relative">
          {/* Timeline spine */}
          <div className="timeline-spine hidden md:block">
            <div ref={spineRef} className="timeline-progress" />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {experienceTimeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.company}
                  className={`timeline-entry-row relative flex items-start ${
                    isLeft ? "md:justify-start entry-left" : "md:justify-end entry-right"
                  }`}
                >
                  {/* Dot */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 z-10">
                    <div className="timeline-dot-indicator w-3 h-3 rounded-full border border-border bg-background transition-colors duration-300" />
                  </div>

                  {/* Card */}
                  <div className="timeline-card w-full md:w-[45%] p-8 rounded-lg border border-border bg-surface/30 opacity-0">
                    {/* Mobile dot */}
                    <div className="md:hidden flex items-center gap-3 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,102,255,0.3)]" />
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-primary font-mono text-[10px] tracking-widest">
                        {item.duration}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-text mb-1">{item.role}</h3>
                    <p className="text-primary text-sm font-sans mb-4">{item.company}</p>

                    <ul className="flex flex-col gap-2">
                      {item.accomplishments.map((acc, j) => (
                        <li
                          key={j}
                          className="text-text-secondary text-xs leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-primary mt-0.5 text-[8px]">◆</span>
                          {acc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
