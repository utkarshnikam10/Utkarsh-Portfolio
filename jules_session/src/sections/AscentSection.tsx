"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { CAREER } from "@/constants/portfolio";

gsap.registerPlugin(ScrollTrigger);

export function AscentSection() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useLayoutEffect(() => {
    const scope = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ascent-card").forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 84%", once: true },
          }
        );
      });
    }, section);

    return () => scope.revert();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      if (!section.current) return;
      const bounds = section.current.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travelled = Math.min(Math.max(viewport - bounds.top, 0), bounds.height);
      setProgress(Math.min(1, travelled / bounds.height));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const lineStyle = { "--timeline-progress": `${Math.round(progress * 100)}%` } as CSSProperties;

  return (
    <section
      className="ascent-section section-shell"
      id="ascent"
      ref={section}
      aria-labelledby="ascent-title"
    >
      <div className="section-heading section-heading--compact">
        <p className="telemetry-label">04 // THE ASCENT</p>
        <div>
          <h2 id="ascent-title">
            A practice shaped
            <br />
            by <em>making things real.</em>
          </h2>
          <p>A short lineage of the questions, disciplines, and delivery habits behind the work.</p>
        </div>
      </div>

      <div className="ascent-timeline" style={lineStyle}>
        <div className="ascent-timeline__spine" aria-hidden="true">
          <i />
        </div>
        {CAREER.map((entry, index) => (
          <article
            className={`ascent-card ${index % 2 ? "ascent-card--right" : "ascent-card--left"}`}
            key={entry.year}
          >
            <span className="ascent-card__year">{entry.year}</span>
            <div>
              <p>LINEAGE / {String(index + 1).padStart(2, "0")}</p>
              <h3>{entry.title}</h3>
              <span>{entry.copy}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
