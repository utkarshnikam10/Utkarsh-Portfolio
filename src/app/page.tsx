"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Codex from "@/sections/Codex";
import BattleDashboard from "@/sections/BattleDashboard";
import Timeline from "@/sections/Timeline";
import Decree from "@/sections/Decree";
import Footer from "@/sections/Footer";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import { useStore } from "@/store/useStore";
import gsap from "gsap";

/**
 * Main Home Page
 * Composes all Mahishmati chapters into a single responsive vertical scrolling interface.
 * Implements a simple scroll spy system to update the active navbar section.
 * Mounts CustomCursor, LoadingScreen, and mouse-parallax background glows.
 */
export default function Home() {
  const { setActiveSection } = useStore();
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Scroll spy section tracker
  useEffect(() => {
    const sections = ["hero", "codex", "battle", "timeline", "decree"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for headers

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
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveSection]);

  // Subtle background glow parallax movement
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
      {/* Cinematic Custom Cursor Follower */}
      <CustomCursor />

      {/* Intro loading animation */}
      {!loadingComplete && <LoadingScreen onComplete={() => setLoadingComplete(true)} />}

      {/* Royal Volumetric Lighting Glows with Mouse Parallax classes */}
      <div className="bg-glow-1 pointer-events-none fixed -top-[40%] -left-[20%] w-[80%] aspect-square rounded-full bg-primary/5 blur-[150px] z-0" />
      <div className="bg-glow-2 pointer-events-none fixed -bottom-[40%] -right-[20%] w-[80%] aspect-square rounded-full bg-accent-crimson/5 blur-[150px] z-0" />

      {/* Navigation */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="relative z-10">
        <Hero />
        <Codex />
        <BattleDashboard />
        <Timeline />
        <Decree />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
