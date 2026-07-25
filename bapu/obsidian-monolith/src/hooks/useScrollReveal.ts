"use client";

import { useEffect, useRef } from "react";

/**
 * useScrollReveal — IntersectionObserver hook that adds `.is-visible` to
 * elements with scroll-reveal classes when they enter the viewport.
 *
 * Usage: Call once inside a parent component. It will observe all elements
 * with `[data-reveal]` attribute inside the given container ref.
 */
export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Once revealed, stop observing for performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.12,
      }
    );

    // Observe all elements with data-reveal attribute
    const revealElements = container.querySelectorAll("[data-reveal]");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
