"use client";

import React, { useEffect, useState, useRef } from "react";

export function MagneticPointer() {
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerDotRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const vel = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hasFinePointer) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;

      vel.current.x = dx * 0.18;
      vel.current.y = dy * 0.18;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      const speed = Math.hypot(vel.current.x, vel.current.y);
      const angle = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      const stretch = Math.min(speed * 0.06, 1.2);

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) rotate(${angle}deg) scale(${
          1 + stretch
        }, ${1 - stretch * 0.25})`;
      }

      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Outer Magnetic Fluid Ring */}
      <div
        ref={outerRingRef}
        className="-translate-x-1/2 -translate-y-1/2 absolute w-9 h-9 rounded-full border border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.4)] backdrop-blur-[1px] transition-opacity duration-300"
      />
      {/* Inner Glowing Precision Dot */}
      <div
        ref={innerDotRef}
        className="-translate-x-1/2 -translate-y-1/2 absolute w-1.5 h-1.5 rounded-full bg-[#ffff23] shadow-[0_0_8px_rgba(255,255,35,0.9)]"
      />
    </div>
  );
}
