"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * useMagneticHover — Hook for adding magnetic attraction to buttons/links
 * Pulls the element towards the cursor within a specified range.
 */
export function useMagneticHover(range = 35, strength = 0.35) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const elX = rect.left + rect.width / 2;
      const elY = rect.top + rect.height / 2;

      // Distance from cursor to element center
      const distanceX = e.clientX - elX;
      const distanceY = e.clientY - elY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        // Interpolate pulling positioning
        gsap.to(el, {
          x: distanceX * strength,
          y: distanceY * strength,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        // Return back using elastic bounce
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1.1, 0.4)",
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1.1, 0.4)",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (el) {
        el.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [range, strength]);

  return ref;
}
