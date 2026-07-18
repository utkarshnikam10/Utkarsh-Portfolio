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
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * NEXUS — Main Portfolio Page
 * Composes sections into a premium stacked-card scrolling experience.
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

  // Stacked Card GSAP animation
  useEffect(() => {
    if (!loadingComplete) return;

    // Wait short delay for R3F and layouts to stabilize
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".stack-card") as HTMLElement[];
      cards.forEach((card, index) => {
        if (index === cards.length - 1) return; // Don't animate the last card (Contact)

        const nextCard = cards[index + 1];

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.35,
          filter: "blur(2px)",
          scrollTrigger: {
            trigger: nextCard,
            start: "top 100%", // Start transition when next card starts entering
            end: "top 0%", // Finish transition when next card covers it
            scrub: true,
          },
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loadingComplete]);

  // Background glow mouse parallax
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
    <div className="relative min-h-screen bg-background text-text overflow-x-hidden selection:bg-primary-dim selection:text-primary">
      <CustomCursor />

      {!loadingComplete && <LoadingScreen onComplete={() => setLoadingComplete(true)} />}

      {/* Ambient Glows */}
      <div className="bg-glow-1 pointer-events-none fixed -top-[40%] -left-[20%] w-[80%] aspect-square rounded-full bg-primary/5 blur-[150px] z-0" />
      <div className="bg-glow-2 pointer-events-none fixed -bottom-[40%] -right-[20%] w-[80%] aspect-square rounded-full bg-primary/3 blur-[150px] z-0" />

      <Navbar />

      <main className="relative z-10">
        <div id="hero" className="stack-card z-10">
          <Hero />
        </div>
        <div id="about" className="stack-card z-20">
          <About />
        </div>
        <div id="skills" className="stack-card z-30">
          <Skills />
        </div>
        <div id="projects" className="stack-card z-40">
          <Projects />
        </div>
        <div id="experience" className="stack-card z-50">
          <Experience />
        </div>
        <div id="achievements" className="stack-card z-60">
          <Achievements />
        </div>
        <div id="contact" className="stack-card z-70">
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}
