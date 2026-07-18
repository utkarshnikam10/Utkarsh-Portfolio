"use client";

import { useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { narrativeTimeline } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Timeline — Chapter III: The Ascent
 * Details Mahendra Baahubali's ascent of the waterfall.
 * Features a scroll-progressive golden timeline spine powered by GSAP.
 */
export default function Timeline() {
  const spineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const spine = spineRef.current;
    if (!section || !spine) return;

    // Golden waterfall line fill driven by scroll progress
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

    // Staggered entry of the timeline items and their dots
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
        { scale: 0, backgroundColor: "#191410", borderColor: "rgba(212, 175, 55, 0.3)" },
        {
          scale: 1,
          backgroundColor: "#d4af37",
          borderColor: "#d4af37",
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
    <section ref={sectionRef} id="timeline" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader index="Chapter III" title="The Ascent Chronicles" />

        <div className="relative">
          {/* Timeline spine (Flowing Golden Waterfall effect) */}
          <div className="timeline-spine hidden md:block">
            <div ref={spineRef} className="timeline-progress" />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {narrativeTimeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.chapter}
                  className={`timeline-entry-row relative flex items-start ${
                    isLeft ? "md:justify-start entry-left" : "md:justify-end entry-right"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-2 z-10">
                    <div className="timeline-dot-indicator w-3 h-3 rounded-full border border-primary/30 bg-[#191410] transition-colors duration-300" />
                  </div>

                  {/* Card Wrapper */}
                  <div className="timeline-card w-full md:w-[45%] char-card p-8 opacity-0">
                    {/* Mobile timeline dot header */}
                    <div className="md:hidden flex items-center gap-3 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-primary font-mono text-[10px] tracking-widest">
                        {item.chapter}
                      </span>
                      <span className="text-text-tertiary font-mono text-[9px] tracking-wider uppercase">
                        {item.coordinates}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-text mb-2">{item.title}</h3>

                    <p className="text-text-secondary text-sm leading-relaxed">{item.event}</p>
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
