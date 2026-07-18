"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import About from "@/sections/Codex";
import Skills from "@/sections/Skills";
import Projects from "@/sections/BattleDashboard";
import Experience from "@/sections/Timeline";
import Achievements from "@/sections/Achievements";
import Contact from "@/sections/Decree";
import Footer from "@/sections/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import { useStore } from "@/store/useStore";
import gsap from "gsap";

/**
 * NEXUS — Main Portfolio Page
 * Composes all sections into a premium single-page scrolling experience.
 */
export default function Home() {
  const { setActiveSection } = useStore();
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Scroll spy section tracker
  useEffect(() => {
    const sections = [
      "hero",
      "about",
      "skills",
      "projects",
      "experience",
      "achievements",
      "contact",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;

        const { top, bottom } = el.getBoundingClientRect();
        const absoluteTop = top + window.scrollY;
        const absoluteBottom = bottom + window.scrollY;

        if (scrollPosition >= absoluteTop && scrollPosition < absoluteBottom) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveSection]);

  // Subtle background glow parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xOffset = (clientX / window.innerWidth - 0.5) * 55;
      const yOffset = (clientY / window.innerHeight - 0.5) * 55;

      gsap.to(".bg-glow-1", {
        x: xOffset,
        y: yOffset,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(".bg-glow-2", {
        x: -xOffset,
        y: -yOffset,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-text overflow-hidden selection:bg-primary-dim selection:text-primary">
      <CustomCursor />

      {!loadingComplete && <LoadingScreen onComplete={() => setLoadingComplete(true)} />}

      {/* Ambient Glow Layers */}
      <div className="bg-glow-1 pointer-events-none fixed -top-[40%] -left-[20%] w-[80%] aspect-square rounded-full bg-primary/5 blur-[150px] z-0" />
      <div className="bg-glow-2 pointer-events-none fixed -bottom-[40%] -right-[20%] w-[80%] aspect-square rounded-full bg-primary/3 blur-[150px] z-0" />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
