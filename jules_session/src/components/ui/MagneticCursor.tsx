"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function MagneticCursor() {
  const x = useMotionValue(-60);
  const y = useMotionValue(-60);
  const smoothX = useSpring(x, { damping: 24, stiffness: 360, mass: 0.35 });
  const smoothY = useSpring(y, { damping: 24, stiffness: 360, mass: 0.35 });
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!pointer.matches) return;

    document.documentElement.classList.add("has-custom-cursor");
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX - 9);
      y.set(event.clientY - 9);
      setIsInteractive(
        Boolean((event.target as Element | null)?.closest("button, a, [data-cursor]"))
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  return (
    <motion.span
      aria-hidden="true"
      className="magnetic-cursor"
      animate={{ scale: isInteractive ? 2.2 : 1, opacity: 1 }}
      style={{ x: smoothX, y: smoothY }}
      transition={{ type: "spring", damping: 18, stiffness: 260 }}
    />
  );
}
