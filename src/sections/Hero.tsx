"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import DecoderText from "@/components/DecoderText";
import Button from "@/components/Button";

const HeroExperience = dynamic(() => import("@/components/HeroModels/HeroExperience"), {
  ssr: false,
});

/**
 * Hero — Full-viewport cinematic intro
 * Bold sans-serif typography + interactive 3D abstract shape + CTAs
 */
export default function Hero() {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      "#hero-badge",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        "#hero-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
        "-=0.6"
      )
      .fromTo(
        "#hero-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        "#hero-desc",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        "#hero-buttons > *",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.15 },
        "-=0.5"
      )
      .fromTo(
        "#hero-canvas",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
        "-=1.2"
      );
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Subtle radial vignette */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,var(--color-background)_90%] z-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Typography */}
        <div className="flex flex-col gap-6">
          <div id="hero-badge" className="flex items-center gap-3 opacity-0">
            <span className="w-10 h-[1px] bg-primary" />
            <span className="text-primary font-mono text-xs tracking-[0.3em] uppercase">
              <DecoderText text="Creative Engineer & Designer" delay={300} />
            </span>
          </div>

          <h1
            id="hero-title"
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] opacity-0"
          >
            Utkarsh
          </h1>

          <h2
            id="hero-subtitle"
            className="font-sans text-lg md:text-xl text-primary tracking-wide font-medium -mt-4 opacity-0"
          >
            Full-Stack Developer & Interactive Experience Engineer
          </h2>

          <p
            id="hero-desc"
            className="text-text-tertiary text-sm md:text-base max-w-md leading-relaxed font-sans mt-2 opacity-0"
          >
            Building high-performance web applications, immersive 3D interfaces, and scalable
            backend systems. Obsessed with pixel-perfect design and buttery-smooth 60fps
            interactions.
          </p>

          <div id="hero-buttons" className="flex flex-wrap gap-4 mt-4">
            <Button href="#projects" variant="primary">
              View Projects
            </Button>
            <Button href="#contact" variant="secondary">
              Contact Me
            </Button>
          </div>
        </div>

        {/* Right: Interactive 3D Canvas */}
        <div
          id="hero-canvas"
          className="relative w-full h-[450px] md:h-[550px] lg:h-[650px] flex-center opacity-0"
        >
          <div className="absolute w-[80%] aspect-square rounded-full bg-primary/5 blur-[80px] -z-10" />
          <HeroExperience />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="text-text-tertiary text-[10px] tracking-[0.25em] uppercase font-mono">
          Scroll Down
        </span>
        <svg width="16" height="24" viewBox="0 0 20 30" className="scroll-indicator text-primary">
          <rect
            x="1"
            y="1"
            width="18"
            height="28"
            rx="9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="10" cy="10" r="2" fill="currentColor">
            <animate attributeName="cy" values="10;18;10" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2;1" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </section>
  );
}
