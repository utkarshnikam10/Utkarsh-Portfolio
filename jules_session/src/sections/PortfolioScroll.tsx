"use client";

import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const rise = {
  initial: { opacity: 0, y: 80 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const projects = [
  {
    number: "01",
    title: "NEXUS",
    type: "Interactive portfolio system",
    copy: "A spatial portfolio where each object becomes a narrative doorway — made to let technical craft be felt before it is explained.",
    tags: "Next.js / R3F / GSAP",
    tone: "moss",
  },
  {
    number: "02",
    title: "ONDA",
    type: "Financial workspace",
    copy: "A calm command centre that turns dense financial activity into focused next actions for modern teams.",
    tags: "Product design / TypeScript / Motion",
    tone: "clay",
  },
  {
    number: "03",
    title: "VECTOR",
    type: "Care platform",
    copy: "A reassuring product journey for high-stakes decisions, shaped around clarity, accessibility, and a human pace.",
    tags: "UX systems / React / Accessibility",
    tone: "cobalt",
  },
] as const;

const craft = [
  ["01", "Frontend", "React, Next.js, TypeScript, Tailwind"],
  ["02", "Creative engineering", "R3F, Three.js, GSAP, Framer Motion"],
  ["03", "Product systems", "Interaction models, UI architecture, component libraries"],
  ["04", "Collaboration", "Prototype direction, design handoff, thoughtful iteration"],
] as const;

const workingStack = [
  "React / Next.js",
  "TypeScript",
  "Three.js / R3F",
  "GSAP / Motion",
  "Tailwind CSS",
  "Figma",
] as const;

export function PortfolioScroll() {
  const portalRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const portal = portalRef.current;
    if (!portal || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.to("[data-world-orbit]", {
        rotate: 160,
        ease: "none",
        scrollTrigger: {
          trigger: portal,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to("[data-world-locator]", {
        yPercent: -115,
        ease: "none",
        scrollTrigger: {
          trigger: portal,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.65,
        },
      });
    }, portal);

    return () => context.revert();
  }, [reduceMotion]);

  return (
    <section className="portfolio-scroll" id="dossier" aria-label="Utkarsh portfolio dossier">
      <section className="world-scroll-portal" ref={portalRef} aria-labelledby="story-heading">
        <div className="world-scroll-portal__sticky">
          <div className="world-scroll-portal__grid" aria-hidden="true" />
          <div className="world-scroll-portal__orbit" data-world-orbit aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <p className="world-scroll-portal__locator" data-world-locator>
            01. 27 / OVERRIDE PROTOCOL
          </p>
          <div className="world-scroll-portal__copy">
            <p className="dossier-kicker">SCROLL TO SHIFT THE VIEWPOINT</p>
            <h2 id="story-heading">
              One world.
              <br />
              <em>Broken boundaries.</em>
            </h2>
            <p>
              Utkarsh builds digital products from the inside out: start with the decision, shape
              the interaction, then make every pixel carry its weight.
            </p>
          </div>
          <div className="world-scroll-portal__legend" aria-label="World camera progress">
            <span>ORIGIN</span>
            <i />
            <span>OBSERVATION</span>
            <i />
            <span>OUTCOME</span>
          </div>
        </div>
      </section>

      <motion.section className="dossier-about dossier-section" id="about" {...rise}>
        <p className="dossier-kicker">01 / ABOUT UTKARSH</p>
        <div className="dossier-about__layout">
          <h2>
            I turn ideas into
            <br />
            <em>pure digital chaos.</em>
          </h2>
          <div>
            <p>
              I&apos;m Utkarsh, a creative developer and product-minded frontend engineer. I bring
              design direction, motion, and robust implementation into one deliberate practice.
            </p>
            <p>
              I care most about the small moments that make a product feel clear: a state that
              arrives at the right pace, a system that survives change, and a useful idea made
              tangible.
            </p>
          </div>
        </div>
        <div className="about-index" aria-label="Utkarsh working stack">
          {workingStack.map((item, index) => (
            <span key={item}>
              {String(index + 1).padStart(2, "0")} / {item}
            </span>
          ))}
        </div>
      </motion.section>

      <section
        className="dossier-projects dossier-section"
        id="projects"
        aria-labelledby="selected-work"
      >
        <motion.div className="dossier-heading" {...rise}>
          <p className="dossier-kicker">02 / SELECTED WORK</p>
          <h2 id="selected-work">
            Small selection.
            <br />
            <em>Deep intent.</em>
          </h2>
        </motion.div>
        <div className="project-list">
          {projects.map((project, index) => (
            <motion.article
              className={`project-card project-card--${project.tone}`}
              key={project.number}
              {...rise}
              transition={{ ...rise.transition, delay: index * 0.08 }}
            >
              <div className="project-card__signal" aria-hidden="true">
                <span />
                <i />
                <b />
              </div>
              <div className="project-card__meta">
                <span>{project.number}</span>
                <span>{project.type}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.copy}</p>
              <span className="project-card__tags">{project.tags}</span>
              <span className="project-card__case-note">Case study in development</span>
            </motion.article>
          ))}
        </div>
      </section>

      <motion.section className="dossier-capabilities dossier-section" id="skills" {...rise}>
        <p className="dossier-kicker">03 / WHAT I DO</p>
        <div className="capability-grid">
          <h2>
            Creative direction
            <br />
            <em>through code.</em>
          </h2>
          <ul>
            {craft.map(([number, title, tools]) => (
              <li key={title}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{tools}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      <motion.section className="dossier-trajectory dossier-section" id="experience" {...rise}>
        <div className="dossier-heading">
          <p className="dossier-kicker">04 / TRAJECTORY</p>
          <h2>
            Built in
            <br />
            <em>public iterations.</em>
          </h2>
        </div>
        <div className="trajectory-grid">
          <article>
            <span>NOW</span>
            <h3>Creative developer</h3>
            <p>
              Designing and engineering polished interfaces, motion systems, and interactive web
              experiences.
            </p>
          </article>
          <article>
            <span>NEXT</span>
            <h3>Selected experience</h3>
            <p>
              Education, roles, recognitions, and verified project outcomes will live here once the
              portfolio data is supplied.
            </p>
          </article>
        </div>
      </motion.section>

      <motion.section className="dossier-contact dossier-section" id="contact" {...rise}>
        <p className="dossier-kicker">05 / CONTACT</p>
        <h2>
          Let&apos;s make the
          <br />
          <em>next thing matter.</em>
        </h2>
        <a href="mailto:hello@utkarsh.design" aria-label="Email Utkarsh at hello@utkarsh.design">
          hello@utkarsh.design <span aria-hidden="true">↗</span>
        </a>
        <p className="dossier-contact__note">
          GitHub, LinkedIn, resume, and verified contact details can be connected when supplied.
        </p>
      </motion.section>
    </section>
  );
}
