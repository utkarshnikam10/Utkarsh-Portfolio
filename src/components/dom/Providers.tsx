"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import Lenis from "lenis";

/**
 * Providers — Wraps application pages
 * Dynamically synchronizes theme state (dark/light) to the HTML body/document class lists
 * and initializes Lenis smooth scrolling.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();

  useEffect(() => {
    // Sync theme with body data-theme/class
    const root = window.document.documentElement;
    const body = window.document.body;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      body.setAttribute("data-theme", "dark");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      body.setAttribute("data-theme", "light");
    }
  }, [theme]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expoOut
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
