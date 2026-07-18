"use client";

import { useState, useEffect, useRef } from "react";
import SectionHeader from "@/components/SectionHeader";
import { projectsData } from "@/constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AudioSynth } from "@/utils/audio";

gsap.registerPlugin(ScrollTrigger);

/**
 * Projects — Premium project showcase cards
 * Clean bento layout with tech stack tags, challenge/solution/impact breakdown, and links
 */
export default function Projects() {
  const [activeProject, setActiveProject] = useState(projectsData[0]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section
      id="projects"
      className="relative h-full flex items-center py-12 md:py-20 px-6 bg-gradient-to-b from-transparent to-surface/20"
    >
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader index="03" title="Featured Projects" />

        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
          {/* Left Column: Project Selectors */}
          <div className="flex flex-col gap-4 opacity-0">
            <h3 className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono mb-2">
              Select Project:
            </h3>

            {projectsData.map((project) => {
              const isSelected = activeProject.id === project.id;

              return (
                <button
                  key={project.id}
                  onClick={() => {
                    AudioSynth.playClick();
                    setActiveProject(project);
                  }}
                  onMouseEnter={() => AudioSynth.playHover()}
                  className={`w-full text-left p-6 rounded-lg border transition-all duration-300 ${
                    isSelected
                      ? "border-primary/40 bg-primary/[0.05] shadow-[0_0_20px_rgba(0,102,255,0.05)]"
                      : "border-border bg-surface/30 hover:border-border-light hover:bg-surface/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-serif font-bold text-base ${isSelected ? "text-primary" : "text-text"}`}
                    >
                      {project.title}
                    </span>
                    <span className="text-xs text-primary/60">{isSelected ? "◆" : "◇"}</span>
                  </div>
                  <p className="text-text-tertiary text-xs leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Center + Right: Project Detail */}
          <div className="lg:col-span-2 rounded-lg p-8 border border-border bg-surface/30 flex flex-col gap-6 opacity-0">
            <div>
              <h3 className="font-serif text-2xl font-bold text-text mb-2">
                {activeProject.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {activeProject.description}
              </p>
            </div>

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2">
              {activeProject.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-[10px] font-mono tracking-wider text-primary bg-primary/[0.06] border border-primary/15 rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="h-px bg-border" />

            {/* Challenge / Solution / Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono block mb-2">
                  Challenge
                </span>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {activeProject.challenge}
                </p>
              </div>
              <div>
                <span className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono block mb-2">
                  Solution
                </span>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {activeProject.solution}
                </p>
              </div>
              <div>
                <span className="text-text-tertiary text-[10px] tracking-widest uppercase font-mono block mb-2">
                  Impact
                </span>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {activeProject.impact}
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Action Links */}
            <div className="flex items-center gap-4">
              <a
                href={activeProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider text-text border border-border rounded-md hover:border-primary hover:text-primary transition-all duration-300 no-underline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Source Code
              </a>
              <a
                href={activeProject.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider text-background bg-primary rounded-md hover:bg-primary/90 transition-all duration-300 no-underline"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
