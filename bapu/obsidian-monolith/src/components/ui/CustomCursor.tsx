"use client";

import React, { useEffect, useState, useRef } from "react";

export function CustomCursor() {
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerDotRef = useRef<HTMLDivElement>(null);

  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position targets & damped lerp state
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check fine pointer & hover support to disable on touch devices
    const hasFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hasFinePointer) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      const targetElem = e.target as HTMLElement | null;
      if (targetElem) {
        const interactive = targetElem.closest(
          "a, button, [data-hover], [data-cursor-label]"
        ) as HTMLElement | null;

        if (interactive) {
          setIsHovered(true);
          const label = interactive.getAttribute("data-cursor-label") || "";
          setCursorText(label);

          // Magnetic snapping of inner dot towards hovered element center
          const rect = interactive.getBoundingClientRect();
          const elemCenterX = rect.left + rect.width / 2;
          const elemCenterY = rect.top + rect.height / 2;

          dotPos.current.x += (elemCenterX - mouse.current.x) * 0.15;
          dotPos.current.y += (elemCenterY - mouse.current.y) * 0.15;
        } else {
          setIsHovered(false);
          setCursorText("");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const render = () => {
      // Damped lerp physics
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.35;
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.35;

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
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
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* High-precision Amber Inner Dot */}
      <div
        ref={innerDotRef}
        className="-translate-x-1/2 -translate-y-1/2 absolute w-2.5 h-2.5 bg-[#d4af37] rounded-full shadow-[0_0_10px_#d4af37]"
      />

      {/* Minimalist Thin Silver Outer Ring */}
      <div
        ref={outerRingRef}
        className={`-translate-x-1/2 -translate-y-1/2 absolute flex items-center justify-center rounded-full border border-[#f5f5f7] transition-all duration-300 ${
          isHovered
            ? "w-14 h-14 bg-white/10 border-amber-300/80 backdrop-blur-[2px] scale-125"
            : "w-8 h-8 opacity-60 bg-transparent"
        }`}
      >
        {cursorText && (
          <span className="text-[9px] font-mono tracking-widest text-amber-200 uppercase font-bold px-1">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
}
