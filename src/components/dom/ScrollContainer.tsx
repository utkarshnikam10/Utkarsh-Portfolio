"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore, ActiveScene, ActiveDistrict } from "@/store/useStore";
import AboutSection from "./sections/AboutSection";
import JourneySection from "./sections/JourneySection";
import ProjectsSection from "./sections/ProjectsSection";
import SkillsSection from "./sections/SkillsSection";
import ProcessSection from "./sections/ProcessSection";
import VisionSection from "./sections/VisionSection";
import ContactSection from "./sections/ContactSection";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * PROJECT NEXUS // SCROLL CONTAINER
 * Responsibility: Coordinates Lenis smooth scroll with GSAP ScrollTrigger
 * and updates Zustand store metrics. Binds DOM layout scenes.
 */
export function ScrollContainer() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const setActiveScene = useStore((state) => state.setActiveScene);
  const setActiveDistrict = useStore((state) => state.setActiveDistrict);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // premium easeOutExponential
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    // 2. Synchronize Lenis with GSAP Ticker
    const rafUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafUpdate);

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Hook ScrollTrigger defaults to Lenis scroll
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? lenis.scrollTo(value!) : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // 3. Monitor scroll updates to drive Zustand state machine
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? lenis.scroll / scrollHeight : 0;

      // Clamp progress between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, progress));
      setScrollProgress(clampedProgress);

      // Determine active scene based on scroll thresholds (8 scenes total)
      let scene: ActiveScene = "opening";
      if (clampedProgress >= 0.875) scene = "contact";
      else if (clampedProgress >= 0.75) scene = "vision";
      else if (clampedProgress >= 0.625) scene = "process";
      else if (clampedProgress >= 0.5) scene = "skills";
      else if (clampedProgress >= 0.375) scene = "projects";
      else if (clampedProgress >= 0.25) scene = "journey";
      else if (clampedProgress >= 0.125) scene = "about";

      setActiveScene(scene);

      // Map active scene to WebGL district routing (6 districts)
      let district: ActiveDistrict = "well-vault";
      if (scene === "opening" || scene === "about") {
        district = "well-vault";
      } else if (scene === "journey") {
        district = "horizon-bridge";
      } else if (scene === "projects") {
        district = "kinetic-forge";
      } else if (scene === "skills") {
        district = "lattice-matrix";
      } else if (scene === "process" || scene === "vision") {
        district = "travertine-terrace";
      } else if (scene === "contact") {
        district = "root-vault";
      }
      setActiveDistrict(district);
    };

    lenis.on("scroll", handleScroll);

    // Initial run
    handleScroll();

    return () => {
      gsap.ticker.remove(rafUpdate);
      lenis.destroy();
      ScrollTrigger.clearMatchMedia();
    };
  }, [setScrollProgress, setActiveScene, setActiveDistrict]);

  return (
    <div ref={scrollContainerRef} className="relative z-10 w-full min-h-screen">
      {/* 
        Scroll Spacer
        Provides the scroll height. The sections themselves are positioned
        fixed/sticky inside the viewport so they overlay the WebGL Canvas.
      */}
      <div className="absolute top-0 left-0 w-full h-[800vh] pointer-events-none" />

      {/* DOM Overlay Scenes */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-20">
        <AboutSection />
        <JourneySection />
        <ProjectsSection />
        <SkillsSection />
        <ProcessSection />
        <VisionSection />
        <ContactSection />
      </div>
    </div>
  );
}

export default ScrollContainer;
